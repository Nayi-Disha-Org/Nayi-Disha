import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function LowDemandMode() {
  const [isActive, setIsActive] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // TODO: Fetch current mode state from backend database / IoT wearable API on mount
  }, []);

  const handleToggleMode = async () => {
    setLoading(true);
    // Simulate database / IoT sync delay
    setTimeout(() => {
      setIsActive(!isActive);
      setLoading(false);
    }, 500);
  };

  return (
    <div className="min-h-screen bg-[#f4f7fb] p-8 font-sans">
      <div className="max-w-4xl mx-auto">
        <header className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-black text-[#0b132b]">Low-Demand Mode</h1>
            <p className="text-slate-600 font-medium mt-1">Instantly strip non-essential tasks and sync connected ESP32 wearables.</p>
          </div>
          <Link to="/?role=parent" className="px-4 py-2 bg-white text-slate-600 font-bold rounded-xl border border-slate-200 hover:bg-slate-50 shadow-sm inline-block">
            ← Back to Dashboard
          </Link>
        </header>

        <div className={`p-8 rounded-3xl shadow-sm border-2 transition-all ${isActive ? 'bg-indigo-900 text-white border-indigo-700' : 'bg-white text-slate-800 border-slate-100'}`}>
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <h2 className="text-2xl font-black">
                {isActive ? "🟢 Low-Demand Mode Active" : "⚪ Low-Demand Mode Standby"}
              </h2>
              <p className={`text-sm mt-2 leading-relaxed ${isActive ? 'text-indigo-200' : 'text-slate-500'}`}>
                {isActive 
                  ? "Non-essential schedule requirements are hidden in database logs. ESP32 wearable set to minimal vibration alerts." 
                  : "Normal schedule enabled across all connected devices and database records."}
              </p>
            </div>
            <button 
              onClick={handleToggleMode}
              disabled={loading}
              className={`px-6 py-3 rounded-2xl font-bold text-sm shadow-md transition whitespace-nowrap ${
                isActive 
                  ? 'bg-white text-indigo-950 hover:bg-indigo-50' 
                  : 'bg-indigo-600 text-white hover:bg-indigo-700'
              } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {loading ? "Syncing..." : isActive ? "Deactivate Mode" : "Activate Now"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}