import React, { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';

export default function RoleAuth() {
  const [searchParams] = useSearchParams();
  const role = searchParams.get('role') || 'parent';
  const initialMode = searchParams.get('mode') || 'login';
  
  const [isLogin, setIsLogin] = useState(initialMode === 'login');
  const navigate = useNavigate();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const roleConfig = {
    parent: { title: "Parent Portal", btn: "bg-[#ff7a59] hover:bg-orange-600", icon: "🏡" },
    caretaker: { title: "Caretaker / NGO", btn: "bg-[#3b82f6] hover:bg-blue-600", icon: "🏫" },
    admin: { title: "Admin Command Center", btn: "bg-[#8b5cf6] hover:bg-purple-600", icon: "⚙️" }
  };

  const currentRole = roleConfig[role] || roleConfig.parent;

  const handleSubmit = (e) => {
    e.preventDefault();
    // After successful authentication or registration, route into the dashboard
    navigate(`/?role=${role}`);
  };

  return (
    <div className="min-h-screen bg-[#0b132b] flex items-center justify-center px-6 relative overflow-hidden font-sans">
      <div className="absolute top-10 left-10 w-32 h-32 bg-[#ff7a59] rounded-full mix-blend-multiply filter blur-2xl opacity-50 animate-pulse"></div>
      <div className="absolute bottom-10 right-10 w-40 h-40 bg-[#3b82f6] rounded-full mix-blend-multiply filter blur-2xl opacity-50 animate-pulse"></div>

      <div className="max-w-md w-full bg-white rounded-3xl p-8 md:p-10 shadow-2xl relative z-10 border-4 border-slate-100">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-[#0b132b] text-white font-black text-3xl mb-3 shadow-lg">
            {currentRole.icon}
          </div>
          <h1 className="text-2xl font-black text-[#0b132b] tracking-tight">
            {currentRole.title}
          </h1>
          <p className="text-xs text-slate-500 font-medium mt-1">
            {isLogin ? 'Sign in to access your secure workspace.' : 'Create your account to get started.'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div>
              <label className="block text-xs font-black uppercase text-slate-500 mb-1">Full Name</label>
              <input 
                type="text" 
                required
                value={fullName} 
                onChange={(e) => setFullName(e.target.value)} 
                placeholder="John Doe" 
                className="w-full p-3.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-slate-800 font-medium" 
              />
            </div>
          )}

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
            {isLogin ? 'Sign In Securely →' : 'Create Account →'}
          </button>
        </form>

        <div className="mt-6 text-center text-xs font-medium text-slate-500">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <button 
            type="button"
            onClick={() => setIsLogin(!isLogin)} 
            className="font-bold text-[#0b132b] hover:underline ml-1"
          >
            {isLogin ? 'Sign Up' : 'Sign In'}
          </button>
        </div>

        <div className="mt-6 text-center border-t border-slate-100 pt-4">
          <Link to="/" className="text-xs font-bold text-slate-400 hover:text-slate-700 transition">
            ← Back to Role Selection
          </Link>
        </div>
      </div>
    </div>
  );
}