import React, { useState } from 'react';
import { Routes, Route, NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, PenSquare, Calendar, BarChart3, Image, Users,
  Settings, Menu, X, ChevronRight, Sparkles
} from 'lucide-react';

import Dashboard from './pages/Dashboard';
import ContentCreator from './pages/ContentCreator';
import Scheduler from './pages/Scheduler';
import Analytics from './pages/Analytics';
import ImageStudio from './pages/ImageStudio';
import Community from './pages/Community';
import PlatformSettings from './pages/PlatformSettings';

const navItems = [
  { path: '/', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/create', label: 'Create Content', icon: PenSquare },
  { path: '/scheduler', label: 'Scheduler', icon: Calendar },
  { path: '/analytics', label: 'Analytics', icon: BarChart3 },
  { path: '/images', label: 'Image Studio', icon: Image },
  { path: '/community', label: 'Community', icon: Users },
  { path: '/settings', label: 'Settings', icon: Settings },
];

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-brand-navy text-white transition-all duration-300 flex flex-col z-20 shadow-xl`}>
        {/* Logo */}
        <div className="p-4 flex items-center justify-between border-b border-white/10">
          {sidebarOpen ? (
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-brand-gold flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="font-display text-lg leading-tight">Dhanam</h1>
                <p className="text-xs text-gray-400">Social Media Hub</p>
              </div>
            </div>
          ) : (
            <div className="w-10 h-10 rounded-lg bg-brand-gold flex items-center justify-center mx-auto">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
          )}
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-gray-400 hover:text-white p-1">
            {sidebarOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-4">
          {navItems.map(item => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/'}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 mx-2 rounded-lg transition-all duration-200 mb-1 ${
                  isActive
                    ? 'bg-brand-gold/20 text-brand-gold-light border-l-3 border-brand-gold'
                    : 'text-gray-400 hover:bg-white/5 hover:text-white'
                }`
              }
            >
              <item.icon size={20} className="flex-shrink-0" />
              {sidebarOpen && <span className="text-sm font-medium">{item.label}</span>}
            </NavLink>
          ))}
        </nav>

        {/* Footer */}
        {sidebarOpen && (
          <div className="p-4 border-t border-white/10">
            <div className="text-xs text-gray-500 text-center">
              Dhanam Finance &copy; {new Date().getFullYear()}
              <br />Empowering people. Enabling progress.
            </div>
          </div>
        )}
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        {/* Top bar */}
        <header className="bg-white shadow-sm border-b px-6 py-4 flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <LayoutDashboard size={16} />
            <ChevronRight size={14} />
            <span className="font-medium text-brand-navy">
              {navItems.find(n => n.path === location.pathname)?.label || 'Dashboard'}
            </span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-500">
              {new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </span>
            <div className="w-8 h-8 rounded-full bg-brand-gold text-white flex items-center justify-center text-sm font-bold">
              D
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="p-6 animate-fadeIn">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/create" element={<ContentCreator />} />
            <Route path="/scheduler" element={<Scheduler />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/images" element={<ImageStudio />} />
            <Route path="/community" element={<Community />} />
            <Route path="/settings" element={<PlatformSettings />} />
          </Routes>
        </div>
      </main>
    </div>
  );
}
