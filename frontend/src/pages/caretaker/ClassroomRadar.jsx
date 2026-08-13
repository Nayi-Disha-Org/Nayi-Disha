import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function ClassroomRadar() {
  const [sensorStreams, setSensorStreams] = useState([]);

  useEffect(() => {
    // TODO: Connect to live WebSocket or database telemetry stream
  }, []);

  return (
    <div className="min-h-screen bg-[#f4f7fb] p-8 font-sans">
      <div className="max-w-5xl mx-auto">
        <header className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-black text-[#0b132b]">Classroom Radar</h1>
            <p className="text-slate-600 font-medium mt-1">Real-time heart rate & oxygen monitoring during classroom activities.</p>
          </div>
          <Link to="/?role=caretaker" className="px-4 py-2 bg-white text-slate-600 font-bold rounded-xl border border-slate-200 hover:bg-slate-50 shadow-sm inline-block">
            ← Back to Dashboard
          </Link>
        </header>

        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-12 text-center">
          <div className="text-5xl mb-4 opacity-40">📡</div>
          <h3 className="text-xl font-bold text-slate-700">No Active Wearables Connected</h3>
          <p className="text-slate-500 mt-2 max-w-md mx-auto">
            Live telemetry streams will appear here once ESP32 classroom devices establish connection.
          </p>
        </div>
      </div>
    </div>
  );
}