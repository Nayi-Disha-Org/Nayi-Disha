import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import API from '../../services/api';
import { AuthContext } from '../../context/AuthContext';

export default function LowDemandMode() {
  const { user } = useContext(AuthContext);
  const [isActive, setIsActive] = useState(false);
  const [loading, setLoading] = useState(true);

  // 1. Fetch the user's saved mode status when the page loads
  useEffect(() => {
    if (user?.id) fetchCurrentMode();
  }, [user]);

  const fetchCurrentMode = async () => {
    try {
      const response = await API.get(`/health/passport/${user.id}`);
      setIsActive(response.data.low_demand_mode || false);
    } catch (error) {
      if (error.response?.status !== 404) {
        console.error("Failed to fetch mode status", error);
      }
    } finally {
      setLoading(false);
    }
  };

  // 2. Send the toggle command to Aiven PostgreSQL
  const handleToggleMode = async () => {
    setLoading(true);
    const newStatus = !isActive;
    
    try {
      const response = await API.put(`/health/low-demand/${user.id}`, {
        isActive: newStatus
      });
      setIsActive(response.data.isActive);
    } catch (error) {
      console.error("Failed to sync with database", error);
      alert("Could not sync with the server. Please check your connection.");
    } finally {
      setLoading(false);
    }
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

        <div className={`p-10 rounded-3xl shadow-lg border-4 transition-all duration-500 ${isActive ? 'bg-indigo-900 text-white border-indigo-500' : 'bg-white text-slate-800 border-slate-100'}`}>
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <h2 className="text-3xl font-black mb-2 flex items-center gap-3">
                {isActive ? "🟢 Active & Shielding" : "⚪ Standby Mode"}
              </h2>
              <p className={`text-sm md:text-base leading-relaxed max-w-xl ${isActive ? 'text-indigo-200' : 'text-slate-500'}`}>
                {isActive 
                  ? "Non-essential schedule requirements are hidden. Your ESP32 wearable has automatically switched to minimal, low-intensity vibration alerts." 
                  : "Normal sensory schedule enabled. Wearable is functioning with standard tactile alerts across all connected devices."}
              </p>
            </div>
            
            <button 
              onClick={handleToggleMode}
              disabled={loading}
              className={`px-8 py-4 rounded-2xl font-black text-lg shadow-xl transition-all active:scale-95 whitespace-nowrap ${
                isActive 
                  ? 'bg-white text-indigo-950 hover:bg-indigo-50 hover:shadow-indigo-500/20' 
                  : 'bg-indigo-600 text-white hover:bg-indigo-700 hover:shadow-indigo-600/30'
              } ${loading ? 'opacity-50 cursor-wait' : ''}`}
            >
              {loading ? "Syncing to Cloud..." : isActive ? "Deactivate Shield" : "Activate Shield"}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}