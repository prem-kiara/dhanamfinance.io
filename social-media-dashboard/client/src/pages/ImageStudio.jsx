import React, { useState, useEffect, useRef } from 'react';
import {
  Image, Upload, Wand2, Layout, Trash2, Download, Eye,
  Loader2, RefreshCw, Copy, X, Plus
} from 'lucide-react';
import * as api from '../utils/api';

const PLATFORMS = [
  { id: 'facebook', label: 'Facebook', size: '1200×630' },
  { id: 'instagram', label: 'Instagram', size: '1080×1080' },
  { id: 'youtube', label: 'YouTube', size: '1280×720' },
  { id: 'linkedin', label: 'LinkedIn', size: '1200×627' },
  { id: 'threads', label: 'Threads', size: '1080×1080' },
];

const TEMPLATE_OPTIONS = [
  { id: 'gold_loan', label: 'Gold Loan', icon: '✨', color: '#B8860B' },
  { id: 'mortgage_loan', label: 'Mortgage Loan', icon: '🏠', color: '#0066CC' },
  { id: 'sme_loan', label: 'SME Loan', icon: '📈', color: '#00A652' },
  { id: 'financial_literacy', label: 'Financial Literacy', icon: '💡', color: '#8B6914' },
  { id: 'custom', label: 'Custom', icon: '🌟', color: '#C75B2A' },
];

