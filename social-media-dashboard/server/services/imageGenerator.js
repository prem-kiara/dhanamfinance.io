const path = require('path');
const fs = require('fs');

// ==============================================
// IMAGE GENERATION SERVICE
// Template-based + AI + Custom Upload
// ==============================================

class ImageGeneratorService {
  constructor() {
    this.uploadDir = path.join(__dirname, '..', 'uploads');
    this.generatedDir = path.join(__dirname, '..', 'uploads', 'generated');
    if (!fs.existsSync(this.generatedDir)) fs.mkdirSync(this.generatedDir, { recursive: true });

    // Brand colors
    this.brand = {
      primary: '#B8860B',
      primaryLight: '#D4A528',
      accent: '#C75B2A',
      navy: '#2D2926',
      cream: '#FFF9F0',
      white: '#FFFFFF',
      green: '#00A652',
      blue: '#0066CC'
    };

    // Template configurations
    this.templates = {
      gold_loan: {
        bgColor: '#FFF9F0',
        accentColor: '#B8860B',
        icon: '✨',
        overlay: 'linear-gradient(135deg, #B8860B22, #D4A52822)'
      },
      mortgage_loan: {
        bgColor: '#E0EDFF',
        accentColor: '#0066CC',
        icon: '🏠',
        overlay: 'linear-gradient(135deg, #0066CC22, #2563EB22)'
      },
      sme_loan: {
        bgColor: '#D9F5E5',
        accentColor: '#00A652',
        icon: '📈',
        overlay: 'linear-gradient(135deg, #00A65222, #16A34A22)'
      },
      financial_literacy: {
        bgColor: '#F5F3EE',
        accentColor: '#8B6914',
        icon: '💡',
        overlay: 'linear-gradient(135deg, #8B691422, #B8860B22)'
      },
      custom: {
        bgColor: '#FFF9F0',
        accentColor: '#C75B2A',
        icon: '🌟',
        overlay: 'linear-gradient(135deg, #C75B2A22, #E8784A22)'
      }
    };
  }

  // Generate HTML-based template image (can be screenshot'd or served)
  generateTemplateHTML({ title, subtitle, category, subcategory, platform, bodyText }) {
    const templateConfig = this.templates[subcategory] || this.templates[category] || this.templates.custom;
    const sizes = {
      facebook: { width: 1200, height: 630 },
      instagram: { width: 1080, height: 1080 },
      youtube: { width: 1280, height: 720 },
      linkedin: { width: 1200, height: 627 },
      threads: { width: 1080, height: 1080 }
    };
    const size = sizes[platform] || sizes.instagram;

    return `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<style>
  @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=Inter:wght@400;500;600;700&display=swap');
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body {
    width: ${size.width}px;
    height: ${size.height}px;
    font-family: 'Inter', sans-serif;
    background: ${templateConfig.bgColor};
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 60px;
    position: relative;
    overflow: hidden;
  }
  .bg-accent {
    position: absolute;
    top: -100px;
    right: -100px;
    width: 400px;
    height: 400px;
    border-radius: 50%;
    background: ${templateConfig.accentColor}15;
  }
  .bg-accent-2 {
    position: absolute;
    bottom: -80px;
    left: -80px;
    width: 300px;
    height: 300px;
    border-radius: 50%;
    background: ${templateConfig.accentColor}10;
  }
  .top-bar {
    height: 6px;
    background: linear-gradient(90deg, ${templateConfig.accentColor}, ${this.brand.primaryLight});
    position: absolute;
    top: 0; left: 0; right: 0;
  }
  .content { position: relative; z-index: 1; flex: 1; display: flex; flex-direction: column; justify-content: center; }
  .icon { font-size: 48px; margin-bottom: 20px; }
  .title {
    font-family: 'DM Serif Display', serif;
    font-size: ${platform === 'instagram' || platform === 'threads' ? '52px' : '44px'};
    color: ${this.brand.navy};
    line-height: 1.2;
    margin-bottom: 16px;
  }
  .subtitle {
    font-size: 20px;
    color: #6B6559;
    line-height: 1.6;
    max-width: 80%;
  }
  .body-text {
    font-size: 18px;
    color: #3D3835;
    line-height: 1.7;
    margin-top: 20px;
    max-width: 85%;
  }
  .footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    position: relative;
    z-index: 1;
    border-top: 2px solid ${templateConfig.accentColor}20;
    padding-top: 24px;
  }
  .brand { display: flex; align-items: center; gap: 12px; }
  .brand-name {
    font-family: 'DM Serif Display', serif;
    font-size: 24px;
    color: ${templateConfig.accentColor};
    font-weight: 700;
  }
  .brand-tagline { font-size: 13px; color: #9B9288; }
  .cta {
    background: ${templateConfig.accentColor};
    color: white;
    padding: 12px 28px;
    border-radius: 8px;
    font-weight: 600;
    font-size: 16px;
  }
  .contact { font-size: 14px; color: #6B6559; }
</style>
</head>
<body>
  <div class="top-bar"></div>
  <div class="bg-accent"></div>
  <div class="bg-accent-2"></div>
  <div class="content">
    <div class="icon">${templateConfig.icon}</div>
    <div class="title">${title || 'Dhanam Finance'}</div>
    <div class="subtitle">${subtitle || 'Empowering people. Enabling progress.'}</div>
    ${bodyText ? `<div class="body-text">${bodyText}</div>` : ''}
  </div>
  <div class="footer">
    <div class="brand">
      <div>
        <div class="brand-name">Dhanam Finance</div>
        <div class="brand-tagline">Empowering people. Enabling progress.</div>
      </div>
    </div>
    <div class="contact">📞 1800 2025 180</div>
  </div>
</body>
</html>`;
  }

