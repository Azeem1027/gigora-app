import React, { useState } from 'react';

export default function ProfileAnalyzer() {
  const [profileText, setProfileText] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async () => {
    if (!profileText.trim()) return;
    setLoading(true);
    try {
      const res = await fetch('http://localhost:8000/api/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ profile_text: profileText }),
      });
      const data = await res.json();
      setResult(data);
    } catch (err) {
      alert('Error analyzing profile');
    }
    setLoading(false);
  };

  const getScoreColor = (score) => {
    if (score >= 8) return 'text-emerald-400 stroke-emerald-500';
    if (score >= 5) return 'text-amber-400 stroke-amber-500';
    return 'text-rose-400 stroke-rose-500';
  };

  const getScoreBadge = (score) => {
    if (score >= 8) return 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20';
    if (score >= 5) return 'bg-amber-500/10 text-amber-400 border border-amber-500/20';
    return 'bg-rose-500/10 text-rose-400 border border-rose-500/20';
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-extrabold text-white tracking-tight">Profile Analyzer</h2>
        <p className="text-slate-400 mt-2 text-sm max-w-xl">
          Get algorithmic feedback on your Upwork or Fiverr profile bio. Improve structure, positioning, and keywords.
        </p>
      </div>

      {/* Input Card */}
      <div className="p-6 bg-slate-900/60 border border-slate-800/80 rounded-2xl shadow-xl">
        <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
          Profile Description
        </label>
        <textarea
          rows="6"
          placeholder="Paste your Fiverr/Upwork profile description here..."
          value={profileText}
          onChange={(e) => setProfileText(e.target.value)}
          className="w-full p-4 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 placeholder-slate-650 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all text-sm leading-relaxed"
        />
        
        <div className="mt-4 flex justify-between items-center">
          <span className="text-xs text-slate-500">
            {profileText.length} characters
          </span>
          <button 
            onClick={handleAnalyze} 
            disabled={loading || !profileText.trim()}
            className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-500/20 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed text-sm"
          >
            {loading ? (
              <>
                <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                <span>Analyzing Description...</span>
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                <span>Analyze Profile</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Analysis Results */}
      {result && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start animate-fade-in">
          {/* Score Card Panel */}
          <div className="p-6 bg-slate-900/60 border border-slate-800/80 rounded-2xl shadow-xl flex flex-col items-center text-center">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-6">Profile Quality Score</h3>
            
            <div className="relative w-40 h-40 flex items-center justify-center">
              {/* Score SVG Gauge */}
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-slate-800"
                  strokeWidth="2.5"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className={getScoreColor(result.score)}
                  strokeWidth="2.5"
                  strokeDasharray={`${result.score * 10}, 100`}
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <div className="absolute flex flex-col items-center">
                <span className="text-4xl font-extrabold text-white">{result.score}</span>
                <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">out of 10</span>
              </div>
            </div>

            <span className={`mt-6 px-3 py-1 rounded-full text-xs font-extrabold tracking-wider ${getScoreBadge(result.score)}`}>
              {result.score >= 8 ? 'OPTIMIZED PROFILE' : result.score >= 5 ? 'NEEDS ADJUSTMENT' : 'CRITICAL UPGRADE NEEDED'}
            </span>
          </div>

          {/* Details Panel */}
          <div className="lg:col-span-2 space-y-6">
            {/* Strengths */}
            <div className="p-6 bg-slate-900/40 border border-slate-800/80 rounded-2xl shadow-lg">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                  <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h4 className="text-base font-bold text-white">Identified Strengths</h4>
              </div>
              <ul className="space-y-2.5">
                {result.strengths && result.strengths.length > 0 ? (
                  result.strengths.map((s, i) => (
                    <li key={i} className="text-sm text-slate-300 leading-relaxed flex items-start gap-2.5">
                      <span className="text-emerald-500 mt-1 select-none">•</span>
                      <span>{s}</span>
                    </li>
                  ))
                ) : (
                  <li className="text-sm text-slate-500 italic">No key strengths detected. Try adding more specific achievements or skills.</li>
                )}
              </ul>
            </div>

            {/* Weaknesses */}
            <div className="p-6 bg-slate-900/40 border border-slate-800/80 rounded-2xl shadow-lg">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-7 h-7 rounded-lg bg-rose-500/10 text-rose-400 flex items-center justify-center">
                  <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <h4 className="text-base font-bold text-white">Areas to Improve</h4>
              </div>
              <ul className="space-y-2.5">
                {result.weaknesses && result.weaknesses.length > 0 ? (
                  result.weaknesses.map((w, i) => (
                    <li key={i} className="text-sm text-slate-300 leading-relaxed flex items-start gap-2.5">
                      <span className="text-rose-500 mt-1 select-none">•</span>
                      <span>{w}</span>
                    </li>
                  ))
                ) : (
                  <li className="text-sm text-slate-500 italic">No major issues found. Nice job!</li>
                )}
              </ul>
            </div>

            {/* Suggestions */}
            <div className="p-6 bg-slate-900/40 border border-slate-800/80 rounded-2xl shadow-lg">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-7 h-7 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
                  <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <h4 className="text-base font-bold text-white">Actionable Suggestions</h4>
              </div>
              <ul className="space-y-2.5">
                {result.suggestions && result.suggestions.length > 0 ? (
                  result.suggestions.map((s, i) => (
                    <li key={i} className="text-sm text-slate-300 leading-relaxed flex items-start gap-2.5">
                      <span className="text-indigo-400 mt-1 select-none">•</span>
                      <span>{s}</span>
                    </li>
                  ))
                ) : (
                  <li className="text-sm text-slate-500 italic">No additional suggestions. Your description matches all benchmarks.</li>
                )}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}