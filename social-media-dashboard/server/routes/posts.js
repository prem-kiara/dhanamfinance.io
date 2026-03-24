const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const { getDb } = require('../config/database');
const contentGenerator = require('../services/contentGenerator');
const scheduler = require('../services/scheduler');

// GET /api/posts - List all posts
router.get('/', (req, res) => {
  const { status, category, platform, page = 1, limit = 20 } = req.query;
  let query = 'SELECT * FROM posts WHERE 1=1';
  const params = [];

  if (status) { query += ' AND status = ?'; params.push(status); }
  if (category) { query += ' AND category = ?'; params.push(category); }
  if (platform) { query += ' AND platforms LIKE ?'; params.push(`%${platform}%`); }

  const total = getDb().prepare(query.replace('SELECT *', 'SELECT COUNT(*) as count')).get(...params).count;
  query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
  params.push(parseInt(limit), (parseInt(page) - 1) * parseInt(limit));

  const posts = getDb().prepare(query).all(...params);
  res.json({ posts, total, page: parseInt(page), pages: Math.ceil(total / parseInt(limit)) });
});

// GET /api/posts/:id - Get single post
router.get('/:id', (req, res) => {
  const post = getDb().prepare('SELECT * FROM posts WHERE id = ?').get(req.params.id);
  if (!post) return res.status(404).json({ error: 'Post not found' });

  const platformStatus = getDb().prepare('SELECT * FROM post_platform_status WHERE post_id = ?').all(req.params.id);
  const schedules = getDb().prepare('SELECT * FROM schedules WHERE post_id = ?').all(req.params.id);

  res.json({ ...post, platformStatus, schedules });
});

// POST /api/posts - Create a new post
router.post('/', (req, res) => {
  const { title, content, category, subcategory, platforms, imageUrl, imageType, status } = req.body;

  if (!title || !content || !category || !platforms) {
    return res.status(400).json({ error: 'Missing required fields: title, content, category, platforms' });
  }

  const id = uuidv4();
  const platformsStr = Array.isArray(platforms) ? platforms.join(',') : platforms;

  getDb().prepare(`
    INSERT INTO posts (id, title, content, category, subcategory, platforms, image_url, image_type, status)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(id, title, content, category, subcategory || null, platformsStr, imageUrl || null, imageType || 'none', status || 'draft');

  const post = getDb().prepare('SELECT * FROM posts WHERE id = ?').get(id);
  res.status(201).json(post);
});

// PUT /api/posts/:id - Update a post
router.put('/:id', (req, res) => {
  const existing = getDb().prepare('SELECT * FROM posts WHERE id = ?').get(req.params.id);
  if (!existing) return res.status(404).json({ error: 'Post not found' });

  const { title, content, category, subcategory, platforms, imageUrl, imageType, status } = req.body;
  const platformsStr = platforms ? (Array.isArray(platforms) ? platforms.join(',') : platforms) : existing.platforms;

  getDb().prepare(`
    UPDATE posts SET title = ?, content = ?, category = ?, subcategory = ?, platforms = ?,
    image_url = ?, image_type = ?, status = ?, updated_at = datetime('now')
    WHERE id = ?
  `).run(
    title || existing.title, content || existing.content, category || existing.category,
    subcategory || existing.subcategory, platformsStr,
    imageUrl || existing.image_url, imageType || existing.image_type,
    status || existing.status, req.params.id
  );

  res.json(getDb().prepare('SELECT * FROM posts WHERE id = ?').get(req.params.id));
});

// DELETE /api/posts/:id
router.delete('/:id', (req, res) => {
  getDb().prepare('DELETE FROM posts WHERE id = ?').run(req.params.id);
  res.json({ success: true });
});

// POST /api/posts/:id/publish - Publish immediately
router.post('/:id/publish', async (req, res) => {
  const post = getDb().prepare('SELECT * FROM posts WHERE id = ?').get(req.params.id);
  if (!post) return res.status(404).json({ error: 'Post not found' });

  const platforms = post.platforms.split(',');
  const results = [];

  const { metaService, youtubeService, linkedInService } = require('../services/socialMedia');

  for (const platform of platforms) {
    try {
      let result;
      switch (platform.trim()) {
        case 'facebook':
          result = await metaService.postToFacebook({ message: post.content, imageUrl: post.image_url });
          break;
        case 'instagram':
          result = await metaService.postToInstagram({ caption: post.content, imageUrl: post.image_url });
          break;
        case 'threads':
          result = await metaService.postToThreads({ text: post.content, imageUrl: post.image_url });
          break;
        case 'youtube':
          result = await youtubeService.postToYouTube({ title: post.title, description: post.content });
          break;
        case 'linkedin':
          result = await linkedInService.postToLinkedIn({ text: post.content, imageUrl: post.image_url, title: post.title });
          break;
      }

      getDb().prepare(`
        INSERT INTO post_platform_status (post_id, platform, status, platform_post_id, published_at)
        VALUES (?, ?, 'published', ?, datetime('now'))
      `).run(post.id, platform.trim(), result?.platformPostId);

      results.push({ platform: platform.trim(), status: 'published', postId: result?.platformPostId });
    } catch (error) {
      getDb().prepare(`
        INSERT INTO post_platform_status (post_id, platform, status, error_message)
        VALUES (?, ?, 'failed', ?)
      `).run(post.id, platform.trim(), error.message);

      results.push({ platform: platform.trim(), status: 'failed', error: error.message });
    }
  }

  getDb().prepare("UPDATE posts SET status = 'published', published_at = datetime('now') WHERE id = ?").run(post.id);
  res.json({ results });
});

// POST /api/posts/:id/schedule - Schedule a post
router.post('/:id/schedule', (req, res) => {
  const post = getDb().prepare('SELECT * FROM posts WHERE id = ?').get(req.params.id);
  if (!post) return res.status(404).json({ error: 'Post not found' });

  const { scheduledTimes, recurrence } = req.body;
  const platforms = post.platforms.split(',').map(p => p.trim());

  if (!scheduledTimes || !Array.isArray(scheduledTimes) || scheduledTimes.length === 0) {
    return res.status(400).json({ error: 'scheduledTimes array is required' });
  }

  const schedules = scheduler.createBulkSchedules({
    postId: post.id,
    platforms,
    scheduledTimes,
    recurrence: recurrence || 'once'
  });

  getDb().prepare("UPDATE posts SET status = 'scheduled' WHERE id = ?").run(post.id);
  res.json({ schedules, message: `Scheduled ${schedules.length} posts` });
});

// GET /api/content/categories
router.get('/content/categories', (req, res) => {
  res.json(contentGenerator.getCategories());
});

// GET /api/content/templates
router.get('/content/templates', (req, res) => {
  const { category, subcategory } = req.query;
  res.json(contentGenerator.getTemplates(category, subcategory));
});

// POST /api/content/generate - Generate content
router.post('/content/generate', async (req, res) => {
  const { category, subcategory, topic, tone, platforms, customPrompt, useAI } = req.body;

  try {
    let result;
    if (useAI && process.env.OPENAI_API_KEY) {
      result = await contentGenerator.generateWithAI({ category, subcategory, topic, tone, platforms, customPrompt });
    } else {
      result = contentGenerator.generateFromTemplate({ category, subcategory, platforms });
    }
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
