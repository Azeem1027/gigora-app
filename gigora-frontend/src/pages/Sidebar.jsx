import React, { useEffect } from 'react';

const NAV_ITEMS = [
  { id: 'profile', label: 'Profile Analyzer', icon: '👤' },
  { id: 'seo', label: 'Optimize Gig SEO', icon: '🔍' },
  { id: 'proposal', label: 'Write Proposal', icon: '📝' },
  { id: 'history', label: 'View Past History', icon: '⏳' },
];

export default function Sidebar({
  activeTab,
  setActiveTab,
  usage,
  userEmail,
  isMobileOpen,
  setIsMobileOpen,
}) {
  // Handle ESC key press to close mobile drawer
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isMobileOpen) {
        setIsMobileOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isMobileOpen, setIsMobileOpen]);

  const handleTabClick = (tabId) => {
    setActiveTab(tabId);
    if (setIsMobileOpen) {
      setIsMobileOpen(false);
    }
  };

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden transition-opacity"
          onClick={() => setIsMobileOpen(false)}
          aria-label="Close mobile sidebar"
        />
      )}

      {/* Navigation Container Drawer */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 border-r border-slate-800 transform transition-transform duration-300 md:translate-x-0 md:static md:block flex flex-col justify-between ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div>
          {/* Header Branding */}
          <div className="h-16 flex items-center justify-between px-6 border-b border-slate-800">
            <div className="flex items-center space-x-3">
              <span className="text-2xl font-black tracking-wider text-purple-500">
                GIGORA
              </span>
              {usage?.plan === 'pro' && (
                <span className="bg-emerald-500/20 text-emerald-400 text-[10px] px-2 py-0.5 rounded-full font-bold border border-emerald-500/30">
                  PRO
                </span>
              )}
            </div>
            <button
              type="button"
              className="md:hidden text-slate-400 hover:text-white p-1 rounded-lg transition"
              onClick={() => setIsMobileOpen(false)}
              aria-label="Close menu"
            >
              ✕
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-2">
            {NAV_ITEMS.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleTabClick(item.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 text-sm font-medium ${
                    isActive
                      ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/20'
                      : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                  }`}
                >
                  <span>{item.icon}</span>
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* User Account Info Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/50">
          <div className="text-[10px] uppercase font-semibold text-slate-500 tracking-wider">
            Logged in as
          </div>
          <div className="text-sm font-medium truncate text-purple-300 mt-0.5">
            {userEmail || 'user@example.com'}
          </div>
        </div>
      </aside>
    </>
  );
}