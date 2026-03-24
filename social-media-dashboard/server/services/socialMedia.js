const axios = require('axios');

// ==============================================
// FACEBOOK / INSTAGRAM / THREADS (Meta Graph API)
// ==============================================
class MetaService {
  constructor() {
    this.graphUrl = 'https://graph.facebook.com/v19.0';
  }

  getCredentials(platform) {
    const { getDb } = require('../config/database');
    const row = getDb().prepare('SELECT credentials FROM api_credentials WHERE platform = ?').get(platform);
    return row ? JSON.parse(row.credentials) : null;
  }

  // Facebook Page Post
  async postToFacebook({ message, imageUrl, link }) {
    const creds = this.getCredentials('facebook');
    if (!creds) throw new Error('Facebook not connected. Please add API credentials.');

    const { pageId, accessToken } = creds;
    const endpoint = imageUrl
      ? `${this.graphUrl}/${pageId}/photos`
      : `${this.graphUrl}/${pageId}/feed`;

    const params = { access_token: accessToken };
    if (imageUrl) {
      params.url = imageUrl;
      params.caption = message;
    } else {
      params.message = message;
      if (link) params.link = link;
    }

    const response = await axios.post(endpoint, null, { params });
    return { platformPostId: response.data.id, platform: 'facebook' };
  }

  // Instagram Business Post
  async postToInstagram({ caption, imageUrl }) {
    const creds = this.getCredentials('instagram');
    if (!creds) throw new Error('Instagram not connected. Please add API credentials.');

    const { businessAccountId, accessToken } = creds;

    // Step 1: Create media container
    const containerRes = await axios.post(
      `${this.graphUrl}/${businessAccountId}/media`,
      null,
      {
        params: {
          image_url: imageUrl,
          caption: caption,
          access_token: accessToken
        }
      }
    );

    // Step 2: Publish
    const publishRes = await axios.post(
      `${this.graphUrl}/${businessAccountId}/media_publish`,
      null,
      {
        params: {
          creation_id: containerRes.data.id,
          access_token: accessToken
        }
      }
    );

    return { platformPostId: publishRes.data.id, platform: 'instagram' };
  }

  // Threads Post
  async postToThreads({ text, imageUrl }) {
    const creds = this.getCredentials('threads');
    if (!creds) throw new Error('Threads not connected. Please add API credentials.');

    const { userId, accessToken } = creds;

    const params = {
      media_type: imageUrl ? 'IMAGE' : 'TEXT',
      text: text,
      access_token: accessToken
    };
    if (imageUrl) params.image_url = imageUrl;

    // Step 1: Create container
    const containerRes = await axios.post(
      `${this.graphUrl}/${userId}/threads`,
      null,
      { params }
    );

    // Step 2: Publish
    const publishRes = await axios.post(
      `${this.graphUrl}/${userId}/threads_publish`,
      null,
      {
        params: {
          creation_id: containerRes.data.id,
          access_token: accessToken
        }
      }
    );

    return { platformPostId: publishRes.data.id, platform: 'threads' };
  }

  // Fetch Facebook Page Insights
  async getFacebookInsights(postId) {
    const creds = this.getCredentials('facebook');
    if (!creds) return null;

    try {
      const res = await axios.get(`${this.graphUrl}/${postId}/insights`, {
        params: {
          metric: 'post_impressions,post_engaged_users,post_clicks,post_reactions_by_type_total',
          access_token: creds.accessToken
        }
      });
      return res.data.data;
    } catch (e) {
      console.error('FB insights error:', e.message);
      return null;
    }
  }

  // Fetch Instagram Insights
  async getInstagramInsights(postId) {
    const creds = this.getCredentials('instagram');
    if (!creds) return null;

    try {
      const res = await axios.get(`${this.graphUrl}/${postId}/insights`, {
        params: {
          metric: 'impressions,reach,engagement,saved',
          access_token: creds.accessToken
        }
      });
      return res.data.data;
    } catch (e) {
      console.error('IG insights error:', e.message);
      return null;
    }
  }
}

// ==============================================
// YOUTUBE (Google/YouTube Data API v3)
// ==============================================
class YouTubeService {
  constructor() {
    this.apiUrl = 'https://www.googleapis.com/youtube/v3';
  }

  getCredentials() {
    const { getDb } = require('../config/database');
    const row = getDb().prepare('SELECT credentials FROM api_credentials WHERE platform = ?').get('youtube');
    return row ? JSON.parse(row.credentials) : null;
  }

