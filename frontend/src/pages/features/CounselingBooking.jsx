import React, { useState, useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../../services/api';
import { AuthContext } from '../../context/AuthContext';

export default function CounselingBooking() {
  const { user } = useContext(AuthContext); 
  const [experts, setExperts] = useState([]); // CHANGED: therapists to experts
  
  // CHANGED: parent_id, preferred_datetime, expert_id
  const [formData, setFormData] = useState({ 
    parent_id: '', parent_name: '', child_name: '', preferred_datetime: '', reason: '', category: '', expert_id: '' 
  });
  const [status, setStatus] = useState('');

  useEffect(() => {
    if (user) {
      // CHANGED: user_id to parent_id
      setFormData(prev => ({ ...prev, parent_id: user.id, parent_name: user.full_name || user.name || '' }));
    }
    const fetchExperts = async () => {
      try {
        // CHANGED: Route to /health/experts
        const res = await API.get('/health/experts');
        setExperts(res.data);
      } catch (error) {
        console.error("Failed to load experts", error);
      }
    };
    fetchExperts();
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('Submitting to secure server...');
    try {
      // CHANGED: Route to /health/counseling/book
      await API.post('/health/counseling/book', formData);
      setStatus('✅ Success! Your request is synced with the Sama Foundation.');
      // CHANGED: Resetting the new variable names
      setFormData({ ...formData, child_name: '', preferred_datetime: '', reason: '', category: '', expert_id: '' }); 
    } catch (error) {
      setStatus('❌ Error submitting request. Check server connection.');
    }
  };

  return (
    <div className="min-h-screen bg-[#f4f7fb] p-8 font-sans">
      <div className="max-w-3xl mx-auto">
        <header className="mb-8 flex items-center justify-between">
          <h1 className="text-3xl font-black text-[#0b132b]">Counseling Desk</h1>
          <Link to="/?role=parent" className="px-4 py-2 bg-white text-slate-600 font-bold rounded-xl border border-slate-200 shadow-sm hover:bg-slate-50">
            ← Back to Dashboard
          </Link>
        </header>

        <form onSubmit={handleSubmit} className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 space-y-4">
          {status && <div className="p-4 font-bold rounded-xl text-sm bg-blue-50 text-blue-700">{status}</div>}
          
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-black uppercase text-slate-500 mb-1">Your Name</label>
              <input type="text" required value={formData.parent_name} onChange={(e) => setFormData({...formData, parent_name: e.target.value})} className="w-full p-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#0b132b]" />
            </div>
            <div>
              <label className="block text-xs font-black uppercase text-slate-500 mb-1">Child's Name</label>
              <input type="text" required value={formData.child_name} onChange={(e) => setFormData({...formData, child_name: e.target.value})} className="w-full p-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#0b132b]" />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-black uppercase text-slate-500 mb-1">Session Category</label>
              <select required value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})} className="w-full p-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#0b132b] bg-white">
                <option value="">Select a reason...</option>
                <option value="Behavioral Concern">Behavioral Concern</option>
                <option value="IEP / Academic Review">IEP / Academic Review</option>
                <option value="Speech / Therapy">Speech / Therapy</option>
                <option value="General Guidance">General Guidance</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-black uppercase text-slate-500 mb-1">Select Expert</label>
              {/* CHANGED: expert_id and mapping through experts array */}
              <select required value={formData.expert_id} onChange={(e) => setFormData({...formData, expert_id: e.target.value})} className="w-full p-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#0b132b] bg-white">
                <option value="">Choose an expert...</option>
                {experts.map(e => (
                  <option key={e.id} value={e.id}>{e.full_name} ({e.specialty})</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-black uppercase text-slate-500 mb-1">Preferred Date & Time</label>
            {/* CHANGED: preferred_datetime */}
            <input type="datetime-local" required value={formData.preferred_datetime} onChange={(e) => setFormData({...formData, preferred_datetime: e.target.value})} className="w-full p-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#0b132b]" />
          </div>
          <div>
            <label className="block text-xs font-black uppercase text-slate-500 mb-1">Reason for Session</label>
            <textarea required rows="3" value={formData.reason} onChange={(e) => setFormData({...formData, reason: e.target.value})} className="w-full p-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#0b132b]"></textarea>
          </div>
          <button type="submit" className="mt-4 w-full py-3 bg-[#0b132b] text-white font-bold rounded-xl shadow-lg hover:bg-slate-800 transition active:scale-95">
            Check Availability & Submit
          </button>
        </form>
      </div>
    </div>
  );
}