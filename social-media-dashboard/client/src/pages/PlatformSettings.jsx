import React, { useState, useEffect } from 'react';
import {
  Settings, Check, X, Eye, EyeOff, Loader2, ExternalLink,
  AlertCircle, CheckCircle2, Link2, Unlink
} from 'lucide-react';
import * as api from '../utils/api';

const PLATFORMS_CONFIG = {
  facebook: {
    label: 'Facebook',
    icon: '📘',
    color: '#1877F2',
    fields: [
      { key: 'pageId', label: 'Page ID', placeholder: 'Your Facebook Page ID' },
      { key: 'accessToken', label: 'Access Token', placeholder: 'Long-lived access token', secret: true },
    ],
    helpUrl: 'https://developers.facebook.com/docs/pages/getting-started'
  },
  instagram: {
    label: 'Instagram',
    icon: '📸',
    color: '#E4405F',
    fields: [
      { key: 'businessAccountId', label: 'Business Account ID', placeholder: 'Instagram Business Account ID' },
      { key: 'accessToken', label: 'Access Token', placeholder: 'Meta Graph API access token', secret: true },
    ],
    helpUrl: 'https://developers.facebook.com/docs/instagram-api/getting-started'
  },
  youtube: {
    label: 'YouTube',
    icon: '📺',
    color: '#FF0000',
    fields: [
      { key: 'clientId', label: 'Client ID', placeholder: 'Google OAuth Client ID' },
      { key: 'clientSecret', label: 'Client Secret', placeholder: 'Google OAuth Client Secret', secret: true },
      { key: 'refreshToken', label: 'Refresh Token', placeholder: 'OAuth2 Refresh Token', secret: true },
      { key: 'channelId', label: 'Channel ID', placeholder: 'YouTube Channel ID' },
    ],
    helpUrl: 'https://developers.google.com/youtube/v3/getting-started'
  },
  linkedin: {
    label: 'LinkedIn',
    icon: '💼',
    color: '#0A66C2',
    fields: [
      { key: 'clientId', label: 'Client ID', placeholder: 'LinkedIn App Client ID' },
      { key: 'clientSecret', label: 'Client Secret', placeholder: 'LinkedIn App Client Secret', secret: true },
      { key: 'accessToken', label: 'Access Token', placeholder: 'OAuth2 Access Token', secret: true },
      { key: 'organizationId', label: 'Organization ID', placeholder: 'LinkedIn Organization/Company ID' },
    ],
    helpUrl: 'https://learn.microsoft.com/en-us/linkedin/marketing/'
  },
  threads: {
    label: 'Threads',
    icon: '🧵',
    color: '#000000',
    fields: [
      { key: 'userId', label: 'User ID', placeholder: 'Threads User ID' },
      { key: 'accessToken', label: 'Access Token', placeholder: 'Threads API Access Token', secret: true },
    ],
    helpUrl: 'https://developers.facebook.com/docs/threads'
  },
};

