require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const { initDatabase } = require('./config/database');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true }));

// Static files for uploads
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });
if (!fs.existsSync(path.join(uploadsDir, 'images'))) fs.mkdirSync(path.join(uploadsDir, 'images'));
app.use('/uploads', express.static(uploadsDir));

async function startServer() {
  // Initialize database
  await initDatabase();
  console.log('[DB] Database initialized');

  // API Routes
  app.use('/api/posts', require('./routes/posts'));
  app.use('/api/analytics', require('./routes/analytics'));
  app.use('/api/images', require('./routes/images'));
  app.use('/api/schedules', require('./routes/schedules'));
  app.use('/api/settings', require('./routes/settings'));

  // Seed demo data endpoint
  app.post('/api/seed-demo', (req, res) => {
    const { getDb } = require('./config/database');
    const { v4: uuidv4 } = require('uuid');
    const demoData = require('./config/seedDemo');
    demoData(getDb(), uuidv4);
    res.json({ success: true, message: 'Demo data seeded!' });
  });

  // Health check
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString(), version: '1.0.0' });
  });

  // Serve React build in production
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '..', 'client', 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, '..', 'client', 'dist', 'index.html'));
    });
  }

  // Initialize scheduler
  const scheduler = require('./services/scheduler');
  scheduler.initialize();

  app.listen(PORT, () => {
    console.log(`
  ╔══════════════════════════════════════════════╗
  ║   Dhanam Finance Social Media Dashboard      ║
  ║   Server running on port ${PORT}               ║
  ║   API: http://localhost:${PORT}/api            ║
  ╚══════════════════════════════════════════════╝
    `);
  });
}

startServer().catch(err => {
  console.error('Failed to start server:', err);
  process.exit(1);
});

module.exports = app;
