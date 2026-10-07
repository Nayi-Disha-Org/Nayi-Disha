import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import API from '../../services/api';
import { AuthContext } from '../../context/AuthContext';

export default function AbcLogger() {
  const { user } = useContext(AuthContext);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [antecedent, setAntecedent] = useState('');
  const [behavior, setBehavior] = useState('');
  const [consequence, setConsequence] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // NEW: State to hold our dynamically calculated top triggers
  const [dynamicTriggers, setDynamicTriggers] = useState([
    'Transitioned to new task', 'Loud sudden noise', 'Denied access to item'
  ]); // Default fallback

  useEffect(() => {
    if (user?.id) fetchLogs();
  }, [user]);

  // NEW: Intelligent Trigger Calculator
  // Every time 'logs' updates, recalculate the Top 3 most common triggers
  useEffect(() => {
    if (logs.length > 0) {
      const counts = {};
      logs.forEach(log => {
        const trigger = log.antecedent.trim();
        // Ignore empty strings or tiny accidental typos
        if (trigger.length > 2) { 
          counts[trigger] = (counts[trigger] || 0) + 1;
        }
      });
      
      // Sort triggers by frequency and grab the top 3
      const topTriggers = Object.keys(counts)
        .sort((a, b) => counts[b] - counts[a])
        .slice(0, 3);
        
      // Override the hardcoded defaults if we found real data!
      if (topTriggers.length > 0) {
        setDynamicTriggers(topTriggers);
      }
    }
  }, [logs]);

  const fetchLogs = async () => {
    try {
      const response = await API.get(`/health/abc-logs/${user.id}`);
      setLogs(response.data);
    } catch (error) {
      console.error("Failed to fetch logs", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddLog = async (e) => {
    e.preventDefault();
    if (!antecedent || !behavior || !consequence) return;
    
    try {
      const response = await API.post('/health/abc-logs', {
        parent_id: user.id,
        antecedent,
        behavior,
        consequence
      });
      setLogs([response.data, ...logs]);
      setAntecedent('');
      setBehavior('');
      setConsequence('');
    } catch (error) {
      console.error("Failed to save log", error);
      alert("Failed to save log. Check your connection.");
    }
  };

  const handleDeleteLog = async (id) => {
    if (!window.confirm("Permanently delete this behavior log?")) return;
    try {
      await API.delete(`/health/abc-logs/${id}`);
      setLogs(logs.filter(log => log.id !== id));
    } catch (error) {
      console.error("Failed to delete log", error);
    }
  };

  const exportToCSV = () => {
    const headers = ['Date', 'Time', 'Antecedent', 'Behavior', 'Consequence'];
    const rows = logs.map(log => {
      const d = new Date(log.created_at);
      return [
        d.toLocaleDateString(),
        d.toLocaleTimeString(),
        `"${log.antecedent.replace(/"/g, '""')}"`,
        `"${log.behavior.replace(/"/g, '""')}"`,
        `"${log.consequence.replace(/"/g, '""')}"`
      ].join(',');
    });
    
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(','), ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `ABC_Logs_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getTimeOfDay = (dateString) => {
    const hour = new Date(dateString).getHours();
    if (hour < 12) return { label: 'Morning', icon: '🌅', color: 'bg-blue-100 text-blue-700' };
    if (hour < 17) return { label: 'Afternoon', icon: '☀️', color: 'bg-orange-100 text-orange-700' };
    return { label: 'Evening', icon: '🌙', color: 'bg-indigo-100 text-indigo-700' };
  };

  const filteredLogs = logs.filter(log => 
    log.antecedent.toLowerCase().includes(searchQuery.toLowerCase()) ||
    log.behavior.toLowerCase().includes(searchQuery.toLowerCase()) ||
    log.consequence.toLowerCase().includes(searchQuery.toLowerCase())
  );

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

        <form onSubmit={handleAddLog} className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 mb-8 space-y-6">
          <div className="flex justify-between items-center border-b pb-4">
            <h2 className="text-xl font-black text-[#0b132b]">📝 Log New Behavior Entry</h2>
          </div>

          {/* DYNAMIC QUICK-FILL SECTION */}
          <div>
            <span className="text-xs font-black uppercase text-emerald-600 mr-3">✨ Most Frequent Triggers:</span>
            <div className="inline-flex flex-wrap gap-2">
              {dynamicTriggers.map(trigger => (
                <button key={trigger} type="button" onClick={() => setAntecedent(trigger)} className="px-3 py-1 bg-emerald-50 border border-emerald-100 text-emerald-700 text-xs font-bold rounded-full hover:bg-emerald-100 transition shadow-sm">
                  {trigger}
                </button>
              ))}
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-black uppercase text-slate-500 mb-1">Antecedent (Trigger)</label>
              <input type="text" required value={antecedent} onChange={(e) => setAntecedent(e.target.value)} placeholder="What happened right before?" className="w-full p-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#ff7a59]" />
            </div>
            <div>
              <label className="block text-xs font-black uppercase text-slate-500 mb-1">Behavior (Action)</label>
              <input type="text" required value={behavior} onChange={(e) => setBehavior(e.target.value)} placeholder="How did the child react?" className="w-full p-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#ff7a59]" />
            </div>
            <div>
              <label className="block text-xs font-black uppercase text-slate-500 mb-1">Consequence (Result)</label>
              <input type="text" required value={consequence} onChange={(e) => setConsequence(e.target.value)} placeholder="What happened after?" className="w-full p-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#ff7a59]" />
            </div>
          </div>
          <button type="submit" className="px-6 py-3 bg-[#ff7a59] text-white font-bold rounded-xl shadow-md hover:bg-orange-600 transition">
            Save Log Entry
          </button>
        </form>

        <div className="space-y-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
            <h3 className="text-xl font-black text-[#0b132b]">Stored Logs</h3>
            <div className="flex items-center gap-3 w-full md:w-auto">
              <input 
                type="text" 
                placeholder="🔍 Search logs..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full md:w-64 p-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#ff7a59]"
              />
              <button onClick={exportToCSV} className="px-4 py-2.5 bg-[#0b132b] text-white font-bold rounded-xl text-sm whitespace-nowrap hover:bg-slate-800 transition shadow-sm">
                📥 Export CSV
              </button>
            </div>
          </div>
          
          {loading ? (
            <div className="bg-white p-12 rounded-3xl text-center border border-slate-100 font-bold text-slate-500 animate-pulse">
              Loading past behavior logs...
            </div>
          ) : filteredLogs.length === 0 ? (
            <div className="bg-white p-12 rounded-3xl text-center border border-slate-100">
              <div className="text-4xl mb-3 opacity-40">📭</div>
              <h4 className="font-bold text-slate-700">No Logs Found</h4>
              <p className="text-slate-500 text-sm mt-1">Try adjusting your search or add a new entry.</p>
            </div>
          ) : (
            filteredLogs.map((log) => {
              const timeTag = getTimeOfDay(log.created_at);
              return (
                <div key={log.id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col md:flex-row justify-between gap-4 items-start md:items-center group">
                  <div className="w-full">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-xs font-bold text-slate-800">
                        {new Date(log.created_at).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
                      </span>
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${timeTag.color}`}>
                        {timeTag.icon} {timeTag.label}
                      </span>
                    </div>
                    <div className="grid md:grid-cols-3 gap-4 text-sm">
                      <div className="bg-slate-50 p-3 rounded-xl border border-slate-100"><strong className="text-slate-400 block mb-1 uppercase text-[10px]">Antecedent</strong> {log.antecedent}</div>
                      <div className="bg-slate-50 p-3 rounded-xl border border-slate-100"><strong className="text-slate-400 block mb-1 uppercase text-[10px]">Behavior</strong> {log.behavior}</div>
                      <div className="bg-slate-50 p-3 rounded-xl border border-slate-100"><strong className="text-slate-400 block mb-1 uppercase text-[10px]">Consequence</strong> {log.consequence}</div>
                    </div>
                  </div>
                  <button onClick={() => handleDeleteLog(log.id)} className="text-slate-300 hover:text-red-500 transition-colors md:opacity-0 md:group-hover:opacity-100 self-end md:self-center p-2">
                    🗑️
                  </button>
                </div>
              )
            })
          )}
        </div>
      </div>
    </div>
  );
}