import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../../services/api';

export default function CaseloadCalendar() {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchSessions = async () => {
    try {
      const response = await API.get('/health/counseling');
      setSessions(response.data);
    } catch (error) {
      console.error("Failed to fetch sessions", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSessions();
  }, []);

  const handleUpdate = async (id, currentNotes, newStatus) => {
    try {
      await API.put(`/health/counseling/${id}`, { status: newStatus, mentor_notes: currentNotes });
      fetchSessions(); // Refresh list after update
    } catch (error) {
      console.error("Update failed", error);
    }
  };

  return (
    <div className="min-h-screen bg-[#f4f7fb] p-8 font-sans">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8 flex items-center justify-between">
          <h1 className="text-3xl font-black text-[#0b132b]">Clinical Caseload Calendar</h1>
         <Link to="/?role=caretaker" className="px-4 py-2 bg-white text-slate-600 font-bold rounded-xl border border-slate-200 hover:bg-slate-50 shadow-sm">
            ← Back to Dashboard
          </Link>
        </header>

        <div className="space-y-4">
          {loading ? (
            <div className="p-16 text-center text-slate-500 font-bold animate-pulse">Syncing clinical records...</div>
          ) : sessions.length === 0 ? (
            <div className="bg-white p-16 rounded-3xl border border-slate-100 text-center font-bold text-slate-500">No Pending Requests</div>
          ) : (
            sessions.map((session) => (
              <div key={session.id} className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 grid md:grid-cols-12 gap-6 items-start">
                
                <div className="col-span-3">
                  <div className="font-black text-lg text-slate-900">{session.parent_name}</div>
                  <div className="text-sm font-medium text-slate-500 mb-2">Child: {session.child_name}</div>
                  <span className="px-3 py-1 bg-indigo-50 text-indigo-700 font-bold rounded-md text-xs uppercase tracking-wide">
                    {session.category}
                  </span>
                </div>

                <div className="col-span-3">
                  <div className="text-xs font-black uppercase text-slate-400 mb-1">Requested Time & Expert</div>
                  <div className="font-semibold text-slate-700 mb-1">
                    {new Date(session.requested_date).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
                  </div>
                  <div className="text-sm text-slate-500 font-medium">Assigned to: {session.therapist_name}</div>
                </div>

                <div className="col-span-4">
                  <label className="block text-xs font-black uppercase text-slate-400 mb-1">Private Mentor Notes</label>
                  <textarea 
                    defaultValue={session.mentor_notes || ''}
                    onBlur={(e) => handleUpdate(session.id, e.target.value, session.status)}
                    placeholder="Type clinical notes here... (Saves automatically when you click away)"
                    className="w-full p-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-indigo-500 bg-slate-50"
                    rows="3"
                  ></textarea>
                </div>

                <div className="col-span-2 flex flex-col gap-2">
                  <div className={`text-center py-2 rounded-xl font-bold text-sm ${session.status === 'Approved' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                    {session.status}
                  </div>
                 {/* If Pending, show Approve and Reject */}
                  {session.status === 'Pending' && (
                    <div className="flex gap-2">
                      <button onClick={() => handleUpdate(session.id, session.mentor_notes, 'Approved')} className="flex-1 py-2 bg-emerald-600 text-white text-sm font-bold rounded-xl hover:bg-emerald-700 transition">
                        Approve
                      </button>
                      <button onClick={() => handleUpdate(session.id, session.mentor_notes, 'Rejected')} className="flex-1 py-2 bg-red-500 text-white text-sm font-bold rounded-xl hover:bg-red-600 transition">
                        Reject
                      </button>
                    </div>
                  )}

                  {/* If Approved, show Complete */}
                  {session.status === 'Approved' && (
                    <button onClick={() => handleUpdate(session.id, session.mentor_notes, 'Completed')} className="w-full py-2 bg-[#0b132b] text-white text-sm font-bold rounded-xl hover:bg-slate-800 transition">
                      Mark as Completed
                    </button>
                  )}
                </div>

              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}