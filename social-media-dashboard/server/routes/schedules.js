const express = require('express');
const router = express.Router();
const scheduler = require('../services/scheduler');

// GET /api/schedules - All schedules
router.get('/', (req, res) => {
  const { status, platform, startDate, endDate } = req.query;
  res.json(scheduler.getSchedules({ status, platform, startDate, endDate }));
});

// GET /api/schedules/upcoming - Next 7 days
router.get('/upcoming', (req, res) => {
  res.json(scheduler.getUpcoming());
});

// GET /api/schedules/suggestions - Best posting times
router.get('/suggestions', (req, res) => {
  res.json(scheduler.getPostingSuggestions());
});

// DELETE /api/schedules/:id - Cancel a schedule
router.delete('/:id', (req, res) => {
  res.json(scheduler.cancelSchedule(req.params.id));
});

module.exports = router;
