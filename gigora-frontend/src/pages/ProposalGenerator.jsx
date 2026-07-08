import React, { useState } from 'react';

export default function ProposalGenerator({ userToken }) {
  const [jobPost, setJobPost] = useState('');
  const [proposal, setProposal] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleGenerate = async () => {
    if (!jobPost.trim()) return;
    setLoading(true);
    try {
      const res = await fetch('http://localhost:8000/api/proposal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ job_post: jobPost, user_id: userToken }),
      });
      const data = await res.json();
      setProposal(data.proposal);
    } catch (err) {
      alert('Error generating proposal');
    }
    setLoading(false);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(proposal);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-extrabold text-white tracking-tight">Proposal Generator</h2>
        <p className="text-slate-400 mt-2 text-sm max-w-xl">
          Instantly craft high-converting proposals. Paste the client's job requirements and get an custom application ready to send.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* Input Card */}
        <div className="p-6 bg-slate-900/60 border border-slate-800/80 rounded-2xl shadow-xl space-y-5">
          <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest border-b border-slate-850 pb-3">Job Details</h3>
          
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Job Description / Post
            </label>
            <textarea
              rows="7"
              placeholder="Paste the job description from Upwork, Fiverr, or Freelancer here..."
              value={jobPost}
              onChange={(e) => setJobPost(e.target.value)}
              className="w-full p-4 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 placeholder-slate-650 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all text-sm leading-relaxed"
            />
          </div>

          <div className="flex justify-end">
            <button 
              onClick={handleGenerate} 
              disabled={loading || !jobPost.trim()}
              className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-500/20 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <span>Generating Proposal...</span>
                </>
              ) : (
                <>
                  <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                  <span>Generate Proposal</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Output Card */}
        <div className="p-6 bg-slate-900/60 border border-slate-800/80 rounded-2xl shadow-xl min-h-[440px] flex flex-col justify-between">
          <div className="space-y-5 flex-1 flex flex-col">
            <div className="flex justify-between items-center border-b border-slate-850 pb-3">
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Tailored Proposal</h3>
              {proposal && (
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
                      <span>Copy Proposal</span>
                    </>
                  )}
                </button>
              )}
            </div>

            {proposal ? (
              <div className="flex-1 overflow-y-auto bg-slate-950 border border-slate-850 rounded-xl p-5 text-sm text-slate-350 leading-relaxed font-sans whitespace-pre-wrap max-h-[340px]">
                {proposal}
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-8 border-2 border-dashed border-slate-850 rounded-xl">
                <div className="w-12 h-12 rounded-2xl bg-slate-950 flex items-center justify-center text-slate-600 mb-4">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <p className="text-slate-500 text-sm">
                  Your customized proposal will appear here after clicking "Generate Proposal".
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}