import React, { useState, useContext } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import API from "../../services/api";
import { AuthContext } from "../../context/AuthContext";

export default function RoleAuth() {
  const [searchParams] = useSearchParams();
  const role = searchParams.get("role") || "parent";

  // 🔒 SECURITY FIX: Only allow parents to sign up!
  const allowSignUp = role === "parent";

  // If they aren't a parent, force the mode to 'login' even if the URL says otherwise
  const initialMode = allowSignUp
    ? searchParams.get("mode") || "login"
    : "login";

  const [isLogin, setIsLogin] = useState(initialMode === "login");
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const navigate = useNavigate();
  const { loginUser } = useContext(AuthContext);

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // 👀 NEW FEATURE: Show password toggle state
  const [showPassword, setShowPassword] = useState(false);

  const roleConfig = {
    parent: {
      title: "Parent Portal",
      btn: "bg-[#ff7a59] hover:bg-orange-600",
      icon: "🏡",
    },
    caretaker: {
      title: "Caretaker / NGO",
      btn: "bg-[#3b82f6] hover:bg-blue-600",
      icon: "🏫",
    },
    admin: {
      title: "Admin Command Center",
      btn: "bg-[#8b5cf6] hover:bg-purple-600",
      icon: "⚙️",
    },
  };

  const currentRole = roleConfig[role] || roleConfig.parent;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");
    setLoading(true);

    try {
      // Inside handleSubmit:
      if (!isLogin && allowSignUp) {
        const response = await API.post("/auth/register", {
          full_name: fullName,
          email: email,
          password: password,
          role: role,
        });

        setIsLogin(true);
        setSuccessMessage("Account created successfully! Please sign in.");
        setPassword("");
        setShowPassword(false);
      } else {
        const response = await API.post("/auth/login", {
          email: email,
          password: password,
          role: role,
        });

        localStorage.setItem("token", response.data.token);
        if (loginUser) {
          loginUser(response.data.user, response.data.token);
        }

        navigate(`/?role=${role}`);
      }
    } catch (err) {
      setErrorMessage(
        err.response?.data?.message || "Server error. Please try again later.",
      );
    } finally {
      setLoading(false);
    }
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
            {allowSignUp && !isLogin
              ? "Create your account to get started."
              : "Sign in to access your secure workspace."}
          </p>
        </div>

        {/* Display Success & Error Messages */}
        {successMessage && (
          <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold rounded-xl text-center">
            {successMessage}
          </div>
        )}
        {errorMessage && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 text-xs font-bold rounded-xl text-center animate-pulse">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Only show Full Name if it's a login screen AND signups are allowed */}
          {!isLogin && allowSignUp && (
            <div>
              <label className="block text-xs font-black uppercase text-slate-500 mb-1">
                Full Name
              </label>
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
            <label className="block text-xs font-black uppercase text-slate-500 mb-1">
              Email Address
            </label>
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
            <label className="block text-xs font-black uppercase text-slate-500 mb-1">
              Password
            </label>
            {/* 👀 Dynamic type based on checkbox state */}
            <input
              type={showPassword ? "text" : "password"}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full p-3.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-slate-800 font-medium"
            />

            {/* 👀 Clean Checkbox UI */}
            <div className="mt-3 flex items-center gap-2 px-1">
              <input
                type="checkbox"
                id="show-password"
                checked={showPassword}
                onChange={() => setShowPassword(!showPassword)}
                className="w-4 h-4 rounded border-slate-300 text-[#0b132b] focus:ring-[#0b132b] cursor-pointer"
              />
              <label
                htmlFor="show-password"
                className="text-xs font-bold text-slate-500 cursor-pointer select-none hover:text-slate-700 transition"
              >
                Show Password
              </label>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3.5 mt-2 rounded-xl text-white font-bold text-sm shadow-lg transition active:scale-95 ${loading ? "opacity-70 cursor-not-allowed" : ""} ${currentRole.btn}`}
          >
            {loading
              ? "Processing..."
              : allowSignUp && !isLogin
                ? "Create Account →"
                : "Sign In Securely →"}
          </button>
        </form>

        {/* 🔒 SECURITY FIX: Hide the Sign Up toggle completely if they are not a parent */}
        {allowSignUp && (
          <div className="mt-6 text-center text-xs font-medium text-slate-500">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button
              type="button"
              onClick={() => {
                setIsLogin(!isLogin);
                setSuccessMessage("");
                setErrorMessage("");
                setShowPassword(false); // Reset password visibility on toggle
              }}
              className="font-bold text-[#0b132b] hover:underline ml-1"
            >
              {isLogin ? "Sign Up" : "Sign In"}
            </button>
          </div>
        )}

        <div className="mt-6 text-center border-t border-slate-100 pt-4">
          <Link
            to="/"
            className="text-xs font-bold text-slate-400 hover:text-slate-700 transition"
          >
            ← Back to Role Selection
          </Link>
        </div>
      </div>
    </div>
  );
}
