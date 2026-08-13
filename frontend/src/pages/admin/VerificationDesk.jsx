import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export default function VerificationDesk() {
  const [applications, setApplications] = useState([]);

  return (
    <div className="min-h-screen bg-[#f4f7fb] p-8">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-black text-[#0b132b]">Verification Desk</h1>
            <p className="text-slate-600 font-medium mt-1">Review and process UDID benefit applications and medical certificates.</p>
          </div>
          <Link 
            to="/?role=admin" 
            className="px-4 py-2 bg-white text-slate-600 font-bold rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors shadow-sm inline-block"
          >
            ← Back to Dashboard
          </Link>
        </header>

        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="p-5 border-b border-slate-100 bg-slate-50 font-black text-slate-700 grid grid-cols-12 gap-4 text-sm uppercase tracking-wider">
            <div className="col-span-3">Applicant Name</div>
            <div className="col-span-3">Document Type</div>
            <div className="col-span-2 text-center">Submission Date</div>
            <div className="col-span-2 text-center">Status</div>
            <div className="col-span-2 text-center">Action</div>
          </div>
          <div className="divide-y divide-slate-100">
            {applications.length === 0 ? (
              <div className="p-16 text-center">
                <div className="text-5xl mb-4 opacity-40">📄</div>
                <h3 className="text-xl font-bold text-slate-700">No Pending Applications</h3>
                <p className="text-slate-500 mt-2 max-w-md mx-auto">
                  All medical certificates and UDID applications have been processed. New submissions will appear here.
                </p>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}