import React, { useState, useEffect } from 'react';
import { Toaster, toast } from 'react-hot-toast';
import { supabase } from './supabaseClient';
import Sidebar from './pages/Sidebar';
import ProfileAnalyzer from './pages/ProfileAnalyzer';
import SeoOptimizer from './pages/GigSEO';
import ProposalGenerator from './pages/ProposalGenerator';
import HistoryLog from './pages/HistoryLog';

export default function App() {
  const [session, setSession] = useState(null);
  const [activeTab, setActiveTab] = useState('profile');
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // Auth Portal States
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);

  // Sync session from Supabase
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Auth Submit Handler
  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isSignUp) {
        // 1. Create account
        const { error: signUpError } = await supabase.auth.signUp({ email, password });
        if (signUpError) throw signUpError;

        // 2. Sign in immediately — no email verification wait
        const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
        if (signInError) {
          toast.success('Account created! Please confirm your email then sign in.');
        }
        // If signIn works, session listener fires → dashboard renders automatically
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        // Session listener handles redirect — no toast to avoid flicker
      }
    } catch (err) {
      toast.error(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  // ── AUTH GATE ──────────────────────────────────────────────────────────────
  if (!session) {
    return (
      <div className="relative min-h-screen bg-slate-950 flex items-center justify-center p-4 overflow-hidden font-sans">
        <Toaster position="top-right" />

        {/* Background Orbs */}
        <div className="bg-glow-orb w-[350px] h-[350px] bg-purple-600/10 top-1/4 left-1/4" />
        <div className="bg-glow-orb w-[280px] h-[280px] bg-indigo-600/10 bottom-1/4 right-1/4" />

        <div className="relative z-10 glass-panel max-w-md w-full p-8 rounded-3xl border border-white/5 space-y-6 shadow-2xl">
          {/* Branding */}
          <div className="text-center space-y-2">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 mb-2 shadow-lg shadow-purple-500/25 text-white font-extrabold text-2xl tracking-tighter">
              G
            </div>
            <h1 className="text-3xl font-black text-white tracking-tight">
              Welcome to{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-300 font-extrabold">
                Gigora
              </span>
            </h1>
            <p className="text-xs text-slate-400">Unlock high-converting freelance assets optimized by AI.</p>
          </div>

          {/* Form */}
          <form onSubmit={handleAuth} className="space-y-4">
            <div className="space-y-1">
              <label className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-slate-950/80 border border-slate-800 focus:border-purple-500/80 rounded-2xl px-4 py-3 text-sm text-white focus:outline-none focus:ring-4 focus:ring-purple-500/10 transition-all duration-300"
                placeholder="you@domain.com"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-slate-950/80 border border-slate-800 focus:border-purple-500/80 rounded-2xl px-4 py-3 text-sm text-white focus:outline-none focus:ring-4 focus:ring-purple-500/10 transition-all duration-300"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 disabled:opacity-50 text-white font-bold h-12 rounded-2xl transition duration-300 text-sm shadow-lg shadow-purple-600/20 active:scale-[0.98] cursor-pointer"
            >
              {loading ? (
                <span className="flex items-center justify-center space-x-2">
                  <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <span>Processing...</span>
                </span>
              ) : (isSignUp ? 'Create Account' : 'Sign In')}
            </button>
          </form>

          <div className="text-center pt-1">
            <button
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-xs text-purple-400 hover:text-purple-300 font-semibold hover:underline bg-transparent border-none cursor-pointer"
            >
              {isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── MAIN DASHBOARD ─────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans antialiased">
      <Toaster
        position="top-right"
        toastOptions={{ style: { background: '#0b0f19', color: '#f1f5f9', border: '1px solid rgba(255,255,255,0.05)' } }}
      />

      {/* Decorative background orbs */}
      <div className="fixed pointer-events-none bg-glow-orb w-[400px] h-[400px] bg-purple-600/5 -top-40 right-0 z-0" />
      <div className="fixed pointer-events-none bg-glow-orb w-[450px] h-[450px] bg-indigo-600/5 -bottom-20 left-0 z-0" />

      {/* Fixed sidebar */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        userEmail={session.user.email}
        isMobileOpen={isMobileOpen}
        setIsMobileOpen={setIsMobileOpen}
        onSignOut={async () => { await supabase.auth.signOut(); }}
      />

      {/* Main content — offset by sidebar width on desktop */}
      <div className="md:pl-64 flex flex-col min-h-screen relative z-10">
        {/* Top header bar */}
        <header className="sticky top-0 z-30 h-16 border-b border-white/5 bg-slate-950/70 backdrop-blur-md flex items-center px-5 gap-4">
          {/* Mobile hamburger */}
          <button
            onClick={() => setIsMobileOpen(true)}
            className="md:hidden flex items-center justify-center w-9 h-9 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition"
          >
            ☰
          </button>

          {/* Page title */}
          <div className="flex items-center gap-2">
            <span className="text-white font-bold text-sm hidden sm:inline">
              {activeTab === 'profile' && '👤 Profile Analyzer'}
              {activeTab === 'seo' && '🔍 SEO Optimizer'}
              {activeTab === 'proposal' && '📝 Proposal Generator'}
              {activeTab === 'history' && '⏳ Activity History'}
            </span>
          </div>

          {/* User email badge on the right */}
          <div className="ml-auto flex items-center gap-3">
            <span className="hidden sm:block text-[11px] text-slate-500 font-mono truncate max-w-[200px]">
              {session.user.email}
            </span>
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center text-white text-xs font-black shadow-md shadow-purple-600/20">
              {session.user.email?.[0]?.toUpperCase() || 'U'}
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-5 md:p-8">
          {activeTab === 'profile'  && <ProfileAnalyzer  userSessionId={session.user.id} />}
          {activeTab === 'seo'      && <SeoOptimizer     userSessionId={session.user.id} />}
          {activeTab === 'proposal' && <ProposalGenerator userSessionId={session.user.id} />}
          {activeTab === 'history'  && <HistoryLog        userSessionId={session.user.id} />}
        </main>
      </div>
    </div>
  );
}