import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function MorningHandover() {
  const [handovers, setHandovers] = useState([]);

  useEffect(() => {
    // TODO: Fetch morning handover reports from database
  }, []);

  return (
    <div className="min-h-screen bg-[#f4f7fb] p-8 font-sans">
      <div className="max-w-5xl mx-auto">
        <header className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-black text-[#0b132b]">Morning Handover</h1>
            <p className="text-slate-600 font-medium mt-1">Review sleep, diet, and low-demand mode triggers before morning sessions start.</p>
          </div>
          <Link to="/?role=caretaker" className="px-4 py-2 bg-white text-slate-600 font-bold rounded-xl border border-slate-200 hover:bg-slate-50 shadow-sm inline-block">
            ← Back to Dashboard
          </Link>
        </header>

        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-12 text-center">
          <div className="text-5xl mb-4 opacity-40">🌅</div>
          <h3 className="text-xl font-bold text-slate-700">No Handover Reports Available</h3>
          <p className="text-slate-500 mt-2 max-w-md mx-auto">
            Waiting for parent submissions and morning logs to synchronize from the database.
          </p>
        </div>
      </div>
    </div>
  );
}