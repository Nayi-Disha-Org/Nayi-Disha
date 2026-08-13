import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export default function GlobalKillSwitch() {
  const [systemModules, setSystemModules] = useState([]);

  return (
    <div className="min-h-screen bg-[#f4f7fb] p-8">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-black text-[#0b132b]">Global Kill Switch</h1>
            <p className="text-slate-600 font-medium mt-1">Instantly disable vulnerable modules during an active system attack.</p>
          </div>
          <Link 
            to="/?role=admin" 
            className="px-4 py-2 bg-white text-slate-600 font-bold rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors shadow-sm inline-block"
          >
            ← Back to Dashboard
          </Link>
        </header>

        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="p-5 border-b border-slate-100 bg-orange-50 font-black text-orange-800 grid grid-cols-12 gap-4 text-sm uppercase tracking-wider">
            <div className="col-span-4">System Module</div>
            <div className="col-span-4">Current Status</div>
            <div className="col-span-4 text-right">Emergency Toggle</div>
          </div>
          <div className="divide-y divide-slate-100">
            {systemModules.length === 0 ? (
              <div className="p-16 text-center">
                <div className="text-5xl mb-4 opacity-40">🔌</div>
                <h3 className="text-xl font-bold text-slate-700">Connecting to Core Servers...</h3>
                <p className="text-slate-500 mt-2 max-w-md mx-auto">
                  Waiting to retrieve live system status. Once connected, you can shut down the Parent Forum or external APIs instantly.
                </p>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}