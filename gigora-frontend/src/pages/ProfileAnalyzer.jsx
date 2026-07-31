import React, { useState } from 'react';
import { toast } from 'react-hot-toast';

export default function ProfileAnalyzer({ onActionComplete }) {
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
      // Direct fetch call to eliminate any apiRequest helper bugs
      const res = await fetch('http://localhost:5000/api/profile-analyzer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          profileText: profileText.trim(),
          platform: platform
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || `Server Error (${res.status})`);
      }

      // Read payload safely
      const resultData = data.data || data;

      if (data.success || data.status === 'success' || resultData.score) {
        setAnalysis(resultData);
        toast.success('AI Analysis complete!');
        if (typeof onActionComplete === 'function') {
          onActionComplete();
        }
      } else {
        toast.error(data.message || 'Analysis failed to return valid data.');
      }
    } catch (err) {
      console.error('Profile Analyzer Error:', err);
      toast.error(err.message || 'Failed to connect to backend server.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl">
        <h2 className="text-xl font-bold text-white mb-2">AI Profile Analyzer</h2>
        <p className="text-xs text-slate-400 mb-6">Optimize your freelance profile performance using custom AI feedback.</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2">Target Platform</label>
            <select
              value={platform}
              onChange={(e) => setPlatform(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-white mb-4 focus:outline-none focus:border-purple-500"
            >
              <option value="Fiverr">Fiverr</option>
              <option value="Upwork">Upwork</option>
              <option value="LinkedIn">LinkedIn</option>
            </select>

            <label className="block text-xs font-semibold text-slate-300 mb-2">Profile Description / Overview</label>
            <textarea
              rows="5"
              value={profileText}
              onChange={(e) => setProfileText(e.target.value)}
              placeholder="Paste your gig overview, bio, or profile summary here..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-sm text-white focus:outline-none focus:border-purple-500 transition"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white font-bold py-3 rounded-xl transition text-sm shadow-md flex items-center justify-center space-x-2"
          >
            {loading ? 'Analyzing Profile...' : 'Analyze Profile'}
          </button>
        </form>
      </div>

      {/* Dynamic AI Feedback Section */}
      {analysis && (
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl text-white space-y-4 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <h3 className="font-bold text-lg text-emerald-400">AI Feedback</h3>
            <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-3 py-1 rounded-full text-xs font-mono font-bold">
              Score: {analysis.score || 0} / 100
            </span>
          </div>

          {analysis.summary && (
            <div>
              <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Overall Summary</h4>
              <p className="text-sm text-slate-200 leading-relaxed">{analysis.summary}</p>
            </div>
          )}

          {analysis.improvements && analysis.improvements.length > 0 && (
            <div>
              <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Key Action Items</h4>
              <ul className="space-y-2">
                {analysis.improvements.map((item, idx) => (
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