import React, { useState, useContext } from "react";
import API from "../../services/api";
import { AuthContext } from "../../context/AuthContext";

export default function Register({ onSwitchToLogin }) {
  const { loginUser } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    role: "parent",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Send data to your Node.js /register route
      const res = await API.post("/auth/register", formData);
      loginUser(res.data.user, res.data.token);
    } catch (err) {
      setError(
        err.response?.data?.message || "Registration failed. Try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md w-full mx-auto bg-white p-8 rounded-3xl shadow-xl border-2 border-slate-100 font-sans mt-10 animate-fade-in-up">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center h-14 w-14 rounded-2xl bg-[#ff7a59] text-white font-black text-2xl mb-3 shadow-md shadow-orange-200">
          ✍️
        </div>
        <h2 className="text-2xl font-black text-[#0b132b]">Create Account</h2>
        <p className="text-xs text-slate-500 font-medium mt-1">
          Register to connect with Sama Foundation
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
            Full Name
          </label>
          <input
            type="text"
            required
            className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-sm font-medium focus:outline-none focus:border-[#ff7a59] focus:bg-white transition-all"
            placeholder="John Doe"
            value={formData.fullName}
            onChange={(e) =>
              setFormData({ ...formData, fullName: e.target.value })
            }
          />
        </div>

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
          className="w-full py-3.5 bg-[#ff7a59] text-white font-black text-sm rounded-xl shadow-lg shadow-orange-200 hover:bg-[#e06843] active:scale-95 transition-all mt-2"
        >
          {loading ? "Creating Account..." : "Register →"}
        </button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-xs text-slate-500 font-medium">
          Already have an account?{" "}
          <button
            onClick={onSwitchToLogin}
            className="text-[#ff7a59] font-black hover:underline ml-1"
          >
            Login Here
          </button>
        </p>
      </div>
    </div>
  );
}
