import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { apiRequest } from '../api';

export default function HistoryLog() {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(false);
    const [activeItem, setActiveItem] = useState(null); // Modal detail tracker

    const fetchHistory = async () => {
        setLoading(true);
        try {
            const response = await apiRequest('/history');
            if (response.success) {
                setHistory(response.data || []);
            }
        } catch (err) {
            toast.error(err.message || 'Failed to sync historical trace tables.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchHistory();
    }, []);

    const handleDelete = async (itemId, e) => {
        e.stopPropagation(); // Stop from triggering view modal row clicks
        if (!window.confirm("Are you sure you want to delete this log entry?")) return;

        try {
            const response = await apiRequest(`/history/${itemId}`, { method: 'DELETE' });
            if (response.success) {
                toast.success('Log entry deleted.');
                setHistory(history.filter(item => item.id !== itemId));
                if (activeItem?.id === itemId) setActiveItem(null);
            }
        } catch (err) {
            toast.error(err.message || 'Failed to discard record.');
        }
    };

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
        toast.success('Content copied to clipboard!');
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div className="flex flex-col space-y-1">
                    <h1 className="text-2xl font-bold text-white">⏳ Generation Activity Log</h1>
                    <p className="text-sm text-slate-400">Review, copy, or purge your last 20 automated generation passes.</p>
                </div>
                <button
                    onClick={fetchHistory}
                    className="bg-slate-900 border border-slate-800 text-slate-300 text-xs px-3 py-2 rounded-xl hover:bg-slate-800 transition font-medium"
                >
                    🔄 Refresh Table
                </button>
            </div>

            {/* LOADING CONTROLLERS */}
            {loading && (
                <div className="space-y-3">
                    {[1, 2, 3].map((n) => (
                        <div key={n} className="h-20 bg-slate-900 border border-slate-800 rounded-xl animate-pulse"></div>
                    ))}
                </div>
            )}

            {/* EMPTY STATE CONDITION */}
            {!loading && history.length === 0 && (
                <div className="bg-slate-900/40 border border-slate-800 border-dashed rounded-2xl p-16 text-center max-w-xl mx-auto flex flex-col items-center justify-center">
                    <div className="w-16 h-16 bg-slate-800/60 rounded-full flex items-center justify-center text-2xl mb-4 border border-slate-700/50">📭</div>
                    <h3 className="text-base font-bold text-slate-200">No History Items Logged</h3>
                    <p className="text-xs text-slate-500 mt-1 max-w-xs">You haven't optimized any titles or generated any bids yet today. Your automated outputs will register here.</p>
                </div>
            )}

            {/* DATA GRID TABLE */}
            {!loading && history.length > 0 && (
                <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm text-slate-300">
                            <thead className="bg-slate-950 text-xs font-bold uppercase text-slate-400 tracking-wider border-b border-slate-800">
                                <tr>
                                    <th className="p-4">Action Variant</th>
                                    <th className="p-4">Input Prompt Snapshot</th>
                                    <th className="p-4">Timestamp</th>
                                    <th className="p-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800/60">
                                {history.map((item) => {
                                    const isProposal = item.type === 'proposal';
                                    return (
                                        <tr
                                            key={item.id}
                                            onClick={() => setActiveItem(item)}
                                            className="hover:bg-slate-850/40 cursor-pointer transition duration-150 group"
                                        >
                                            <td className="p-4 whitespace-nowrap">
                                                <span className={`text-[10px] uppercase px-2.5 py-1 rounded-md font-bold border ${isProposal ? 'bg-purple-500/10 border-purple-500/20 text-purple-400' : 'bg-blue-500/10 border-blue-500/20 text-blue-400'}`}>
                                                    {item.type}
                                                </span>
                                            </td>
                                            <td className="p-4 max-w-xs truncate text-xs text-slate-400 font-mono">
                                                {item.input_text}
                                            </td>
                                            <td className="p-4 whitespace-nowrap text-xs text-slate-500">
                                                {new Date(item.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                            </td>
                                            <td className="p-4 text-right whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                                                <div className="flex items-center justify-end space-x-2">
                                                    <button
                                                        onClick={() => setActiveItem(item)}
                                                        className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 px-2.5 py-1.5 rounded-lg border border-slate-700 font-medium transition"
                                                    >
                                                        View
                                                    </button>
                                                    <button
                                                        onClick={(e) => handleDelete(item.id, e)}
                                                        className="text-xs text-rose-400 hover:bg-rose-500/10 px-2.5 py-1.5 rounded-lg border border-transparent hover:border-rose-500/20 transition"
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* VIEW DIALOG MODAL LAYOVER */}
            {activeItem && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4" onClick={() => setActiveItem(null)}>
                    <div
                        className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full p-6 space-y-4 relative shadow-2xl overflow-hidden"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex justify-between items-start border-b border-slate-800 pb-3">
                            <div>
                                <span className="text-[10px] font-black uppercase tracking-wider bg-purple-500/10 text-purple-400 px-2 py-0.5 rounded border border-purple-500/20">
                                    {activeItem.type} Record
                                </span>
                                <p className="text-xs text-slate-500 mt-1">Generated: {new Date(activeItem.created_at).toLocaleString()}</p>
                            </div>
                            <button
                                onClick={() => setActiveItem(null)}
                                className="text-slate-400 hover:text-white text-sm bg-slate-800 hover:bg-slate-700 w-8 h-8 rounded-full flex items-center justify-center border border-slate-700"
                            >
                                ✕
                            </button>
                        </div>

                        <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
                            <div className="space-y-1 bg-slate-950 p-3 rounded-xl border border-slate-800">
                                <label className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block">Historic Source Prompt Input</label>
                                <p className="text-xs text-slate-300 whitespace-pre-wrap font-mono">{activeItem.input_text}</p>
                            </div>

                            <div className="space-y-1">
                                <div className="flex justify-between items-center">
                                    <label className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Compiled Output Response</label>
                                    <button
                                        onClick={() => copyToClipboard(activeItem.output)}
                                        className="text-xs text-purple-400 hover:underline font-semibold"
                                    >
                                        📋 Copy Text Content
                                    </button>
                                </div>
                                <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl text-sm text-slate-200 font-mono whitespace-pre-wrap leading-relaxed">
                                    {activeItem.output}
                                </div>
                            </div>
                        </div>

                        <div className="pt-2 border-t border-slate-800 flex justify-end">
                            <button
                                onClick={() => setActiveItem(null)}
                                className="bg-purple-600 hover:bg-purple-500 text-white text-sm font-bold px-5 py-2 rounded-xl transition shadow-lg shadow-purple-600/10"
                            >
                                Close View
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}