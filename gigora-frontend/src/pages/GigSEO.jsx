import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import { apiRequest } from '../api';

export default function SeoOptimizer({ onActionComplete, triggerLimitModal }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Web Development');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  // Character limit tracking configuration
  const MAX_TITLE_CHARS = 80;
  const isTitleOverLimit = title.length > MAX_TITLE_CHARS;

  const handleOptimize = async (e) => {
    if (e) e.preventDefault();
    if (!title.trim() || !description.trim()) {
      toast.error('Please fill out all fields before submitting.');
      return;
    }

    setLoading(true);
    try {
      const response = await apiRequest('/seo', {
        method: 'POST',
        body: JSON.stringify({ title, description, category }),
      });

      if (response.success) {
        setResult(response.data);
        toast.success('Gig optimized successfully!');
      //  onActionComplete(); // Refresh usage limits banner
      }
    } catch (err) {
      const msg = err.message || '';
      if (msg.includes('Limit reached') || msg.includes('429')) {
        triggerLimitModal();
      } else {
        toast.error(msg || 'Failed to optimize gig SEO parameters.');
      }
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text, fieldName) => {
    navigator.clipboard.writeText(text);
    toast.success(`${fieldName} copied to clipboard!`);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-2xl font-bold text-white">🔍 Gig SEO Optimizer</h1>
        <p className="text-sm text-slate-400">Optimize your Fiverr gig title, tags, and descriptions to match expert search algorithms.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        {/* INPUT FORM BLOCK */}
        <form onSubmit={handleOptimize} className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4">
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-sm font-semibold text-slate-200">Gig Title</label>
              <span className={`text-xs font-bold ${isTitleOverLimit ? 'text-rose-500' : 'text-slate-500'}`}>
                {title.length} / {MAX_TITLE_CHARS} Chars
              </span>
            </div>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., I will build an automated chatbot utilizing gemini api..."
              className={`w-full bg-slate-950 border rounded-xl px-4 py-3 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-purple-500 min-h-[48px] ${isTitleOverLimit ? 'border-rose-500 ring-rose-500/20' : 'border-slate-800'}`}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-200 mb-1.5">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-purple-500 min-h-[48px]"
            >
              <option value="Web Development">Web Development</option>
              <option value="AI and Machine Learning">AI & Machine Learning</option>
              <option value="Cybersecurity">Cybersecurity</option>
              <option value="Graphics Design">Graphics Design</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-200 mb-1.5">Current Raw Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={6}
              placeholder="Paste your raw gig description summary here..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div className="flex space-x-2 pt-2">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 disabled:from-slate-800 disabled:to-slate-800 text-white font-bold h-12 rounded-xl transition shadow-lg shadow-purple-600/10 flex items-center justify-center space-x-2"
            >
              {loading ? (
                <span>Generating Optimization Vectors...</span>
              ) : (
                <><span>🚀 Optimize Gig Features</span></>
              )}
            </button>
            {result && (
              <button
                type="button"
                onClick={handleOptimize}
                className="bg-slate-800 hover:bg-slate-700 text-slate-200 px-4 h-12 rounded-xl border border-slate-700 transition text-sm font-medium"
              >
                🔄 Regenerate
              </button>
            )}
          </div>
        </form>

        {/* RESULTS METRICS GRID PANELS */}
        <div className="space-y-6">
          {loading && (
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4 animate-pulse">
              <div className="h-5 bg-slate-800 rounded w-1/3"></div>
              <div className="space-y-2">
                <div className="h-4 bg-slate-800 rounded w-full"></div>
                <div className="h-4 bg-slate-800 rounded w-5/6"></div>
              </div>
              <div className="h-24 bg-slate-800 rounded w-full"></div>
            </div>
          )}

          {!loading && !result && (
            <div className="bg-slate-900/50 border border-slate-800 border-dashed rounded-2xl p-12 text-center flex flex-col items-center justify-center text-slate-500">
              <span className="text-4xl mb-3">🎯</span>
              <p className="text-sm font-medium">Ready for Optimization</p>
              <p className="text-xs text-slate-600 mt-1">Submit your title and description to run backend keyword quality algorithms.</p>
            </div>
          )}

          {!loading && result && (
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-6">
              {/* SCORE LOGIC BREAKDOWN TRACKERS */}
              <div className="space-y-3 bg-slate-950 p-4 rounded-xl border border-slate-800">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-sm font-bold text-purple-400 uppercase tracking-wide">SEO Score Breakdown</h3>
                  <span className="text-lg font-black text-white">{result.scores.overall_score}%</span>
                </div>

                {/* Title Tracker */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-semibold text-slate-400">
                    <span>Title Strength</span>
                    <span>{result.scores.title_strength}%</span>
                  </div>
                  <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-purple-500 rounded-full transition-all duration-500" style={{ width: `${result.scores.title_strength}%` }}></div>
                  </div>
                </div>

                {/* Tag Tracker */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-semibold text-slate-400">
                    <span>Tag Quality Match</span>
                    <span>{result.scores.tag_quality}%</span>
                  </div>
                  <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 rounded-full transition-all duration-500" style={{ width: `${result.scores.tag_quality}%` }}></div>
                  </div>
                </div>

                {/* Description Tracker */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-semibold text-slate-400">
                    <span>Description Length Optimization</span>
                    <span>{result.scores.description_length}%</span>
                  </div>
                  <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 rounded-full transition-all duration-500" style={{ width: `${result.scores.description_length}%` }}></div>
                  </div>
                </div>
              </div>

              {/* OPTIMIZED TITLE ROW */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold uppercase text-slate-400 tracking-wider">Optimized Title</label>
                  <button onClick={() => copyToClipboard(result.optimized_title, 'Title')} className="text-xs text-purple-400 font-semibold hover:underline">Copy Title</button>
                </div>
                <div className="bg-slate-950 border border-slate-800 p-3 rounded-xl text-sm font-medium text-slate-100">{result.optimized_title}</div>
              </div>

              {/* TAG DISPLAY COMPONENT BADGES */}
              <div className="space-y-2">
                <label className="block text-xs font-bold uppercase text-slate-400 tracking-wider">Validated Search Tags</label>
                <div className="flex flex-wrap gap-2">
                  {result.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className={`text-xs px-3 py-1.5 font-bold rounded-lg border flex items-center space-x-1.5 ${tag.valid ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-rose-500/10 border-rose-500/30 text-rose-400'}`}
                    >
                      <span>{tag.text}</span>
                      <span className="text-[10px] opacity-70">({tag.valid ? 'Valid' : 'Invalid'})</span>
                    </span>
                  ))}
                </div>
              </div>

              {/* OPTIMIZED DESCRIPTION CONTAINER */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold uppercase text-slate-400 tracking-wider">Optimized Description Copy</label>
                  <button onClick={() => copyToClipboard(result.optimized_description, 'Description')} className="text-xs text-purple-400 font-semibold hover:underline">Copy Description</button>
                </div>
                <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl text-sm text-slate-300 max-h-60 overflow-y-auto whitespace-pre-line leading-relaxed">
                  {result.optimized_description}
                </div>
              </div>

              {/* TIPS BULLET ITEMS */}
              <div className="space-y-2 border-t border-slate-800 pt-4">
                <label className="block text-xs font-bold uppercase text-amber-400 tracking-wider">System AI Action Tips</label>
                <ul className="list-disc pl-4 text-xs text-slate-400 space-y-1">
                  {result.tips.map((tip, idx) => <li key={idx}>{tip}</li>)}
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}