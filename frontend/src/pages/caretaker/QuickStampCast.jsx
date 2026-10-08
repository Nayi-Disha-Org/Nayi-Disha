import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import API from '../../services/api';
import { AuthContext } from '../../context/AuthContext';

export default function QuickStampCast() {
  const { user } = useContext(AuthContext);
  const [broadcasts, setBroadcasts] = useState([]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);

  // Fetch broadcasts from Aiven PostgreSQL on load
  useEffect(() => {
    fetchBroadcasts();
  }, []);

  const fetchBroadcasts = async () => {
    try {
      const res = await API.get('/health/broadcasts');
      setBroadcasts(res.data);
    } catch (error) {
      console.error("Failed to load broadcasts", error);
    } finally {
      setLoading(false);
    }
  };

  // Save new broadcast to the database
  const handleSendBroadcast = async (e) => {
    e.preventDefault();
    if (!message.trim() || !user?.id) return;
    
    try {
      const res = await API.post('/health/broadcasts', {
        caretaker_id: user.id,
        message: message.trim()
      });
      // Add the new broadcast to the top of the list instantly
      setBroadcasts([res.data, ...broadcasts]);
      setMessage('');
    } catch (error) {
      console.error("Failed to send broadcast", error);
      alert("Could not send broadcast. Check your connection.");
    }
  };

  return (
    <div className="min-h-screen bg-[#f4f7fb] p-8 font-sans">
      <div className="max-w-5xl mx-auto">
        <header className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-black text-[#0b132b]">Quick-Stamp Cast</h1>
            <p className="text-slate-600 font-medium mt-1">Send one-tap updates straight to parents in real-time.</p>
          </div>
          <Link to="/?role=caretaker" className="px-4 py-2 bg-white text-slate-600 font-bold rounded-xl border border-slate-200 hover:bg-slate-50 shadow-sm inline-block">
            ← Back to Dashboard
          </Link>
        </header>

        <form onSubmit={handleSendBroadcast} className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 mb-8 space-y-4">
          <h2 className="text-xl font-black text-[#0b132b] mb-2">⚡ Send Quick Update</h2>
          <div className="flex gap-4">
            <input 
              type="text" 
              value={message} 
              onChange={(e) => setMessage(e.target.value)} 
              placeholder="e.g., Finished Physio Session successfully" 
              className="flex-1 p-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#3b82f6]" 
            />
            <button type="submit" disabled={!message.trim()} className="px-6 py-3 bg-[#3b82f6] disabled:opacity-50 text-white font-bold rounded-xl shadow-md hover:bg-blue-600 transition">
              Broadcast Cast
            </button>
          </div>
        </form>

        <div className="space-y-4">
          <h3 className="text-xl font-black text-[#0b132b]">Broadcast History</h3>
          
          {loading ? (
            <div className="bg-white p-12 rounded-3xl text-center border border-slate-100 animate-pulse text-slate-500 font-bold">
              Fetching recent broadcasts...
            </div>
          ) : broadcasts.length === 0 ? (
            <div className="bg-white p-12 rounded-3xl text-center border border-slate-100">
              <div className="text-4xl mb-3 opacity-40">⚡</div>
              <h4 className="font-bold text-slate-700">No Broadcasts Sent Yet</h4>
              <p className="text-slate-500 text-sm mt-1">Sent updates will log here and store in the database.</p>
            </div>
          ) : (
            broadcasts.map((b) => (
              <div key={b.id} className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex justify-between items-center animate-fade-in-up">
                <span className="font-semibold text-slate-800 text-sm">{b.message}</span>
                <span className="text-xs text-slate-400 font-bold">
                  {new Date(b.created_at).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true })}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}