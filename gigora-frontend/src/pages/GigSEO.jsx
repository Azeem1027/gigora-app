import React, { useState } from 'react';

export default function GigSEO() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleOptimize = async () => {
    if (!title.trim() || !description.trim()) return;
    setLoading(true);
    try {
      const res = await fetch('http://localhost:8000/api/seo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, description }),
      });
      const data = await res.json();
      setResult(data.optimized);
    } catch (err) {
      alert('Error optimizing gig');
    }
    setLoading(false);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-extrabold text-white tracking-tight">Gig SEO Optimizer</h2>
        <p className="text-slate-400 mt-2 text-sm max-w-xl">
          Supercharge your gig listings. Inject high-traffic search terms naturally to boost rankings on platform search results.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* Input Panel */}
        <div className="p-6 bg-slate-900/60 border border-slate-800/80 rounded-2xl shadow-xl space-y-5">
          <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest border-b border-slate-850 pb-3">Original Listing</h3>
          
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Gig Title
            </label>
            <input
              type="text"
              placeholder="e.g. I will design a modern web application in React..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 placeholder-slate-650 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Gig Description
            </label>
            <textarea
              rows="6"
              placeholder="Paste your existing gig description..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-4 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 placeholder-slate-650 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all text-sm leading-relaxed"
            />
          </div>

          <div className="flex justify-end pt-2">
            <button 
              onClick={handleOptimize} 
              disabled={loading || !title.trim() || !description.trim()}
              className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-500/20 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <span>Optimizing Listing...</span>
                </>
              ) : (
                <>
                  <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  <span>Optimize Gig</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Output Panel */}
        <div className="p-6 bg-slate-900/60 border border-slate-800/80 rounded-2xl shadow-xl min-h-[400px] flex flex-col justify-between">
          <div className="space-y-5 flex-1 flex flex-col">
            <div className="flex justify-between items-center border-b border-slate-850 pb-3">
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Optimized Output</h3>
              {result && (
                <button
                  onClick={handleCopy}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                    copied 
                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                      : 'bg-slate-950 hover:bg-slate-850 text-slate-400 hover:text-white border-slate-800 hover:border-slate-700'
                  }`}
                >
                  {copied ? (
                    <>
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                      </svg>
                      <span>Copy Output</span>
                    </>
                  )}
                </button>
              )}
            </div>

            {result ? (
              <div className="flex-1 overflow-y-auto bg-slate-950 border border-slate-850 rounded-xl p-4 text-sm text-slate-300 leading-relaxed font-mono whitespace-pre-wrap max-h-[300px]">
                {result}
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-8 border-2 border-dashed border-slate-850 rounded-xl">
                <div className="w-12 h-12 rounded-2xl bg-slate-950 flex items-center justify-center text-slate-600 mb-4">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <p className="text-slate-500 text-sm">
                  Your optimized SEO description will appear here after clicking "Optimize Gig".
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}