  async postToYouTube({ title, description, thumbnailUrl, videoPath, tags }) {
    const creds = this.getCredentials();
    if (!creds) throw new Error('YouTube not connected. Please add API credentials.');

    // YouTube requires OAuth2 and video file upload via resumable upload
    // This is a simplified version - full implementation needs google-auth-library
    const { google } = require('googleapis');
    const oauth2Client = new google.auth.OAuth2(
      creds.clientId,
      creds.clientSecret
    );
    oauth2Client.setCredentials({ refresh_token: creds.refreshToken });

    const youtube = google.youtube({ version: 'v3', auth: oauth2Client });

    // For community posts (text + image)
    // Note: YouTube Community Posts API is limited, this posts a video
    if (videoPath) {
      const fs = require('fs');
      const res = await youtube.videos.insert({
        part: ['snippet', 'status'],
        requestBody: {
          snippet: {
            title,
            description,
            tags: tags || [],
            categoryId: '22' // People & Blogs
          },
          status: {
            privacyStatus: 'public'
          }
        },
        media: {
          body: fs.createReadStream(videoPath)
        }
      });
      return { platformPostId: res.data.id, platform: 'youtube' };
    }

    // For YouTube Shorts or community post (text-based)
    return { platformPostId: null, platform: 'youtube', note: 'Text/image community posts require manual posting or YouTube Studio' };
  }

  async getChannelAnalytics() {
    const creds = this.getCredentials();
    if (!creds) return null;

    try {
      const { google } = require('googleapis');
      const oauth2Client = new google.auth.OAuth2(creds.clientId, creds.clientSecret);
      oauth2Client.setCredentials({ refresh_token: creds.refreshToken });

      const youtube = google.youtube({ version: 'v3', auth: oauth2Client });
      const res = await youtube.channels.list({
        part: ['statistics', 'snippet'],
        mine: true
      });

      return res.data.items?.[0];
    } catch (e) {
      console.error('YouTube analytics error:', e.message);
      return null;
    }
  }
}

// ==============================================
// LINKEDIN (LinkedIn Marketing API)
// ==============================================
class LinkedInService {
  constructor() {
    this.apiUrl = 'https://api.linkedin.com/v2';
    this.restApiUrl = 'https://api.linkedin.com/rest';
  }

  getCredentials() {
    const { getDb } = require('../config/database');
    const row = getDb().prepare('SELECT credentials FROM api_credentials WHERE platform = ?').get('linkedin');
    return row ? JSON.parse(row.credentials) : null;
  }

  async postToLinkedIn({ text, imageUrl, title }) {
    const creds = this.getCredentials();
    if (!creds) throw new Error('LinkedIn not connected. Please add API credentials.');

    const { accessToken, organizationId } = creds;
    const author = `urn:li:organization:${organizationId}`;

    const postBody = {
      author,
      lifecycleState: 'PUBLISHED',
      specificContent: {
        'com.linkedin.ugc.ShareContent': {
          shareCommentary: { text },
          shareMediaCategory: imageUrl ? 'IMAGE' : 'NONE'
        }
      },
      visibility: {
        'com.linkedin.ugc.MemberNetworkVisibility': 'PUBLIC'
      }
    };

    if (imageUrl) {
      // Step 1: Register image upload
      const registerRes = await axios.post(
        `${this.apiUrl}/assets?action=registerUpload`,
        {
          registerUploadRequest: {
            recipes: ['urn:li:digitalmediaRecipe:feedshare-image'],
            owner: author,
            serviceRelationships: [{
              relationshipType: 'OWNER',
              identifier: 'urn:li:userGeneratedContent'
            }]
          }
        },
        { headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' } }
      );

      const uploadUrl = registerRes.data.value.uploadMechanism['com.linkedin.digitalmedia.uploading.MediaUploadHttpRequest'].uploadUrl;
      const asset = registerRes.data.value.asset;

      // Step 2: Upload image
      const imageBuffer = (await axios.get(imageUrl, { responseType: 'arraybuffer' })).data;
      await axios.put(uploadUrl, imageBuffer, {
        headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'image/png' }
      });

      // Step 3: Add media to post
      postBody.specificContent['com.linkedin.ugc.ShareContent'].media = [{
        status: 'READY',
        media: asset,
        title: { text: title || 'Dhanam Finance' }
      }];
    }

    const response = await axios.post(
      `${this.apiUrl}/ugcPosts`,
      postBody,
      { headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' } }
    );

    return { platformPostId: response.headers['x-restli-id'], platform: 'linkedin' };
  }

  async getPostAnalytics(postUrn) {
    const creds = this.getCredentials();
    if (!creds) return null;

    try {
      const res = await axios.get(
        `${this.apiUrl}/socialActions/${postUrn}`,
        { headers: { Authorization: `Bearer ${creds.accessToken}` } }
      );
      return res.data;
    } catch (e) {
      console.error('LinkedIn analytics error:', e.message);
      return null;
    }
  }
}

module.exports = {
  metaService: new MetaService(),
  youtubeService: new YouTubeService(),
  linkedInService: new LinkedInService()
};
