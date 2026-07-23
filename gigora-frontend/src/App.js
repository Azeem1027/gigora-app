import React, { useState, useEffect, useCallback } from 'react';
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
  const [usage, setUsage] = useState({ count: 0, limit: 10, plan: 'free' });
  const [showModal, setShowModal] = useState(false);

  // Auth Portal States
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);

  // Sync session states from Supabase
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Fetch Usage Limits with dynamic headers
  const fetchUsage = useCallback(async () => {
    if (!session || !session.user || !session.user.id) return;
    try {
      const response = await fetch('http://localhost:8000/api/usage', {
        headers: { 'X-User-Id': session.user.id }
      });
      if (!response.ok) return;
      const result = await response.json();
      if (result.success) setUsage(result.data);
    } catch (err) {
      console.error("Failed syncing profile metadata context metrics.");
    }
  }, [session]);

  useEffect(() => {
    if (session?.user?.id) {
      fetchUsage();
    }
  }, [session, fetchUsage]);

  // Auth Submit Handler
  const handleAuth = async (e) => {
    e.preventDefault();
    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        toast.success("Verification link broadcasted to account inbox!");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast.success("Identity profile mounted successfully!");
      }
    } catch (err) {
      toast.error(err.message);
    }
  };

  // 1. Gatehouse Render View: If not logged in, show Auth Gate
  if (!session) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
        <Toaster position="top-right" />
        <div className="bg-slate-900 border border-slate-800 max-w-md w-full p-8 rounded-2xl space-y-6 shadow-2xl">
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-bold text-white">Welcome to Gigora AI</h2>
            <p className="text-xs text-slate-400">Authenticate identity tracking credentials to access computational pipelines.</p>
          </div>
          <form onSubmit={handleAuth} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">Workspace Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-purple-500 transition"
                placeholder="you@domain.com"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">Security Password Access Key</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-purple-500 transition"
                placeholder="••••••••"
              />
            </div>
            <button type="submit" className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 rounded-xl transition text-sm shadow-md shadow-purple-600/10">
              {isSignUp ? 'Construct Workspace Account' : 'Initialize Session Entry'}
            </button>
          </form>
          <div className="text-center">
            <button onClick={() => setIsSignUp(!isSignUp)} className="text-xs text-purple-400 hover:underline">
              {isSignUp ? 'Already own an automated profile? Authenticate' : 'Create a profile account workspace'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 2. Main Platform App Workspace View
  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-100 font-sans antialiased">
      <Toaster position="top-right" toastOptions={{ style: { background: '#0f172a', color: '#f1f5f9', border: '1px solid #334155' } }} />

      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        usage={usage}
        userEmail={session.user.email}
        isMobileOpen={isMobileOpen}
        setIsMobileOpen={setIsMobileOpen}
        onSignOut={async () => { await supabase.auth.signOut(); toast.success("Session closed."); }}
      />

      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 border-b border-slate-800 bg-slate-900/40 backdrop-blur-md flex items-center justify-between px-6 combined-header layout-strip">
          <button onClick={() => setIsMobileOpen(true)} className="md:hidden text-slate-400 hover:text-white p-1">☰</button>

          <div className="flex items-center space-x-3 ml-auto text-xs font-semibold">
            <span className="text-slate-400 font-mono tracking-wide">Plan: <span className="uppercase text-purple-400">{usage.plan}</span></span>
            <span className={`${usage.count >= usage.limit && usage.plan === 'free' ? 'text-rose-400' : 'text-emerald-400'} bg-slate-900 px-2.5 py-1 rounded-md border border-slate-800`}>
              {usage.count} / {usage.plan === 'paid' ? '∞' : usage.limit} Runs Utilized
            </span>
          </div>
        </header>

        <main className="flex-1 p-6 md:p-8 max-w-7xl w-full mx-auto">
          {activeTab === 'profile' && <ProfileAnalyzer userSessionId={session.user.id} onActionComplete={fetchUsage} triggerLimitModal={() => setShowModal(true)} />}
          {activeTab === 'seo' && <SeoOptimizer userSessionId={session.user.id} onActionComplete={fetchUsage} triggerLimitModal={() => setShowModal(true)} />}
          {activeTab === 'proposal' && <ProposalGenerator userSessionId={session.user.id} onActionComplete={fetchUsage} triggerLimitModal={() => setShowModal(true)} />}
          {activeTab === 'history' && <HistoryLog userSessionId={session.user.id} />}
        </main>
      </div>

      {/* Paywall Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-800 max-w-sm w-full p-6 rounded-2xl text-center space-y-4 shadow-2xl">
            <span className="text-4xl block">⚡</span>
            <h3 className="text-lg font-bold text-white">Execution Throttles Imposed</h3>
            <p className="text-xs text-slate-400 leading-relaxed">You have hit the computation boundaries assigned to your free infrastructure. Upgrade your operational plan tier.</p>
            <div className="flex space-x-2 pt-2">
              <button onClick={() => setShowModal(false)} className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold py-2.5 rounded-xl border border-slate-700 transition text-xs">Dismiss</button>
              <button onClick={() => { toast.success("Redirecting upgrade pipelines..."); setShowModal(false); }} className="flex-1 bg-purple-600 hover:bg-purple-700 text-white font-bold py-2.5 rounded-xl transition text-xs shadow-md">Go Pro Upgrade</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}