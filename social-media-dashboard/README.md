# Dhanam Finance - Social Media Dashboard

A comprehensive social media management platform built for Dhanam Finance to generate, schedule, and monitor content across all major social media platforms.

## Features

### Content Creation
- **Multi-Platform Support**: Facebook, Instagram, YouTube, LinkedIn, Threads
- **Content Categories**: Asset Products (Gold Loan, Mortgage, SME), Financial Literacy, Custom Topics
- **AI Content Generation**: OpenAI-powered content creation tailored per platform
- **Template Library**: Pre-built content templates with Dhanam Finance branding
- **Per-Platform Optimization**: Content automatically adapted for each platform's requirements

### Image Studio
- **Template-Based Images**: Branded HTML templates for each product category
- **AI Image Generation**: DALL-E 3 integration for custom image creation
- **Custom Upload**: Upload your own images for posts
- **Image Library**: Manage all uploaded and generated images
- **Platform-Specific Sizing**: Auto-sized for each platform (1080x1080, 1200x630, etc.)

### Scheduling
- **Multi-Time Scheduling**: Schedule posts multiple times per day
- **Recurring Schedules**: Daily, weekly, weekday, monthly recurrence
- **Calendar View**: Visual weekly calendar of scheduled posts
- **Best Time Suggestions**: Platform-specific optimal posting times
- **Bulk Scheduling**: Schedule across all platforms simultaneously

### Analytics & Reporting
- **Dashboard Overview**: Total engagement, reach, impressions at a glance
- **Platform Comparison**: Side-by-side performance across all platforms
- **Engagement Trends**: 30/60/90 day trend analysis with charts
- **Top Posts Ranking**: Best performing content sorted by various metrics
- **Category Performance**: Which content categories perform best
- **Community Growth**: Follower growth tracking per platform

### Community Growth Suggestions
- **Content Strategy**: 70-20-10 content mix, regional content, series ideas
- **Platform-Specific Tips**: Tailored strategies for each platform
- **Engagement Tactics**: Polls, quizzes, gold price alerts, employee spotlights
- **Growth Hacks**: Cross-platform repurposing, hashtag strategy, influencer collabs
- **Priority Actions**: Top 5 immediate actions for maximum impact

## Setup Instructions

### Prerequisites
- Node.js 18+ installed
- npm or yarn

### 1. Install Dependencies

```bash
cd social-media-dashboard

# Install root dependencies
npm install

# Install server dependencies
cd server && npm install && cd ..

# Install client dependencies
cd client && npm install && cd ..
```

### 2. Configure Environment

```bash
# Copy example env file
cp server/.env.example server/.env

# Edit the .env file with your API credentials
```

### 3. Social Media API Setup

#### Meta (Facebook, Instagram, Threads)
1. Go to [Meta for Developers](https://developers.facebook.com/)
2. Create a new app (Business type)
3. Add Facebook Login, Instagram Graph API, and Threads API
4. Generate a long-lived Page Access Token
5. Add credentials to `.env`

#### YouTube
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a project and enable YouTube Data API v3
3. Create OAuth 2.0 credentials
4. Generate a refresh token using the OAuth playground
5. Add credentials to `.env`

#### LinkedIn
1. Go to [LinkedIn Developer Portal](https://www.linkedin.com/developers/)
2. Create a new app
3. Request `w_member_social` and `w_organization_social` permissions
4. Generate an access token
5. Add credentials to `.env`

#### OpenAI (for AI features)
1. Go to [OpenAI Platform](https://platform.openai.com/)
2. Generate an API key
3. Add to `.env` as `OPENAI_API_KEY`

### 4. Run the Application

```bash
# Start both server and client
npm start

# Or run separately:
npm run server   # Backend on port 5000
npm run client   # Frontend on port 3000
```

### 5. Load Demo Data

Click "Load Demo Data" on the dashboard to populate with sample posts, analytics, and community metrics.

## Tech Stack

- **Frontend**: React 18, Vite, Tailwind CSS, Recharts, Lucide Icons
- **Backend**: Node.js, Express, SQLite (better-sqlite3)
- **Scheduling**: node-cron for recurring schedules
- **APIs**: Meta Graph API, YouTube Data API, LinkedIn Marketing API
- **AI**: OpenAI GPT-4 (content), DALL-E 3 (images)

## Project Structure

```
social-media-dashboard/
├── client/                    # React frontend
│   ├── src/
│   │   ├── pages/            # Dashboard, ContentCreator, Scheduler, Analytics, etc.
│   │   ├── utils/            # API client
│   │   ├── App.jsx           # Main app with routing
│   │   └── main.jsx          # Entry point
│   └── package.json
├── server/                    # Node.js backend
│   ├── config/               # Database setup, seed data
│   ├── routes/               # API routes (posts, analytics, images, schedules, settings)
│   ├── services/             # Business logic (social media, content gen, scheduler, analytics)
│   ├── uploads/              # Image storage
│   └── index.js              # Server entry point
└── README.md
```

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/posts` | GET/POST | List/create posts |
| `/api/posts/:id/publish` | POST | Publish immediately |
| `/api/posts/:id/schedule` | POST | Schedule post |
| `/api/posts/content/generate` | POST | Generate content |
| `/api/images/upload` | POST | Upload image |
| `/api/images/generate-template` | POST | Generate template image |
| `/api/images/generate-ai` | POST | AI image generation |
| `/api/analytics/dashboard` | GET | Overview stats |
| `/api/analytics/report` | GET | Full report |
| `/api/schedules` | GET | All schedules |
| `/api/settings/platforms` | GET/POST | Platform connections |
| `/api/settings/suggestions` | GET | Community growth tips |
