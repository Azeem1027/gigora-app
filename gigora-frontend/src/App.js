import React, { useState, useEffect } from 'react';
import './App.css';
import Login from './components/Login';
import Signup from './components/Signup';
import Sidebar from './components/Sidebar';
import ProfileAnalyzer from './pages/ProfileAnalyzer';
import GigSEO from './pages/GigSEO';
import ProposalGenerator from './pages/ProposalGenerator';

export default function App() {
  const [authMode, setAuthMode] = useState('none'); // 'none', 'login', 'signup'
  const [userToken, setUserToken] = useState(null);
  const [activeTab, setActiveTab] = useState('profile'); // 'profile', 'seo', 'proposal'

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) setUserToken(token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUserToken(null);
    setAuthMode('none');
  };

  // 1. DASHBOARD VIEW (Logged In)
  if (userToken) {
    return (
      <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
        {/* Dashboard Navbar */}
        <header className="sticky top-0 z-30 flex justify-between items-center px-6 py-4 bg-slate-900/80 backdrop-blur-md border-b border-slate-800/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-violet-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div>
              <span className="text-xl font-extrabold tracking-wider bg-clip-text text-transparent bg-gradient-to-r from-white via-indigo-200 to-indigo-400">
                GIGORA
              </span>
              <span className="ml-2 text-xs font-semibold px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                AI Suite
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-3 pr-4 border-r border-slate-800">
              <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center">
                <svg className="w-4 h-4 text-indigo-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
              </div>
              <span className="text-sm font-medium text-slate-300">Freelancer Account</span>
            </div>
            
            <button 
              onClick={handleLogout} 
              className="flex items-center gap-2 px-4 py-2 text-sm font-semibold bg-slate-800 hover:bg-rose-950/40 text-slate-300 hover:text-rose-400 border border-slate-700 hover:border-rose-900/50 rounded-xl shadow-sm transition-all duration-300 cursor-pointer"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <span>Log Out</span>
            </button>
          </div>
        </header>

        {/* Dashboard Body with Sidebar */}
        <div className="flex flex-1 relative overflow-hidden">
          <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
          
          <main className="flex-1 p-6 md:p-10 overflow-y-auto max-w-7xl mx-auto w-full transition-all duration-300">
            <div className="animate-fade-in">
              {activeTab === 'profile' && <ProfileAnalyzer />}
              {activeTab === 'seo' && <GigSEO />}
              {activeTab === 'proposal' && <ProposalGenerator userToken={userToken} />}
            </div>
          </main>
        </div>
      </div>
    );
  }

  // 2. AUTHENTICATION VIEWS (Login / Signup Pages)
  if (authMode === 'login' || authMode === 'signup') {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between font-sans relative overflow-hidden">
        {/* Background Decorative Blobs */}
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-600/10 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-violet-600/10 blur-[120px] rounded-full pointer-events-none" />

        <header className="px-6 py-6 flex justify-between items-center max-w-7xl mx-auto w-full z-10">
          <div 
            onClick={() => setAuthMode('none')}
            className="flex items-center gap-2 text-sm font-semibold text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span>Back to Home</span>
          </div>

          <div className="flex items-center gap-2 cursor-pointer" onClick={() => setAuthMode('none')}>
            <div className="w-8 h-8 rounded-lg bg-indigo-500 flex items-center justify-center shadow-lg">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <span className="font-extrabold tracking-wider text-white">GIGORA</span>
          </div>
        </header>

        <div className="flex-1 flex items-center justify-center px-4 py-12 z-10">
          <div className="w-full max-w-md bg-slate-900/40 backdrop-blur-xl border border-slate-800/80 p-8 rounded-3xl shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-indigo-500 via-violet-500 to-pink-500" />
            
            {authMode === 'login' ? (
              <Login 
                switchToSignup={() => setAuthMode('signup')} 
                onLoginSuccess={(token) => setUserToken(token)}
              />
            ) : (
              <Signup switchToLogin={() => setAuthMode('login')} />
            )}
          </div>
        </div>

        <footer className="py-6 text-center text-xs text-slate-500 z-10">
          &copy; {new Date().getFullYear()} Gigora AI. All rights reserved.
        </footer>
      </div>
    );
  }

  // 3. LANDING PAGE VIEW (Default homepage)
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans relative overflow-hidden">
      {/* Background Decorative Gradients */}
      <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-indigo-500/10 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute top-[30%] right-[-10%] w-[50%] h-[50%] bg-violet-600/10 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[10%] w-[50%] h-[50%] bg-blue-600/5 blur-[150px] rounded-full pointer-events-none" />

      {/* Header / Nav */}
      <nav className="max-w-7xl mx-auto px-6 py-6 flex justify-between items-center relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-violet-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <span className="text-2xl font-extrabold tracking-wider bg-clip-text text-transparent bg-gradient-to-r from-white via-indigo-100 to-indigo-300">
            GIGORA
          </span>
        </div>

        <div className="hidden md:flex items-center gap-8 bg-slate-900/50 border border-slate-800/80 px-6 py-2.5 rounded-full backdrop-blur-md">
          <a href="#features" className="text-sm font-semibold text-slate-300 hover:text-white transition-colors">Features</a>
          <a href="#pricing" className="text-sm font-semibold text-slate-300 hover:text-white transition-colors">Pricing</a>
          <a href="#why-us" className="text-sm font-semibold text-slate-300 hover:text-white transition-colors">Why Gigora</a>
        </div>

        <div className="flex items-center gap-4">
          <button 
            onClick={() => setAuthMode('login')} 
            className="text-sm font-semibold text-slate-300 hover:text-white transition-colors cursor-pointer px-4 py-2 rounded-xl hover:bg-slate-900"
          >
            Login
          </button>
          <button 
            onClick={() => setAuthMode('signup')} 
            className="text-sm font-semibold bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 text-white px-5 py-2.5 rounded-xl shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/35 hover:-translate-y-0.5 transition-all duration-300 cursor-pointer"
          >
            Get Started
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-6 pt-20 pb-24 text-center relative z-10">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold mb-8 animate-pulse">
          <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
          <span>Next-Generation AI Platform for Freelancers</span>
        </div>

        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-white mb-8 leading-tight">
          Win Every Gig with the <br className="hidden sm:inline" />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-violet-400 to-pink-400">
            Power of Smart AI
          </span>
        </h1>

        <p className="text-lg md:text-xl text-slate-400 max-w-3xl mx-auto mb-10 leading-relaxed">
          Optimize your Upwork and Fiverr profiles, rocket your gig listings to the top of search rankings, and craft high-converting proposals in under 10 seconds.
        </p>

        <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
          <button 
            onClick={() => setAuthMode('signup')}
            className="w-full sm:w-auto text-base font-bold bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 text-white px-8 py-4 rounded-2xl shadow-xl shadow-indigo-500/20 hover:shadow-indigo-500/30 hover:-translate-y-0.5 transition-all duration-300 cursor-pointer flex items-center justify-center gap-2"
          >
            <span>Start Winning More Gigs</span>
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </button>
          <a
            href="#features"
            className="w-full sm:w-auto text-base font-bold bg-slate-900/60 hover:bg-slate-950 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white px-8 py-4 rounded-2xl transition-all duration-300 cursor-pointer flex items-center justify-center gap-2"
          >
            Explore Features
          </a>
        </div>

        {/* Dynamic Mockup Presentation Grid */}
        <div className="mt-20 border border-slate-800/80 bg-slate-900/25 p-4 rounded-3xl backdrop-blur-md shadow-2xl relative">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500/10 to-violet-500/10 rounded-3xl blur opacity-30" />
          <div className="w-full h-[400px] rounded-2xl bg-slate-950 border border-slate-800 flex flex-col items-stretch overflow-hidden text-left shadow-inner">
            {/* Mock Header */}
            <div className="bg-slate-900 px-4 py-3 border-b border-slate-800 flex justify-between items-center text-xs text-slate-400">
              <div className="flex gap-2">
                <span className="w-3 h-3 rounded-full bg-red-500/40" />
                <span className="w-3 h-3 rounded-full bg-yellow-500/40" />
                <span className="w-3 h-3 rounded-full bg-green-500/40" />
              </div>
              <span className="font-mono bg-slate-950 px-3 py-1 rounded border border-slate-800">app.gigora.com/dashboard</span>
              <div className="w-12 h-2 rounded bg-slate-800" />
            </div>
            
            {/* Mock Layout */}
            <div className="flex flex-1">
              {/* Mock Sidebar */}
              <div className="w-48 bg-slate-900/60 border-r border-slate-800 p-3 hidden sm:flex flex-col gap-2">
                <div className="h-6 rounded bg-indigo-500/10 border border-indigo-500/20 mb-4 flex items-center px-2"><div className="w-2 h-2 rounded-full bg-indigo-400 mr-2" /><div className="w-16 h-1.5 rounded bg-indigo-400/40" /></div>
                <div className="h-6 rounded bg-slate-800/40 flex items-center px-2"><div className="w-2 h-2 rounded-full bg-slate-600 mr-2" /><div className="w-20 h-1.5 rounded bg-slate-700" /></div>
                <div className="h-6 rounded bg-slate-800/40 flex items-center px-2"><div className="w-2 h-2 rounded-full bg-slate-600 mr-2" /><div className="w-24 h-1.5 rounded bg-slate-700" /></div>
                <div className="h-6 rounded bg-slate-800/40 flex items-center px-2"><div className="w-2 h-2 rounded-full bg-slate-600 mr-2" /><div className="w-14 h-1.5 rounded bg-slate-700" /></div>
              </div>
              {/* Mock Content */}
              <div className="flex-1 p-6 flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="h-4 w-1/4 rounded bg-indigo-500/20" />
                  <div className="h-8 w-2/3 rounded bg-slate-800" />
                  <div className="h-24 rounded bg-slate-900 border border-slate-850 p-4 space-y-2">
                    <div className="h-3 w-full rounded bg-slate-800" />
                    <div className="h-3 w-5/6 rounded bg-slate-800" />
                    <div className="h-3 w-4/6 rounded bg-slate-800" />
                  </div>
                </div>
                <div className="flex justify-between items-center pt-4 border-t border-slate-800/60">
                  <div className="flex gap-4">
                    <div className="h-10 w-24 rounded-lg bg-slate-850" />
                    <div className="h-10 w-32 rounded-lg bg-indigo-600" />
                  </div>
                  <div className="h-8 w-8 rounded-full bg-slate-850" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="max-w-7xl mx-auto px-6 py-20 relative z-10 border-t border-slate-900">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-4">
            Maximize Your Freelance Potential
          </h2>
          <p className="text-slate-400 max-w-xl mx-auto">
            Three developer-grade AI engines engineered to skyrocket your conversion rate and gig rankings.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Card 1 */}
          <div className="p-8 rounded-3xl bg-slate-900/30 border border-slate-800 hover:border-indigo-500/40 hover:bg-slate-900/50 transition-all duration-300 group shadow-lg">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Profile Analyzer</h3>
            <p className="text-slate-400 text-sm leading-relaxed mb-4">
              Get an instant algorithmic checkup of your Fiverr/Upwork description. Uncover exact strengths, weaknesses, and a score upgrade roadmap.
            </p>
            <span className="text-indigo-400 text-xs font-semibold uppercase tracking-wider">AI Audit Engine</span>
          </div>

          {/* Card 2 */}
          <div className="p-8 rounded-3xl bg-slate-900/30 border border-slate-800 hover:border-indigo-500/40 hover:bg-slate-900/50 transition-all duration-300 group shadow-lg">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Gig SEO Optimizer</h3>
            <p className="text-slate-400 text-sm leading-relaxed mb-4">
              Inject search-friendly keywords organically into your titles and descriptions to rank higher on search result pages and attract direct buyers.
            </p>
            <span className="text-indigo-400 text-xs font-semibold uppercase tracking-wider">SEO Refactor Engine</span>
          </div>

          {/* Card 3 */}
          <div className="p-8 rounded-3xl bg-slate-900/30 border border-slate-800 hover:border-indigo-500/40 hover:bg-slate-900/50 transition-all duration-300 group shadow-lg">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Proposal Generator</h3>
            <p className="text-slate-400 text-sm leading-relaxed mb-4">
              Stop sending boilerplate copy. Instantly output tailored, professional proposals matching client requirements exactly.
            </p>
            <span className="text-indigo-400 text-xs font-semibold uppercase tracking-wider">Conversion Engine</span>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="max-w-5xl mx-auto px-6 py-20 relative z-10 border-t border-slate-900">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-4">
            Transparent Pricing
          </h2>
          <p className="text-slate-400 max-w-md mx-auto">
            Choose the plan that fits your freelancing scale. No hidden fees.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
          {/* Free Tier */}
          <div className="p-8 rounded-3xl bg-slate-900/20 border border-slate-800 flex flex-col justify-between shadow-lg">
            <div>
              <h3 className="text-xl font-bold text-slate-300 mb-2">Hobby Starter</h3>
              <p className="text-slate-500 text-sm mb-6">Perfect for testing the waters</p>
              <div className="text-4xl font-extrabold text-white mb-6">
                $0 <span className="text-sm font-normal text-slate-500">/ forever</span>
              </div>
              <ul className="space-y-3.5 mb-8 text-sm text-slate-400">
                <li className="flex items-center gap-2.5">
                  <svg className="w-4 h-4 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>5 Profile Audits per month</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <svg className="w-4 h-4 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>10 Gig SEO Optimizations</span>
                </li>
                <li className="flex items-center gap-2.5 text-slate-600 line-through">
                  <svg className="w-4 h-4 text-slate-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  <span>Unlimited Proposal Generations</span>
                </li>
              </ul>
            </div>
            <button 
              onClick={() => setAuthMode('signup')}
              className="w-full py-3 bg-slate-800 hover:bg-slate-750 text-white font-semibold rounded-xl transition-all cursor-pointer"
            >
              Get Started
            </button>
          </div>

          {/* Pro Tier */}
          <div className="p-8 rounded-3xl bg-slate-900/50 border-2 border-indigo-500 flex flex-col justify-between shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-indigo-500 text-white text-[10px] uppercase font-bold tracking-widest px-4 py-1.5 rounded-bl-xl">
              POPULAR
            </div>
            <div>
              <h3 className="text-xl font-bold text-white mb-2">Freelancer Pro</h3>
              <p className="text-indigo-300 text-sm mb-6">Designed to maximize your gig conversions</p>
              <div className="text-4xl font-extrabold text-white mb-6">
                $19 <span className="text-xs font-normal text-indigo-400">/ month</span>
              </div>
              <ul className="space-y-3.5 mb-8 text-sm text-slate-300">
                <li className="flex items-center gap-2.5">
                  <svg className="w-4 h-4 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Unlimited Profile Audits</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <svg className="w-4 h-4 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Unlimited SEO Optimizations</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <svg className="w-4 h-4 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Unlimited High-Converting Proposals</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <svg className="w-4 h-4 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Priority API responses</span>
                </li>
              </ul>
            </div>
            <button 
              onClick={() => setAuthMode('signup')}
              className="w-full py-3 bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-500/20 transition-all cursor-pointer"
            >
              Go Pro Now
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="max-w-7xl mx-auto px-6 py-12 border-t border-slate-900 text-center text-sm text-slate-500 relative z-10 flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded bg-slate-800 flex items-center justify-center">
            <svg className="w-4 h-4 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <span className="font-extrabold tracking-wider text-slate-400">GIGORA</span>
        </div>
        <div>
          &copy; {new Date().getFullYear()} Gigora AI Suite. Crafted for high conversions.
        </div>
      </footer>
    </div>
  );
}