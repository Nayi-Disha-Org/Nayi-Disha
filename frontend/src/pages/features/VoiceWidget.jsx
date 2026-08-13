import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function VoiceWidget() {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [savedNotes, setSavedNotes] = useState([]); // Empty state: waiting for database entries

  useEffect(() => {
    // TODO: Fetch past voice logs from backend database endpoint
  }, []);

  const toggleRecording = () => {
    setIsRecording(!isRecording);
    if (!isRecording) {
      // Placeholder for Web Speech API integration or audio stream capture
      setTranscript('Listening... Speak your observation notes.');
    }
  };

  const handleSaveToDatabase = () => {
    if (!transcript) return;
    const newEntry = {
      id: Date.now(),
      text: transcript,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setSavedNotes([newEntry, ...savedNotes]);
    setTranscript('');
  };

  return (
    <div className="min-h-screen bg-[#f4f7fb] p-8 font-sans">
      <div className="max-w-3xl mx-auto">
        <header className="mb-12 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-black text-[#0b132b]">Voice Quick-Log Widget</h1>
            <p className="text-slate-600 font-medium mt-1">Record audio notes; our AI auto-populates logs into your database.</p>
          </div>
          <Link to="/?role=parent" className="px-4 py-2 bg-white text-slate-600 font-bold rounded-xl border border-slate-200 hover:bg-slate-50 shadow-sm inline-block">
            ← Back to Dashboard
          </Link>
        </header>

        <div className="bg-white p-12 rounded-3xl shadow-sm border border-slate-100 flex flex-col items-center justify-center space-y-6 text-center">
          <button 
            onClick={toggleRecording}
            className={`h-28 w-28 rounded-full flex items-center justify-center text-4xl shadow-xl transition-all ${
              isRecording ? 'bg-red-500 text-white animate-pulse scale-110' : 'bg-[#0b132b] text-white hover:bg-slate-800'
            }`}
          >
            🎙️
          </button>
          <p className="font-bold text-slate-700 text-lg">
            {isRecording ? "Recording audio... Tap to stop." : "Tap microphone to start voice note"}
          </p>

          {transcript && (
            <div className="w-full mt-6 p-6 bg-slate-50 rounded-2xl border border-slate-200 text-left">
              <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider block mb-1">Live Transcription Preview</span>
              <p className="text-sm font-semibold text-slate-800">{transcript}</p>
              <button 
                onClick={handleSaveToDatabase}
                className="mt-4 px-5 py-2 bg-[#10b981] text-white text-xs font-bold rounded-xl shadow-md hover:bg-emerald-600 transition"
              >
                Save to Database ✓
              </button>
            </div>
          )}
        </div>

        {/* Stored Voice Notes */}
        <div className="mt-8 space-y-4">
          <h3 className="text-xl font-black text-[#0b132b]">Stored Voice Logs</h3>
          {savedNotes.length === 0 ? (
            <div className="bg-white p-8 rounded-2xl text-center border border-slate-100">
              <p className="text-slate-400 text-sm font-medium">No recorded voice notes stored yet.</p>
            </div>
          ) : (
            savedNotes.map((note) => (
              <div key={note.id} className="bg-white p-4 rounded-2xl border border-slate-100 flex justify-between items-center">
                <p className="text-sm text-slate-700 font-medium">{note.text}</p>
                <span className="text-xs text-slate-400 font-bold">{note.timestamp}</span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}