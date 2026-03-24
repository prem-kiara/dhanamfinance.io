// Seed demo data for testing the dashboard
module.exports = function seedDemo(db, uuidv4) {
  // Clear existing demo data
  db.prepare("DELETE FROM analytics").run();
  db.prepare("DELETE FROM post_platform_status").run();
  db.prepare("DELETE FROM schedules").run();
  db.prepare("DELETE FROM posts WHERE id LIKE 'demo_%'").run();
  db.prepare("DELETE FROM community_metrics").run();

  const platforms = ['facebook', 'instagram', 'youtube', 'linkedin', 'threads'];
  const categories = ['asset_products', 'financial_literacy', 'custom'];
  const subcategories = {
    asset_products: ['gold_loan', 'mortgage_loan', 'sme_loan'],
    financial_literacy: ['saving_tips', 'investment', 'gold_investment'],
    custom: ['testimonial', 'announcement', 'engagement']
  };

  const titles = [
    'Gold Loan - Quick Disbursal Available!',
    'Financial Tip: The 50/30/20 Rule',
    'Mortgage Loan for Your Dream Home',
    'SME Growth Solutions',
    'Customer Success Story - Madurai Branch',
    'Gold Price Update - Weekly Alert',
    'New Branch Opening in Coimbatore',
    'Investment Basics for Beginners',
    'Festival Special - Gold Loan Offers',
    'Understanding Credit Scores',
    'Dhanam Finance - 10 Years of Trust',
    'EMI Calculator - Plan Your Loan',
    'Tax Planning Tips for Salaried',
    'Gold Loan vs Personal Loan',
    'SME Loan - Supply Chain Finance',
    'Meet Our Madurai Branch Team',
    'Pongal Special - Financial Wishes',
    'Why Choose Dhanam Finance?',
    'Home Loan Tips for First-Time Buyers',
    'Savings Account vs Fixed Deposit'
  ];

  const posts = [];
  const now = new Date();

  for (let i = 0; i < 20; i++) {
    const cat = categories[i % 3];
    const subcat = subcategories[cat][i % subcategories[cat].length];
    const platformSet = platforms.slice(0, 2 + Math.floor(Math.random() * 4)).join(',');
    const daysAgo = Math.floor(Math.random() * 60);
    const createdAt = new Date(now.getTime() - daysAgo * 86400000).toISOString();
    const status = i < 12 ? 'published' : (i < 16 ? 'scheduled' : 'draft');
    const id = `demo_${uuidv4()}`;

    db.prepare(`
      INSERT INTO posts (id, title, content, category, subcategory, platforms, status, created_at, published_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      id, titles[i],
      `This is demo content for "${titles[i]}". Empowering people. Enabling progress. Contact Dhanam Finance at 1800 2025 180.`,
      cat, subcat, platformSet, status, createdAt,
      status === 'published' ? createdAt : null
    );

    posts.push({ id, platforms: platformSet.split(','), status, createdAt });
  }

  // Seed analytics for published posts
  for (const post of posts.filter(p => p.status === 'published')) {
    for (const platform of post.platforms) {
      const baseEngagement = Math.floor(Math.random() * 500) + 50;
      for (let day = 0; day < 7; day++) {
        const date = new Date(new Date(post.createdAt).getTime() + day * 86400000);
        const decay = Math.max(0.1, 1 - day * 0.15);

        db.prepare(`
          INSERT INTO analytics (post_id, platform, likes, comments, shares, views, reach, impressions, engagement_rate, clicks, saves, fetched_at)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `).run(
          post.id, platform,
          Math.floor(baseEngagement * decay * (0.5 + Math.random())),
          Math.floor(baseEngagement * 0.15 * decay * (0.5 + Math.random())),
          Math.floor(baseEngagement * 0.08 * decay * (0.5 + Math.random())),
          Math.floor(baseEngagement * 10 * decay * (0.5 + Math.random())),
          Math.floor(baseEngagement * 5 * decay * (0.5 + Math.random())),
          Math.floor(baseEngagement * 15 * decay * (0.5 + Math.random())),
          Math.round((2 + Math.random() * 6) * 100) / 100,
          Math.floor(baseEngagement * 0.3 * decay * (0.5 + Math.random())),
          Math.floor(baseEngagement * 0.05 * decay * (0.5 + Math.random())),
          date.toISOString()
        );
      }
    }
  }

  // Seed community metrics
  for (const platform of platforms) {
    const baseFollowers = { facebook: 15000, instagram: 8500, youtube: 3200, linkedin: 5600, threads: 1200 };
    for (let week = 0; week < 8; week++) {
      const date = new Date(now.getTime() - week * 7 * 86400000);
      const growth = 1 + (8 - week) * 0.02;
      db.prepare(`
        INSERT INTO community_metrics (platform, followers, following, total_posts, avg_engagement_rate, growth_rate, recorded_at)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `).run(
        platform,
        Math.floor(baseFollowers[platform] * growth),
        Math.floor(baseFollowers[platform] * 0.1),
        20 + (8 - week) * 3,
        Math.round((2 + Math.random() * 4) * 100) / 100,
        Math.round((1 + Math.random() * 5) * 100) / 100,
        date.toISOString()
      );
    }
  }

  // Seed scheduled posts
  for (const post of posts.filter(p => p.status === 'scheduled')) {
    for (const platform of post.platforms) {
      const futureDate = new Date(now.getTime() + Math.floor(Math.random() * 7) * 86400000 + Math.floor(Math.random() * 12) * 3600000);
      db.prepare(`
        INSERT INTO schedules (id, post_id, platform, scheduled_time, recurrence, status)
        VALUES (?, ?, ?, ?, 'once', 'pending')
      `).run(`demo_sched_${uuidv4()}`, post.id, platform, futureDate.toISOString());
    }
  }

  console.log('[Seed] Demo data created: 20 posts, analytics, community metrics, schedules');
};