export default function ImageStudio() {
  const [activeTab, setActiveTab] = useState('template'); // template, ai, upload, library
  const [library, setLibrary] = useState([]);
  const [loading, setLoading] = useState(false);
  const [previewHtml, setPreviewHtml] = useState('');
  const [showPreview, setShowPreview] = useState(false);
  const fileInputRef = useRef(null);

  // Template form
  const [templateForm, setTemplateForm] = useState({
    title: '', subtitle: '', bodyText: '',
    category: 'gold_loan', platform: 'instagram'
  });

  // AI form
  const [aiForm, setAiForm] = useState({
    prompt: '', platform: 'instagram', style: 'professional'
  });
  const [aiResult, setAiResult] = useState(null);

  // Upload
  const [uploadedFiles, setUploadedFiles] = useState([]);

  useEffect(() => { loadLibrary(); }, []);

  const loadLibrary = async () => {
    try {
      const res = await api.getImageLibrary();
      setLibrary(res.data);
    } catch (e) { console.log(e); }
  };

  const handleGenerateTemplate = async () => {
    setLoading(true);
    try {
      const res = await api.generateTemplateImage({
        ...templateForm,
        subcategory: templateForm.category
      });
      setPreviewHtml(res.data.html);
      setShowPreview(true);
    } catch (e) {
      alert('Failed to generate template: ' + e.message);
    }
    setLoading(false);
  };

  const handleGenerateAI = async () => {
    if (!aiForm.prompt) { alert('Please enter an image description'); return; }
    setLoading(true);
    try {
      const res = await api.generateAIImage(aiForm);
      setAiResult(res.data);
    } catch (e) {
      alert('AI generation failed: ' + e.message);
    }
    setLoading(false);
  };

  const handleUpload = async (e) => {
    const files = e.target.files;
    if (!files.length) return;

    setLoading(true);
    try {
      if (files.length === 1) {
        const formData = new FormData();
        formData.append('image', files[0]);
        const res = await api.uploadImage(formData);
        setUploadedFiles(prev => [res.data, ...prev]);
      } else {
        const formData = new FormData();
        Array.from(files).forEach(f => formData.append('images', f));
        const res = await api.uploadMultipleImages(formData);
        setUploadedFiles(prev => [...res.data.files, ...prev]);
      }
      await loadLibrary();
    } catch (e) {
      alert('Upload failed: ' + e.message);
    }
    setLoading(false);
  };

  const handleDeleteImage = async (filename) => {
    if (!confirm('Delete this image?')) return;
    try {
      await api.deleteImage(filename);
      await loadLibrary();
    } catch (e) { alert('Delete failed'); }
  };

  const tabs = [
    { id: 'template', label: 'Template', icon: Layout },
    { id: 'ai', label: 'AI Generate', icon: Wand2 },
    { id: 'upload', label: 'Upload', icon: Upload },
    { id: 'library', label: 'Library', icon: Image },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-display text-brand-navy">Image Studio</h1>
        <p className="text-gray-500 text-sm">Create, generate, and manage images for your posts</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 rounded-xl p-1">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all ${
              activeTab === tab.id ? 'bg-white shadow-sm text-brand-navy' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <tab.icon size={16} /> {tab.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Controls */}
        <div>
          {activeTab === 'template' && (
            <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 space-y-4">
              <h3 className="font-semibold text-brand-navy">Template Generator</h3>
              <p className="text-xs text-gray-500">Create branded social media images using Dhanam Finance templates</p>

              <div>
                <label className="text-xs text-gray-500 mb-1 block">Template Type</label>
                <div className="grid grid-cols-3 gap-2">
                  {TEMPLATE_OPTIONS.map(opt => (
                    <button
                      key={opt.id}
                      onClick={() => setTemplateForm(f => ({ ...f, category: opt.id }))}
                      className={`p-3 rounded-lg text-center border-2 transition-all ${
                        templateForm.category === opt.id ? 'border-brand-gold bg-brand-gold/5' : 'border-transparent bg-gray-50 hover:bg-gray-100'
                      }`}
                    >
                      <span className="text-2xl block mb-1">{opt.icon}</span>
                      <span className="text-xs font-medium">{opt.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs text-gray-500 mb-1 block">Platform / Size</label>
                <select value={templateForm.platform} onChange={e => setTemplateForm(f => ({ ...f, platform: e.target.value }))}
                  className="w-full p-2 border rounded-lg text-sm">
                  {PLATFORMS.map(p => (
                    <option key={p.id} value={p.id}>{p.label} ({p.size})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs text-gray-500 mb-1 block">Title</label>
                <input value={templateForm.title} onChange={e => setTemplateForm(f => ({ ...f, title: e.target.value }))}
                  placeholder="e.g., Gold Loan - Quick Disbursal" className="w-full p-2 border rounded-lg text-sm" />
              </div>

              <div>
                <label className="text-xs text-gray-500 mb-1 block">Subtitle</label>
                <input value={templateForm.subtitle} onChange={e => setTemplateForm(f => ({ ...f, subtitle: e.target.value }))}
                  placeholder="e.g., Get funds in minutes" className="w-full p-2 border rounded-lg text-sm" />
              </div>

              <div>
                <label className="text-xs text-gray-500 mb-1 block">Body Text (optional)</label>
                <textarea value={templateForm.bodyText} onChange={e => setTemplateForm(f => ({ ...f, bodyText: e.target.value }))}
                  placeholder="Additional details..." rows={3} className="w-full p-2 border rounded-lg text-sm resize-none" />
              </div>

              <button onClick={handleGenerateTemplate} disabled={loading}
                className="w-full py-3 bg-brand-gold text-white rounded-lg font-medium text-sm flex items-center justify-center gap-2 hover:bg-brand-gold-dark disabled:opacity-50">
                {loading ? <Loader2 size={16} className="animate-spin" /> : <Layout size={16} />}
                Generate Template Image
              </button>
            </div>
          )}

          {activeTab === 'ai' && (
            <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 space-y-4">
              <h3 className="font-semibold text-brand-navy">AI Image Generator</h3>
              <p className="text-xs text-gray-500">Generate unique images using AI (requires OpenAI API key)</p>

              <div>
                <label className="text-xs text-gray-500 mb-1 block">Image Description</label>
                <textarea value={aiForm.prompt} onChange={e => setAiForm(f => ({ ...f, prompt: e.target.value }))}
                  placeholder="Describe the image you want... e.g., A professional image showing gold coins with a modern financial services aesthetic"
                  rows={4} className="w-full p-2 border rounded-lg text-sm resize-none" />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Platform</label>
                  <select value={aiForm.platform} onChange={e => setAiForm(f => ({ ...f, platform: e.target.value }))}
                    className="w-full p-2 border rounded-lg text-sm">
                    {PLATFORMS.map(p => <option key={p.id} value={p.id}>{p.label}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Style</label>
                  <select value={aiForm.style} onChange={e => setAiForm(f => ({ ...f, style: e.target.value }))}
                    className="w-full p-2 border rounded-lg text-sm">
                    <option value="professional">Professional</option>
                    <option value="modern">Modern & Minimal</option>
                    <option value="warm">Warm & Inviting</option>
                    <option value="bold">Bold & Vibrant</option>
                    <option value="traditional">Traditional Indian</option>
                  </select>
                </div>
              </div>

              <button onClick={handleGenerateAI} disabled={loading}
                className="w-full py-3 bg-purple-600 text-white rounded-lg font-medium text-sm flex items-center justify-center gap-2 hover:bg-purple-700 disabled:opacity-50">
                {loading ? <Loader2 size={16} className="animate-spin" /> : <Wand2 size={16} />}
                Generate with AI
              </button>

              {aiResult && (
                <div className="mt-4 p-4 bg-purple-50 rounded-lg">
                  <img src={aiResult.url} alt="AI Generated" className="w-full rounded-lg mb-2" />
                  {aiResult.revisedPrompt && <p className="text-xs text-gray-600 italic">{aiResult.revisedPrompt}</p>}
                </div>
              )}
            </div>
          )}

          {activeTab === 'upload' && (
            <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 space-y-4">
              <h3 className="font-semibold text-brand-navy">Upload Images</h3>
              <p className="text-xs text-gray-500">Upload your own images to use in social media posts</p>

              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-gray-300 rounded-xl p-12 text-center cursor-pointer hover:border-brand-gold hover:bg-brand-gold/5 transition-all"
              >
                <Upload size={40} className="mx-auto text-gray-400 mb-3" />
                <p className="text-sm font-medium text-gray-600">Click to upload or drag & drop</p>
                <p className="text-xs text-gray-400 mt-1">JPG, PNG, GIF, WebP, SVG (max 10MB)</p>
                <input ref={fileInputRef} type="file" multiple accept="image/*" className="hidden" onChange={handleUpload} />
              </div>

              {uploadedFiles.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Recently Uploaded</h4>
                  {uploadedFiles.map((f, i) => (
                    <div key={i} className="flex items-center gap-3 p-2 bg-green-50 rounded-lg">
                      <span className="text-green-600 text-sm">✓</span>
                      <span className="text-sm flex-1 truncate">{f.filename}</span>
                      <span className="text-xs text-gray-500">{(f.size / 1024).toFixed(0)}KB</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'library' && (
            <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
              <h3 className="font-semibold text-brand-navy mb-4">Image Library ({library.length})</h3>
              {library.length > 0 ? (
                <div className="grid grid-cols-2 gap-3 max-h-[500px] overflow-auto">
                  {library.map((img, i) => (
                    <div key={i} className="relative group rounded-lg overflow-hidden border">
                      <img src={img.url} alt={img.filename} className="w-full h-32 object-cover" />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        <button className="p-2 bg-white rounded-full hover:bg-gray-100" title="Preview">
                          <Eye size={14} />
                        </button>
                        <button onClick={() => handleDeleteImage(img.filename)}
                          className="p-2 bg-white rounded-full hover:bg-red-50 text-red-500" title="Delete">
                          <Trash2 size={14} />
                        </button>
                      </div>
                      <div className="p-2">
                        <p className="text-xs truncate text-gray-600">{img.filename}</p>
                        <p className="text-xs text-gray-400">{(img.size / 1024).toFixed(0)} KB</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-gray-400">
                  <Image size={40} className="mx-auto mb-3 text-gray-300" />
                  <p className="text-sm">No images uploaded yet</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right: Preview */}
        <div>
          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 sticky top-24">
            <h3 className="font-semibold text-brand-navy mb-4 flex items-center gap-2">
              <Eye size={18} /> Preview
            </h3>

            {showPreview && previewHtml ? (
              <div className="space-y-3">
                <div className="border rounded-lg overflow-hidden bg-gray-50">
                  <iframe
                    srcDoc={previewHtml}
                    className="w-full"
                    style={{ height: '400px', border: 'none' }}
                    title="Template Preview"
                  />
                </div>
                <div className="flex gap-2">
                  <button onClick={() => { const blob = new Blob([previewHtml], { type: 'text/html' }); const url = URL.createObjectURL(blob); window.open(url, '_blank'); }}
                    className="flex-1 flex items-center justify-center gap-2 py-2 bg-gray-100 rounded-lg text-sm hover:bg-gray-200">
                    <Eye size={14} /> Full Preview
                  </button>
                  <button onClick={() => navigator.clipboard.writeText(previewHtml)}
                    className="flex-1 flex items-center justify-center gap-2 py-2 bg-gray-100 rounded-lg text-sm hover:bg-gray-200">
                    <Copy size={14} /> Copy HTML
                  </button>
                </div>
              </div>
            ) : (
              <div className="h-64 flex flex-col items-center justify-center text-gray-400">
                <Image size={48} className="mb-3 text-gray-300" />
                <p className="text-sm">Generate or select an image to preview</p>
                <p className="text-xs mt-1">Templates will appear here with Dhanam branding</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
