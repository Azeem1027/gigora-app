import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import { apiRequest } from '../api';

export default function ProposalGenerator({ onActionComplete, triggerLimitModal }) {
  const [jobPost, setJobPost] = useState('');
  const [tone, setTone] = useState('professional'); // 'professional', 'friendly', 'confident'
  const [skill, setSkill] = useState('Web Dev');
  const [platform, setPlatform] = useState('Fiverr'); // 'Fiverr', 'Upwork'
  const [length, setLength] = useState('medium'); // 'short', 'medium', 'long'
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleGenerate = async (e) => {
    if (e) e.preventDefault();
    if (!jobPost.trim()) {
      toast.error('Please paste a client job posting description first.');
      return;
    }

    setLoading(true);
    try {
      const response = await apiRequest('/proposal', {
        method: 'POST',
        body: JSON.stringify({ job_post: jobPost, tone, skill, platform, length }),
      });

      if (response.success) {
        setResult(response.data);
        toast.success('Proposal drafted beautifully!');
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

  const handleDownloadTxt = () => {
    if (!result || !result.proposal) return;

    const timestamp = new Date().toISOString().split('T')[0];
    const element = document.createElement("a");
    const file = new Blob([result.proposal], { type: 'text/plain;charset=utf-8' });

    element.href = URL.createObjectURL(file);
    element.download = `proposal-${timestamp}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    toast.success('Proposal downloaded as text file!');
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success('Proposal text copied!');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-2xl font-bold text-white">📝 Smart Proposal Generator</h1>
        <p className="text-sm text-slate-400">Draft personalized, high-converting freelance bidding templates based on specific job openings.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        {/* OPTIONS & FORM INPUT CONTROLS */}
        <form onSubmit={handleGenerate} className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-5">

          {/* TONE SELECTION BUTTONS */}
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Select Copy Tone</label>
            <div className="grid grid-cols-3 gap-2">
              {['professional', 'friendly', 'confident'].map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTone(t)}
                  className={`capitalize py-2.5 rounded-xl text-xs font-semibold border transition-all duration-200 ${tone === t ? 'bg-purple-600 border-purple-500 text-white shadow-md shadow-purple-600/20' : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'}`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* CHIP PLATFORM TOGGLE BOX */}
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Target Platform</label>
            <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800">
              {['Fiverr', 'Upwork'].map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPlatform(p)}
                  className={`flex-1 py-2 rounded-lg text-xs font-bold transition ${platform === p ? 'bg-slate-800 text-purple-400 border border-slate-700/60' : 'text-slate-500 hover:text-slate-300'}`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          {/* SKILLS MULTI-DROPDOWN MENU */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Domain Specialty</label>
              <select
                value={skill}
                onChange={(e) => setSkill(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-purple-500 min-h-[44px]"
              >
                <option value="Web Dev">Web Dev</option>
                <option value="Graphic Design">Graphic Design</option>
                <option value="Writing">Writing</option>
                <option value="Marketing">Marketing</option>
                <option value="Mobile Dev">Mobile Dev</option>
                <option value="AI/ML">AI / ML</option>
                <option value="Other">Other Specialty</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Length Control</label>
              <select
                value={length}
                onChange={(e) => setLength(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-purple-500 min-h-[44px]"
              >
                <option value="short">Short (~100 words)</option>
                <option value="medium">Medium (~200 words)</option>
                <option value="long">Long (~300 words)</option>
              </select>
            </div>
          </div>

          {/* INPUT POST DETAILS */}
          <div>
            <label className="block text-sm font-semibold text-slate-200 mb-1.5">Client Job Specification Post</label>
            <textarea
              value={jobPost}
              onChange={(e) => setJobPost(e.target.value)}
              rows={5}
              placeholder="Paste the core requirements or Upwork/Fiverr custom offer description details here..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div className="flex space-x-2 pt-1">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 disabled:from-slate-800 disabled:to-slate-800 text-white font-bold h-12 rounded-xl transition shadow-lg flex items-center justify-center space-x-2 text-sm"
            >
              {loading ? <span>Assembling Few-Shot Blueprint Models...</span> : <span>✨ Draft Proposal Portfolio</span>}
            </button>
            {result && (
              <button
                type="button"
                onClick={handleGenerate}
                className="bg-slate-800 hover:bg-slate-700 text-slate-200 px-4 h-12 rounded-xl border border-slate-700 transition text-sm font-medium"
              >
                🔄
              </button>
            )}
          </div>
        </form>

        {/* PROPOSAL RESPONSE RENDERING GRID */}
        <div className="space-y-6">
          {loading && (
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4 animate-pulse">
              <div className="h-4 bg-slate-800 rounded w-1/4"></div>
              <div className="space-y-2">
                <div className="h-4 bg-slate-800 rounded w-full"></div>
                <div className="h-4 bg-slate-800 rounded w-5/6"></div>
                <div className="h-4 bg-slate-800 rounded w-4/5"></div>
              </div>
            </div>
          )}

          {!loading && !result && (
            <div className="bg-slate-900/50 border border-slate-800 border-dashed rounded-2xl p-12 text-center flex flex-col items-center justify-center text-slate-500">
              <span className="text-4xl mb-3">📄</span>
              <p className="text-sm font-medium">Ready for Generation</p>
              <p className="text-xs text-slate-600 mt-1">Configure your tone matching styles above to compile specialized bid cards.</p>
            </div>
          )}

          {!loading && result && (
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-5">
              <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                <div>
                  <h3 className="text-xs font-bold uppercase text-slate-400 tracking-wider">Generated Copy</h3>
                  <p className="text-[11px] text-slate-500 mt-0.5">Calculated Length: <strong className="text-purple-400">{result.word_count}</strong> words</p>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => copyToClipboard(result.proposal)}
                    className="bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs px-3 py-1.5 rounded-lg border border-slate-700 transition font-medium"
                  >
                    📋 Copy Text
                  </button>
                  <button
                    onClick={handleDownloadTxt}
                    className="bg-purple-600/20 hover:bg-purple-600 text-purple-300 hover:text-white text-xs px-3 py-1.5 rounded-lg border border-purple-500/30 transition font-medium"
                  >
                    💾 Save .TXT File
                  </button>
                </div>
              </div>

              {/* LIVE RESPONSE BOX */}
              <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl text-sm text-slate-200 whitespace-pre-line leading-relaxed max-h-80 overflow-y-auto font-mono">
                {result.proposal}
              </div>

              {/* RECOVERY CHIP SELLING BADGES */}
              <div className="space-y-2 pt-2">
                <label className="block text-xs font-bold uppercase text-emerald-400 tracking-wider">Extracted Pitch Pillars</label>
                <div className="flex flex-wrap gap-2">
                  {result.key_points.map((point, i) => (
                    <span key={i} className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs px-3 py-1 rounded-full font-medium">
                      ✓ {point}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}