import React, { useState, useEffect } from 'react';
import {
  BarChart3, TrendingUp, Eye, Heart, MessageCircle, Share2,
  Download, Filter, Loader2, ArrowUpRight, ArrowDownRight,
  Trophy, Clock, Target
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, AreaChart, Area, RadarChart,
  PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend
} from 'recharts';
import * as api from '../utils/api';

const PLATFORM_COLORS = {
  facebook: '#1877F2', instagram: '#E4405F', youtube: '#FF0000',
  linkedin: '#0A66C2', threads: '#000000'
};

const COLORS = ['#B8860B', '#E4405F', '#1877F2', '#00A652', '#0A66C2', '#C75B2A'];

export default function Analytics() {
  const [report, setReport] = useState(null);
  const [trends, setTrends] = useState([]);
  const [topPosts, setTopPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [communityMetrics, setCommunityMetrics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState('30');
  const [platformFilter, setPlatformFilter] = useState('');
  const [sortBy, setSortBy] = useState('engagement');

  useEffect(() => { loadAnalytics(); }, [dateRange, platformFilter, sortBy]);

  const loadAnalytics = async () => {
    try {
      const [reportRes, trendsRes, topRes, catRes, communityRes] = await Promise.all([
        api.getAnalyticsReport({}),
        api.getEngagementTrends({ days: parseInt(dateRange), platform: platformFilter || undefined }),
        api.getTopPosts({ limit: 10, sortBy }),
        api.getCategoryPerformance(),
        api.getCommunityMetrics()
      ]);
      setReport(reportRes.data);
      setTrends(trendsRes.data);
      setTopPosts(topRes.data);
      setCategories(catRes.data);
      setCommunityMetrics(communityRes.data);
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64"><Loader2 className="w-8 h-8 animate-spin text-brand-gold" /></div>;
  }

  const overview = report?.overview || {};
  const platformData = report?.platformBreakdown || [];

  // Build radar data for platform comparison
  const radarData = platformData.map(p => ({
    platform: p.platform,
    Engagement: Math.log10(p.total_likes + p.total_comments + p.total_shares + 1) * 25,
    Reach: Math.log10(p.total_reach + 1) * 25,
    Impressions: Math.log10(p.total_impressions + 1) * 25,
    Clicks: Math.log10(p.total_clicks + 1) * 25,
  }));

  const categoryLabels = {
    asset_products: 'Asset Products',
    financial_literacy: 'Financial Literacy',
    custom: 'Custom Topics'
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-display text-brand-navy">Analytics & Reports</h1>
          <p className="text-gray-500 text-sm">Detailed performance insights across all platforms</p>
        </div>
        <div className="flex gap-2">
          <select value={dateRange} onChange={e => setDateRange(e.target.value)}
            className="px-3 py-2 border rounded-lg text-sm bg-white">
            <option value="7">Last 7 days</option>
            <option value="14">Last 14 days</option>
            <option value="30">Last 30 days</option>
            <option value="60">Last 60 days</option>
            <option value="90">Last 90 days</option>
          </select>
          <select value={platformFilter} onChange={e => setPlatformFilter(e.target.value)}
            className="px-3 py-2 border rounded-lg text-sm bg-white">
            <option value="">All Platforms</option>
            {Object.keys(PLATFORM_COLORS).map(p => (
              <option key={p} value={p}>{p.charAt(0).toUpperCase() + p.slice(1)}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {[
          { label: 'Total Engagement', value: overview.engagement?.total || 0, icon: Heart, color: '#E4405F', change: '+12.5%' },
          { label: 'Total Reach', value: overview.reach || 0, icon: Eye, color: '#0066CC', change: '+8.3%' },
          { label: 'Impressions', value: overview.impressions || 0, icon: Target, color: '#00A652', change: '+15.2%' },
          { label: 'Published Posts', value: overview.posts?.published || 0, icon: BarChart3, color: '#B8860B', change: '+5' },
          { label: 'Avg. Engagement', value: `${overview.engagement?.avgRate || 0}%`, icon: TrendingUp, color: '#C75B2A', change: '+1.2%' },
        ].map((metric, i) => (
          <div key={i} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${metric.color}12` }}>
                <metric.icon size={16} style={{ color: metric.color }} />
              </div>
            </div>
            <p className="text-xl font-bold text-brand-navy">{typeof metric.value === 'number' ? metric.value.toLocaleString() : metric.value}</p>
            <p className="text-xs text-gray-500">{metric.label}</p>
            <p className="text-xs text-green-600 mt-1 flex items-center gap-0.5">
              <ArrowUpRight size={10} /> {metric.change}
            </p>
          </div>
        ))}
      </div>

      {/* Main Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Engagement Trends */}
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <h3 className="font-semibold text-brand-navy mb-4">Engagement Trends</h3>
          {trends.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={trends}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="date" tickFormatter={d => new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })} tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Area type="monotone" dataKey="likes" stackId="1" stroke="#E4405F" fill="#E4405F" fillOpacity={0.3} />
                <Area type="monotone" dataKey="comments" stackId="1" stroke="#1877F2" fill="#1877F2" fillOpacity={0.3} />
                <Area type="monotone" dataKey="shares" stackId="1" stroke="#00A652" fill="#00A652" fillOpacity={0.3} />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-72 flex items-center justify-center text-gray-400 text-sm">No trend data available</div>
          )}
        </div>

        {/* Platform Comparison */}
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <h3 className="font-semibold text-brand-navy mb-4">Platform Comparison</h3>
          {platformData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={platformData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="platform" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Legend />
                <Bar dataKey="total_likes" name="Likes" fill="#E4405F" radius={[4, 4, 0, 0]} />
                <Bar dataKey="total_reach" name="Reach" fill="#0066CC" radius={[4, 4, 0, 0]} />
                <Bar dataKey="total_impressions" name="Impressions" fill="#00A652" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-72 flex items-center justify-center text-gray-400 text-sm">No platform data available</div>
          )}
        </div>
      </div>

      {/* Category Performance + Top Posts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Category Performance */}
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <h3 className="font-semibold text-brand-navy mb-4">Content Category Performance</h3>
          {categories.length > 0 ? (
            <>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie data={categories.map(c => ({ name: categoryLabels[c.category] || c.category, value: c.total_likes + c.total_comments + c.total_shares }))}
                    cx="50%" cy="50%" innerRadius={50} outerRadius={75} dataKey="value"
                    label={({ name }) => name}>
                    {categories.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-2 mt-3">
                {categories.map((cat, i) => (
                  <div key={i} className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }}></span>
                      {categoryLabels[cat.category] || cat.category}
                    </span>
                    <span className="font-medium">{cat.post_count} posts</span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="h-52 flex items-center justify-center text-gray-400 text-sm">No category data</div>
          )}
        </div>

        {/* Top Performing Posts */}
        <div className="lg:col-span-2 bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-brand-navy flex items-center gap-2">
              <Trophy size={18} className="text-brand-gold" /> Top Performing Posts
            </h3>
            <select value={sortBy} onChange={e => setSortBy(e.target.value)}
              className="text-xs px-2 py-1 border rounded-lg">
              <option value="engagement">By Engagement</option>
              <option value="reach">By Reach</option>
              <option value="impressions">By Impressions</option>
              <option value="likes">By Likes</option>
            </select>
          </div>
          {topPosts.length > 0 ? (
            <div className="space-y-3 max-h-[400px] overflow-auto">
              {topPosts.map((post, i) => (
                <div key={i} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                    i < 3 ? 'bg-brand-gold text-white' : 'bg-gray-200 text-gray-600'
                  }`}>
                    {i + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm text-brand-navy truncate">{post.title}</p>
                    <p className="text-xs text-gray-500 capitalize">{post.category?.replace('_', ' ')} · {post.analytics_platform}</p>
                    <div className="flex gap-4 mt-1 text-xs text-gray-600">
                      <span className="flex items-center gap-1"><Heart size={10} className="text-red-400" /> {post.likes?.toLocaleString()}</span>
                      <span className="flex items-center gap-1"><MessageCircle size={10} className="text-blue-400" /> {post.comments?.toLocaleString()}</span>
                      <span className="flex items-center gap-1"><Share2 size={10} className="text-green-400" /> {post.shares?.toLocaleString()}</span>
                      <span className="flex items-center gap-1"><Eye size={10} className="text-purple-400" /> {post.reach?.toLocaleString()}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-brand-gold">{post.engagement_rate?.toFixed(1)}%</p>
                    <p className="text-xs text-gray-500">engagement</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="h-64 flex items-center justify-center text-gray-400 text-sm">No post data yet</div>
          )}
        </div>
      </div>

      {/* Community Growth */}
      <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
        <h3 className="font-semibold text-brand-navy mb-4">Community Growth by Platform</h3>
        {communityMetrics.length > 0 ? (
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
            {Object.keys(PLATFORM_COLORS).map(platform => {
              const metrics = communityMetrics.filter(m => m.platform === platform);
              const latest = metrics[0];
              return (
                <div key={platform} className="text-center p-4 rounded-lg" style={{ backgroundColor: `${PLATFORM_COLORS[platform]}08` }}>
                  <span className="text-2xl font-bold" style={{ color: PLATFORM_COLORS[platform] }}>
                    {latest ? (latest.followers / 1000).toFixed(1) + 'K' : '0'}
                  </span>
                  <p className="text-xs text-gray-500 capitalize mt-1">{platform} Followers</p>
                  {latest?.growth_rate > 0 && (
                    <p className="text-xs text-green-600 flex items-center justify-center gap-0.5 mt-1">
                      <ArrowUpRight size={10} /> {latest.growth_rate}% growth
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="h-24 flex items-center justify-center text-gray-400 text-sm">Load demo data to see community metrics</div>
        )}
      </div>
    </div>
  );
}
