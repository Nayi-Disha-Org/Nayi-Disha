import React, { useState, useContext, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import API from '../services/api';
import { AuthContext } from '../context/AuthContext';

export default function AccountSettings() {
  const [searchParams] = useSearchParams();
  const role = searchParams.get('role') || 'parent';

  // Pulling loginUser and token so we can update global app state when the name changes!
  const { user, loginUser, token } = useContext(AuthContext);

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [notifications, setNotifications] = useState({
    emailAlerts: true,
    wearableVibe: true,
    dailySummary: false,
  });
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  // Fetch real profile data when the page loads
  useEffect(() => {
    if (user?.id) fetchProfile();
  }, [user]);

  const fetchProfile = async () => {
    try {
      const res = await API.get(`/auth/profile/${user.id}`);
      setFullName(res.data.full_name || '');
      setEmail(res.data.email || '');
      setNotifications({
        emailAlerts: res.data.email_alerts ?? true,
        wearableVibe: res.data.wearable_vibe ?? true,
        dailySummary: res.data.daily_summary ?? false,
      });
    } catch (error) {
      console.error("Failed to load profile", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const res = await API.put(`/auth/profile/${user.id}`, {
        full_name: fullName,
        email: email,
        email_alerts: notifications.emailAlerts,
        wearable_vibe: notifications.wearableVibe,
        daily_summary: notifications.dailySummary
      });
      
      // Magic step: Update the global AuthContext so the Nav Bar updates instantly!
      if (loginUser && token) {
        loginUser({ ...user, full_name: res.data.full_name, email: res.data.email }, token);
      }

      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (error) {
      console.error("Failed to update profile", error);
      alert("Error saving settings. Please check your connection.");
    }
  };

  if (loading) {
    return <div className="min-h-screen bg-[#f4f7fb] flex items-center justify-center font-bold text-slate-500 animate-pulse">Loading secure preferences...</div>;
  }

  return (
    <div className="min-h-screen bg-[#f4f7fb] p-8 font-sans">
      <div className="max-w-4xl mx-auto">
        <header className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-black text-[#0b132b]">Account Settings</h1>
            <p className="text-slate-600 font-medium mt-1">Manage your profile, preferences, and notification channels.</p>
          </div>
          <Link to={`/?role=${role}`} className="px-4 py-2 bg-white text-slate-600 font-bold rounded-xl border border-slate-200 hover:bg-slate-50 shadow-sm inline-block">
            ← Back to Dashboard
          </Link>
        </header>

        {saved && (
          <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 text-emerald-700 font-bold text-sm rounded-2xl text-center animate-fade-in-up">
            ✅ Settings updated and synced with server successfully!
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-6">
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 space-y-4">
            <h2 className="text-xl font-black text-[#0b132b]">👤 Profile Information</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-black uppercase text-slate-500 mb-1">Full Name</label>
                <input 
                  type="text" 
                  value={fullName} 
                  onChange={(e) => setFullName(e.target.value)} 
                  className="w-full p-3.5 rounded-xl border border-slate-200 text-sm font-medium focus:outline-none focus:border-[#0b132b]" 
                />
              </div>
              <div>
                <label className="block text-xs font-black uppercase text-slate-500 mb-1">Email Address</label>
                <input 
                  type="email" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  className="w-full p-3.5 rounded-xl border border-slate-200 text-sm font-medium focus:outline-none focus:border-[#0b132b]" 
                />
              </div>
            </div>
          </div>

          <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 space-y-4">
            <h2 className="text-xl font-black text-[#0b132b]">🔔 Notification Preferences</h2>
            <div className="space-y-3">
              <label className="flex items-center gap-3 p-3 rounded-2xl hover:bg-slate-50 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={notifications.emailAlerts} 
                  onChange={(e) => setNotifications({...notifications, emailAlerts: e.target.checked})}
                  className="h-5 w-5 rounded border-slate-300 text-[#0b132b]" 
                />
                <div>
                  <span className="font-bold text-slate-800 text-sm block">Email Alerts</span>
                  <span className="text-xs text-slate-500">Receive urgent sensor warnings and broadcast casts via email.</span>
                </div>
              </label>

              <label className="flex items-center gap-3 p-3 rounded-2xl hover:bg-slate-50 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={notifications.wearableVibe} 
                  onChange={(e) => setNotifications({...notifications, wearableVibe: e.target.checked})}
                  className="h-5 w-5 rounded border-slate-300 text-[#0b132b]" 
                />
                <div>
                  <span className="font-bold text-slate-800 text-sm block">ESP32 Wearable Vibration Alerts</span>
                  <span className="text-xs text-slate-500">Sync low-demand mode and barometric shift vibrations to hardware device.</span>
                </div>
              </label>

              <label className="flex items-center gap-3 p-3 rounded-2xl hover:bg-slate-50 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={notifications.dailySummary} 
                  onChange={(e) => setNotifications({...notifications, dailySummary: e.target.checked})}
                  className="h-5 w-5 rounded border-slate-300 text-[#0b132b]" 
                />
                <div>
                  <span className="font-bold text-slate-800 text-sm block">Daily Behavioral Summary</span>
                  <span className="text-xs text-slate-500">Get a daily digest of ABC behavioral logs and morning handovers.</span>
                </div>
              </label>
            </div>
          </div>

          <button 
            type="submit" 
            className="px-8 py-4 bg-[#0b132b] text-white font-bold rounded-2xl shadow-lg hover:bg-slate-800 transition active:scale-95"
          >
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
}