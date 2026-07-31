import React, { useState } from 'react';
import { toast } from 'react-hot-toast';

export default function ProposalGenerator({ onActionComplete }) {
  const [jobDescription, setJobDescription] = useState('');
  const [tone, setTone] = useState('Professional');
  const [skill, setSkill] = useState('Web Development');
  const [platform, setPlatform] = useState('Upwork');
  const [length, setLength] = useState('Medium');
  const [loading, setLoading] = useState(false);
  const [proposalData, setProposalData] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!jobDescription.trim()) {
      toast.error('Please paste a job description.');
      return;
    }

    setLoading(true);
    setProposalData(null);

    try {
      const res = await fetch('http://localhost:5000/api/proposal', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          jobDescription: jobDescription.trim(),
          tone,
          skill,
          platform,
          length,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || `Server Error (${res.status})`);
      }

      const resultData = data.data || data;

      if (data.success || data.status === 'success' || resultData.proposal) {
        setProposalData(resultData);
        toast.success('Proposal generated!');
        if (typeof onActionComplete === 'function') {
          onActionComplete();
        }
      } else {
        toast.error(data.message || 'Failed to generate proposal.');
      }
    } catch (err) {
      console.error('Proposal Generator Error:', err);
      toast.error(err.message || 'Failed to connect to backend server.');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (!proposalData?.proposal) return;
    navigator.clipboard.writeText(proposalData.proposal);
    toast.success('Proposal copied to clipboard!');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl">
        <h2 className="text-xl font-bold text-white mb-2">AI Proposal Generator</h2>
        <p className="text-xs text-slate-400 mb-6">Create tailored, high-converting proposals for client postings.</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2">Platform</label>
              <select
                value={platform}
                onChange={(e) => setPlatform(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-purple-500"
              >
                <option value="Upwork">Upwork</option>
                <option value="Fiverr">Fiverr Buyer Request</option>
                <option value="Freelancer">Freelancer</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2">Tone</label>
              <select
                value={tone}
                onChange={(e) => setTone(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-purple-500"
              >
                <option value="Professional">Professional</option>
                <option value="Friendly">Friendly & Approachable</option>
                <option value="Direct">Direct & Concise</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2">Length</label>
              <select
                value={length}
                onChange={(e) => setLength(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-purple-500"
              >
                <option value="Short">Short & Punchy</option>
                <option value="Medium">Medium (Standard)</option>
                <option value="Detailed">Detailed & Comprehensive</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2">Job Description</label>
            <textarea
              rows="5"
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Paste the client's job post requirements here..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-sm text-white focus:outline-none focus:border-purple-500 transition"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white font-bold py-3 rounded-xl transition text-sm shadow-md flex items-center justify-center space-x-2"
          >
            {loading ? 'Generating Proposal...' : 'Generate Proposal'}
          </button>
        </form>
      </div>

      {/* Generated Proposal Output */}
      {proposalData && (
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl text-white space-y-4 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <h3 className="font-bold text-lg text-emerald-400">Generated Proposal</h3>
            <button
              onClick={copyToClipboard}
              className="bg-purple-600/20 text-purple-400 border border-purple-500/30 hover:bg-purple-600/30 px-3 py-1.5 rounded-xl text-xs font-semibold transition"
            >
              📋 Copy Proposal
            </button>
          </div>

          <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl text-sm text-slate-200 whitespace-pre-line leading-relaxed font-sans">
            {proposalData.proposal}
          </div>

          {proposalData.keyHighlights && proposalData.keyHighlights.length > 0 && (
            <div>
              <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Proposal Key Highlights</h4>
              <ul className="space-y-2">
                {proposalData.keyHighlights.map((item, idx) => (
                  <li key={idx} className="flex items-start space-x-2 text-xs text-slate-300 bg-slate-950 p-3 rounded-xl border border-slate-800">
                    <span className="text-purple-400 font-bold">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}