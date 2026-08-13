import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export default function TriageInbox() {
  const [alerts, setAlerts] = useState([]);

  const getSeverityColors = (severity) => {
    switch (severity) {
      case 'red': return 'bg-red-50 border-red-500 text-red-700';
      case 'yellow': return 'bg-yellow-50 border-yellow-500 text-yellow-700';
      case 'green': return 'bg-green-50 border-green-500 text-green-700';
      default: return 'bg-slate-50 border-slate-500 text-slate-700';
    }
  };

  return (
    <div className="min-h-screen bg-[#f4f7fb] p-8">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-black text-[#0b132b]">Clinical Triage Inbox</h1>
            <p className="text-slate-600 font-medium mt-1">Review flagged LLM alerts and IoT sensor warnings.</p>
          </div>
          <Link 
            to="/?role=admin" 
            className="px-4 py-2 bg-white text-slate-600 font-bold rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors shadow-sm inline-block"
          >
            ← Back to Dashboard
          </Link>
        </header>

        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="p-5 border-b border-slate-100 bg-slate-50 font-black text-slate-700 grid grid-cols-12 gap-4">
            <div className="col-span-2">Time</div>
            <div className="col-span-2">Child Profile</div>
            <div className="col-span-6">Alert Details</div>
            <div className="col-span-2 text-center">Action</div>
          </div>
          <div className="divide-y divide-slate-100">
            {alerts.length === 0 ? (
              <div className="p-12 text-center">
                <div className="text-4xl mb-3 opacity-50">📭</div>
                <h3 className="text-lg font-bold text-slate-700">No Active Alerts</h3>
                <p className="text-slate-500 mt-1">Waiting for incoming data from the sensors and LLM.</p>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}