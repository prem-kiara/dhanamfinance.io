const express = require('express');
const router = express.Router();
const analyticsService = require('../services/analytics');

// GET /api/analytics/dashboard - Overview stats
router.get('/dashboard', (req, res) => {
  res.json(analyticsService.getDashboardStats());
});

// GET /api/analytics/platform - Platform-specific analytics
router.get('/platform', (req, res) => {
  const { platform, startDate, endDate } = req.query;
  res.json(analyticsService.getPlatformAnalytics(platform, { start: startDate, end: endDate }));
});

// GET /api/analytics/top-posts
router.get('/top-posts', (req, res) => {
  const { limit, sortBy } = req.query;
  res.json(analyticsService.getTopPosts(parseInt(limit) || 10, sortBy));
});

// GET /api/analytics/trends
router.get('/trends', (req, res) => {
  const { days, platform } = req.query;
  res.json(analyticsService.getEngagementTrends(parseInt(days) || 30, platform));
});

// GET /api/analytics/categories
router.get('/categories', (req, res) => {
  res.json(analyticsService.getCategoryPerformance());
});

// GET /api/analytics/frequency
router.get('/frequency', (req, res) => {
  const { days } = req.query;
  res.json(analyticsService.getPostingFrequency(parseInt(days) || 30));
});

// GET /api/analytics/best-times
router.get('/best-times', (req, res) => {
  res.json(analyticsService.getBestTimeSlots());
});

// GET /api/analytics/report - Full report
router.get('/report', (req, res) => {
  const { startDate, endDate } = req.query;
  res.json(analyticsService.generateReport({ start: startDate, end: endDate }));
});

// GET /api/analytics/community
router.get('/community', (req, res) => {
  res.json(analyticsService.getCommunityMetrics());
});

// POST /api/analytics/record - Record new analytics data
router.post('/record', (req, res) => {
  analyticsService.recordAnalytics(req.body);
  res.json({ success: true });
});

module.exports = router;
