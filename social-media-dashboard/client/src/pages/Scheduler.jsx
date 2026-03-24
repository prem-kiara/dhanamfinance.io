import React, { useState, useEffect } from 'react';
import {
  Calendar, Clock, Filter, Trash2, Loader2, ChevronLeft, ChevronRight,
  AlertCircle, CheckCircle2, XCircle, TimerIcon
} from 'lucide-react';
import * as api from '../utils/api';

const PLATFORM_COLORS = {
  facebook: '#1877F2', instagram: '#E4405F', youtube: '#FF0000',
  linkedin: '#0A66C2', threads: '#000000'
};

const STATUS_STYLES = {
  pending: { bg: 'bg-yellow-50', text: 'text-yellow-700', icon: Clock, label: 'Pending' },
  completed: { bg: 'bg-green-50', text: 'text-green-700', icon: CheckCircle2, label: 'Published' },
  failed: { bg: 'bg-red-50', text: 'text-red-700', icon: XCircle, label: 'Failed' },
  cancelled: { bg: 'bg-gray-50', text: 'text-gray-500', icon: AlertCircle, label: 'Cancelled' }
};

export default function Scheduler() {
  const [schedules, setSchedules] = useState([]);
  const [upcoming, setUpcoming] = useState([]);
  const [suggestions, setSuggestions] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({ status: '', platform: '' });
  const [viewMode, setViewMode] = useState('list'); // list or calendar
  const [currentWeek, setCurrentWeek] = useState(new Date());

  useEffect(() => { loadData(); }, [filter]);

  const loadData = async () => {
    try {
      const [schedRes, upcomingRes, suggestRes] = await Promise.all([
        api.getSchedules(filter),
        api.getUpcomingSchedules(),
        api.getScheduleSuggestions()
      ]);
      setSchedules(schedRes.data);
      setUpcoming(upcomingRes.data);
      setSuggestions(suggestRes.data);
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  const handleCancel = async (id) => {
    if (!confirm('Cancel this scheduled post?')) return;
    await api.cancelSchedule(id);
    loadData();
  };

  // Generate week view
  const getWeekDays = () => {
    const start = new Date(currentWeek);
    start.setDate(start.getDate() - start.getDay());
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(start);
      d.setDate(d.getDate() + i);
      return d;
    });
  };

  const weekDays = getWeekDays();
  const getSchedulesForDay = (date) => {
    const dayStr = date.toISOString().split('T')[0];
    return schedules.filter(s => s.scheduled_time && s.scheduled_time.startsWith(dayStr));
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64"><Loader2 className="w-8 h-8 animate-spin text-brand-gold" /></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display text-brand-navy">Scheduler</h1>
          <p className="text-gray-500 text-sm">Manage and schedule content across all platforms</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setViewMode('list')}
            className={`px-4 py-2 rounded-lg text-sm font-medium ${viewMode === 'list' ? 'bg-brand-gold text-white' : 'bg-gray-100'}`}>
            List View
          </button>
          <button onClick={() => setViewMode('calendar')}
            className={`px-4 py-2 rounded-lg text-sm font-medium ${viewMode === 'calendar' ? 'bg-brand-gold text-white' : 'bg-gray-100'}`}>
            Calendar View
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-3 flex-wrap">
        <select value={filter.status} onChange={e => setFilter(f => ({ ...f, status: e.target.value }))}
          className="px-3 py-2 border rounded-lg text-sm bg-white">
          <option value="">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="completed">Completed</option>
          <option value="failed">Failed</option>
          <option value="cancelled">Cancelled</option>
        </select>
        <select value={filter.platform} onChange={e => setFilter(f => ({ ...f, platform: e.target.value }))}
          className="px-3 py-2 border rounded-lg text-sm bg-white">
          <option value="">All Platforms</option>
          {Object.keys(PLATFORM_COLORS).map(p => (
            <option key={p} value={p}>{p.charAt(0).toUpperCase() + p.slice(1)}</option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          {viewMode === 'list' ? (
            /* List View */
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="px-5 py-3 border-b bg-gray-50">
                <h3 className="font-semibold text-sm text-brand-navy">Scheduled Posts ({schedules.length})</h3>
              </div>
              {schedules.length > 0 ? (
                <div className="divide-y max-h-[600px] overflow-auto">
                  {schedules.map(schedule => {
                    const statusStyle = STATUS_STYLES[schedule.status] || STATUS_STYLES.pending;
                    const StatusIcon = statusStyle.icon;
                    return (
                      <div key={schedule.id} className="p-4 hover:bg-gray-50 transition-colors">
                        <div className="flex items-start gap-3">
                          <div className="w-1 h-12 rounded-full" style={{ backgroundColor: PLATFORM_COLORS[schedule.platform] }}></div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <p className="font-medium text-sm text-brand-navy truncate">{schedule.post_title || 'Untitled'}</p>
                              <span className={`text-xs px-2 py-0.5 rounded-full ${statusStyle.bg} ${statusStyle.text} flex items-center gap-1`}>
                                <StatusIcon size={10} /> {statusStyle.label}
                              </span>
                            </div>
                            <p className="text-xs text-gray-500 truncate mb-1">{schedule.post_content?.substring(0, 100)}...</p>
                            <div className="flex items-center gap-4 text-xs text-gray-500">
                              <span className="flex items-center gap-1">
                                <Calendar size={11} />
                                {new Date(schedule.scheduled_time).toLocaleDateString('en-IN', { dateStyle: 'medium' })}
                              </span>
                              <span className="flex items-center gap-1">
                                <Clock size={11} />
                                {new Date(schedule.scheduled_time).toLocaleTimeString('en-IN', { timeStyle: 'short' })}
                              </span>
                              <span className="capitalize font-medium" style={{ color: PLATFORM_COLORS[schedule.platform] }}>
                                {schedule.platform}
                              </span>
                              {schedule.recurrence !== 'once' && (
                                <span className="bg-purple-50 text-purple-600 px-2 py-0.5 rounded-full">{schedule.recurrence}</span>
                              )}
                            </div>
                          </div>
                          {schedule.status === 'pending' && (
                            <button onClick={() => handleCancel(schedule.id)} className="text-gray-400 hover:text-red-500 p-1">
                              <Trash2 size={16} />
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="p-12 text-center text-gray-400">
                  <Calendar size={40} className="mx-auto mb-3 text-gray-300" />
                  <p>No scheduled posts found</p>
                </div>
              )}
            </div>
          ) : (
            /* Calendar View */
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="px-5 py-3 border-b bg-gray-50 flex items-center justify-between">
                <button onClick={() => { const d = new Date(currentWeek); d.setDate(d.getDate() - 7); setCurrentWeek(d); }}>
                  <ChevronLeft size={20} className="text-gray-500 hover:text-brand-navy" />
                </button>
                <h3 className="font-semibold text-sm text-brand-navy">
                  {weekDays[0].toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })} - {weekDays[6].toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}
                </h3>
                <button onClick={() => { const d = new Date(currentWeek); d.setDate(d.getDate() + 7); setCurrentWeek(d); }}>
                  <ChevronRight size={20} className="text-gray-500 hover:text-brand-navy" />
                </button>
              </div>
              <div className="grid grid-cols-7 divide-x">
                {weekDays.map((day, i) => {
                  const daySchedules = getSchedulesForDay(day);
                  const isToday = day.toDateString() === new Date().toDateString();
                  return (
                    <div key={i} className={`min-h-[200px] p-2 ${isToday ? 'bg-brand-gold/5' : ''}`}>
                      <div className={`text-center mb-2 ${isToday ? 'font-bold text-brand-gold' : 'text-gray-500'}`}>
                        <div className="text-xs">{day.toLocaleDateString('en-IN', { weekday: 'short' })}</div>
                        <div className={`text-lg ${isToday ? 'w-8 h-8 rounded-full bg-brand-gold text-white flex items-center justify-center mx-auto' : ''}`}>
                          {day.getDate()}
                        </div>
                      </div>
                      <div className="space-y-1">
                        {daySchedules.map((s, j) => (
                          <div key={j} className="text-xs p-1.5 rounded"
                            style={{ backgroundColor: `${PLATFORM_COLORS[s.platform]}15`, color: PLATFORM_COLORS[s.platform] }}>
                            <div className="font-medium truncate">{s.post_title?.substring(0, 20)}</div>
                            <div className="opacity-70">{new Date(s.scheduled_time).toLocaleTimeString('en-IN', { timeStyle: 'short' })}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Best Times Sidebar */}
        <div className="space-y-5">
          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <h3 className="font-semibold text-brand-navy mb-4 flex items-center gap-2">
              <TimerIcon size={18} className="text-brand-gold" /> Best Posting Times
            </h3>
            {suggestions && Object.entries(suggestions).map(([platform, data]) => (
              <div key={platform} className="mb-4 last:mb-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: PLATFORM_COLORS[platform] }}></span>
                  <span className="text-sm font-medium capitalize">{platform}</span>
                </div>
                <div className="pl-4 text-xs text-gray-600 space-y-1">
                  <p>🕐 {data.bestTimes.join(', ')}</p>
                  <p>📅 {data.bestDays.join(', ')}</p>
                  <p>📊 {data.frequency}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Stats */}
          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <h3 className="font-semibold text-brand-navy mb-3">Schedule Overview</h3>
            <div className="space-y-2">
              {Object.entries(STATUS_STYLES).map(([status, style]) => {
                const count = schedules.filter(s => s.status === status).length;
                const Icon = style.icon;
                return (
                  <div key={status} className="flex items-center justify-between p-2 rounded-lg bg-gray-50">
                    <span className={`flex items-center gap-2 text-sm ${style.text}`}>
                      <Icon size={14} /> {style.label}
                    </span>
                    <span className="font-bold text-sm">{count}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
