import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import { generateProposal } from '../api';

export default function ProposalGenerator({ userSessionId, onActionComplete, triggerLimitModal }) {
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

    if (!skill.trim()) {
      toast.error('Please input your target skill.');
      return;
    }

    setLoading(true);
    setProposalData(null);

    try {
      const data = await generateProposal({
        jobDescription: jobDescription.trim(),
        tone,
        skill: skill.trim(),
        platform,
        length,
      }, userSessionId);

      const resultData = data.data || data;

      if (data.success || data.status === 'success' || resultData.proposal) {
        setProposalData(resultData);
        toast.success('AI Proposal generated successfully!');
        if (typeof onActionComplete === 'function') {
          onActionComplete();
        }
      } else {
        toast.error(data.message || 'Failed to generate proposal.');
      }
    } catch (err) {
      console.error('Proposal Generator Error:', err);
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

  const copyToClipboard = () => {
    if (!proposalData?.proposal) return;
    navigator.clipboard.writeText(proposalData.proposal);
    toast.success('Proposal copied to clipboard!');
  };

  const getWordCount = (text) => {
    if (!text) return 0;
    return text.trim().split(/\s+/).filter(w => w.length > 0).length;
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
      {/* Page Title */}
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-black text-white tracking-tight flex items-center gap-2">
          <span>📝</span> AI Proposal Generator
        </h1>
        <p className="text-sm text-slate-400 leading-relaxed">
          Instantly generate customized, high-converting proposals tailored to specific client postings and platforms.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* INPUT FORM BLOCK */}
        <div className="lg:col-span-12 bg-slate-900/60 backdrop-blur-md border border-white/5 p-6 rounded-3xl shadow-xl space-y-6">
          <div className="border-b border-white/5 pb-4">
            <h3 className="text-md font-bold text-slate-200">Proposal Configuration</h3>
            <p className="text-xs text-slate-400">Configure parameters to customize the AI proposal tone and context</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">Platform</label>
                <div className="relative">
                  <select
                    value={platform}
                    onChange={(e) => setPlatform(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-4 py-3 text-sm text-white focus:outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 transition-all duration-300 appearance-none cursor-pointer"
                  >
                    <option value="Upwork">Upwork</option>
                    <option value="Fiverr">Fiverr Buyer Request</option>
                    <option value="Freelancer">Freelancer</option>
                  </select>
                  <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-slate-400 text-xs">
                    ▼
                  </div>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">Tone</label>
                <div className="relative">
                  <select
                    value={tone}
                    onChange={(e) => setTone(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-4 py-3 text-sm text-white focus:outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 transition-all duration-300 appearance-none cursor-pointer"
                  >
                    <option value="Professional">Professional</option>
                    <option value="Friendly">Friendly & Approachable</option>
                    <option value="Direct">Direct & Concise</option>
                  </select>
                  <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-slate-400 text-xs">
                    ▼
                  </div>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">Length</label>
                <div className="relative">
                  <select
                    value={length}
                    onChange={(e) => setLength(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-4 py-3 text-sm text-white focus:outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 transition-all duration-300 appearance-none cursor-pointer"
                  >
                    <option value="Short">Short & Punchy</option>
                    <option value="Medium">Medium (Standard)</option>
                    <option value="Detailed">Detailed & Comprehensive</option>
                  </select>
                  <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-slate-400 text-xs">
                    ▼
                  </div>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">Core Skill Focus</label>
                <input
                  type="text"
                  value={skill}
                  onChange={(e) => setSkill(e.target.value)}
                  placeholder="e.g. Web Development"
                  className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-4 py-3 text-sm text-white focus:outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 transition-all duration-300 placeholder-slate-600"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">Job Posting / Description</label>
              <textarea
                rows="6"
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Paste the client's job requirements or gig posting description details here..."
                className="w-full bg-slate-950 border border-slate-800 focus:border-purple-500/80 rounded-2xl p-4 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:ring-4 focus:ring-purple-500/10 transition-all duration-300 resize-y min-h-[140px]"
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
                  <span>Generating Custom Proposal...</span>
                </span>
              ) : (
                <>
                  <span>📝</span>
                  <span>Generate AI Proposal</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Dynamic AI Proposal Section */}
        <div className="lg:col-span-12 space-y-6">
          {loading && (
            <div className="bg-slate-900/40 border border-slate-800/80 p-8 rounded-3xl space-y-6 animate-pulse">
              <div className="flex justify-between items-center pb-4 border-b border-slate-800">
                <div className="h-6 bg-slate-800 rounded w-1/3"></div>
                <div className="h-8 bg-slate-800 rounded w-20"></div>
              </div>
              <div className="space-y-3">
                <div className="h-4 bg-slate-800 rounded w-full"></div>
                <div className="h-4 bg-slate-800 rounded w-full"></div>
                <div className="h-4 bg-slate-800 rounded w-4/5"></div>
              </div>
            </div>
          )}

          {!loading && !proposalData && (
            <div className="bg-slate-900/30 border border-slate-800/60 border-dashed rounded-3xl p-16 text-center flex flex-col items-center justify-center text-slate-500 min-h-[250px]">
              <div className="w-16 h-16 rounded-2xl bg-slate-950 flex items-center justify-center text-3xl mb-4 border border-slate-800 shadow-md">
                📄
              </div>
              <p className="text-sm font-semibold text-slate-300">Ready to Draft</p>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                Select your parameters, paste the job details, and type your main skills to trigger a highly relevant proposal draft.
              </p>
            </div>
          )}

          {!loading && proposalData && (
            <div className="bg-slate-900/60 backdrop-blur-md border border-white/5 p-6 rounded-3xl text-white space-y-6 shadow-xl animate-scale-up">
              {/* Header Info */}
              <div className="flex items-center justify-between border-b border-white/5 pb-4">
                <div className="space-y-0.5">
                  <h3 className="font-bold text-lg text-white">Generated Proposal</h3>
                  <div className="flex items-center space-x-2 text-[10px] uppercase font-bold text-slate-400 font-mono tracking-wider">
                    <span>{platform}</span>
                    <span>•</span>
                    <span>{tone} Tone</span>
                    <span>•</span>
                    <span>{length} Length</span>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <span className="text-[10px] text-slate-450 bg-slate-950 border border-slate-850 px-2.5 py-1 rounded-xl font-mono">
                    {getWordCount(proposalData.proposal)} Words / {proposalData.proposal?.length || 0} Chars
                  </span>
                  <button
                    type="button"
                    onClick={copyToClipboard}
                    className="bg-purple-600/10 hover:bg-purple-600/25 text-purple-400 hover:text-purple-300 border border-purple-500/20 hover:border-purple-500/40 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer"
                  >
                    📋 Copy Proposal
                  </button>
                </div>
              </div>

              {/* Proposal Content Body */}
              <div className="bg-slate-950/80 border border-slate-800 p-5 rounded-2xl text-slate-200 text-xs whitespace-pre-line leading-relaxed font-sans border-l-4 border-l-purple-500 max-h-[450px] overflow-y-auto scrollbar-thin">
                {proposalData.proposal}
              </div>

              {/* Highlights cards */}
              {proposalData.keyHighlights && proposalData.keyHighlights.length > 0 && (
                <div className="space-y-3">
                  <h4 className="text-[10px] font-bold text-purple-400 uppercase tracking-wider">Proposal Strategy Highlights</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {proposalData.keyHighlights.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex items-start gap-3 text-xs text-slate-350 bg-slate-950/40 p-3.5 rounded-2xl border border-slate-800/80 hover:border-purple-500/10 transition-all duration-200"
                      >
                        <span className="text-purple-400 font-bold text-sm">✦</span>
                        <span className="leading-relaxed font-medium">{item}</span>
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