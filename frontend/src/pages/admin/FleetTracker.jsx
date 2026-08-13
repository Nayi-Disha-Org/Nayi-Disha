import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export default function FleetTracker() {
  const [devices, setDevices] = useState([]);

  const getBatteryColor = (level) => {
    if (level <= 15) return "text-red-600 bg-red-100";
    if (level <= 50) return "text-yellow-600 bg-yellow-100";
    return "text-green-600 bg-green-100";
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'Online': return "bg-green-500";
      case 'Offline': return "bg-red-500";
      case 'Charging': return "bg-blue-500";
      default: return "bg-gray-400";
    }
  };

  return (
    <div className="min-h-screen bg-[#f4f7fb] p-8">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-black text-[#0b132b]">IoT Fleet Tracker</h1>
            <p className="text-slate-600 font-medium mt-1">Live diagnostics for all deployed ESP32 sensory wearables.</p>
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
            <div className="col-span-3">Device ID & Status</div>
            <div className="col-span-3">Assigned Child</div>
            <div className="col-span-2 text-center">Battery</div>
            <div className="col-span-2">Last Sync</div>
            <div className="col-span-2 text-center">Diagnostics</div>
          </div>

          <div className="divide-y divide-slate-100">
            {devices.length === 0 ? (
              <div className="p-12 text-center">
                <div className="text-4xl mb-3 opacity-50">📟</div>
                <h3 className="text-lg font-bold text-slate-700">No Devices Detected</h3>
                <p className="text-slate-500 mt-1">Fleet data will populate here once the server connection is established.</p>
              </div>
            ) : (
              devices.map((device, index) => (
                <div key={index} className="p-5 grid grid-cols-12 gap-4 items-center hover:bg-slate-50 transition-colors">
                  <div className="col-span-3 flex items-center gap-3">
                    <span className="relative flex h-3 w-3">
                      {device.status === 'Online' && (
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                      )}
                      <span className={`relative inline-flex rounded-full h-3 w-3 ${getStatusColor(device.status)}`}></span>
                    </span>
                    <div>
                      <div className="font-bold text-slate-900">{device.deviceId}</div>
                      <div className="text-xs font-medium text-slate-500">{device.status}</div>
                    </div>
                  </div>
                  <div className="col-span-3 font-semibold text-slate-700">{device.assignedTo}</div>
                  <div className="col-span-2 flex justify-center">
                    <span className={`px-3 py-1 rounded-full text-xs font-black ${getBatteryColor(device.battery)}`}>
                      {device.battery}%
                    </span>
                  </div>
                  <div className="col-span-2 text-sm font-medium text-slate-500">{device.lastSync}</div>
                  <div className="col-span-2 flex justify-center">
                    {device.calibration === 'Valid' ? (
                      <span className="text-green-500 font-bold text-sm">✅ OK</span>
                    ) : (
                      <button className="px-3 py-1 bg-red-50 text-red-600 border border-red-200 rounded-lg text-xs font-bold hover:bg-red-100">
                        Recalibrate
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}