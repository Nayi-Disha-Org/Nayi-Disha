import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function AbcLogger() {
  const [logs, setLogs] = useState([]); // Empty state: no dummy logs
  const [antecedent, setAntecedent] = useState('');
  const [behavior, setBehavior] = useState('');
  const [consequence, setConsequence] = useState('');

  useEffect(() => {
    // TODO: Fetch existing logs from backend database endpoint
  }, []);

  const handleAddLog = (e) => {
    e.preventDefault();
    if (!antecedent || !behavior || !consequence) return;
    const newLog = {
      id: Date.now(),
      antecedent,
      behavior,
      consequence,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setLogs([newLog, ...logs]);
    setAntecedent('');
    setBehavior('');
    setConsequence('');
  };

  return (
    <div className="min-h-screen bg-[#f4f7fb] p-8 font-sans">
      <div className="max-w-5xl mx-auto">
        <header className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-black text-[#0b132b]">ABC Behavioral Logger</h1>
            <p className="text-slate-600 font-medium mt-1">Track Antecedent, Behavior, and Consequence and store entries in your database.</p>
          </div>
          <Link to="/?role=parent" className="px-4 py-2 bg-white text-slate-600 font-bold rounded-xl border border-slate-200 hover:bg-slate-50 shadow-sm inline-block">
            ← Back to Dashboard
          </Link>
        </header>

        {/* Input Form */}
        <form onSubmit={handleAddLog} className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 mb-8 space-y-4">
          <h2 className="text-xl font-black text-[#0b132b] mb-4">📝 Log New Behavior Entry</h2>
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-black uppercase text-slate-500 mb-1">Antecedent (Trigger)</label>
              <input type="text" value={antecedent} onChange={(e) => setAntecedent(e.target.value)} placeholder="What happened right before?" className="w-full p-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#ff7a59]" />
            </div>
            <div>
              <label className="block text-xs font-black uppercase text-slate-500 mb-1">Behavior (Action)</label>
              <input type="text" value={behavior} onChange={(e) => setBehavior(e.target.value)} placeholder="How did the child react?" className="w-full p-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#ff7a59]" />
            </div>
            <div>
              <label className="block text-xs font-black uppercase text-slate-500 mb-1">Consequence (Result)</label>
              <input type="text" value={consequence} onChange={(e) => setConsequence(e.target.value)} placeholder="What happened after?" className="w-full p-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#ff7a59]" />
            </div>
          </div>
          <button type="submit" className="mt-4 px-6 py-3 bg-[#ff7a59] text-white font-bold rounded-xl shadow-md hover:bg-orange-600 transition">
            Save Log Entry
          </button>
        </form>

        {/* Log Entries List */}
        <div className="space-y-4">
          <h3 className="text-xl font-black text-[#0b132b]">Stored Logs</h3>
          {logs.length === 0 ? (
            <div className="bg-white p-12 rounded-3xl text-center border border-slate-100">
              <div className="text-4xl mb-3 opacity-40">📭</div>
              <h4 className="font-bold text-slate-700">No Behavior Logs Found</h4>
              <p className="text-slate-500 text-sm mt-1">Submitted behavior logs will appear here once recorded.</p>
            </div>
          ) : (
            logs.map((log) => (
              <div key={log.id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col md:flex-row justify-between gap-4 items-start md:items-center">
                <div>
                  <span className="text-xs font-bold text-orange-500">{log.time}</span>
                  <div className="grid md:grid-cols-3 gap-4 mt-2 text-sm">
                    <div><strong className="text-slate-400">A:</strong> {log.antecedent}</div>
                    <div><strong className="text-slate-400">B:</strong> {log.behavior}</div>
                    <div><strong className="text-slate-400">C:</strong> {log.consequence}</div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}