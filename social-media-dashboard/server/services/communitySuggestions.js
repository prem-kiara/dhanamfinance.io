const { getDb } = require('../config/database');

// ==============================================
// COMMUNITY GROWTH SUGGESTIONS ENGINE
// ==============================================

class CommunitySuggestionsService {
  // Generate personalized suggestions based on analytics
  generateSuggestions() {
    const stats = this.getBasicStats();
    const suggestions = [];

    // === CONTENT STRATEGY SUGGESTIONS ===
    suggestions.push({
      category: 'Content Strategy',
      icon: '📝',
      items: [
        {
          title: 'Diversify Content Mix',
          description: 'Maintain a 70-20-10 content ratio: 70% value-driven (financial tips, education), 20% promotional (product offers), 10% engagement (polls, Q&A, behind-the-scenes).',
          priority: 'high',
          impact: 'Increases organic reach by 30-40%'
        },
        {
          title: 'Create Regional Content in Tamil',
          description: 'Post content in both Tamil and English. Regional language posts see 2-3x more engagement in Tamil Nadu. Use Tamil captions with English hashtags.',
          priority: 'high',
          impact: 'Can increase engagement by 150-200%'
        },
        {
          title: 'Start a Financial Literacy Series',
          description: 'Create a weekly "Money Monday" or "Finance Friday" series covering budgeting, saving, investing basics. Series content builds anticipation and loyal followers.',
          priority: 'medium',
          impact: 'Builds authority and trust, 20-30% follower growth'
        },
        {
          title: 'Customer Success Stories',
          description: 'Share video testimonials and success stories from customers who used Dhanam loans. User-generated content gets 4x more engagement than brand content.',
          priority: 'high',
          impact: 'Builds trust, 50% more profile visits'
        },
        {
          title: 'Festival & Cultural Content Calendar',
          description: 'Plan content around Tamil festivals (Pongal, Deepavali, Tamil New Year), national holidays, and financial events (tax season, budget). This shows cultural awareness.',
          priority: 'medium',
          impact: 'Seasonal engagement spikes of 200-300%'
        }
      ]
    });

    // === PLATFORM-SPECIFIC SUGGESTIONS ===
    suggestions.push({
      category: 'Platform Growth',
      icon: '📱',
      items: [
        {
          title: 'Instagram Reels Strategy',
          description: 'Create 15-30 second Reels explaining gold loan process, mortgage tips, or quick financial hacks. Reels get 3x the reach of static posts. Aim for 3-5 Reels/week.',
          priority: 'high',
          platform: 'instagram',
          impact: 'Instagram Reels average 2x more reach than feed posts'
        },
        {
          title: 'YouTube Shorts for Financial Tips',
          description: 'Convert financial literacy content into 60-second YouTube Shorts. Cover topics like "5 things to know before taking a gold loan" or "How to calculate EMI".',
          priority: 'high',
          platform: 'youtube',
          impact: 'YouTube Shorts can drive 5x subscriber growth'
        },
        {
          title: 'LinkedIn Thought Leadership',
          description: 'Publish articles about NBFC industry trends, RBI regulations, and financial inclusion. Position Dhanam leadership as thought leaders. Post 2-3 times/week.',
          priority: 'medium',
          platform: 'linkedin',
          impact: 'Builds B2B credibility and partnership opportunities'
        },
        {
          title: 'Facebook Community Group',
          description: 'Create a "Dhanam Finance - Financial Wellness Community" group. Share exclusive tips, answer queries, and build a loyal community. Groups get 5x more organic reach.',
          priority: 'high',
          platform: 'facebook',
          impact: 'Community groups drive 60% more brand loyalty'
        },
        {
          title: 'Threads for Quick Updates',
          description: 'Use Threads for quick market updates, gold price alerts, and conversational financial tips. Be early-mover on this growing platform.',
          priority: 'medium',
          platform: 'threads',
          impact: 'First-mover advantage on growing platform'
        }
      ]
    });

    // === ENGAGEMENT TACTICS ===
    suggestions.push({
      category: 'Engagement Boosters',
      icon: '🚀',
      items: [
        {
          title: 'Interactive Polls & Quizzes',
          description: 'Run weekly polls: "Gold loan vs. Personal loan - which would you choose?" or "Test your financial literacy" quizzes. Interactive content gets 2x engagement.',
          priority: 'high',
          impact: '2x engagement, 40% more comments'
        },
        {
          title: 'Gold Price Alert Posts',
          description: 'Post daily/weekly gold price updates. This is high-value, time-sensitive content that keeps followers coming back. Use Instagram Stories for real-time updates.',
          priority: 'high',
          impact: 'Daily engagement driver, 3x story views'
        },
        {
          title: 'Employee Spotlights',
          description: 'Feature branch managers and loan officers. Humanize the brand with "Meet Our Team" posts. People connect with people, not logos.',
          priority: 'medium',
          impact: '35% more profile visits, builds trust'
        },
        {
          title: 'EMI Calculator Challenges',
          description: 'Post "Can you calculate the EMI?" challenges. Educational + interactive content drives comments and saves.',
          priority: 'low',
          impact: 'Increases saves and shares by 25%'
        },
        {
          title: 'Customer Milestone Celebrations',
          description: 'Celebrate customer milestones: "10,000th customer served at our Madurai branch!" Creates community feeling and social proof.',
          priority: 'medium',
          impact: 'Drives local engagement and branch awareness'
        }
      ]
    });

    // === GROWTH HACKS ===
    suggestions.push({
      category: 'Growth Strategies',
      icon: '📈',
      items: [
        {
          title: 'Cross-Platform Content Repurposing',
          description: 'Turn one blog post into: 1 LinkedIn article, 3 Instagram carousel slides, 1 YouTube Short, 5 Threads posts. Maximize content ROI.',
          priority: 'high',
          impact: '5x content output with same effort'
        },
        {
          title: 'Hashtag Strategy Optimization',
          description: 'Use a mix of high-volume (#Finance), medium (#GoldLoan), and niche (#TamilNaduNBFC) hashtags. Create a branded hashtag #DhanamFinance.',
          priority: 'medium',
          impact: 'Can increase discoverability by 70%'
        },
        {
          title: 'Collaborate with Local Influencers',
          description: 'Partner with Tamil finance influencers and local business owners for cross-promotions. Micro-influencers (10K-50K followers) have 60% higher engagement.',
          priority: 'high',
          impact: 'Access to new audience, 40% follower growth'
        },
        {
          title: 'Referral Contest Campaigns',
          description: 'Run "Refer & Win" campaigns on social media. Offer gold coin prizes for most referrals. UGC campaigns drive 6.9x more engagement.',
          priority: 'medium',
          impact: 'Viral potential, 5x reach increase'
        },
        {
          title: 'SEO-Driven YouTube Content',
          description: 'Create long-form YouTube content answering FAQs: "How gold loans work in India", "Best NBFC for gold loan". These rank on Google and YouTube search.',
          priority: 'high',
          impact: 'Long-term organic discovery channel'
        },
        {
          title: 'Consistent Posting Schedule',
          description: 'Post at the same times daily. Consistency builds algorithmic favor. Use: FB (9AM, 1PM), IG (11AM, 7PM), LinkedIn (7:30AM, 12PM), YouTube (2PM).',
          priority: 'high',
          impact: 'Consistent posting increases reach by 50%'
        }
      ]
    });

    // === COMMUNITY BUILDING ===
    suggestions.push({
      category: 'Community Building',
      icon: '🤝',
      items: [
        {
          title: 'Respond to Every Comment Within 1 Hour',
          description: 'Fast response time signals to algorithms that your content sparks conversation. Aim for <1 hour response on all comments.',
          priority: 'high',
          impact: 'Increases comment count by 100%, boosts reach'
        },
        {
          title: 'Host Monthly Live Q&A Sessions',
          description: 'Go live on Instagram/Facebook monthly with a financial expert from Dhanam. Cover loan processes, financial planning, gold market trends.',
          priority: 'medium',
          impact: 'Live sessions get 3x the engagement of regular posts'
        },
        {
          title: 'Create a WhatsApp Community',
          description: 'Build a WhatsApp Community channel for gold price alerts, financial tips, and exclusive offers. Direct communication channel with customers.',
          priority: 'high',
          impact: 'Direct reach, 98% open rates'
        },
        {
          title: 'Branch-Level Social Handles',
          description: 'Create location-based social pages or highlight posts for major branches. Local content performs better for local businesses.',
          priority: 'low',
          impact: 'Hyperlocal engagement, 2x local reach'
        }
      ]
    });

    return {
      suggestions,
      generatedAt: new Date().toISOString(),
      basedOnPosts: stats.totalPosts,
      priorityActions: this.getTopPriorityActions(suggestions)
    };
  }

  // Get top 5 priority actions
  getTopPriorityActions(suggestions) {
    const allItems = suggestions.flatMap(s =>
      s.items.map(item => ({ ...item, category: s.category }))
    );
    return allItems
      .filter(i => i.priority === 'high')
      .slice(0, 5)
      .map(i => ({
        action: i.title,
        category: i.category,
        impact: i.impact
      }));
  }

  getBasicStats() {
    const totalPosts = getDb().prepare('SELECT COUNT(*) as count FROM posts').get().count;
    return { totalPosts };
  }
}

module.exports = new CommunitySuggestionsService();
