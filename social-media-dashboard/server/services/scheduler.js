const cron = require('node-cron');
const { v4: uuidv4 } = require('uuid');
const { getDb } = require('../config/database');

// ==============================================
// POST SCHEDULING SERVICE
// Supports multiple posts per day, recurring schedules
// ==============================================

class SchedulerService {
  constructor() {
    this.activeJobs = new Map();
  }

  // Initialize: load pending schedules from DB and set up cron jobs
  initialize() {
    const pendingSchedules = getDb().prepare(
      "SELECT * FROM schedules WHERE status = 'pending' AND scheduled_time > datetime('now')"
    ).all();

    console.log(`[Scheduler] Loading ${pendingSchedules.length} pending schedules...`);

    for (const schedule of pendingSchedules) {
      this.setupJob(schedule);
    }
  }

  // Create a new schedule
  createSchedule({ postId, platform, scheduledTime, recurrence }) {
    const id = uuidv4();
    const cronExpression = this.timeToCron(scheduledTime, recurrence);

    getDb().prepare(`
      INSERT INTO schedules (id, post_id, platform, scheduled_time, recurrence, status, cron_expression)
      VALUES (?, ?, ?, ?, ?, 'pending', ?)
    `).run(id, postId, platform, scheduledTime, recurrence || 'once', cronExpression);

    const schedule = getDb().prepare('SELECT * FROM schedules WHERE id = ?').get(id);
    this.setupJob(schedule);

    return schedule;
  }

  // Create multiple schedules for a post (multiple platforms, multiple times)
  createBulkSchedules({ postId, platforms, scheduledTimes, recurrence }) {
    const schedules = [];

    for (const platform of platforms) {
      for (const time of scheduledTimes) {
        const schedule = this.createSchedule({
          postId,
          platform,
          scheduledTime: time,
          recurrence
        });
        schedules.push(schedule);
      }
    }

    return schedules;
  }

  // Set up a cron job for a schedule
  setupJob(schedule) {
    if (schedule.recurrence === 'once') {
      // One-time schedule: use setTimeout
      const targetTime = new Date(schedule.scheduled_time);
      const now = new Date();
      const delay = targetTime.getTime() - now.getTime();

      if (delay > 0) {
        const timeout = setTimeout(() => {
          this.executePost(schedule);
        }, delay);

        this.activeJobs.set(schedule.id, { type: 'timeout', ref: timeout });
        console.log(`[Scheduler] Scheduled one-time post ${schedule.id} for ${schedule.scheduled_time}`);
      }
    } else if (schedule.cron_expression && cron.validate(schedule.cron_expression)) {
      // Recurring schedule: use cron
      const job = cron.schedule(schedule.cron_expression, () => {
        this.executePost(schedule);
      });

      this.activeJobs.set(schedule.id, { type: 'cron', ref: job });
      console.log(`[Scheduler] Set up recurring cron for schedule ${schedule.id}: ${schedule.cron_expression}`);
    }
  }

  // Execute a scheduled post
  async executePost(schedule) {
    console.log(`[Scheduler] Executing post ${schedule.post_id} on ${schedule.platform}`);

    try {
      const post = getDb().prepare('SELECT * FROM posts WHERE id = ?').get(schedule.post_id);
      if (!post) {
        console.error(`[Scheduler] Post ${schedule.post_id} not found`);
        this.updateScheduleStatus(schedule.id, 'failed');
        return;
      }

      const { metaService, youtubeService, linkedInService } = require('./socialMedia');

      let result;
      switch (schedule.platform) {
        case 'facebook':
          result = await metaService.postToFacebook({
            message: post.content,
            imageUrl: post.image_url
          });
          break;
        case 'instagram':
          result = await metaService.postToInstagram({
            caption: post.content,
            imageUrl: post.image_url
          });
          break;
        case 'threads':
          result = await metaService.postToThreads({
            text: post.content,
            imageUrl: post.image_url
          });
          break;
        case 'youtube':
          result = await youtubeService.postToYouTube({
            title: post.title,
            description: post.content
          });
          break;
        case 'linkedin':
          result = await linkedInService.postToLinkedIn({
            text: post.content,
            imageUrl: post.image_url,
            title: post.title
          });
          break;
        default:
          throw new Error(`Unknown platform: ${schedule.platform}`);
      }

      // Update post platform status
      getDb().prepare(`
        INSERT INTO post_platform_status (post_id, platform, status, platform_post_id, published_at)
        VALUES (?, ?, 'published', ?, datetime('now'))
      `).run(post.id, schedule.platform, result?.platformPostId);

      // Update schedule status
      if (schedule.recurrence === 'once') {
        this.updateScheduleStatus(schedule.id, 'completed');
      }

      // Update post status
      getDb().prepare("UPDATE posts SET status = 'published', published_at = datetime('now') WHERE id = ?")
        .run(post.id);

      console.log(`[Scheduler] Successfully posted to ${schedule.platform}`);
    } catch (error) {
      console.error(`[Scheduler] Failed to post: ${error.message}`);

      getDb().prepare(`
        INSERT INTO post_platform_status (post_id, platform, status, error_message)
        VALUES (?, ?, 'failed', ?)
      `).run(schedule.post_id, schedule.platform, error.message);

      this.updateScheduleStatus(schedule.id, 'failed');
    }
  }

