import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  BarChart3, TrendingUp, Eye, Heart, MessageCircle, Share2,
  Calendar, PenSquare, ArrowUpRight, Clock, Loader2, Database
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import * as api from '../utils/api';

const PLATFORM_COLORS = {
  facebook: '#1877F2', instagram: '#E4405F', youtube: '#FF0000',
  linkedin: '#0A66C2', threads: '#000000'
};

const StatCard = ({ title, value, icon: Icon, color, change }) => (
  <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
    <div className="flex items-start justify-between">
      <div>
        <p className="text-sm text-gray-500 mb-1">{title}</p>
        <p className="text-2xl font-bold text-brand-navy">{typeof value === 'number' ? value.toLocaleString() : value}</p>
        {change && (
          <p className={`text-xs mt-1 flex items-center gap-1 ${change >= 0 ? 'text-green-600' : 'text-red-500'}`}>
            <TrendingUp size={12} /> {change >= 0 ? '+' : ''}{change}%
          </p>
        )}
      </div>
      <div className={`w-10 h-10 rounded-lg flex items-center justify-center`} style={{ backgroundColor: `${color}15` }}>
        <Icon size={20} style={{ color }} />
      </div>
    </div>
  </div>
);

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [trends, setTrends] = useState([]);
  const [platforms, setPlatforms] = useState([]);
  const [upcoming, setUpcoming] = useState([]);
  const [loading, setLoading] = useState(true);
  const [seeding, setSeeding] = useState(false);

  useEffect(() => { loadDashboard(); }, []);

  const loadDashboard = async () => {
    try {
      const [statsRes, trendsRes, platformsRes, upcomingRes] = await Promise.all([
        api.getDashboardStats(),
        api.getEngagementTrends({ days: 30 }),
        api.getPlatformAnalytics({}),
        api.getUpcomingSchedules()
      ]);
      setStats(statsRes.data);
      setTrends(trendsRes.data);
      setPlatforms(platformsRes.data);
      setUpcoming(upcomingRes.data);
    } catch (e) {
      console.log('Dashboard load:', e.message);
    }
    setLoading(false);
  };

  const handleSeedDemo = async () => {
    setSeeding(true);
    try {
      await api.seedDemoData();
      await loadDashboard();
    } catch (e) { console.error(e); }
    setSeeding(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-brand-gold" />
      </div>
    );
  }

  const postStats = stats?.posts || { total: 0, published: 0, scheduled: 0, drafts: 0 };
  const engStats = stats?.engagement || { total: 0, avgRate: 0 };

  const pieData = [
    { name: 'Published', value: postStats.published, color: '#00A652' },
    { name: 'Scheduled', value: postStats.scheduled, color: '#0066CC' },
    { name: 'Drafts', value: postStats.drafts, color: '#9B9288' },
  ].filter(d => d.value > 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display text-brand-navy">Dashboard</h1>
          <p className="text-gray-500 text-sm">Overview of your social media performance</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleSeedDemo}
            disabled={seeding}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-sm disabled:opacity-50"
          >
            {seeding ? <Loader2 size={16} className="animate-spin" /> : <Database size={16} />}
            Load Demo Data
          </button>
          <Link to="/create" className="flex items-center gap-2 px-4 py-2 bg-brand-gold text-white rounded-lg hover:bg-brand-gold-dark text-sm shadow-sm">
            <PenSquare size={16} /> Create Post
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Posts" value={postStats.total} icon={PenSquare} color="#B8860B" change={12} />
        <StatCard title="Total Engagement" value={engStats.total} icon={Heart} color="#E4405F" change={8} />
        <StatCard title="Total Reach" value={stats?.reach || 0} icon={Eye} color="#0066CC" change={15} />
        <StatCard title="Avg. Engagement Rate" value={`${engStats.avgRate}%`} icon={TrendingUp} color="#00A652" change={3} />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Engagement Trend */}
        <div className="lg:col-span-2 bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <h3 className="font-semibold text-brand-navy mb-4">Engagement Trends (30 Days)</h3>
          {trends.length > 0 ? (
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={trends}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="date" tickFormatter={d => new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })} tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Line type="monotone" dataKey="likes" stroke="#E4405F" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="comments" stroke="#1877F2" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="shares" stroke="#00A652" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-64 flex items-center justify-center text-gray-400">
              <p>No trend data yet. Load demo data or create posts to see trends.</p>
            </div>
          )}
          <div className="flex gap-4 mt-2 text-xs">
            <span className="flex items-center gap-1"><span className="w-3 h-1 rounded bg-[#E4405F]"></span> Likes</span>
            <span className="flex items-center gap-1"><span className="w-3 h-1 rounded bg-[#1877F2]"></span> Comments</span>
            <span className="flex items-center gap-1"><span className="w-3 h-1 rounded bg-[#00A652]"></span> Shares</span>
          </div>
        </div>

        {/* Post Status Pie */}
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <h3 className="font-semibold text-brand-navy mb-4">Post Status</h3>
          {pieData.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={85} dataKey="value" label={({ name, value }) => `${name}: ${value}`}>
                  {pieData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-52 flex items-center justify-center text-gray-400 text-sm">No posts yet</div>
          )}
          <div className="flex justify-center gap-4 text-xs mt-2">
            {pieData.map(d => (
              <span key={d.name} className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: d.color }}></span> {d.name}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Platform Performance + Upcoming */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Platform Performance */}
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <h3 className="font-semibold text-brand-navy mb-4">Platform Performance</h3>
          {platforms.length > 0 ? (
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={platforms}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="platform" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey="total_likes" name="Likes" fill="#E4405F" radius={[4, 4, 0, 0]} />
                <Bar dataKey="total_comments" name="Comments" fill="#1877F2" radius={[4, 4, 0, 0]} />
                <Bar dataKey="total_shares" name="Shares" fill="#00A652" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-60 flex items-center justify-center text-gray-400 text-sm">No platform data yet</div>
          )}
        </div>

        {/* Upcoming Scheduled Posts */}
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-brand-navy">Upcoming Posts</h3>
            <Link to="/scheduler" className="text-sm text-brand-gold hover:underline flex items-center gap-1">
              View All <ArrowUpRight size={14} />
            </Link>
          </div>
          {upcoming.length > 0 ? (
            <div className="space-y-3 max-h-64 overflow-auto">
              {upcoming.slice(0, 6).map((item, i) => (
                <div key={i} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className={`w-2 h-2 rounded-full bg-platform-${item.platform}`}></div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-brand-navy truncate">{item.post_title}</p>
                    <p className="text-xs text-gray-500 flex items-center gap-1">
                      <Clock size={11} />
                      {new Date(item.scheduled_time).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}
                    </p>
                  </div>
                  <span className="text-xs font-medium px-2 py-1 rounded-full capitalize"
                    style={{ backgroundColor: `${PLATFORM_COLORS[item.platform]}15`, color: PLATFORM_COLORS[item.platform] }}>
                    {item.platform}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="h-60 flex flex-col items-center justify-center text-gray-400 text-sm">
              <Calendar size={32} className="mb-2 text-gray-300" />
              <p>No upcoming posts scheduled</p>
              <Link to="/create" className="text-brand-gold hover:underline mt-2 text-xs">Create & schedule your first post</Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
