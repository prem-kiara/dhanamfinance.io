import React, { useState, useEffect } from 'react';
import {
  Sparkles, Send, Clock, Save, Copy, RefreshCw, Loader2,
  Facebook, Instagram, Youtube, Linkedin, Hash, ChevronDown, Image, Wand2
} from 'lucide-react';
import * as api from '../utils/api';

const PLATFORMS = [
  { id: 'facebook', label: 'Facebook', icon: '📘', color: '#1877F2' },
  { id: 'instagram', label: 'Instagram', icon: '📸', color: '#E4405F' },
  { id: 'youtube', label: 'YouTube', icon: '📺', color: '#FF0000' },
  { id: 'linkedin', label: 'LinkedIn', icon: '💼', color: '#0A66C2' },
  { id: 'threads', label: 'Threads', icon: '🧵', color: '#000000' },
];

const CATEGORIES = {
  asset_products: {
    label: 'Asset & Liability Products',
    icon: '🏦',
    subcategories: {
      gold_loan: 'Gold Loan',
      mortgage_loan: 'Mortgage Loan',
      sme_loan: 'SME Loan'
    }
  },
  financial_literacy: {
    label: 'Financial Literacy',
    icon: '📚',
    subcategories: {
      saving_tips: 'Saving Tips',
      investment: 'Investment Basics',
      gold_investment: 'Gold Investment',
      budgeting: 'Budgeting',
      credit_score: 'Credit Score',
      tax_planning: 'Tax Planning'
    }
  },
  custom: {
    label: 'Custom Topics',
    icon: '✨',
    subcategories: {
      testimonial: 'Customer Testimonial',
      announcement: 'Announcement',
      festival: 'Festival Greeting',
      engagement: 'Engagement Post',
      tips: 'Tips & Tricks'
    }
  }
};

