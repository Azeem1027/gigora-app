import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import { analyzeProfile } from '../api';

export default function ProfileAnalyzer({ userSessionId, onActionComplete, triggerLimitModal }) {
  const [profileText, setProfileText] = useState('');
  const [platform, setPlatform] = useState('Fiverr');
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!profileText.trim()) {
      toast.error('Please enter profile text or details.');
      return;
    }

    setLoading(true);
    setAnalysis(null);

    try {
      const data = await analyzeProfile({
        profileText: profileText.trim(),
        platform: platform
      }, userSessionId);

      const resultData = data.data || data;

      if (data.success || data.status === 'success' || resultData.score) {
        setAnalysis(resultData);
        toast.success('AI Profile analysis complete!');
        if (typeof onActionComplete === 'function') {
          onActionComplete();
        }
      } else {
        toast.error(data.message || 'Analysis failed to return valid data.');
      }
    } catch (err) {
      console.error('Profile Analyzer Error:', err);
      const msg = err.message || '';
      if (msg.includes('Limit reached') || msg.includes('429')) {
        if (typeof triggerLimitModal === 'function') {
          triggerLimitModal();
        } else {
          toast.error('Usage limit reached. Please upgrade to Pro.');
        }
      } else {
        toast.error(msg || 'Failed to connect to backend server.');
      }
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'from-emerald-500 to-teal-400';
    if (score >= 60) return 'from-amber-500 to-yellow-400';
    return 'from-rose-500 to-red-400';
  };

  const getScoreBg = (score) => {
    if (score >= 80) return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
    if (score >= 60) return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
    return 'bg-rose-500/10 text-rose-400 border-rose-500/20';
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
      {/* Intro Header */}
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-black text-white tracking-tight flex items-center gap-2">
          <span>👤</span> AI Profile Analyzer
        </h1>
        <p className="text-sm text-slate-400 leading-relaxed">
          Improve your freelancer bios and profile summaries for Upwork, Fiverr, or LinkedIn using expert-level critiques.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* INPUT FORM BLOCK */}
        <div className="lg:col-span-6 bg-slate-900/60 backdrop-blur-md border border-white/5 p-6 rounded-3xl shadow-xl space-y-6">
          <div className="border-b border-white/5 pb-4">
            <h3 className="text-md font-bold text-slate-200">Optimize Profile Copy</h3>
            <p className="text-xs text-slate-400">Fill in the details below to trigger key analysis</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">Target Platform</label>
              <div className="relative">
                <select
                  value={platform}
                  onChange={(e) => setPlatform(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-4 py-3.5 text-sm text-white focus:outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 transition-all duration-300 appearance-none cursor-pointer"
                >
                  <option value="Fiverr">Fiverr Seller Profile</option>
                  <option value="Upwork">Upwork Profile Overview</option>
                  <option value="LinkedIn">LinkedIn About Section</option>
                </select>
                <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-slate-400 text-xs">
                  ▼
                </div>
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">Profile Text</label>
                <span className="text-[10px] text-slate-500 font-mono">{profileText.length} chars</span>
              </div>
              <textarea
                rows="8"
                value={profileText}
                onChange={(e) => setProfileText(e.target.value)}
                placeholder="Paste your bio, about section, or current profile description here..."
                className="w-full bg-slate-950 border border-slate-800 focus:border-purple-500/80 rounded-2xl p-4 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:ring-4 focus:ring-purple-500/10 transition-all duration-300 resize-y min-h-[150px]"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 disabled:from-slate-800 disabled:to-slate-800 text-white font-bold h-12 rounded-2xl transition duration-300 text-sm shadow-lg shadow-purple-600/10 flex items-center justify-center space-x-2 cursor-pointer disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center space-x-2">
                  <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <span>Analyzing Copy...</span>
                </span>
              ) : (
                <>
                  <span>✨</span>
                  <span>Analyze Profile Copy</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Dynamic AI Feedback Section */}
        <div className="lg:col-span-6 space-y-6">
          {loading && (
            <div className="bg-slate-900/40 border border-slate-800/80 p-8 rounded-3xl space-y-6 animate-pulse">
              <div className="flex justify-between items-center pb-4 border-b border-slate-800">
                <div className="h-6 bg-slate-800 rounded w-1/3"></div>
                <div className="h-8 bg-slate-800 rounded w-20"></div>
              </div>
              <div className="space-y-3">
                <div className="h-4 bg-slate-800 rounded w-1/4"></div>
                <div className="h-4 bg-slate-800 rounded w-full"></div>
                <div className="h-4 bg-slate-800 rounded w-full"></div>
                <div className="h-4 bg-slate-800 rounded w-3/4"></div>
              </div>
              <div className="space-y-2">
                <div className="h-4 bg-slate-800 rounded w-1/3"></div>
                <div className="h-12 bg-slate-800 rounded w-full"></div>
                <div className="h-12 bg-slate-800 rounded w-full"></div>
              </div>
            </div>
          )}

          {!loading && !analysis && (
            <div className="bg-slate-900/30 border border-slate-800/60 border-dashed rounded-3xl p-16 text-center flex flex-col items-center justify-center text-slate-500 h-full min-h-[350px]">
              <div className="w-16 h-16 rounded-2xl bg-slate-950 flex items-center justify-center text-3xl mb-4 border border-slate-800 shadow-md">
                📊
              </div>
              <p className="text-sm font-semibold text-slate-300">Ready for Overview</p>
              <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
                Paste your profile bio description and select a target channel to see custom optimization scores and item suggestions.
              </p>
            </div>
          )}

          {!loading && analysis && (
            <div className="bg-slate-900/60 backdrop-blur-md border border-white/5 p-6 rounded-3xl text-white space-y-6 shadow-xl animate-scale-up">
              {/* Header Info */}
              <div className="flex items-center justify-between border-b border-white/5 pb-4">
                <div className="space-y-0.5">
                  <h3 className="font-bold text-lg text-white">Analysis Feedback</h3>
                  <p className="text-[10px] uppercase font-bold text-slate-400 font-mono tracking-wider">{platform} optimized</p>
                </div>
                <span className={`px-4 py-1.5 rounded-full text-xs font-mono font-bold border ${getScoreBg(analysis.score)}`}>
                  Score: {analysis.score || 0}%
                </span>
              </div>

              {/* Glowing Linear Score Bar */}
              <div className="space-y-1">
                <div className="flex justify-between text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
                  <span>Rating Strength</span>
                  <span>{analysis.score || 0}/100</span>
                </div>
                <div className="w-full bg-slate-950 h-3 rounded-full overflow-hidden border border-slate-850 p-[2px]">
                  <div
                    className={`h-full rounded-full bg-gradient-to-r ${getScoreColor(analysis.score)} shadow-[0_0_8px_rgba(168,85,247,0.3)] transition-all duration-1000`}
                    style={{ width: `${analysis.score || 0}%` }}
                  ></div>
                </div>
              </div>

              {/* Overall Summary */}
              {analysis.summary && (
                <div className="space-y-1.5 bg-slate-950/50 border border-slate-800/40 p-4 rounded-2xl">
                  <h4 className="text-[10px] font-bold text-purple-400 uppercase tracking-wider">Summary Verdict</h4>
                  <p className="text-xs text-slate-350 leading-relaxed font-medium">{analysis.summary}</p>
                </div>
              )}

              {/* Key Action items */}
              {analysis.improvements && analysis.improvements.length > 0 && (
                <div className="space-y-3">
                  <h4 className="text-[10px] font-bold text-purple-400 uppercase tracking-wider">Action Items & Tips</h4>
                  <ul className="space-y-2.5">
                    {analysis.improvements.map((item, idx) => (
                      <li
                        key={idx}
                        className="flex items-start gap-3 text-xs text-slate-300 bg-slate-950/60 p-3.5 rounded-2xl border border-slate-800/80 hover:border-purple-500/20 transition-all duration-200"
                      >
                        <span className="text-purple-400 flex shrink-0 mt-0.5 font-bold text-md leading-none">✓</span>
                        <span className="leading-relaxed">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}