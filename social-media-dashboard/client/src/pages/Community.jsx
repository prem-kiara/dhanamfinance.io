import React, { useState, useEffect } from 'react';
import {
  Users, TrendingUp, Target, Lightbulb, ArrowUpRight, Star,
  ChevronDown, ChevronUp, Loader2, Zap, MessageSquare, BarChart
} from 'lucide-react';
import * as api from '../utils/api';

const PRIORITY_STYLES = {
  high: { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200', badge: 'bg-red-100 text-red-700' },
  medium: { bg: 'bg-yellow-50', text: 'text-yellow-700', border: 'border-yellow-200', badge: 'bg-yellow-100 text-yellow-700' },
  low: { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200', badge: 'bg-green-100 text-green-700' },
};

const PLATFORM_COLORS = {
  facebook: '#1877F2', instagram: '#E4405F', youtube: '#FF0000',
  linkedin: '#0A66C2', threads: '#000000'
};

export default function Community() {
  const [suggestions, setSuggestions] = useState(null);
  const [communityMetrics, setCommunityMetrics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedCategory, setExpandedCategory] = useState(null);
  const [selectedPriority, setSelectedPriority] = useState('all');

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    try {
      const [suggestRes, metricsRes] = await Promise.all([
        api.getCommunitySuggestions(),
        api.getCommunityMetrics()
      ]);
      setSuggestions(suggestRes.data);
      setCommunityMetrics(metricsRes.data);
      if (suggestRes.data?.suggestions?.length > 0) {
        setExpandedCategory(suggestRes.data.suggestions[0].category);
      }
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64"><Loader2 className="w-8 h-8 animate-spin text-brand-gold" /></div>;
  }

  const priorityActions = suggestions?.priorityActions || [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-display text-brand-navy">Community Growth</h1>
        <p className="text-gray-500 text-sm">Actionable suggestions to grow your social media presence</p>
      </div>

      {/* Platform Followers Overview */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {Object.entries(PLATFORM_COLORS).map(([platform, color]) => {
          const metrics = communityMetrics.filter(m => m.platform === platform);
          const latest = metrics[0];
          return (
            <div key={platform} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 text-center">
              <span className="text-2xl font-bold block" style={{ color }}>
                {latest ? (latest.followers / 1000).toFixed(1) + 'K' : '—'}
              </span>
              <p className="text-xs text-gray-500 capitalize mt-1">{platform}</p>
              {latest?.growth_rate > 0 && (
                <p className="text-xs text-green-600 flex items-center justify-center gap-0.5 mt-1">
                  <ArrowUpRight size={10} /> {latest.growth_rate}%
                </p>
              )}
            </div>
          );
        })}
      </div>

      {/* Priority Actions */}
      {priorityActions.length > 0 && (
        <div className="bg-gradient-to-r from-brand-gold/10 to-brand-accent/10 rounded-xl p-5 border border-brand-gold/20">
          <h3 className="font-semibold text-brand-navy mb-3 flex items-center gap-2">
            <Zap size={18} className="text-brand-gold" /> Top 5 Priority Actions
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
            {priorityActions.map((action, i) => (
              <div key={i} className="bg-white rounded-lg p-3 shadow-sm">
                <div className="flex items-start gap-2">
                  <span className="w-6 h-6 rounded-full bg-brand-gold text-white text-xs flex items-center justify-center font-bold flex-shrink-0">{i + 1}</span>
                  <div>
                    <p className="text-sm font-medium text-brand-navy leading-tight">{action.action}</p>
                    <p className="text-xs text-gray-500 mt-1">{action.impact}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Priority Filter */}
      <div className="flex gap-2">
        {['all', 'high', 'medium', 'low'].map(p => (
          <button
            key={p}
            onClick={() => setSelectedPriority(p)}
            className={`px-4 py-2 rounded-lg text-sm font-medium capitalize ${
              selectedPriority === p ? 'bg-brand-navy text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {p === 'all' ? 'All Suggestions' : `${p} Priority`}
          </button>
        ))}
      </div>

      {/* Suggestion Categories */}
      {suggestions?.suggestions?.map((category, catIdx) => {
        const filteredItems = selectedPriority === 'all'
          ? category.items
          : category.items.filter(i => i.priority === selectedPriority);

        if (filteredItems.length === 0) return null;

        const isExpanded = expandedCategory === category.category;

        return (
          <div key={catIdx} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <button
              onClick={() => setExpandedCategory(isExpanded ? null : category.category)}
              className="w-full px-5 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{category.icon}</span>
                <div className="text-left">
                  <h3 className="font-semibold text-brand-navy">{category.category}</h3>
                  <p className="text-xs text-gray-500">{filteredItems.length} suggestions</p>
                </div>
              </div>
              {isExpanded ? <ChevronUp size={20} className="text-gray-400" /> : <ChevronDown size={20} className="text-gray-400" />}
            </button>

            {isExpanded && (
              <div className="px-5 pb-5 space-y-3">
                {filteredItems.map((item, i) => {
                  const prioStyle = PRIORITY_STYLES[item.priority] || PRIORITY_STYLES.medium;
                  return (
                    <div key={i} className={`p-4 rounded-lg border ${prioStyle.border} ${prioStyle.bg}`}>
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-medium text-sm text-brand-navy flex items-center gap-2">
                          <Star size={14} className="text-brand-gold" /> {item.title}
                        </h4>
                        <div className="flex items-center gap-2">
                          {item.platform && (
                            <span className="text-xs px-2 py-0.5 rounded-full capitalize font-medium"
                              style={{ backgroundColor: `${PLATFORM_COLORS[item.platform]}15`, color: PLATFORM_COLORS[item.platform] }}>
                              {item.platform}
                            </span>
                          )}
                          <span className={`text-xs px-2 py-0.5 rounded-full capitalize font-medium ${prioStyle.badge}`}>
                            {item.priority}
                          </span>
                        </div>
                      </div>
                      <p className="text-sm text-gray-700 mb-2 leading-relaxed">{item.description}</p>
                      <div className="flex items-center gap-1 text-xs text-brand-gold font-medium">
                        <Target size={12} /> Expected Impact: {item.impact}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
