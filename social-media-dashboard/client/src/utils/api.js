import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' }
});

// Posts
export const getPosts = (params) => api.get('/posts', { params });
export const getPost = (id) => api.get(`/posts/${id}`);
export const createPost = (data) => api.post('/posts', data);
export const updatePost = (id, data) => api.put(`/posts/${id}`, data);
export const deletePost = (id) => api.delete(`/posts/${id}`);
export const publishPost = (id) => api.post(`/posts/${id}/publish`);
export const schedulePost = (id, data) => api.post(`/posts/${id}/schedule`, data);

// Content Generation
export const getCategories = () => api.get('/posts/content/categories');
export const getTemplates = (params) => api.get('/posts/content/templates', { params });
export const generateContent = (data) => api.post('/posts/content/generate', data);

// Images
export const uploadImage = (formData) => api.post('/images/upload', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
export const uploadMultipleImages = (formData) => api.post('/images/upload-multiple', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
export const getImageLibrary = () => api.get('/images/library');
export const generateTemplateImage = (data) => api.post('/images/generate-template', data);
export const generateAIImage = (data) => api.post('/images/generate-ai', data);
export const getImageTemplates = () => api.get('/images/templates');
export const deleteImage = (filename) => api.delete(`/images/${filename}`);

// Analytics
export const getDashboardStats = () => api.get('/analytics/dashboard');
export const getPlatformAnalytics = (params) => api.get('/analytics/platform', { params });
export const getTopPosts = (params) => api.get('/analytics/top-posts', { params });
export const getEngagementTrends = (params) => api.get('/analytics/trends', { params });
export const getCategoryPerformance = () => api.get('/analytics/categories');
export const getPostingFrequency = (params) => api.get('/analytics/frequency', { params });
export const getBestTimes = () => api.get('/analytics/best-times');
export const getAnalyticsReport = (params) => api.get('/analytics/report', { params });
export const getCommunityMetrics = () => api.get('/analytics/community');

// Schedules
export const getSchedules = (params) => api.get('/schedules', { params });
export const getUpcomingSchedules = () => api.get('/schedules/upcoming');
export const getScheduleSuggestions = () => api.get('/schedules/suggestions');
export const cancelSchedule = (id) => api.delete(`/schedules/${id}`);

// Settings
export const getConnectedPlatforms = () => api.get('/settings/platforms');
export const connectPlatform = (platform, data) => api.post(`/settings/platforms/${platform}`, data);
export const disconnectPlatform = (platform) => api.delete(`/settings/platforms/${platform}`);
export const getCommunitySuggestions = () => api.get('/settings/suggestions');

// Seed demo data
export const seedDemoData = () => api.post('/seed-demo');

export default api;
