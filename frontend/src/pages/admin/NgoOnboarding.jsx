import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export default function NgoOnboarding() {
  const [ngos, setNgos] = useState([]);

  return (
    <div className="min-h-screen bg-[#f4f7fb] p-8">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-black text-[#0b132b]">NGO & Center Onboarding</h1>
            <p className="text-slate-600 font-medium mt-1">Generate master credentials and initialize isolated database environments.</p>
          </div>
          <Link 
            to="/?role=admin" 
            className="px-4 py-2 bg-white text-slate-600 font-bold rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors shadow-sm inline-block"
          >
            ← Back to Dashboard
          </Link>
        </header>

        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="p-5 border-b border-slate-100 bg-purple-50 font-black text-purple-800 grid grid-cols-12 gap-4 text-sm uppercase tracking-wider">
            <div className="col-span-4">Organization Name</div>
            <div className="col-span-3">Master Email</div>
            <div className="col-span-2 text-center">Database Status</div>
            <div className="col-span-3 text-center">Configuration</div>
          </div>
          <div className="divide-y divide-slate-100">
            {ngos.length === 0 ? (
              <div className="p-16 text-center">
                <div className="text-5xl mb-4 opacity-40">🏢</div>
                <h3 className="text-xl font-bold text-slate-700">No Active Centers</h3>
                <p className="text-slate-500 mt-2 max-w-md mx-auto">
                  There are currently no external NGOs registered on the platform. Onboard your first center to provision credentials.
                </p>
                <button className="mt-6 px-6 py-2.5 bg-purple-600 text-white font-bold rounded-xl shadow-md hover:bg-purple-700 transition">
                  + Register New NGO
                </button>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}