import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import { optimizeSeo } from '../api';

export default function GigSEO({ userSessionId, onActionComplete, triggerLimitModal }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Web Development');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const MAX_TITLE_CHARS = 80;
  const isTitleOverLimit = title.length > MAX_TITLE_CHARS;

  const handleOptimize = async (e) => {
    if (e) e.preventDefault();
    if (!title.trim() && !description.trim()) {
      toast.error('Please fill out at least one field before submitting.');
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const data = await optimizeSeo({
        title: title.trim(),
        description: description.trim(),
        category: category,
      }, userSessionId);

      const dataPayload = data.data || data;

      if (data.success || data.status === 'success' || dataPayload.scores) {
        setResult(dataPayload);
        toast.success('Gig optimized successfully!');
        if (typeof onActionComplete === 'function') {
          onActionComplete();
        }
      } else {
        toast.error(data.message || 'Optimization failed to return valid data.');
      }
    } catch (err) {
      console.error('SEO Error:', err);
      const msg = err.message || '';
      if (msg.includes('Limit reached') || msg.includes('429')) {
        if (typeof triggerLimitModal === 'function') {
          triggerLimitModal();
        } else {
          toast.error('Usage limit reached. Please upgrade to Pro.');
        }
      } else {
        toast.error(msg || 'Failed to optimize gig SEO parameters.');
      }
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text, fieldName) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    toast.success(`${fieldName} copied to clipboard!`);
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'from-emerald-500 to-teal-400';
    if (score >= 65) return 'from-indigo-500 to-purple-400';
    return 'from-amber-500 to-yellow-400';
  };

  const getProgressBg = (score) => {
    if (score >= 80) return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/15';
    if (score >= 65) return 'bg-indigo-500/10 text-indigo-400 border-indigo-500/15';
    return 'bg-amber-500/10 text-amber-400 border-amber-500/15';
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Page Header */}
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-black text-white tracking-tight flex items-center gap-2">
          <span>🔍</span> Gig SEO Optimizer
        </h1>
        <p className="text-sm text-slate-400 leading-relaxed">
          Optimize gig titles, tags, and description copy to rank higher in Fiverr or Upwork search algorithms.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* INPUT FORM BLOCK */}
        <form onSubmit={handleOptimize} className="lg:col-span-6 bg-slate-900/60 backdrop-blur-md border border-white/5 p-6 rounded-3xl space-y-5 shadow-xl">
          <div className="border-b border-white/5 pb-4">
            <h3 className="text-md font-bold text-slate-200">SEO Optimizations Parameters</h3>
            <p className="text-xs text-slate-400 font-medium">Input your current draft details to analyze</p>
          </div>

          <div className="space-y-1">
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Gig Title</label>
              <span className={`text-[10px] font-mono font-bold ${isTitleOverLimit ? 'text-rose-500' : 'text-slate-500'}`}>
                {title.length} / {MAX_TITLE_CHARS} chars
              </span>
            </div>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., I will build an automated chatbot utilizing gemini api..."
              className={`w-full bg-slate-950 border rounded-2xl px-4 py-3.5 text-sm text-slate-100 placeholder-slate-650 focus:outline-none focus:ring-4 transition-all duration-300 ${isTitleOverLimit ? 'border-rose-500/80 ring-rose-500/10' : 'border-slate-800 focus:border-purple-500 focus:ring-purple-500/10'}`}
            />
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">Category</label>
            <div className="relative">
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-4 py-3.5 text-sm text-slate-100 focus:outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 transition-all duration-300 appearance-none cursor-pointer"
              >
                <option value="Web Development">Web Development</option>
                <option value="AI and Machine Learning">AI & Machine Learning</option>
                <option value="Cybersecurity">Cybersecurity</option>
                <option value="Graphics Design">Graphics Design</option>
              </select>
              <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-slate-400 text-xs">
                ▼
              </div>
            </div>
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">Current Description Draft</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={6}
              placeholder="Paste your raw gig description summary here..."
              className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-4 py-3.5 text-sm text-slate-100 placeholder-slate-650 focus:outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 transition-all duration-300 resize-y min-h-[120px]"
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
                <span>Calculating SEO Data...</span>
              </span>
            ) : (
              <>
                <span>🚀</span>
                <span>Optimize Gig SEO</span>
              </>
            )}
          </button>
        </form>

        {/* RESULTS PANEL */}
        <div className="lg:col-span-6 space-y-6">
          {loading && (
            <div className="bg-slate-900/40 border border-slate-800 p-6 rounded-3xl space-y-6 animate-pulse">
              <div className="h-6 bg-slate-800 rounded w-1/3"></div>
              <div className="space-y-4">
                <div className="h-3 bg-slate-800 rounded w-full"></div>
                <div className="h-3 bg-slate-800 rounded w-full"></div>
                <div className="h-3 bg-slate-800 rounded w-4/5"></div>
              </div>
              <div className="h-32 bg-slate-800 rounded-2xl w-full"></div>
            </div>
          )}

          {!loading && !result && (
            <div className="bg-slate-900/30 border border-slate-800/60 border-dashed rounded-3xl p-16 text-center flex flex-col items-center justify-center text-slate-500 h-full min-h-[350px]">
              <div className="w-16 h-16 rounded-2xl bg-slate-950 flex items-center justify-center text-3xl mb-4 border border-slate-800 shadow-md">
                🎯
              </div>
              <p className="text-sm font-semibold text-slate-300">Ready for Optimization</p>
              <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
                Submit a title, draft description, and category. The AI will output scores, optimized copies, and highly-targeted rank keywords.
              </p>
            </div>
          )}

          {!loading && result && (
            <div className="bg-slate-900/60 backdrop-blur-md border border-white/5 p-6 rounded-3xl space-y-6 shadow-xl animate-scale-up text-white">
              {/* Score Breakdown Section */}
              {result.scores && (
                <div className="space-y-4 bg-slate-950/60 border border-slate-850 p-4.5 rounded-2xl">
                  <div className="flex justify-between items-center mb-1">
                    <h3 className="text-xs font-bold text-purple-400 uppercase tracking-wide">SEO Score Summary</h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-mono font-bold border ${getProgressBg(result.scores.overall_score || 0)}`}>
                      {result.scores.overall_score || 0}%
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Linear Sub-scores */}
                    {[
                      { label: 'Overall Strength', score: result.scores.overall_score },
                      { label: 'Title Strength', score: result.scores.title_strength },
                      { label: 'Tag Relevance', score: result.scores.tag_quality },
                      { label: 'Description Length', score: result.scores.description_length }
                    ].map((metric, idx) => (
                      <div key={idx} className="space-y-1">
                        <div className="flex justify-between text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
                          <span>{metric.label}</span>
                          <span>{metric.score || 0}%</span>
                        </div>
                        <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden border border-slate-800/80 p-[1px]">
                          <div
                            className={`h-full rounded-full bg-gradient-to-r ${getScoreColor(metric.score || 0)}`}
                            style={{ width: `${metric.score || 0}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Optimized Title */}
              {result.optimized_title && (
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Optimized Title Copy</label>
                    <button
                      type="button"
                      onClick={() => copyToClipboard(result.optimized_title, 'Title')}
                      className="text-xs text-purple-400 font-semibold hover:text-purple-300 transition hover:underline cursor-pointer"
                    >
                      Copy Title
                    </button>
                  </div>
                  <div className="bg-slate-950/80 border border-slate-800 p-3.5 rounded-2xl text-xs font-medium text-slate-100 leading-relaxed border-l-4 border-l-purple-500">
                    {result.optimized_title}
                  </div>
                </div>
              )}

              {/* Keywords / Tags */}
              {result.tags && result.tags.length > 0 && (
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Recommended Search Tags</label>
                    <button
                      type="button"
                      onClick={() => copyToClipboard(result.tags.map(t => t.text).join(', '), 'Tags')}
                      className="text-xs text-purple-400 font-semibold hover:text-purple-300 transition hover:underline cursor-pointer"
                    >
                      Copy All
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {result.tags.map((tag, idx) => (
                      <span
                        key={idx}
                        className={`text-[11px] font-semibold px-2.5 py-1 rounded-xl border flex items-center space-x-1 ${tag.valid !== false ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-slate-800/40 text-slate-400 border-slate-800'}`}
                      >
                        <span>{tag.valid !== false ? '✓' : '•'}</span>
                        <span>{tag.text}</span>
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Optimized Description */}
              {result.optimized_description && (
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Optimized Description Content</label>
                    <button
                      type="button"
                      onClick={() => copyToClipboard(result.optimized_description, 'Description')}
                      className="text-xs text-purple-400 font-semibold hover:text-purple-300 transition hover:underline cursor-pointer"
                    >
                      Copy Content
                    </button>
                  </div>
                  <div className="bg-slate-950/80 border border-slate-800 p-4 rounded-2xl text-xs text-slate-300 max-h-48 overflow-y-auto whitespace-pre-line leading-relaxed font-sans scrollbar-thin">
                    {result.optimized_description}
                  </div>
                </div>
              )}

              {/* Performance Rank Tips */}
              {result.tips && result.tips.length > 0 && (
                <div className="space-y-3 pt-2">
                  <h4 className="text-[10px] font-bold text-purple-400 uppercase tracking-wider">Rank Performance Tips</h4>
                  <div className="grid grid-cols-1 gap-2">
                    {result.tips.map((tip, idx) => (
                      <div key={idx} className="flex items-center space-x-2 text-[11px] text-slate-400 bg-slate-950/40 p-2.5 rounded-xl border border-slate-850">
                        <span className="text-purple-400 font-bold">•</span>
                        <span>{tip}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}