  // Update schedule status
  updateScheduleStatus(scheduleId, status) {
    getDb().prepare('UPDATE schedules SET status = ? WHERE id = ?').run(status, scheduleId);

    // Clean up active job
    const job = this.activeJobs.get(scheduleId);
    if (job) {
      if (job.type === 'timeout') clearTimeout(job.ref);
      if (job.type === 'cron') job.ref.stop();
      this.activeJobs.delete(scheduleId);
    }
  }

  // Cancel a schedule
  cancelSchedule(scheduleId) {
    this.updateScheduleStatus(scheduleId, 'cancelled');
    return { success: true, message: 'Schedule cancelled' };
  }

  // Get all schedules
  getSchedules(filters = {}) {
    let query = `
      SELECT s.*, p.title as post_title, p.content as post_content, p.category
      FROM schedules s
      JOIN posts p ON s.post_id = p.id
      WHERE 1=1
    `;
    const params = [];

    if (filters.status) {
      query += ' AND s.status = ?';
      params.push(filters.status);
    }
    if (filters.platform) {
      query += ' AND s.platform = ?';
      params.push(filters.platform);
    }
    if (filters.startDate) {
      query += ' AND s.scheduled_time >= ?';
      params.push(filters.startDate);
    }
    if (filters.endDate) {
      query += ' AND s.scheduled_time <= ?';
      params.push(filters.endDate);
    }

    query += ' ORDER BY s.scheduled_time ASC';
    return getDb().prepare(query).all(...params);
  }

  // Get upcoming schedules (next 7 days)
  getUpcoming() {
    return getDb().prepare(`
      SELECT s.*, p.title as post_title, p.content as post_content, p.category, p.image_url
      FROM schedules s
      JOIN posts p ON s.post_id = p.id
      WHERE s.status = 'pending' AND s.scheduled_time > datetime('now')
      AND s.scheduled_time <= datetime('now', '+7 days')
      ORDER BY s.scheduled_time ASC
    `).all();
  }

  // Convert datetime + recurrence to cron expression
  timeToCron(dateTimeStr, recurrence) {
    const date = new Date(dateTimeStr);
    const minute = date.getMinutes();
    const hour = date.getHours();
    const dayOfMonth = date.getDate();
    const month = date.getMonth() + 1;
    const dayOfWeek = date.getDay();

    switch (recurrence) {
      case 'daily':
        return `${minute} ${hour} * * *`;
      case 'weekly':
        return `${minute} ${hour} * * ${dayOfWeek}`;
      case 'monthly':
        return `${minute} ${hour} ${dayOfMonth} * *`;
      case 'weekdays':
        return `${minute} ${hour} * * 1-5`;
      default: // once
        return `${minute} ${hour} ${dayOfMonth} ${month} *`;
    }
  }

  // Get posting suggestions (best times)
  getPostingSuggestions() {
    return {
      facebook: {
        bestTimes: ['9:00 AM', '1:00 PM', '4:00 PM'],
        bestDays: ['Wednesday', 'Thursday', 'Friday'],
        frequency: '1-2 posts/day'
      },
      instagram: {
        bestTimes: ['11:00 AM', '2:00 PM', '7:00 PM'],
        bestDays: ['Tuesday', 'Wednesday', 'Friday'],
        frequency: '1-3 posts/day + stories'
      },
      youtube: {
        bestTimes: ['2:00 PM', '5:00 PM', '9:00 PM'],
        bestDays: ['Thursday', 'Friday', 'Saturday'],
        frequency: '2-3 videos/week'
      },
      linkedin: {
        bestTimes: ['7:30 AM', '12:00 PM', '5:30 PM'],
        bestDays: ['Tuesday', 'Wednesday', 'Thursday'],
        frequency: '1 post/day'
      },
      threads: {
        bestTimes: ['10:00 AM', '1:00 PM', '8:00 PM'],
        bestDays: ['Monday', 'Wednesday', 'Friday'],
        frequency: '2-4 posts/day'
      }
    };
  }
}

module.exports = new SchedulerService();
