import React, { useState, useContext } from "react";
import API from "../../services/api";
import { AuthContext } from "../../context/AuthContext";

export default function Login({ onSwitchToRegister }) {
  const { loginUser } = useContext(AuthContext);
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Send data to your Node.js /login route
      const res = await API.post("/auth/login", formData);
      loginUser(res.data.user, res.data.token);
    } catch (err) {
      setError(
        err.response?.data?.message || "Login failed. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md w-full mx-auto bg-white p-8 rounded-3xl shadow-xl border-2 border-slate-100 font-sans mt-10 animate-fade-in-up">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center h-14 w-14 rounded-2xl bg-[#ff7a59] text-white font-black text-2xl mb-3 shadow-md shadow-orange-200">
          🏡
        </div>
        <h2 className="text-2xl font-black text-[#0b132b]">Parent Login</h2>
        <p className="text-xs text-slate-500 font-medium mt-1">
          Sign in to access the Nayi Disha portal
        </p>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 text-xs font-bold p-3 rounded-xl mb-4 border border-red-200 text-center">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-1">
            Email Address
          </label>
          <input
            type="email"
            required
            className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-sm font-medium focus:outline-none focus:border-[#ff7a59] focus:bg-white transition-all"
            placeholder="parent@example.com"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
          />
        </div>

        <div>
          <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-1">
            Password
          </label>
          <input
            type="password"
            required
            className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-sm font-medium focus:outline-none focus:border-[#ff7a59] focus:bg-white transition-all"
            placeholder="••••••••"
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3.5 bg-[#0b132b] text-white font-black text-sm rounded-xl shadow-lg hover:bg-slate-800 active:scale-95 transition-all mt-2"
        >
          {loading ? "Authenticating..." : "Secure Login →"}
        </button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-xs text-slate-500 font-medium">
          Don't have an account?{" "}
          <button
            onClick={onSwitchToRegister}
            className="text-[#ff7a59] font-black hover:underline ml-1"
          >
            Register Here
          </button>
        </p>
      </div>
    </div>
  );
}