export default function PlatformSettings() {
  const [platforms, setPlatforms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingPlatform, setEditingPlatform] = useState(null);
  const [credentials, setCredentials] = useState({});
  const [showSecrets, setShowSecrets] = useState({});
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => { loadPlatforms(); }, []);

  const loadPlatforms = async () => {
    try {
      const res = await api.getConnectedPlatforms();
      setPlatforms(res.data);
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  const handleEdit = (platformId) => {
    setEditingPlatform(platformId);
    setCredentials({});
    setShowSecrets({});
    setMessage(null);
  };

  const handleSave = async (platformId) => {
    setSaving(true);
    try {
      await api.connectPlatform(platformId, { credentials });
      setMessage({ type: 'success', text: `${PLATFORMS_CONFIG[platformId].label} connected successfully!` });
      setEditingPlatform(null);
      await loadPlatforms();
    } catch (e) {
      setMessage({ type: 'error', text: 'Failed to save: ' + e.message });
    }
    setSaving(false);
  };

  const handleDisconnect = async (platformId) => {
    if (!confirm(`Disconnect ${PLATFORMS_CONFIG[platformId].label}?`)) return;
    try {
      await api.disconnectPlatform(platformId);
      await loadPlatforms();
      setMessage({ type: 'success', text: 'Platform disconnected.' });
    } catch (e) {
      setMessage({ type: 'error', text: 'Failed to disconnect' });
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64"><Loader2 className="w-8 h-8 animate-spin text-brand-gold" /></div>;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-display text-brand-navy">Platform Settings</h1>
        <p className="text-gray-500 text-sm">Connect your social media accounts to enable posting</p>
      </div>

      {message && (
        <div className={`p-4 rounded-lg text-sm flex items-center gap-2 ${
          message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'
        }`}>
          {message.type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
          {message.text}
        </div>
      )}

      {/* Setup Guide */}
      <div className="bg-blue-50 rounded-xl p-5 border border-blue-200">
        <h3 className="font-semibold text-blue-800 mb-2 flex items-center gap-2">
          <AlertCircle size={18} /> How to Connect Platforms
        </h3>
        <div className="text-sm text-blue-700 space-y-1">
          <p>1. Create developer accounts on each platform (Meta Business Suite, Google Cloud, LinkedIn Developer)</p>
          <p>2. Generate API keys and access tokens for each platform</p>
          <p>3. Enter the credentials below to connect each platform</p>
          <p>4. For Meta platforms (Facebook, Instagram, Threads), you need a Meta Business App with proper permissions</p>
        </div>
      </div>

      {/* Platform Cards */}
      <div className="space-y-4">
        {Object.entries(PLATFORMS_CONFIG).map(([platformId, config]) => {
          const platformState = platforms.find(p => p.platform === platformId);
          const isConnected = platformState?.isConnected;
          const isEditing = editingPlatform === platformId;

          return (
            <div key={platformId} className={`bg-white rounded-xl shadow-sm border overflow-hidden ${
              isConnected ? 'border-green-200' : 'border-gray-100'
            }`}>
              {/* Header */}
              <div className="px-5 py-4 flex items-center justify-between" style={{ borderLeft: `4px solid ${config.color}` }}>
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{config.icon}</span>
                  <div>
                    <h3 className="font-semibold text-brand-navy">{config.label}</h3>
                    <p className="text-xs text-gray-500">
                      {isConnected
                        ? <span className="text-green-600 flex items-center gap-1"><CheckCircle2 size={12} /> Connected</span>
                        : <span className="text-gray-400 flex items-center gap-1"><Unlink size={12} /> Not connected</span>
                      }
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <a href={config.helpUrl} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-1 text-xs text-blue-600 hover:underline">
                    <ExternalLink size={12} /> Docs
                  </a>
                  {isConnected && !isEditing && (
                    <button onClick={() => handleDisconnect(platformId)}
                      className="text-xs px-3 py-1.5 bg-red-50 text-red-600 rounded-lg hover:bg-red-100">
                      Disconnect
                    </button>
                  )}
                  {!isEditing ? (
                    <button onClick={() => handleEdit(platformId)}
                      className="text-xs px-3 py-1.5 bg-brand-gold/10 text-brand-gold rounded-lg hover:bg-brand-gold/20 font-medium">
                      {isConnected ? 'Update' : 'Connect'}
                    </button>
                  ) : (
                    <button onClick={() => setEditingPlatform(null)}
                      className="text-xs px-3 py-1.5 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200">
                      Cancel
                    </button>
                  )}
                </div>
              </div>

              {/* Credential Form */}
              {isEditing && (
                <div className="px-5 py-4 border-t bg-gray-50 space-y-3">
                  {config.fields.map(field => (
                    <div key={field.key}>
                      <label className="text-xs text-gray-500 mb-1 block">{field.label}</label>
                      <div className="relative">
                        <input
                          type={field.secret && !showSecrets[field.key] ? 'password' : 'text'}
                          value={credentials[field.key] || ''}
                          onChange={e => setCredentials(prev => ({ ...prev, [field.key]: e.target.value }))}
                          placeholder={field.placeholder}
                          className="w-full p-2.5 border rounded-lg text-sm pr-10 focus:ring-2 focus:ring-brand-gold/30 focus:border-brand-gold"
                        />
                        {field.secret && (
                          <button
                            onClick={() => setShowSecrets(prev => ({ ...prev, [field.key]: !prev[field.key] }))}
                            className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                          >
                            {showSecrets[field.key] ? <EyeOff size={16} /> : <Eye size={16} />}
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                  <button
                    onClick={() => handleSave(platformId)}
                    disabled={saving}
                    className="flex items-center gap-2 px-5 py-2.5 bg-brand-gold text-white rounded-lg hover:bg-brand-gold-dark text-sm font-medium disabled:opacity-50"
                  >
                    {saving ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />}
                    Save & Connect
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* OpenAI Settings */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden" style={{ borderLeft: '4px solid #10a37f' }}>
        <div className="px-5 py-4">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🤖</span>
            <div>
              <h3 className="font-semibold text-brand-navy">OpenAI (AI Content & Image Generation)</h3>
              <p className="text-xs text-gray-500">Required for AI-powered content and image generation features</p>
            </div>
          </div>
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600">
              Set your OpenAI API key in the server's <code className="bg-gray-200 px-1 rounded">.env</code> file:
            </p>
            <code className="block mt-2 p-2 bg-gray-200 rounded text-sm">OPENAI_API_KEY=your_openai_api_key</code>
            <a href="https://platform.openai.com/api-keys" target="_blank" rel="noopener noreferrer"
              className="text-xs text-blue-600 hover:underline flex items-center gap-1 mt-2">
              <ExternalLink size={12} /> Get your API key
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
