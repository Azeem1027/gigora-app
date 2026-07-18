import React from 'react';

export default function Sidebar({ activeTab, setActiveTab, usage, userEmail, isMobileOpen, setIsMobileOpen }) {
  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Navigation Container Drawer */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 border-r border-slate-800 transform transition-transform duration-300 md:translate-x-0 md:static md:block ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="h-16 flex items-center justify-between px-6 border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <span className="text-2xl font-black tracking-wider text-purple-500">GIGORA</span>
            {usage?.plan === 'pro' && (
              <span className="bg-emerald-500/20 text-emerald-400 text-[10px] px-2 py-0.5 rounded-full font-bold border border-emerald-500/30">PRO</span>
            )}
          </div>
          <button className="md:hidden text-slate-400 hover:text-white" onClick={() => setIsMobileOpen(false)}>
            ✕
          </button>
        </div>

        <nav className="p-4 space-y-2">
          <button
            onClick={() => { setActiveTab('profile'); setIsMobileOpen(false); }}
            className={`w-full flex items-center px-4 py-3 rounded-xl transition-all duration-200 text-sm font-medium ${activeTab === 'profile' ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/20' : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'}`}
          >
            👤 Profile Analyzer
          </button>

          <button
            onClick={() => { setActiveTab('seo'); setIsMobileOpen(false); }}
            className={`w-full flex items-center px-4 py-3 rounded-xl transition-all duration-200 text-sm font-medium ${activeTab === 'seo' ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/20' : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'}`}
          >
            🔍 Optimize Gig SEO
          </button>

          <button
            onClick={() => { setActiveTab('proposal'); setIsMobileOpen(false); }}
            className={`w-full flex items-center px-4 py-3 rounded-xl transition-all duration-200 text-sm font-medium ${activeTab === 'proposal' ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/20' : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'}`}
          >
            📝 Write Proposal
          </button>

          <button
            onClick={() => { setActiveTab('history'); setIsMobileOpen(false); }}
            className={`w-full flex items-center px-4 py-3 rounded-xl transition-all duration-200 text-sm font-medium ${activeTab === 'history' ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/20' : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'}`}
          >
            ⏳ View Past History
          </button>
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-slate-800 bg-slate-900/50">
          <div className="text-xs text-slate-400">Logged in as:</div>
          <div className="text-sm font-medium truncate text-purple-300">{userEmail || 'Azeem@nust.edu.pk'}</div>
        </div>
      </aside>
    </>
  );
}