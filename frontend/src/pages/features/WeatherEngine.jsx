import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function WeatherEngine() {
  const [weatherData, setWeatherData] = useState(null);
  const [syncing, setSyncing] = useState(false);
  const [apiError, setApiError] = useState(false);

  useEffect(() => {
    const fetchLiveWeather = async () => {
      try {
        // Fetching real-time atmospheric data for Bengaluru, Karnataka
        const response = await fetch("https://api.open-meteo.com/v1/forecast?latitude=12.9716&longitude=77.5946&current=temperature_2m,relative_humidity_2m,surface_pressure,wind_speed_10m&daily=temperature_2m_max,weather_code&timezone=Asia%2FKolkata");
        
        if (!response.ok) throw new Error("Weather API unreachable");
        const data = await response.json();

        const current = data.current;
        const daily = data.daily;

        // --- DYNAMIC SENSORY RISK ENGINE ---
        let risk = "Low";
        let activeTriggers = [];
        let activeRecs = [];

        // 1. Humidity Check
        if (current.relative_humidity_2m > 70) {
            activeTriggers.push(`High ambient humidity (${current.relative_humidity_2m}%) can increase tactile defensiveness and irritability.`);
            activeRecs.push("Provide breathable clothing and a cool environment. Preemptively enable Low-Demand Mode.");
            risk = "Moderate";
        }
        // 2. Barometric Pressure Check
        if (current.surface_pressure < 1010) {
            activeTriggers.push(`Low barometric pressure (${current.surface_pressure} hPa) is a known trigger for tension headaches.`);
            activeRecs.push("Offer deep-pressure therapy (weighted blanket) to counteract atmospheric shifts.");
            risk = "High";
        }
        // 3. Wind Speed Check
        if (current.wind_speed_10m > 15) {
            activeTriggers.push(`Gusty winds (${current.wind_speed_10m} km/h) may cause auditory overstimulation.`);
            activeRecs.push("Ensure noise-canceling headphones are accessible today.");
            if (risk === "Low") risk = "Moderate";
        }

        // 4. Safe Day Fallback
        if (activeTriggers.length === 0) {
            activeTriggers.push("Atmospheric conditions are optimal. No major environmental shifts detected.");
            activeRecs.push("Standard routine can proceed normally today.");
        }

        // --- DYNAMIC 3-DAY FORECAST ---
        const forecastMap = daily.time.slice(1, 4).map((dateStr, idx) => {
            const temp = daily.temperature_2m_max[idx + 1];
            // Simple logic: If tomorrow is hotter than 30°C, risk is High
            const fRisk = temp > 30 ? "High" : temp > 27 ? "Moderate" : "Low";
            const fColor = fRisk === 'High' ? 'text-red-500' : fRisk === 'Moderate' ? 'text-amber-500' : 'text-emerald-500';
            
            return {
                day: new Date(dateStr).toLocaleDateString('en-IN', { weekday: 'long' }),
                temp: `${temp}°C`,
                risk: fRisk,
                riskColor: fColor,
                icon: fRisk === 'High' ? '☀️' : fRisk === 'Moderate' ? '⛅' : '☁️'
            };
        });

        setWeatherData({
          location: "Bengaluru, Karnataka",
          temperature: `${current.temperature_2m}°C`,
          humidity: `${current.relative_humidity_2m}%`,
          pressureTrend: current.surface_pressure < 1010 ? "Dropping 📉" : "Stable ➖",
          windSpeed: `${current.wind_speed_10m} km/h`,
          riskLevel: risk,
          triggers: activeTriggers,
          recommendations: activeRecs,
          forecast: forecastMap
        });

      } catch (error) {
        console.error("Failed to fetch telemetry", error);
        setApiError(true);
      }
    };

    fetchLiveWeather();
  }, []);

  const handleSyncWearable = () => {
    setSyncing(true);
    setTimeout(() => {
      setSyncing(false);
      alert("Success! Weather warnings synced to ESP32 Wearable.");
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-[#f4f7fb] p-8 font-sans">
      <div className="max-w-5xl mx-auto">
        <header className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black text-[#0b132b]">Weather Sensory Engine</h1>
            <p className="text-emerald-600 font-bold mt-1 text-sm flex items-center gap-2">
              <span className="relative flex h-2 w-2"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span><span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span></span>
              Live Telemetry Connected
            </p>
          </div>
          <Link to="/?role=parent" className="px-4 py-2 bg-white text-slate-600 font-bold rounded-xl border border-slate-200 hover:bg-slate-50 shadow-sm inline-block text-center">
            ← Back to Dashboard
          </Link>
        </header>

        {apiError ? (
          <div className="bg-red-50 p-16 rounded-3xl border border-red-200 text-center text-red-600 font-bold">
            Failed to connect to global weather satellites. Check your internet connection.
          </div>
        ) : !weatherData ? (
          <div className="bg-white p-16 rounded-3xl shadow-sm border border-slate-100 text-center animate-pulse">
            <div className="text-5xl mb-4 opacity-40">🌤️</div>
            <h3 className="text-xl font-bold text-slate-700">Fetching Live Weather Telemetry...</h3>
          </div>
        ) : (
          <div className="space-y-6 animate-fade-in-up">
            
            {/* Top Grid: Weather Stats & Risk Level */}
            <div className="grid md:grid-cols-3 gap-6">
              
              <div className="col-span-2 bg-gradient-to-br from-blue-500 to-indigo-600 p-8 rounded-3xl shadow-lg text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 -mt-4 -mr-4 text-9xl opacity-20">☁️</div>
                <div className="relative z-10">
                  <h3 className="text-blue-100 font-black tracking-wider uppercase text-xs mb-1">Current Telemetry</h3>
                  <h2 className="text-3xl font-black mb-6">{weatherData.location}</h2>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center divide-x divide-white/20">
                    <div><p className="text-blue-100 text-xs font-bold uppercase mb-1">Temp</p><p className="text-2xl font-black">{weatherData.temperature}</p></div>
                    <div><p className="text-blue-100 text-xs font-bold uppercase mb-1">Humidity</p><p className="text-2xl font-black">{weatherData.humidity}</p></div>
                    <div><p className="text-blue-100 text-xs font-bold uppercase mb-1">Pressure</p><p className="text-xl font-black">{weatherData.pressureTrend}</p></div>
                    <div><p className="text-blue-100 text-xs font-bold uppercase mb-1">Wind</p><p className="text-xl font-black">{weatherData.windSpeed}</p></div>
                  </div>
                </div>
              </div>

              <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 flex flex-col justify-center items-center text-center">
                <div className={`h-16 w-16 rounded-full flex items-center justify-center text-3xl mb-4 shadow-inner ${weatherData.riskLevel === 'High' ? 'bg-red-100 text-red-600' : weatherData.riskLevel === 'Moderate' ? 'bg-amber-100 text-amber-600' : 'bg-emerald-100 text-emerald-600'}`}>
                  {weatherData.riskLevel === 'High' ? '⚠️' : weatherData.riskLevel === 'Moderate' ? '⚡' : '✅'}
                </div>
                <h3 className="text-slate-500 font-bold uppercase text-xs tracking-widest mb-1">Overall Sensory Risk</h3>
                <p className={`text-3xl font-black mb-4 ${weatherData.riskLevel === 'High' ? 'text-red-600' : weatherData.riskLevel === 'Moderate' ? 'text-amber-500' : 'text-emerald-500'}`}>
                  {weatherData.riskLevel}
                </p>
              </div>
            </div>

            {/* Middle Grid: Triggers & AI Recommendations */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 flex flex-col justify-between">
                <div>
                  <h3 className="font-black text-xl text-[#0b132b] mb-4 flex items-center gap-2"><span>⚡</span> Detected Triggers</h3>
                  <ul className="space-y-3 mb-6">
                    {weatherData.triggers.map((trigger, idx) => (
                      <li key={idx} className="flex items-start gap-3 text-sm font-medium text-slate-700 bg-slate-50 p-4 rounded-xl border border-slate-100">
                        <span className="text-orange-500 mt-0.5">•</span>{trigger}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="bg-emerald-50 p-8 rounded-3xl shadow-sm border border-emerald-100 flex flex-col justify-between">
                <div>
                  <h3 className="font-black text-xl text-emerald-900 mb-4 flex items-center gap-2"><span>🛡️</span> AI Action Plan</h3>
                  <ul className="space-y-3 mb-6">
                    {weatherData.recommendations.map((rec, idx) => (
                      <li key={idx} className="flex items-start gap-3 text-sm font-bold text-emerald-800 bg-white p-4 rounded-xl shadow-sm border border-emerald-50">
                        <span className="text-emerald-500 mt-0.5">✓</span>{rec}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-emerald-200/50">
                  <button onClick={handleSyncWearable} disabled={syncing} className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl transition shadow-md active:scale-95 text-sm">
                    {syncing ? "Syncing..." : "⌚ Sync to Wearable"}
                  </button>
                  <button onClick={() => alert("Success! Weather warning sent to the caretaker's dashboard.")} className="flex-1 py-3 bg-white text-emerald-800 border border-emerald-200 hover:bg-emerald-100 font-bold rounded-xl transition text-sm">
                    🏫 Alert Caretaker
                  </button>
                </div>
              </div>
            </div>

            {/* Bottom Section: 3-Day Sensory Forecast */}
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
              <h3 className="font-black text-xl text-[#0b132b] mb-6 flex items-center gap-2"><span>📅</span> 3-Day Sensory Forecast</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {weatherData.forecast.map((day, idx) => (
                  <div key={idx} className="p-5 rounded-2xl border border-slate-100 hover:shadow-md transition flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <span className="text-4xl">{day.icon}</span>
                      <div>
                        <p className="font-black text-slate-800">{day.day}</p>
                        <p className="text-slate-500 font-bold text-sm">{day.temp}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] font-black uppercase text-slate-400">Risk</p>
                      <p className={`font-black ${day.riskColor}`}>{day.risk}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}