  // Generate image using AI (OpenAI DALL-E)
  async generateWithAI({ prompt, platform, style }) {
    try {
      const OpenAI = require('openai');
      const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

      const sizes = {
        facebook: '1792x1024',
        instagram: '1024x1024',
        youtube: '1792x1024',
        linkedin: '1792x1024',
        threads: '1024x1024'
      };

      const enhancedPrompt = `Create a professional, modern financial services marketing image for Dhanam Finance (Indian NBFC).
Style: ${style || 'clean, professional, warm gold and cream tones'}.
Brand colors: Gold (#B8860B), Cream (#FFF9F0), Charcoal (#2D2926).
${prompt}
No text in the image. Clean, corporate, trustworthy aesthetic.`;

      const response = await openai.images.generate({
        model: 'dall-e-3',
        prompt: enhancedPrompt,
        n: 1,
        size: sizes[platform] || '1024x1024',
        quality: 'hd'
      });

      return {
        url: response.data[0].url,
        revisedPrompt: response.data[0].revised_prompt,
        type: 'ai_generated'
      };
    } catch (error) {
      console.error('AI image generation error:', error.message);
      throw new Error('AI image generation failed: ' + error.message);
    }
  }

  // Get list of uploaded images
  getUploadedImages() {
    const imagesDir = path.join(this.uploadDir, 'images');
    if (!fs.existsSync(imagesDir)) return [];

    return fs.readdirSync(imagesDir)
      .filter(f => /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(f))
      .map(f => ({
        filename: f,
        url: `/uploads/images/${f}`,
        path: path.join(imagesDir, f),
        size: fs.statSync(path.join(imagesDir, f)).size,
        modified: fs.statSync(path.join(imagesDir, f)).mtime
      }))
      .sort((a, b) => b.modified - a.modified);
  }

  // Get all template types
  getTemplateTypes() {
    return Object.entries(this.templates).map(([key, config]) => ({
      id: key,
      icon: config.icon,
      bgColor: config.bgColor,
      accentColor: config.accentColor
    }));
  }
}

module.exports = new ImageGeneratorService();
