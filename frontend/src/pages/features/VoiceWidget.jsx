import React, { useState, useEffect, useContext, useRef } from 'react';
import { Link } from 'react-router-dom';
import API from '../../services/api';
import { AuthContext } from '../../context/AuthContext';

export default function VoiceWidget() {
  const { user } = useContext(AuthContext);
  const [logs, setLogs] = useState([]);
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [saving, setSaving] = useState(false);
  const [filter, setFilter] = useState('All');
  const [manualText, setManualText] = useState('');
  const recognitionRef = useRef(null);

  const categories = ['All', 'Behavior Alert', 'Sensory Trigger', 'Diet & Meal', 'Sleep Cycle', 'Daily Routine'];

  useEffect(() => {
    if (user?.id) fetchVoiceLogs();
  }, [user]);

  const fetchVoiceLogs = async () => {
    try {
      const res = await API.get(`/health/voice-logs/${user.id}`);
      setLogs(res.data);
    } catch (err) {
      console.error("Failed to load voice logs:", err);
    }
  };

  const startListening = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return alert("Speech recognition isn't supported in this browser.");

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-IN';

    recognition.onstart = () => { setIsRecording(true); setTranscript(''); };
    recognition.onresult = (event) => {
      const text = event.results[0][0].transcript;
      setTranscript(text);
      saveLog(text);
    };
    recognition.onerror = () => setIsRecording(false);
    recognition.onend = () => setIsRecording(false);

    recognitionRef.current = recognition;
    recognition.start();
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsRecording(false);
    }
  };

  const categorizeNote = (text) => {
    const lower = text.toLowerCase();
    if (lower.match(/meltdown|scream|cry|hit/)) return 'Behavior Alert';
    if (lower.match(/noise|light|sound|loud/)) return 'Sensory Trigger';
    if (lower.match(/eat|lunch|dinner|food/)) return 'Diet & Meal';
    if (lower.match(/sleep|nap|wake|tired/)) return 'Sleep Cycle';
    return 'Daily Routine';
  };

  const saveLog = async (text) => {
    if (!text.trim() || !user?.id) return;
    setSaving(true);
    try {
      const res = await API.post('/health/voice-logs', { parent_id: user.id, transcript: text, category: categorizeNote(text) });
      setLogs((prev) => [res.data, ...prev]);
      setManualText('');
    } catch (err) {
      console.error("Failed to save note:", err);
    } finally {
      setSaving(false);
    }
  };

  const deleteLog = async (id) => {
    if (!window.confirm("Delete this log?")) return;
    try {
      await API.delete(`/health/voice-logs/${id}`);
      setLogs(logs.filter(log => log.id !== id));
    } catch (err) {
      console.error("Failed to delete", err);
    }
  };

  const filteredLogs = filter === 'All' ? logs : logs.filter(log => log.category === filter);

  return (
    <div className="min-h-screen bg-[#f4f7fb] p-8 font-sans">
      <div className="max-w-4xl mx-auto">
        <header className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-black text-[#0b132b]">Voice Quick-Log Widget</h1>
            <p className="text-slate-600 font-medium mt-1">Record audio notes; our AI auto-categorizes them into your database.</p>
          </div>
          <Link to="/?role=parent" className="px-4 py-2 bg-white text-slate-600 font-bold rounded-xl border border-slate-200 hover:bg-slate-50 shadow-sm">
            ← Back to Dashboard
          </Link>
        </header>

        {/* Input Section */}
        <div className="grid md:grid-cols-2 gap-6 mb-10">
          {/* Voice Input */}
          <div className="bg-white p-10 rounded-3xl shadow-sm border border-slate-100 flex flex-col items-center justify-center text-center">
            <button
              onClick={isRecording ? stopListening : startListening}
              className={`h-24 w-24 rounded-full flex items-center justify-center text-4xl shadow-lg transition-all duration-300 ${
                isRecording ? 'bg-red-500 text-white animate-pulse scale-110' : 'bg-[#0b132b] hover:bg-slate-800 text-white hover:scale-105'
              }`}
            >
              🎙️
            </button>
            <h3 className="mt-6 text-lg font-black text-[#0b132b]">{isRecording ? "Listening..." : "Tap to speak"}</h3>
            {saving && <p className="text-xs font-bold text-blue-600 mt-2 animate-pulse">Saving to database...</p>}
          </div>

          {/* Silent Manual Input */}
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 flex flex-col justify-between">
            <div>
              <h3 className="font-black text-lg text-[#0b132b] mb-2 flex items-center gap-2"><span>🤫</span> Silent Entry</h3>
              <p className="text-xs text-slate-500 mb-4">Can't speak right now? Type your note instead.</p>
              <textarea
                value={manualText}
                onChange={(e) => setManualText(e.target.value)}
                placeholder="E.g., Aarav struggled with the loud blender noise at breakfast..."
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:border-[#0b132b] focus:ring-0 resize-none h-24"
              ></textarea>
            </div>
            <button onClick={() => saveLog(manualText)} disabled={saving || !manualText.trim()} className="mt-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl transition disabled:opacity-50 w-full">
              Save Written Log
            </button>
          </div>
        </div>

        {/* Filter & Logs */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-black text-[#0b132b]">Stored Logs</h2>
          </div>
          
          <div className="flex flex-wrap gap-2 mb-6">
            {categories.map(cat => (
              <button 
                key={cat} onClick={() => setFilter(cat)}
                className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider transition-all ${
                  filter === cat ? 'bg-[#0b132b] text-white shadow-md' : 'bg-white text-slate-500 border border-slate-200 hover:bg-slate-100'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {filteredLogs.length === 0 ? (
            <div className="bg-white p-10 rounded-2xl border border-slate-100 text-center text-slate-400 font-medium">No logs found for this category.</div>
          ) : (
            <div className="space-y-4 animate-fade-in-up">
              {filteredLogs.map((log) => (
                <div key={log.id} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4 group">
                  <div className="space-y-1 pr-6">
                    <span className="inline-block px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-purple-100 text-purple-700">
                      {log.category}
                    </span>
                    <p className="text-slate-800 font-bold text-sm md:text-base mt-2">{log.transcript}</p>
                  </div>
                  <div className="flex flex-col items-end justify-between min-w-[120px]">
                    <button onClick={() => deleteLog(log.id)} className="text-slate-300 hover:text-red-500 transition-colors mb-2 md:opacity-0 md:group-hover:opacity-100">
                      🗑️
                    </button>
                    <div className="text-xs text-slate-400 font-bold text-right">
                      {new Date(log.created_at).toLocaleString('en-IN', { month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric', hour12: true })}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}