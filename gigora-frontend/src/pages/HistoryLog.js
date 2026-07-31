import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { apiRequest } from '../api';

export default function HistoryLog() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await apiRequest('/history');
        if (response?.success) {
          setHistory(response.data || []);
        }
      } catch (err) {
        toast.error(err.message || 'Failed to sync historical trace tables.');
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  if (loading) {
    return (
      <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl animate-pulse">
        <div className="h-6 bg-slate-800 rounded w-1/3 mb-4"></div>
        <div className="h-20 bg-slate-800 rounded"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-white">⏳ Past History</h1>
      {history.length === 0 ? (
        <div className="p-8 bg-slate-900/50 border border-slate-800 rounded-2xl text-center text-slate-400">
          No history found.
        </div>
      ) : (
        <div className="space-y-4">
          {history.map((item, idx) => (
            <div key={idx} className="p-4 bg-slate-900 border border-slate-800 rounded-xl">
              <p className="text-sm text-slate-200">{item.prompt || item.action}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}