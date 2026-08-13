import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function UdidGuide() {
  const [udidStatus, setUdidStatus] = useState(null); // null until database query resolves

  useEffect(() => {
    // TODO: Fetch UDID benefit status from database
  }, []);

  return (
    <div className="min-h-screen bg-[#f4f7fb] p-8 font-sans">
      <div className="max-w-4xl mx-auto">
        <header className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-black text-[#0b132b]">UDID & Government Benefits Guide</h1>
            <p className="text-slate-600 font-medium mt-1">Track Unique Disability ID status from secure database records.</p>
          </div>
          <Link to="/?role=parent" className="px-4 py-2 bg-white text-slate-600 font-bold rounded-xl border border-slate-200 hover:bg-slate-50 shadow-sm inline-block">
            ← Back to Dashboard
          </Link>
        </header>

        {!udidStatus ? (
          <div className="bg-white p-16 rounded-3xl shadow-sm border border-slate-100 text-center">
            <div className="text-5xl mb-4 opacity-40">🏛️</div>
            <h3 className="text-xl font-bold text-slate-700">Loading UDID Verification Records...</h3>
            <p className="text-slate-500 mt-2 max-w-md mx-auto">
              Retrieving disability credential mapping from the secure database server.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* UDID verified records render here */}
          </div>
        )}
      </div>
    </div>
  );
}