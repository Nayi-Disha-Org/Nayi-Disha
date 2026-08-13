import React, { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';

export default function RoleLogin() {
  const [searchParams] = useSearchParams();
  const role = searchParams.get('role') || 'parent';
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Define role-specific styling & labels
  const roleConfig = {
    parent: { title: "Parent Portal Login", color: "text-[#ff7a59]", border: "hover:border-[#ff7a59]", btn: "bg-[#ff7a59] hover:bg-orange-600", icon: "🏡" },
    caretaker: { title: "Caretaker / NGO Login", color: "text-[#3b82f6]", border: "hover:border-[#3b82f6]", btn: "bg-[#3b82f6] hover:bg-blue-600", icon: "🏫" },
    admin: { title: "Admin Command Center Login", color: "text-[#8b5cf6]", border: "hover:border-[#8b5cf6]", btn: "bg-[#8b5cf6] hover:bg-purple-600", icon: "⚙️" }
  };

  const currentRole = roleConfig[role] || roleConfig.parent;

  const handleLogin = (e) => {
    e.preventDefault();
    // After successful authentication, redirect back to home with the corresponding role query
    navigate(`/?role=${role}`);
  };

  return (
    <div className="min-h-screen bg-[#0b132b] flex items-center justify-center px-6 relative overflow-hidden font-sans">
      <div className="absolute top-10 left-10 w-32 h-32 bg-[#ff7a59] rounded-full mix-blend-multiply filter blur-2xl opacity-50 animate-pulse"></div>
      <div className="absolute bottom-10 right-10 w-40 h-40 bg-[#3b82f6] rounded-full mix-blend-multiply filter blur-2xl opacity-50 animate-pulse"></div>

      <div className="max-w-md w-full bg-white rounded-3xl p-8 md:p-10 shadow-2xl relative z-10 border-4 border-slate-100">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-[#0b132b] text-white font-black text-3xl mb-3 shadow-lg">
            {currentRole.icon}
          </div>
          <h1 className="text-2xl font-black text-[#0b132b] tracking-tight">
            {currentRole.title}
          </h1>
          <p className="text-xs text-slate-500 font-medium mt-1">
            Sign in to access your secure workspace.
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-xs font-black uppercase text-slate-500 mb-1">Email Address</label>
            <input 
              type="email" 
              required
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              placeholder={`${role}@nayidisha.org`} 
              className="w-full p-3.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-slate-800 font-medium" 
            />
          </div>

          <div>
            <label className="block text-xs font-black uppercase text-slate-500 mb-1">Password</label>
            <input 
              type="password" 
              required
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              placeholder="••••••••" 
              className="w-full p-3.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-slate-800 font-medium" 
            />
          </div>

          <button 
            type="submit" 
            className={`w-full py-3.5 rounded-xl text-white font-bold text-sm shadow-lg transition active:scale-95 ${currentRole.btn}`}
          >
            Sign In Securely →
          </button>
        </form>

        <div className="mt-8 text-center border-t border-slate-100 pt-4">
          <Link to="/" className="text-xs font-bold text-slate-400 hover:text-slate-700 transition">
            ← Back to Role Selection
          </Link>
        </div>
      </div>
    </div>
  );
}