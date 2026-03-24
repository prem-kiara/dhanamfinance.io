const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const imageGenerator = require('../services/imageGenerator');

// Configure multer for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = path.join(__dirname, '..', 'uploads', 'images');
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}-${Math.random().toString(36).substr(2, 9)}${ext}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (req, file, cb) => {
    const allowed = /\.(jpg|jpeg|png|gif|webp|svg)$/i;
    if (allowed.test(path.extname(file.originalname))) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

// POST /api/images/upload - Upload custom image
router.post('/upload', upload.single('image'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No image file provided' });

  res.json({
    filename: req.file.filename,
    url: `/uploads/images/${req.file.filename}`,
    size: req.file.size,
    mimetype: req.file.mimetype
  });
});

// POST /api/images/upload-multiple - Upload multiple images
router.post('/upload-multiple', upload.array('images', 10), (req, res) => {
  if (!req.files || req.files.length === 0) return res.status(400).json({ error: 'No files provided' });

  const files = req.files.map(f => ({
    filename: f.filename,
    url: `/uploads/images/${f.filename}`,
    size: f.size,
    mimetype: f.mimetype
  }));

  res.json({ files, count: files.length });
});

// GET /api/images/library - Get uploaded images
router.get('/library', (req, res) => {
  res.json(imageGenerator.getUploadedImages());
});

// POST /api/images/generate-template - Generate template-based image HTML
router.post('/generate-template', (req, res) => {
  const { title, subtitle, category, subcategory, platform, bodyText } = req.body;

  const html = imageGenerator.generateTemplateHTML({
    title, subtitle, category, subcategory, platform, bodyText
  });

  res.json({ html, type: 'template' });
});

// POST /api/images/generate-ai - Generate AI image
router.post('/generate-ai', async (req, res) => {
  const { prompt, platform, style } = req.body;

  try {
    const result = await imageGenerator.generateWithAI({ prompt, platform, style });
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/images/templates - Get available template types
router.get('/templates', (req, res) => {
  res.json(imageGenerator.getTemplateTypes());
});

// DELETE /api/images/:filename
router.delete('/:filename', (req, res) => {
  const filepath = path.join(__dirname, '..', 'uploads', 'images', req.params.filename);
  if (fs.existsSync(filepath)) {
    fs.unlinkSync(filepath);
    res.json({ success: true });
  } else {
    res.status(404).json({ error: 'Image not found' });
  }
});

module.exports = router;
