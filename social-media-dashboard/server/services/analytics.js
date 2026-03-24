const { getDb } = require('../config/database');

// ==============================================
// ANALYTICS & REPORTING SERVICE
// ==============================================

class AnalyticsService {
  // Get dashboard overview stats
  getDashboardStats() {
    const totalPosts = getDb().prepare('SELECT COUNT(*) as count FROM posts').get().count;
    const publishedPosts = getDb().prepare("SELECT COUNT(*) as count FROM posts WHERE status = 'published'").get().count;
    const scheduledPosts = getDb().prepare("SELECT COUNT(*) as count FROM posts WHERE status = 'scheduled'").get().count;
    const draftPosts = getDb().prepare("SELECT COUNT(*) as count FROM posts WHERE status = 'draft'").get().count;

    const totalEngagement = getDb().prepare('SELECT SUM(likes + comments + shares) as total FROM analytics').get().total || 0;
    const totalReach = getDb().prepare('SELECT SUM(reach) as total FROM analytics').get().total || 0;
    const totalImpressions = getDb().prepare('SELECT SUM(impressions) as total FROM analytics').get().total || 0;
    const avgEngRate = getDb().prepare('SELECT AVG(engagement_rate) as avg FROM analytics').get().avg || 0;

    return {
      posts: { total: totalPosts, published: publishedPosts, scheduled: scheduledPosts, drafts: draftPosts },
      engagement: { total: totalEngagement, avgRate: Math.round(avgEngRate * 100) / 100 },
      reach: totalReach,
      impressions: totalImpressions
    };
  }

  // Get analytics by platform
  getPlatformAnalytics(platform, dateRange) {
    let query = `
      SELECT platform,
        SUM(likes) as total_likes,
        SUM(comments) as total_comments,
        SUM(shares) as total_shares,
        SUM(views) as total_views,
        SUM(reach) as total_reach,
        SUM(impressions) as total_impressions,
        AVG(engagement_rate) as avg_engagement_rate,
        SUM(clicks) as total_clicks,
        SUM(saves) as total_saves,
        COUNT(DISTINCT post_id) as post_count
      FROM analytics WHERE 1=1
    `;
    const params = [];

    if (platform) {
      query += ' AND platform = ?';
      params.push(platform);
    }
    if (dateRange?.start) {
      query += ' AND fetched_at >= ?';
      params.push(dateRange.start);
    }
    if (dateRange?.end) {
      query += ' AND fetched_at <= ?';
      params.push(dateRange.end);
    }

    query += ' GROUP BY platform';
    return getDb().prepare(query).all(...params);
  }

  // Get post performance rankings
  getTopPosts(limit = 10, sortBy = 'engagement') {
    const orderCol = {
      engagement: '(a.likes + a.comments + a.shares)',
      reach: 'a.reach',
      impressions: 'a.impressions',
      likes: 'a.likes',
      comments: 'a.comments'
    }[sortBy] || '(a.likes + a.comments + a.shares)';

    return getDb().prepare(`
      SELECT p.*, a.likes, a.comments, a.shares, a.views, a.reach, a.impressions,
        a.engagement_rate, a.platform as analytics_platform,
        (a.likes + a.comments + a.shares) as total_engagement
      FROM posts p
      JOIN analytics a ON p.id = a.post_id
      ORDER BY ${orderCol} DESC
      LIMIT ?
    `).all(limit);
  }

  // Get engagement trends over time
  getEngagementTrends(days = 30, platform) {
    let query = `
      SELECT DATE(fetched_at) as date,
        SUM(likes) as likes,
        SUM(comments) as comments,
        SUM(shares) as shares,
        SUM(reach) as reach,
        SUM(impressions) as impressions,
        AVG(engagement_rate) as avg_engagement
      FROM analytics
      WHERE fetched_at >= datetime('now', '-${days} days')
    `;
    const params = [];

    if (platform) {
      query += ' AND platform = ?';
      params.push(platform);
    }

    query += ' GROUP BY DATE(fetched_at) ORDER BY date ASC';
    return getDb().prepare(query).all(...params);
  }

  // Get content category performance
  getCategoryPerformance() {
    return getDb().prepare(`
      SELECT p.category,
        COUNT(DISTINCT p.id) as post_count,
        SUM(a.likes) as total_likes,
        SUM(a.comments) as total_comments,
        SUM(a.shares) as total_shares,
        SUM(a.reach) as total_reach,
        AVG(a.engagement_rate) as avg_engagement_rate
      FROM posts p
      LEFT JOIN analytics a ON p.id = a.post_id
      GROUP BY p.category
      ORDER BY avg_engagement_rate DESC
    `).all();
  }

  // Get posting frequency analysis
  getPostingFrequency(days = 30) {
    return getDb().prepare(`
      SELECT DATE(created_at) as date,
        COUNT(*) as post_count,
        GROUP_CONCAT(DISTINCT platforms) as platforms_used
      FROM posts
      WHERE created_at >= datetime('now', '-${days} days')
      GROUP BY DATE(created_at)
      ORDER BY date ASC
    `).all();
  }

  // Get best performing time slots
  getBestTimeSlots() {
    return getDb().prepare(`
      SELECT
        CAST(strftime('%H', published_at) AS INTEGER) as hour,
        platform,
        AVG(engagement_rate) as avg_engagement,
        COUNT(*) as post_count
      FROM analytics a
      JOIN posts p ON a.post_id = p.id
      WHERE p.published_at IS NOT NULL
      GROUP BY hour, platform
      ORDER BY avg_engagement DESC
    `).all();
  }

  // Record analytics for a post
  recordAnalytics({ postId, platform, likes, comments, shares, views, reach, impressions, engagementRate, clicks, saves }) {
    getDb().prepare(`
      INSERT INTO analytics (post_id, platform, likes, comments, shares, views, reach, impressions, engagement_rate, clicks, saves)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(postId, platform, likes || 0, comments || 0, shares || 0, views || 0, reach || 0, impressions || 0, engagementRate || 0, clicks || 0, saves || 0);
  }

  // Get community metrics
  getCommunityMetrics() {
    return getDb().prepare(`
      SELECT * FROM community_metrics
      ORDER BY recorded_at DESC
      LIMIT 5
    `).all();
  }

  // Record community metrics
  recordCommunityMetrics({ platform, followers, following, totalPosts, avgEngagementRate, growthRate }) {
    getDb().prepare(`
      INSERT INTO community_metrics (platform, followers, following, total_posts, avg_engagement_rate, growth_rate)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(platform, followers, following, totalPosts, avgEngagementRate, growthRate);
  }

  // Generate performance report data
  generateReport(dateRange) {
    return {
      overview: this.getDashboardStats(),
      platformBreakdown: this.getPlatformAnalytics(null, dateRange),
      topPosts: this.getTopPosts(5),
      categoryPerformance: this.getCategoryPerformance(),
      trends: this.getEngagementTrends(30),
      bestTimes: this.getBestTimeSlots(),
      community: this.getCommunityMetrics()
    };
  }
}

module.exports = new AnalyticsService();
