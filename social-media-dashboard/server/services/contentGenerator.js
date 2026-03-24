const { getDb } = require('../config/database');

// ==============================================
// AI CONTENT GENERATION SERVICE
// ==============================================

class ContentGeneratorService {
  constructor() {
    this.categories = {
      asset_products: {
        label: 'Asset & Liability Products',
        subcategories: {
          gold_loan: 'Gold Loan',
          mortgage_loan: 'Mortgage Loan',
          sme_loan: 'SME Loan'
        }
      },
      financial_literacy: {
        label: 'Financial Literacy',
        subcategories: {
          saving_tips: 'Saving Tips',
          investment: 'Investment Basics',
          gold_investment: 'Gold Investment',
          budgeting: 'Budgeting',
          credit_score: 'Credit Score',
          tax_planning: 'Tax Planning',
          insurance: 'Insurance Awareness'
        }
      },
      custom: {
        label: 'Custom Topics',
        subcategories: {
          testimonial: 'Customer Testimonial',
          announcement: 'Announcement',
          festival: 'Festival Greeting',
          tips: 'Tips & Tricks',
          news: 'Industry News',
          engagement: 'Engagement Post'
        }
      }
    };

    this.platformSpecs = {
      facebook: { maxLength: 63206, hashtagLimit: 30, imageSize: '1200x630', videoMax: '240min' },
      instagram: { maxLength: 2200, hashtagLimit: 30, imageSize: '1080x1080', videoMax: '60s/90s reels' },
      youtube: { titleMax: 100, descMax: 5000, imageSize: '1280x720', videoMax: 'varies' },
      linkedin: { maxLength: 3000, hashtagLimit: 5, imageSize: '1200x627', videoMax: '10min' },
      threads: { maxLength: 500, hashtagLimit: 10, imageSize: '1080x1080', videoMax: '5min' }
    };
  }

  // Get all content categories
  getCategories() {
    return this.categories;
  }

  // Get templates by category
  getTemplates(category, subcategory) {
    let query = 'SELECT * FROM content_templates WHERE 1=1';
    const params = [];

    if (category) {
      query += ' AND category = ?';
      params.push(category);
    }
    if (subcategory) {
      query += ' AND subcategory = ?';
      params.push(subcategory);
    }

    return getDb().prepare(query).all(...params);
  }

  // Generate content using AI (OpenAI)
  async generateWithAI({ category, subcategory, topic, tone, platforms, customPrompt }) {
    try {
      const OpenAI = require('openai');
      const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

      const platformList = platforms.join(', ');
      const categoryLabel = this.categories[category]?.label || category;
      const subcatLabel = this.categories[category]?.subcategories?.[subcategory] || subcategory;

      const systemPrompt = `You are a social media content creator for Dhanam Finance, an RBI-licensed NBFC in Tamil Nadu, India.
Company details:
- Tagline: "Empowering people. Enabling progress."
- Products: Gold Loans, Mortgage Loans, SME Loans
- 50+ branches across Tamil Nadu
- 10+ years of trust, 5L+ happy customers
- Contact: 1800 2025 180
- Tone: Professional yet approachable, warm, trustworthy

Generate engaging social media content that follows best practices for each platform.`;

      const userPrompt = `Generate social media content for the following:
Category: ${categoryLabel}
${subcatLabel ? `Subcategory: ${subcatLabel}` : ''}
${topic ? `Topic: ${topic}` : ''}
Tone: ${tone || 'professional and warm'}
Platforms: ${platformList}
${customPrompt ? `Additional instructions: ${customPrompt}` : ''}

For each platform, provide:
1. The post text (optimized for that platform's character limits and style)
2. Relevant hashtags
3. Best posting time suggestion
4. A brief image description suggestion

Format the response as JSON:
{
  "posts": {
    "platform_name": {
      "text": "...",
      "hashtags": ["..."],
      "bestTime": "...",
      "imageDescription": "..."
    }
  }
}`;

      const completion = await openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.7,
        max_tokens: 2000,
        response_format: { type: 'json_object' }
      });

      return JSON.parse(completion.choices[0].message.content);
    } catch (error) {
      console.error('AI generation error:', error.message);
      // Fallback to template-based generation
      return this.generateFromTemplate({ category, subcategory, platforms });
    }
  }

  // Generate content from templates (fallback or explicit)
  generateFromTemplate({ category, subcategory, platforms }) {
    const templates = this.getTemplates(category, subcategory);
    if (templates.length === 0) {
      return this.generateGenericContent({ category, subcategory, platforms });
    }

    const template = templates[Math.floor(Math.random() * templates.length)];
    const posts = {};

    for (const platform of platforms) {
      const specs = this.platformSpecs[platform];
      let text = template.template_text;

      // Truncate for platform limits
      if (text.length > specs.maxLength) {
        text = text.substring(0, specs.maxLength - 3) + '...';
      }

      // Adjust hashtags for platform
      let hashtags = template.hashtags ? template.hashtags.split(' ').filter(h => h.startsWith('#')) : [];
      if (hashtags.length > specs.hashtagLimit) {
        hashtags = hashtags.slice(0, specs.hashtagLimit);
      }

      posts[platform] = {
        text,
        hashtags,
        bestTime: this.getBestPostingTime(platform),
        imageDescription: `Professional image for ${this.categories[category]?.subcategories?.[subcategory] || category}`
      };
    }

    return { posts, source: 'template', templateId: template.id };
  }

  // Generic content generator
  generateGenericContent({ category, subcategory, platforms }) {
    const posts = {};
    const catLabel = this.categories[category]?.label || 'Dhanam Finance';

    for (const platform of platforms) {
      posts[platform] = {
        text: `Discover ${catLabel} solutions with Dhanam Finance! 🌟\n\nEmpowering people. Enabling progress.\n\n📞 1800 2025 180\n🏢 50+ branches across Tamil Nadu`,
        hashtags: ['#DhanamFinance', '#FinancialSolutions', '#TamilNadu', '#NBFC'],
        bestTime: this.getBestPostingTime(platform),
        imageDescription: `Dhanam Finance ${catLabel} promotional content`
      };
    }

    return { posts, source: 'generic' };
  }

  // Best posting times by platform
  getBestPostingTime(platform) {
    const times = {
      facebook: ['9:00 AM', '1:00 PM', '4:00 PM'],
      instagram: ['11:00 AM', '2:00 PM', '7:00 PM'],
      youtube: ['2:00 PM', '5:00 PM', '9:00 PM'],
      linkedin: ['7:30 AM', '12:00 PM', '5:30 PM'],
      threads: ['10:00 AM', '1:00 PM', '8:00 PM']
    };
    const platformTimes = times[platform] || ['10:00 AM'];
    return platformTimes[Math.floor(Math.random() * platformTimes.length)];
  }
}

module.exports = new ContentGeneratorService();
