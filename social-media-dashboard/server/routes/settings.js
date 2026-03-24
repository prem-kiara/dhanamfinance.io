const express = require('express');
const router = express.Router();
const { getDb } = require('../config/database');
const communitySuggestions = require('../services/communitySuggestions');

// GET /api/settings/platforms - Get connected platforms
router.get('/platforms', (req, res) => {
  const platforms = getDb().prepare('SELECT platform, is_connected, updated_at FROM api_credentials').all();
  const allPlatforms = ['facebook', 'instagram', 'youtube', 'linkedin', 'threads'];

  const result = allPlatforms.map(p => {
    const existing = platforms.find(ep => ep.platform === p);
    return {
      platform: p,
      isConnected: existing?.is_connected === 1,
      updatedAt: existing?.updated_at || null
    };
  });

  res.json(result);
});

// POST /api/settings/platforms/:platform - Connect/update platform credentials
router.post('/platforms/:platform', (req, res) => {
  const { platform } = req.params;
  const { credentials } = req.body;

  if (!credentials) return res.status(400).json({ error: 'Credentials required' });

  const existing = getDb().prepare('SELECT * FROM api_credentials WHERE platform = ?').get(platform);
  if (existing) {
    getDb().prepare(`
      UPDATE api_credentials SET credentials = ?, is_connected = 1, updated_at = datetime('now')
      WHERE platform = ?
    `).run(JSON.stringify(credentials), platform);
  } else {
    getDb().prepare(`
      INSERT INTO api_credentials (platform, credentials, is_connected) VALUES (?, ?, 1)
    `).run(platform, JSON.stringify(credentials));
  }

  res.json({ success: true, platform, isConnected: true });
});

// DELETE /api/settings/platforms/:platform - Disconnect platform
router.delete('/platforms/:platform', (req, res) => {
  getDb().prepare('UPDATE api_credentials SET is_connected = 0 WHERE platform = ?').run(req.params.platform);
  res.json({ success: true });
});

// GET /api/settings/suggestions - Community growth suggestions
router.get('/suggestions', (req, res) => {
  res.json(communitySuggestions.generateSuggestions());
});

module.exports = router;
