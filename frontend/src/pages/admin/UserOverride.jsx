import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export default function UserOverride() {
  const [flaggedUsers, setFlaggedUsers] = useState([]);

  return (
    <div className="min-h-screen bg-[#f4f7fb] p-8">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-black text-[#0b132b]">User Override Center</h1>
            <p className="text-slate-600 font-medium mt-1">Force password resets, freeze compromised accounts, and ban malicious users.</p>
          </div>
          <Link 
            to="/?role=admin" 
            className="px-4 py-2 bg-white text-slate-600 font-bold rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors shadow-sm inline-block"
          >
            ← Back to Dashboard
          </Link>
        </header>

        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="p-5 border-b border-slate-100 bg-red-50 font-black text-red-800 grid grid-cols-12 gap-4 text-sm uppercase tracking-wider">
            <div className="col-span-3">User Profile</div>
            <div className="col-span-3">Role</div>
            <div className="col-span-4">Flag Reason</div>
            <div className="col-span-2 text-center">Override Action</div>
          </div>
          <div className="divide-y divide-slate-100">
            {flaggedUsers.length === 0 ? (
              <div className="p-16 text-center">
                <div className="text-5xl mb-4 opacity-40">🛡️</div>
                <h3 className="text-xl font-bold text-slate-700">System Secure</h3>
                <p className="text-slate-500 mt-2 max-w-md mx-auto">
                  No compromised accounts or malicious activities detected across the platform.
                </p>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}