export default function ContentCreator() {
  const [selectedPlatforms, setSelectedPlatforms] = useState(['facebook', 'instagram']);
  const [category, setCategory] = useState('');
  const [subcategory, setSubcategory] = useState('');
  const [topic, setTopic] = useState('');
  const [tone, setTone] = useState('professional');
  const [customPrompt, setCustomPrompt] = useState('');
  const [generatedContent, setGeneratedContent] = useState(null);
  const [editedContent, setEditedContent] = useState({});
  const [title, setTitle] = useState('');
  const [generating, setGenerating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [useAI, setUseAI] = useState(false);
  const [showScheduler, setShowScheduler] = useState(false);
  const [scheduleTimes, setScheduleTimes] = useState(['']);
  const [recurrence, setRecurrence] = useState('once');
  const [message, setMessage] = useState(null);

  const togglePlatform = (id) => {
    setSelectedPlatforms(prev =>
      prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
    );
  };

  const handleGenerate = async () => {
    if (!category || selectedPlatforms.length === 0) {
      setMessage({ type: 'error', text: 'Please select a category and at least one platform' });
      return;
    }

    setGenerating(true);
    setMessage(null);
    try {
      const res = await api.generateContent({
        category, subcategory, topic, tone,
        platforms: selectedPlatforms,
        customPrompt, useAI
      });
      setGeneratedContent(res.data);

      // Initialize edited content
      const edited = {};
      if (res.data.posts) {
        Object.entries(res.data.posts).forEach(([platform, data]) => {
          edited[platform] = data.text || '';
        });
      }
      setEditedContent(edited);

      if (!title) {
        const catLabel = CATEGORIES[category]?.subcategories?.[subcategory] || CATEGORIES[category]?.label || '';
        setTitle(`${catLabel} - ${new Date().toLocaleDateString()}`);
      }
    } catch (e) {
      setMessage({ type: 'error', text: 'Failed to generate content: ' + e.message });
    }
    setGenerating(false);
  };

  const handleSaveDraft = async () => {
    setSaving(true);
    try {
      const content = Object.values(editedContent).join('\n\n---\n\n') || 'Draft content';
      const res = await api.createPost({
        title: title || 'Untitled Post',
        content,
        category,
        subcategory,
        platforms: selectedPlatforms,
        status: 'draft'
      });
      setMessage({ type: 'success', text: 'Post saved as draft!' });
    } catch (e) {
      setMessage({ type: 'error', text: 'Failed to save: ' + e.message });
    }
    setSaving(false);
  };

  const handlePublish = async () => {
    setPublishing(true);
    try {
      const content = Object.values(editedContent).join('\n\n---\n\n') || 'Content';
      const postRes = await api.createPost({
        title: title || 'Social Media Post',
        content,
        category,
        subcategory,
        platforms: selectedPlatforms,
        status: 'published'
      });
      await api.publishPost(postRes.data.id);
      setMessage({ type: 'success', text: 'Post published to all selected platforms!' });
    } catch (e) {
      setMessage({ type: 'error', text: 'Publishing failed: ' + e.message });
    }
    setPublishing(false);
  };

  const handleSchedule = async () => {
    const validTimes = scheduleTimes.filter(t => t);
    if (validTimes.length === 0) {
      setMessage({ type: 'error', text: 'Please add at least one schedule time' });
      return;
    }

    try {
      const content = Object.values(editedContent).join('\n\n---\n\n') || 'Content';
      const postRes = await api.createPost({
        title: title || 'Scheduled Post',
        content,
        category,
        subcategory,
        platforms: selectedPlatforms,
        status: 'scheduled'
      });
      await api.schedulePost(postRes.data.id, {
        scheduledTimes: validTimes,
        recurrence
      });
      setMessage({ type: 'success', text: `Post scheduled for ${validTimes.length} time slot(s)!` });
      setShowScheduler(false);
    } catch (e) {
      setMessage({ type: 'error', text: 'Scheduling failed: ' + e.message });
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-display text-brand-navy">Create Content</h1>
        <p className="text-gray-500 text-sm">Generate and publish content across all platforms</p>
      </div>

      {message && (
        <div className={`p-4 rounded-lg text-sm ${message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
          {message.text}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Settings */}
        <div className="space-y-5">
          {/* Platform Selection */}
          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <h3 className="font-semibold text-brand-navy mb-3 text-sm uppercase tracking-wide">Platforms</h3>
            <div className="space-y-2">
              {PLATFORMS.map(p => (
                <label key={p.id} className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all ${
                  selectedPlatforms.includes(p.id) ? 'bg-gray-50 border-2' : 'border-2 border-transparent hover:bg-gray-50'
                }`} style={selectedPlatforms.includes(p.id) ? { borderColor: p.color + '40' } : {}}>
                  <input
                    type="checkbox"
                    checked={selectedPlatforms.includes(p.id)}
                    onChange={() => togglePlatform(p.id)}
                    className="sr-only"
                  />
                  <span className="text-lg">{p.icon}</span>
                  <span className="text-sm font-medium">{p.label}</span>
                  {selectedPlatforms.includes(p.id) && (
                    <span className="ml-auto w-5 h-5 rounded-full flex items-center justify-center text-white text-xs" style={{ backgroundColor: p.color }}>✓</span>
                  )}
                </label>
              ))}
            </div>
          </div>

          {/* Category Selection */}
          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <h3 className="font-semibold text-brand-navy mb-3 text-sm uppercase tracking-wide">Content Category</h3>
            <div className="space-y-2">
              {Object.entries(CATEGORIES).map(([key, cat]) => (
                <button
                  key={key}
                  onClick={() => { setCategory(key); setSubcategory(''); }}
                  className={`w-full text-left p-3 rounded-lg flex items-center gap-3 transition-all ${
                    category === key ? 'bg-brand-gold/10 border-2 border-brand-gold/30' : 'hover:bg-gray-50 border-2 border-transparent'
                  }`}
                >
                  <span className="text-lg">{cat.icon}</span>
                  <span className="text-sm font-medium">{cat.label}</span>
                </button>
              ))}
            </div>

            {category && CATEGORIES[category]?.subcategories && (
              <div className="mt-3 pt-3 border-t">
                <p className="text-xs text-gray-500 mb-2">Subcategory</p>
                <select
                  value={subcategory}
                  onChange={e => setSubcategory(e.target.value)}
                  className="w-full p-2 border rounded-lg text-sm focus:ring-2 focus:ring-brand-gold/30 focus:border-brand-gold"
                >
                  <option value="">All {CATEGORIES[category].label}</option>
                  {Object.entries(CATEGORIES[category].subcategories).map(([key, label]) => (
                    <option key={key} value={key}>{label}</option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {/* Tone & Topic */}
          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 space-y-3">
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Topic / Subject</label>
              <input
                value={topic}
                onChange={e => setTopic(e.target.value)}
                placeholder="e.g., Gold loan benefits for farmers"
                className="w-full p-2 border rounded-lg text-sm focus:ring-2 focus:ring-brand-gold/30 focus:border-brand-gold"
              />
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Tone</label>
              <select value={tone} onChange={e => setTone(e.target.value)}
                className="w-full p-2 border rounded-lg text-sm focus:ring-2 focus:ring-brand-gold/30 focus:border-brand-gold">
                <option value="professional">Professional</option>
                <option value="casual">Casual & Friendly</option>
                <option value="educational">Educational</option>
                <option value="promotional">Promotional</option>
                <option value="inspirational">Inspirational</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Additional Instructions</label>
              <textarea
                value={customPrompt}
                onChange={e => setCustomPrompt(e.target.value)}
                placeholder="Any specific details or style preferences..."
                rows={3}
                className="w-full p-2 border rounded-lg text-sm focus:ring-2 focus:ring-brand-gold/30 focus:border-brand-gold resize-none"
              />
            </div>

            {/* AI Toggle */}
            <label className="flex items-center gap-2 p-3 bg-purple-50 rounded-lg cursor-pointer">
              <input type="checkbox" checked={useAI} onChange={e => setUseAI(e.target.checked)} className="rounded" />
              <Wand2 size={16} className="text-purple-600" />
              <span className="text-sm font-medium text-purple-700">Use AI Generation</span>
            </label>

            <button
              onClick={handleGenerate}
              disabled={generating}
              className="w-full flex items-center justify-center gap-2 py-3 bg-brand-gold text-white rounded-lg hover:bg-brand-gold-dark font-medium text-sm disabled:opacity-50 transition-colors"
            >
              {generating ? <Loader2 size={18} className="animate-spin" /> : <Sparkles size={18} />}
              {generating ? 'Generating...' : 'Generate Content'}
            </button>
          </div>
        </div>

        {/* Right: Generated Content */}
        <div className="lg:col-span-2 space-y-5">
          {/* Title */}
          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <label className="text-xs text-gray-500 mb-1 block">Post Title</label>
            <input
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="Give your post a title..."
              className="w-full p-3 border rounded-lg text-lg font-display focus:ring-2 focus:ring-brand-gold/30 focus:border-brand-gold"
            />
          </div>

          {/* Generated Content Per Platform */}
          {generatedContent?.posts ? (
            Object.entries(generatedContent.posts).map(([platform, data]) => (
              <div key={platform} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="flex items-center gap-2 px-5 py-3 border-b" style={{ backgroundColor: `${PLATFORMS.find(p => p.id === platform)?.color}08` }}>
                  <span className="text-lg">{PLATFORMS.find(p => p.id === platform)?.icon}</span>
                  <span className="font-medium text-sm capitalize">{platform}</span>
                  {data.bestTime && <span className="ml-auto text-xs text-gray-500 flex items-center gap-1"><Clock size={12} /> Best: {data.bestTime}</span>}
                </div>
                <div className="p-5 space-y-3">
                  <textarea
                    value={editedContent[platform] || data.text || ''}
                    onChange={e => setEditedContent(prev => ({ ...prev, [platform]: e.target.value }))}
                    rows={6}
                    className="w-full p-3 border rounded-lg text-sm focus:ring-2 focus:ring-brand-gold/30 focus:border-brand-gold resize-none"
                  />
                  {data.hashtags && data.hashtags.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {data.hashtags.map((tag, i) => (
                        <span key={i} className="text-xs px-2 py-1 bg-blue-50 text-blue-600 rounded-full">{tag}</span>
                      ))}
                    </div>
                  )}
                  {data.imageDescription && (
                    <div className="flex items-center gap-2 p-2 bg-amber-50 rounded-lg text-xs text-amber-700">
                      <Image size={14} /> Suggested image: {data.imageDescription}
                    </div>
                  )}
                  <div className="flex gap-2">
                    <button
                      onClick={() => navigator.clipboard.writeText(editedContent[platform] || data.text)}
                      className="flex items-center gap-1 px-3 py-1.5 text-xs bg-gray-100 rounded-lg hover:bg-gray-200"
                    >
                      <Copy size={12} /> Copy
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-white rounded-xl p-16 shadow-sm border border-gray-100 text-center">
              <Sparkles size={48} className="mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500">Select a category and platforms, then click "Generate Content"</p>
              <p className="text-xs text-gray-400 mt-2">Content will be tailored for each platform's requirements</p>
            </div>
          )}

          {/* Action Buttons */}
          {generatedContent?.posts && (
            <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 space-y-4">
              {/* Schedule Section */}
              {showScheduler && (
                <div className="p-4 bg-blue-50 rounded-lg space-y-3">
                  <h4 className="font-medium text-sm text-brand-navy">Schedule Post</h4>
                  {scheduleTimes.map((time, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <input
                        type="datetime-local"
                        value={time}
                        onChange={e => {
                          const newTimes = [...scheduleTimes];
                          newTimes[i] = e.target.value;
                          setScheduleTimes(newTimes);
                        }}
                        className="flex-1 p-2 border rounded-lg text-sm"
                      />
                      {i > 0 && (
                        <button
                          onClick={() => setScheduleTimes(prev => prev.filter((_, idx) => idx !== i))}
                          className="text-red-500 text-xs hover:underline"
                        >Remove</button>
                      )}
                    </div>
                  ))}
                  <button
                    onClick={() => setScheduleTimes(prev => [...prev, ''])}
                    className="text-sm text-brand-gold hover:underline"
                  >+ Add another time slot</button>

                  <select value={recurrence} onChange={e => setRecurrence(e.target.value)} className="w-full p-2 border rounded-lg text-sm">
                    <option value="once">One-time</option>
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="weekdays">Weekdays only</option>
                    <option value="monthly">Monthly</option>
                  </select>

                  <div className="flex gap-2">
                    <button onClick={handleSchedule} className="flex-1 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700">
                      Confirm Schedule
                    </button>
                    <button onClick={() => setShowScheduler(false)} className="px-4 py-2 bg-gray-200 rounded-lg text-sm">Cancel</button>
                  </div>
                </div>
              )}

              <div className="flex flex-wrap gap-3">
                <button onClick={handleSaveDraft} disabled={saving}
                  className="flex items-center gap-2 px-5 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-sm font-medium disabled:opacity-50">
                  {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />} Save Draft
                </button>
                <button onClick={() => setShowScheduler(!showScheduler)}
                  className="flex items-center gap-2 px-5 py-2.5 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 text-sm font-medium">
                  <Clock size={16} /> Schedule
                </button>
                <button onClick={handlePublish} disabled={publishing}
                  className="flex items-center gap-2 px-5 py-2.5 bg-brand-gold text-white rounded-lg hover:bg-brand-gold-dark text-sm font-medium disabled:opacity-50 ml-auto">
                  {publishing ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />} Publish Now
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
