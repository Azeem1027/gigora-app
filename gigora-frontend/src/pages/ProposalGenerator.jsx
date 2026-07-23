import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import { apiRequest } from '../api';

export default function ProposalGenerator({ onActionComplete, triggerLimitModal }) {
  const [jobPost, setJobPost] = useState('');
  const [tone, setTone] = useState('professional');
  const [skill, setSkill] = useState('Web Development');
  const [platform, setPlatform] = useState('Fiverr');
  const [length, setLength] = useState('medium');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [showAll, setShowAll] = useState(false);

  const handleGenerate = async (e) => {
    if (e) e.preventDefault();
    if (!jobPost.trim()) {
      toast.error('Please paste a client job posting description first.');
      return;
    }

    setLoading(true);
    setShowAll(false);
    try {
      const response = await apiRequest('/proposal', {
        method: 'POST',
        body: JSON.stringify({ job_post: jobPost, tone, skill, platform, length }),
      });

      if (response.success) {
        setResult(response.data);
        toast.success('Generated proposals using 3 AI models!');
        onActionComplete();
      }
    } catch (err) {
      const msg = err.message || '';
      if (msg.includes('Limit reached') || msg.includes('429')) {
        triggerLimitModal();
      } else {
        toast.error(msg || 'Failed to generate your matching proposal.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadTxt = (text) => {
    const timestamp = new Date().toISOString().split('T')[0];
    const element = document.createElement("a");
    const file = new Blob([text], { type: 'text/plain;charset=utf-8' });
    element.href = URL.createObjectURL(file);
    element.download = `proposal-${timestamp}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    toast.success('Proposal downloaded!');
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard!');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-2xl font-bold text-white">📝 Smart Proposal Generator</h1>
        <p className="text-sm text-slate-400">Comparing 3 AI models to find the perfect bid.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        {/* FORM INPUT CONTROLS */}
        <form onSubmit={handleGenerate} className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-5">
          <div>
            <label className="block text-sm font-semibold text-slate-200 mb-1.5">Job Posting Description</label>
            <textarea
              value={jobPost}
              onChange={(e) => setJobPost(e.target.value)}
              rows={6}
              placeholder="Paste the client's job requirements here..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-200 mb-1.5">Tone</label>
              <select value={tone} onChange={(e) => setTone(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-100">
                <option value="professional">Professional</option>
                <option value="casual">Casual</option>
                <option value="persuasive">Persuasive</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-200 mb-1.5">Skill</label>
              <select value={skill} onChange={(e) => setSkill(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-100">
                <option value="Web Development">Web Dev</option>
                <option value="AI">AI/ML</option>
                <option value="Design">Design</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 disabled:opacity-50 text-white font-bold h-12 rounded-xl transition"
          >
            {loading ? 'Generating...' : '🚀 Generate Proposal'}
          </button>
        </form>

        {/* RESPONSE GRID */}
        <div className="space-y-6">
          {loading && (
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4 animate-pulse">
              <div className="h-4 bg-slate-800 rounded w-1/4"></div>
              <div className="space-y-2">
                <div className="h-4 bg-slate-800 rounded w-full"></div>
                <div className="h-4 bg-slate-800 rounded w-5/6"></div>
              </div>
            </div>
          )}

          {/* IDLE STATE: Shown when no results yet */}
          {!loading && !result && (
            <div className="bg-slate-900/50 border border-slate-800 border-dashed rounded-2xl p-12 text-center flex flex-col items-center justify-center text-slate-500">
              <span className="text-4xl mb-3">📝</span>
              <p className="text-sm font-medium text-slate-300">Ready to Generate</p>
              <p className="text-xs text-slate-500 mt-1">Paste a job description to generate your bid.</p>
            </div>
          )}

          {!loading && result && (
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-5">
              <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800 mb-4">
                <button 
                  onClick={() => setShowAll(false)}
                  className={`flex-1 py-2 rounded-lg text-xs font-bold transition ${!showAll ? 'bg-purple-600 text-white' : 'text-slate-500'}`}
                >
                  Best Result
                </button>
                <button 
                  onClick={() => setShowAll(true)}
                  className={`flex-1 py-2 rounded-lg text-xs font-bold transition ${showAll ? 'bg-purple-600 text-white' : 'text-slate-500'}`}
                >
                  Compare All
                </button>
              </div>

              {!showAll ? (
                <div>
                  <div className="flex justify-between items-center border-b border-slate-800 pb-3 mb-3">
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Top Choice</h3>
                    <div className="flex space-x-2">
                      <button onClick={() => copyToClipboard(result.proposal)} className="text-[10px] bg-slate-800 px-2 py-1 rounded">📋 Copy</button>
                      <button onClick={() => handleDownloadTxt(result.proposal)} className="text-[10px] bg-purple-600/20 px-2 py-1 rounded">💾 Save</button>
                    </div>
                  </div>
                  <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl text-sm text-slate-200 font-mono whitespace-pre-line max-h-80 overflow-y-auto">
                    {result.proposal}
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {result.all_results?.map((item, idx) => (
                    <div key={idx} className="bg-slate-950 border border-slate-800 p-4 rounded-xl space-y-2">
                      <div className="flex justify-between">
                         <span className="text-xs font-bold text-purple-400">{item.model}</span>
                         <button onClick={() => copyToClipboard(item.proposal)} className="text-[10px] text-slate-500 hover:text-white">Copy</button>
                      </div>
                      <p className="text-xs text-slate-300 line-clamp-3">{item.proposal}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}