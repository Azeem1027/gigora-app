import React, { useEffect } from 'react';

const NAV_ITEMS = [
  { id: 'profile',  label: 'Profile Analyzer', icon: '👤' },
  { id: 'seo',      label: 'Optimize Gig SEO', icon: '🔍' },
  { id: 'proposal', label: 'Write Proposal',   icon: '📝' },
  { id: 'history',  label: 'View Past History', icon: '⏳' },
];

export default function Sidebar({
  activeTab,
  setActiveTab,
  userEmail,
  isMobileOpen,
  setIsMobileOpen,
  onSignOut,
}) {
  // Close on ESC key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isMobileOpen) setIsMobileOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isMobileOpen, setIsMobileOpen]);

  const handleTabClick = (tabId) => {
    setActiveTab(tabId);
    setIsMobileOpen(false);
  };

  return (
    <>
      {/* Mobile backdrop */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar drawer — always fixed, visible on desktop via md:translate-x-0 */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-50 w-64
          bg-slate-900 border-r border-slate-800
          flex flex-col
          transition-transform duration-300 ease-in-out
          ${isMobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        `}
      >
        {/* Logo / Brand */}
        <div className="h-16 flex items-center justify-between px-5 border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center text-white font-black text-base shadow-md shadow-purple-600/20">
              G
            </div>
            <span className="text-lg font-black tracking-wider text-white">
              GIGO<span className="text-purple-400">RA</span>
            </span>
          </div>
          {/* Mobile close button */}
          <button
            type="button"
            className="md:hidden text-slate-400 hover:text-white p-1.5 rounded-lg transition"
            onClick={() => setIsMobileOpen(false)}
          >
            ✕
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {NAV_ITEMS.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleTabClick(item.id)}
                className={`
                  w-full flex items-center gap-3 px-4 py-3 rounded-xl
                  text-sm font-medium transition-all duration-200 text-left
                  ${isActive
                    ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/25'
                    : 'text-slate-400 hover:bg-slate-800/70 hover:text-slate-100'
                  }
                `}
              >
                <span className="text-base">{item.icon}</span>
                <span>{item.label}</span>
                {isActive && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-white/60" />}
              </button>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 space-y-3 shrink-0">
          {/* User pill */}
          <div className="flex items-center gap-3 px-3 py-2.5 bg-slate-950/50 border border-slate-800 rounded-xl">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center text-white text-xs font-black shrink-0">
              {userEmail?.[0]?.toUpperCase() || 'U'}
            </div>
            <span className="text-xs text-slate-300 font-medium truncate flex-1">{userEmail}</span>
          </div>

          {/* Sign Out */}
          {onSignOut && (
            <button
              type="button"
              onClick={onSignOut}
              className="w-full flex items-center justify-center gap-2 px-3 py-2.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 hover:text-rose-300 border border-rose-500/15 hover:border-rose-500/30 rounded-xl text-xs font-semibold transition-all duration-200 cursor-pointer"
            >
              <span>🚪</span>
              <span>Sign Out</span>
            </button>
          )}
        </div>
      </aside>
    </>
  );
}