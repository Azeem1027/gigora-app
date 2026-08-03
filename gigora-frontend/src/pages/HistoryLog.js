import React, { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-hot-toast';
import { apiRequest, deleteHistoryItem } from '../api';

const ACTION_LABELS = {
  profile_analysis: { label: 'Profile Analysis', icon: '👤', color: 'text-indigo-400', bg: 'bg-indigo-500/10 border-indigo-500/20' },
  proposal_generation: { label: 'Proposal Generation', icon: '📝', color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20' },
  seo_optimization: { label: 'SEO Optimization', icon: '🔍', color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/20' },
};

const TABS = [
  { id: 'all', label: 'All Activity' },
  { id: 'profile_analysis', label: 'Profile' },
  { id: 'proposal_generation', label: 'Proposals' },
  { id: 'seo_optimization', label: 'SEO' },
];

function formatDate(iso) {
  if (!iso) return '—';
  const d = new Date(iso);
  return d.toLocaleString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
    hour: '2-digit', minute: '2-digit', hour12: true
  });
}

function HistoryCard({ item, onDelete }) {
  const [expanded, setExpanded] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const meta = ACTION_LABELS[item.action] || { label: item.action, icon: '📋', color: 'text-slate-400', bg: 'bg-slate-800 border-slate-700' };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await onDelete(item.id);
    } finally {
      setDeleting(false);
    }
  };

  const copyText = (text, label) => {
    if (!text) return;
    navigator.clipboard.writeText(typeof text === 'object' ? JSON.stringify(text, null, 2) : text);
    toast.success(`${label} copied!`);
  };

  const renderOutput = (output) => {
    if (!output) return null;

    if (output.score !== undefined) {
      return (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Profile Score</span>
            <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
              {output.score} / 100
            </span>
          </div>
          {output.summary && (
            <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/50 p-3 rounded-xl border border-slate-800/60">
              {output.summary}
            </p>
          )}
          {output.improvements && output.improvements.length > 0 && (
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Improvements</span>
                <button onClick={() => copyText(output.improvements.join('\n'), 'Improvements')} className="text-[10px] text-indigo-400 hover:text-indigo-300 font-semibold cursor-pointer">Copy All</button>
              </div>
              {output.improvements.map((tip, i) => (
                <div key={i} className="flex items-start gap-2 text-xs text-slate-300 bg-slate-950/40 p-2.5 rounded-xl border border-slate-800/50">
                  <span className="text-indigo-400 font-bold shrink-0">•</span>
                  <span>{tip}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      );
    }

    if (output.proposal) {
      return (
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Generated Proposal</span>
            <button onClick={() => copyText(output.proposal, 'Proposal')} className="text-[10px] text-indigo-400 hover:text-indigo-300 font-semibold cursor-pointer">Copy Proposal</button>
          </div>
          <div className="bg-slate-950/70 border border-slate-800 p-3.5 rounded-xl text-xs text-slate-300 whitespace-pre-line leading-relaxed max-h-56 overflow-y-auto border-l-4 border-l-emerald-500">
            {output.proposal}
          </div>
          {output.keyHighlights && output.keyHighlights.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {output.keyHighlights.map((h, i) => (
                <div key={i} className="flex items-start gap-2 text-xs text-slate-300 bg-slate-950/40 p-2.5 rounded-xl border border-slate-800/50">
                  <span className="text-emerald-400 font-bold shrink-0">✦</span>
                  <span>{h}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      );
    }

    if (output.scores) {
      return (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">SEO Scores</span>
            <span className="text-xs font-mono font-bold text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-full border border-amber-500/20">
              {output.scores.overall_score || 0}%
            </span>
          </div>
          {output.optimized_title && (
            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <span className="text-[10px] text-slate-400 font-semibold">Optimized Title</span>
                <button onClick={() => copyText(output.optimized_title, 'Title')} className="text-[10px] text-indigo-400 hover:text-indigo-300 font-semibold cursor-pointer">Copy</button>
              </div>
              <div className="bg-slate-950/60 border border-slate-800 border-l-4 border-l-amber-500 p-2.5 rounded-xl text-xs font-medium text-slate-200">
                {output.optimized_title}
              </div>
            </div>
          )}
          {output.tags && output.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {output.tags.map((t, i) => (
                <span key={i} className={`text-[10px] font-semibold px-2 py-0.5 rounded-lg border ${t.valid !== false ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' : 'bg-slate-800 text-slate-400 border-slate-700'}`}>
                  {t.text}
                </span>
              ))}
            </div>
          )}
          {output.optimized_description && (
            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <span className="text-[10px] text-slate-400 font-semibold">Optimized Description</span>
                <button onClick={() => copyText(output.optimized_description, 'Description')} className="text-[10px] text-indigo-400 hover:text-indigo-300 font-semibold cursor-pointer">Copy</button>
              </div>
              <div className="bg-slate-950/60 border border-slate-800 p-2.5 rounded-xl text-xs text-slate-300 max-h-36 overflow-y-auto whitespace-pre-line leading-relaxed">
                {output.optimized_description}
              </div>
            </div>
          )}
        </div>
      );
    }

    return (
      <div className="space-y-2">
        <div className="flex justify-end">
          <button onClick={() => copyText(output, 'JSON')} className="text-[10px] text-indigo-400 hover:text-indigo-300 font-semibold cursor-pointer">Copy Raw JSON</button>
        </div>
        <pre className="text-xs text-slate-400 bg-slate-950/60 p-3 rounded-xl border border-slate-800/80 whitespace-pre-wrap break-all max-h-40 overflow-y-auto font-mono">
          {JSON.stringify(output, null, 2)}
        </pre>
      </div>
    );
  };

  return (
    <div className={`bg-slate-900/60 border border-white/5 rounded-2xl overflow-hidden transition-all duration-300 hover:border-slate-700/60 ${deleting ? 'opacity-40 scale-95 pointer-events-none' : ''}`}>
      {/* Card Header */}
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className={`w-9 h-9 rounded-xl border flex items-center justify-center text-base flex-shrink-0 ${meta.bg}`}>
            {meta.icon}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className={`text-xs font-bold ${meta.color}`}>{meta.label}</span>
              {item.input?.platform && (
                <span className="text-[10px] bg-slate-950 border border-slate-800 text-slate-400 px-2 py-0.5 rounded-full font-mono">
                  {item.input.platform}
                </span>
              )}
            </div>
            <p className="text-[10px] text-slate-500 font-mono mt-0.5">{formatDate(item.timestamp)}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0 ml-3">
          <button
            onClick={() => setExpanded(!expanded)}
            className="text-xs text-slate-400 hover:text-white bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 px-3 py-1.5 rounded-xl font-semibold transition-all duration-200 cursor-pointer"
          >
            {expanded ? '▲ Hide' : '▼ View'}
          </button>
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="text-xs text-rose-400 hover:text-rose-300 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/15 hover:border-rose-500/35 px-3 py-1.5 rounded-xl font-semibold transition-all duration-200 cursor-pointer disabled:opacity-50"
          >
            {deleting ? '…' : '🗑'}
          </button>
        </div>
      </div>

      {/* Expanded Content */}
      {expanded && (
        <div className="border-t border-white/5 p-4 space-y-4">
          {/* Input Summary */}
          {item.input && (
            <div className="space-y-2">
              <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Input Data</span>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {Object.entries(item.input)
                  .filter(([k, v]) => v && typeof v === 'string' && v.trim().length > 0)
                  .map(([key, val]) => (
                    <div key={key} className="bg-slate-950/60 border border-slate-800/60 rounded-xl p-2.5">
                      <div className="text-[9px] uppercase font-bold text-slate-500 tracking-wider mb-0.5">{key.replace(/_/g, ' ')}</div>
                      <div className="text-[11px] text-slate-300 font-medium truncate" title={val}>{val}</div>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* Output */}
          {item.output && (
            <div className="space-y-2">
              <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">AI Output</span>
              {renderOutput(item.output)}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function HistoryLog({ userSessionId }) {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');

  const fetchHistory = useCallback(async () => {
    if (!userSessionId) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const response = await apiRequest('/history', { method: 'GET', userId: userSessionId });
      if (response?.success) {
        setHistory(response.data || []);
      } else {
        toast.error(response?.message || 'Failed to fetch history.');
      }
    } catch (err) {
      toast.error(err.message || 'Failed to sync historical logs.');
    } finally {
      setLoading(false);
    }
  }, [userSessionId]);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  const handleDelete = async (id) => {
    try {
      await deleteHistoryItem(id, userSessionId);
      setHistory(prev => prev.filter(item => item.id !== id));
      toast.success('History entry deleted.');
    } catch (err) {
      toast.error(err.message || 'Failed to delete history entry.');
    }
  };

  const filtered = history.filter(item => {
    const matchesTab = activeTab === 'all' || item.action === activeTab;
    const q = searchQuery.toLowerCase();
    const matchesSearch = !q ||
      item.action?.toLowerCase().includes(q) ||
      item.input?.platform?.toLowerCase().includes(q) ||
      item.input?.jobDescription?.toLowerCase().includes(q) ||
      item.input?.text?.toLowerCase().includes(q) ||
      item.input?.title?.toLowerCase().includes(q) ||
      item.input?.description?.toLowerCase().includes(q) ||
      item.output?.proposal?.toLowerCase().includes(q) ||
      item.output?.summary?.toLowerCase().includes(q);
    return matchesTab && matchesSearch;
  });

  const countFor = (tabId) => tabId === 'all' ? history.length : history.filter(h => h.action === tabId).length;

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-fade-in">
      {/* Page Header */}
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-black text-white tracking-tight flex items-center gap-2">
          <span>⏳</span> Activity History
        </h1>
        <p className="text-sm text-slate-400 leading-relaxed">
          Browse, search, and manage all past AI generation sessions across tools.
        </p>
      </div>

      {/* Controls Bar */}
      <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
        {/* Search */}
        <div className="relative flex-1 w-full">
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-slate-500 text-sm">
            🔎
          </div>
          <input
            type="text"
            placeholder="Search logs by keyword, platform, or output…"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full bg-slate-900/60 border border-slate-800 focus:border-indigo-500 rounded-2xl pl-10 pr-4 py-3 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all duration-300"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} className="absolute inset-y-0 right-4 flex items-center text-slate-500 hover:text-white text-xs cursor-pointer">
              ✕
            </button>
          )}
        </div>

        {/* Refresh Button */}
        <button
          onClick={fetchHistory}
          disabled={loading}
          className="flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white bg-slate-900/60 border border-slate-800 hover:border-slate-700 px-4 py-3 rounded-2xl transition-all duration-200 cursor-pointer disabled:opacity-50 shrink-0"
        >
          <span className={loading ? 'animate-spin' : ''}>↻</span>
          <span>Refresh</span>
        </button>
      </div>

      {/* Tab Filters */}
      <div className="flex items-center gap-2 flex-wrap">
        {TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer ${
              activeTab === tab.id
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20'
                : 'bg-slate-900/60 text-slate-400 border border-slate-800 hover:text-white hover:border-slate-700'
            }`}
          >
            <span>{tab.label}</span>
            <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-mono ${activeTab === tab.id ? 'bg-white/20' : 'bg-slate-800 text-slate-500'}`}>
              {countFor(tab.id)}
            </span>
          </button>
        ))}
      </div>

      {/* Loading Skeleton */}
      {loading && (
        <div className="space-y-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="bg-slate-900/40 border border-slate-800 rounded-2xl p-4 animate-pulse">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-slate-800 rounded-xl shrink-0"></div>
                <div className="space-y-2 flex-1">
                  <div className="h-3.5 bg-slate-800 rounded w-1/4"></div>
                  <div className="h-2.5 bg-slate-800 rounded w-1/5"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* No Session */}
      {!loading && !userSessionId && (
        <div className="bg-slate-900/30 border border-slate-800/60 border-dashed rounded-3xl p-16 text-center flex flex-col items-center justify-center">
          <div className="w-16 h-16 rounded-2xl bg-slate-950 flex items-center justify-center text-3xl mb-4 border border-slate-800">🔐</div>
          <p className="text-sm font-semibold text-slate-300">Session Required</p>
          <p className="text-xs text-slate-500 mt-1">Please log in to view your activity history.</p>
        </div>
      )}

      {/* Empty History */}
      {!loading && userSessionId && filtered.length === 0 && (
        <div className="bg-slate-900/30 border border-slate-800/60 border-dashed rounded-3xl p-16 text-center flex flex-col items-center justify-center min-h-[300px]">
          <div className="w-16 h-16 rounded-2xl bg-slate-950 flex items-center justify-center text-3xl mb-4 border border-slate-800 shadow-md">
            {searchQuery ? '🔎' : '📭'}
          </div>
          <p className="text-sm font-semibold text-slate-300">
            {searchQuery ? 'No Matching Results' : 'No Activity Yet'}
          </p>
          <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
            {searchQuery
              ? `No logs matched "${searchQuery}". Try a different search term.`
              : 'Run the Profile Analyzer, SEO Optimizer, or Proposal Generator to start building your activity log.'}
          </p>
        </div>
      )}

      {/* History Cards */}
      {!loading && filtered.length > 0 && (
        <div className="space-y-3">
          {filtered.map(item => (
            <HistoryCard key={item.id} item={item} onDelete={handleDelete} />
          ))}
          <p className="text-center text-[10px] text-slate-600 font-mono pt-2">
            Showing {filtered.length} of {history.length} log{history.length !== 1 ? 's' : ''}
          </p>
        </div>
      )}
    </div>
  );
}