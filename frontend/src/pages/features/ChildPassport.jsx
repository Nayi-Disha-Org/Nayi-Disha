import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

export default function ChildPassport() {
  const [passportData, setPassportData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchChildPassport = async () => {
      try {
        // TODO: Replace with your actual backend endpoint
        const response = await axios.get('http://localhost:5000/api/child/passport', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}` // Pass token if secured
          }
        });
        setPassportData(response.data);
      } catch (error) {
        console.warn("Backend not connected yet. Loading fallback UI data...");
        // FALLBACK MOCK DATA: So you can see the UI while backend is being built
        setTimeout(() => {
          setPassportData({
            child_name: "Aarav Sharma",
            udid: "2748-XXXX-9812",
            age: 8,
            emergency_contacts: [
              { relation: "Father (Shridhar)", phone: "+91 98450 XXXXX" },
              { relation: "Therapist Clinic", phone: "+91 80 2345 XXXX" }
            ],
            triggers: [
              "Sudden loud noises / sirens",
              "Bright fluorescent flickering lights",
              "Unexpected schedule changes"
            ],
            strategies: "Provide noise-canceling headphones immediately. Offer a weighted lap pad and guide him to the designated quiet corner for 5 minutes with low-demand communication."
          });
          setLoading(false);
        }, 1500); // Simulated 1.5 second loading delay
      }
    };

    fetchChildPassport();
  }, []);

  return (
    <div className="min-h-screen bg-[#f4f7fb] p-8 font-sans">
      <div className="max-w-4xl mx-auto">
        <header className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-black text-[#0b132b]">Dynamic Child Passport</h1>
            <p className="text-slate-600 font-medium mt-1">Emergency summary and sensory profile retrieved from database records.</p>
          </div>
          <Link to="/?role=parent" className="px-4 py-2 bg-white text-slate-600 font-bold rounded-xl border border-slate-200 hover:bg-slate-50 shadow-sm inline-block">
            ← Back to Dashboard
          </Link>
        </header>

        {loading || !passportData ? (
          <div className="bg-white p-16 rounded-3xl shadow-sm border border-slate-100 text-center animate-pulse">
            <div className="text-5xl mb-4 opacity-40">🪪</div>
            <h3 className="text-xl font-bold text-slate-700">Connecting to Child Record...</h3>
            <p className="text-slate-500 mt-2 max-w-md mx-auto">
              Waiting to retrieve emergency profile and medical triggers from the secure database server.
            </p>
          </div>
        ) : (
          <div className="bg-white p-10 rounded-3xl shadow-xl border-4 border-slate-100 space-y-8 animate-fade-in-up">
            
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-slate-100 pb-6 gap-4">
              <div>
                <h2 className="text-3xl font-black text-[#0b132b]">{passportData.child_name}</h2>
                <p className="text-slate-500 font-medium mt-1">UDID: {passportData.udid} | Age: {passportData.age}</p>
              </div>
              <button 
                onClick={() => window.print()} 
                className="px-6 py-3 bg-[#0b132b] text-white font-bold rounded-xl shadow-md hover:bg-slate-800 transition active:scale-95 flex items-center gap-2"
              >
                <span>🖨️</span> Download / Print PDF
              </button>
            </div>

            {/* Grid Section for Contacts & Triggers */}
            <div className="grid md:grid-cols-2 gap-6">
              
              {/* Emergency Contacts */}
              <div className="p-6 bg-red-50 rounded-2xl border border-red-100 shadow-sm">
                <h3 className="font-black text-red-800 mb-4 flex items-center gap-2">
                  <span>🚨</span> Emergency Contacts
                </h3>
                <div className="space-y-3">
                  {passportData.emergency_contacts.map((contact, idx) => (
                    <div key={idx} className="bg-white p-3 rounded-xl border border-red-50">
                      <p className="text-xs text-red-400 font-black uppercase tracking-wider">{contact.relation}</p>
                      <p className="text-sm font-bold text-red-900 mt-0.5">{contact.phone}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Sensory Triggers */}
              <div className="p-6 bg-orange-50 rounded-2xl border border-orange-100 shadow-sm">
                <h3 className="font-black text-orange-800 mb-4 flex items-center gap-2">
                  <span>⚡</span> Primary Triggers
                </h3>
                <ul className="space-y-2">
                  {passportData.triggers.map((trigger, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm font-medium text-orange-900 bg-white p-2.5 rounded-xl border border-orange-50">
                      <span className="text-orange-400 mt-0.5">•</span>
                      {trigger}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* De-escalation Strategies */}
            <div className="p-6 bg-yellow-50 rounded-2xl border border-yellow-200 shadow-sm">
              <h3 className="font-black text-yellow-800 mb-3 flex items-center gap-2">
                <span>💡</span> De-escalation Strategies
              </h3>
              <p className="text-sm text-yellow-900 leading-relaxed font-medium bg-white p-4 rounded-xl border border-yellow-100">
                {passportData.strategies}
              </p>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}