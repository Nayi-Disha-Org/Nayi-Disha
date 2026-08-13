import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export default function IepArchitect() {
  const [columns, setColumns] = useState({
    goalBank: {
      name: "Clinical Macro-Goals (Bank)",
      items: [
        { id: "goal-1", content: "Improve Fine Motor Skills", badge: "Physical" },
        { id: "goal-2", content: "Increase Sustained Attention", badge: "Cognitive" },
        { id: "goal-3", content: "Independent Dressing", badge: "Life Skill" },
        { id: "goal-4", content: "Emotional Regulation", badge: "Behavioral" }
      ]
    },
    dailyRoutine: {
      name: "Aarav's Daily Routine (Home)",
      items: [
        { id: "task-1", content: "Buttoning Shirt (5 mins)", badge: "Morning" },
        { id: "task-2", content: "Sort Colored Blocks", badge: "Afternoon" }
      ]
    }
  });

  return (
    <div className="min-h-screen bg-[#f4f7fb] p-8">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-black text-[#0b132b]">IEP Routine Architect</h1>
            <p className="text-slate-600 font-medium mt-1">Drag and drop clinical macro-goals to build daily home routines.</p>
          </div>
          <Link 
            to="/?role=admin" 
            className="px-4 py-2 bg-white text-slate-600 font-bold rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors shadow-sm inline-block"
          >
            ← Back to Dashboard
          </Link>
        </header>

        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8 text-center">
           <h2 className="text-xl font-bold text-slate-700 mb-2">Drag and Drop Interface Pending</h2>
           <p className="text-slate-500">The <code>@hello-pangea/dnd</code> package needs to be installed to render the interactive columns here.</p>
        </div>
      </div>
    </div>
  );
}