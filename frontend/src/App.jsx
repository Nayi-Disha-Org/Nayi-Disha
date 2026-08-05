import React, { useState, useContext } from "react";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import { AuthContext, AuthProvider } from "./context/AuthContext";

function MainApp() {
  const { user, logoutUser } = useContext(AuthContext);
  const [selectedRole, setSelectedRole] = useState(null);
  const [activeTab, setActiveTab] = useState("parent");
  const [authMode, setAuthMode] = useState("login"); // Toggles between login and register

  if (!selectedRole) {
    return (
      <div className="min-h-screen bg-[#0b132b] flex items-center justify-center px-6 relative overflow-hidden font-sans">
        <div className="absolute top-10 left-10 w-32 h-32 bg-[#ff7a59] rounded-full mix-blend-multiply filter blur-2xl opacity-50 animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-40 h-40 bg-[#3b82f6] rounded-full mix-blend-multiply filter blur-2xl opacity-50 animate-pulse"></div>

        <div className="max-w-5xl w-full bg-white rounded-3xl p-8 md:p-12 shadow-2xl relative z-10 text-center border-4 border-slate-100">
          <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-[#ff7a59] text-white font-black text-3xl mb-4 shadow-lg shadow-orange-200">
            ND
          </div>

          <h1 className="text-3xl md:text-5xl font-black text-[#0b132b] tracking-tight mb-3">
            Welcome to Nayi Disha
          </h1>
          <p className="text-slate-600 text-base md:text-lg font-medium mb-10 max-w-xl mx-auto">
            Please select your profile to enter your customized portal.
          </p>

          <div className="grid md:grid-cols-3 gap-6 text-left">
            <button
              onClick={() => {
                setSelectedRole("parent");
                setActiveTab("parent");
              }}
              className="bg-[#f4f7fb] hover:bg-[#fff5f2] p-6 rounded-3xl border-2 border-transparent hover:border-[#ff7a59] transition-all group shadow-sm hover:shadow-md text-left flex flex-col justify-between"
            >
              <div>
                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">
                  🏡
                </div>
                <h2 className="text-xl font-black text-[#0b132b] mb-2">
                  Parent Portal
                </h2>
                <p className="text-xs text-slate-600 font-medium leading-relaxed">
                  Access daily ABC mood logs, child passport, sensor tracking,
                  and IEP home roadmap.
                </p>
              </div>
              <span className="mt-6 inline-flex items-center text-xs font-black text-[#ff7a59] uppercase tracking-wider">
                Enter Portal →
              </span>
            </button>

            <button
              onClick={() => {
                setSelectedRole("caretaker");
                setActiveTab("caretaker");
              }}
              className="bg-[#f4f7fb] hover:bg-[#f0f7ff] p-6 rounded-3xl border-2 border-transparent hover:border-[#3b82f6] transition-all group shadow-sm hover:shadow-md text-left flex flex-col justify-between"
            >
              <div>
                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">
                  🏫
                </div>
                <h2 className="text-xl font-black text-[#0b132b] mb-2">
                  Caretaker / NGO
                </h2>
                <p className="text-xs text-slate-600 font-medium leading-relaxed">
                  Review morning handovers, monitor live classroom radar, and
                  send quick updates.
                </p>
              </div>
              <span className="mt-6 inline-flex items-center text-xs font-black text-[#3b82f6] uppercase tracking-wider">
                Enter Portal →
              </span>
            </button>

            <button
              onClick={() => {
                setSelectedRole("admin");
                setActiveTab("admin");
              }}
              className="bg-[#f4f7fb] hover:bg-[#f5f3ff] p-6 rounded-3xl border-2 border-transparent hover:border-[#8b5cf6] transition-all group shadow-sm hover:shadow-md text-left flex flex-col justify-between"
            >
              <div>
                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">
                  ⚙️
                </div>
                <h2 className="text-xl font-black text-[#0b132b] mb-2">
                  Admin Dashboard
                </h2>
                <p className="text-xs text-slate-600 font-medium leading-relaxed">
                  Manage clinical triage, system overrides, IoT fleets, and NGO
                  onboarding.
                </p>
              </div>
              <span className="mt-6 inline-flex items-center text-xs font-black text-[#8b5cf6] uppercase tracking-wider">
                Enter Command Center →
              </span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f4f7fb] text-slate-800 font-sans animate-fade-in-up">
      <header className="sticky top-0 z-50 bg-white shadow-sm border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-full bg-[#ff7a59] flex items-center justify-center text-white font-black text-2xl shadow-lg shadow-orange-200">
              ND
            </div>
            <div>
              <span className="text-2xl font-black text-[#0b132b] tracking-tight">
                Nayi Disha
              </span>
              <span className="block text-[10px] font-extrabold text-[#ff7a59] uppercase tracking-widest">
                {selectedRole === "parent"
                  ? "Parent Workspace"
                  : selectedRole === "caretaker"
                    ? "Caretaker Floor"
                    : "Admin Command Center"}
              </span>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-base font-bold text-slate-600">
            <a
              href="#about"
              className="hover:text-[#ff7a59] transition-colors flex items-center gap-1"
            >
              About <span className="text-xs">▼</span>
            </a>
            <a
              href="#dashboard"
              className="hover:text-[#ff7a59] transition-colors flex items-center gap-1"
            >
              Dashboard <span className="text-xs">▼</span>
            </a>
            <a
              href="#features"
              className="hover:text-[#ff7a59] transition-colors flex items-center gap-1"
            >
              Features <span className="text-xs">▼</span>
            </a>
          </nav>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setSelectedRole(null)}
              className="hidden md:block font-bold text-slate-400 hover:text-[#0b132b] transition-colors text-sm"
            >
              Switch Role
            </button>
            <button className="px-6 py-2.5 rounded-full bg-[#0b132b] text-white font-bold text-sm hover:bg-slate-800 transition-all shadow-md active:scale-95">
              Account Settings
            </button>
          </div>
        </div>
      </header>

      <section
        id="about"
        className="relative pt-16 pb-24 md:pt-20 md:pb-32 overflow-hidden bg-[#0b132b]"
      >
        <div className="absolute top-10 left-10 w-24 h-24 bg-[#ff7a59] rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute top-10 right-20 w-32 h-32 bg-[#4ade80] rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>

        <div className="max-w-7xl mx-auto px-6 text-center relative z-10">
          <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight leading-tight max-w-4xl mx-auto mb-6">
            Welcome to the{" "}
            <span
              className={
                selectedRole === "admin"
                  ? "text-[#8b5cf6] capitalize"
                  : "text-[#ff7a59] capitalize"
              }
            >
              {selectedRole}
            </span>
            {" Dashboard"}
          </h1>
          <p className="text-lg md:text-xl text-slate-300 max-w-2xl mx-auto mb-10 leading-relaxed font-medium">
            {selectedRole === "admin"
              ? "Your unified command center for clinical oversight, system diagnostics, and global overrides."
              : "Your customized workspace for monitoring metrics, managing schedules, and interacting with the Nayi Disha ecosystem."}
          </p>
        </div>

        <div className="absolute bottom-0 w-full overflow-hidden leading-none">
          <svg
            viewBox="0 0 1200 120"
            preserveAspectRatio="none"
            className="relative block w-full h-[60px] md:h-[100px]"
            style={{ transform: "rotate(180deg)" }}
          >
            <path
              d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"
              className="fill-[#f4f7fb]"
            ></path>
          </svg>
        </div>
      </section>

      <section id="dashboard" className="py-20 relative z-20 -mt-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            {/* PARENT TAB LOGIC */}
            {activeTab === "parent" && (
              <div className="animate-fade-in-up">
                {user ? (
                  <div className="space-y-8">
                    <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex flex-col md:flex-row items-center justify-between gap-4">
                      <div>
                        <h2 className="text-2xl font-black text-[#0b132b]">
                          Welcome back, {user.full_name}! 👋
                        </h2>
                        <p className="text-slate-500 font-medium text-sm">
                          You are successfully logged into the parent portal.
                        </p>
                      </div>
                      <button
                        onClick={logoutUser}
                        className="px-6 py-2 bg-red-50 text-red-500 font-bold rounded-xl hover:bg-red-100 transition-colors"
                      >
                        Sign Out
                      </button>
                    </div>

                    {/* Existing 3 Column Grid */}
                    <div className="grid md:grid-cols-3 gap-6">
                      <div className="bg-white p-8 rounded-3xl shadow-lg border-t-8 border-[#ff7a59] hover:-translate-y-1 transition-transform">
                        <div className="text-4xl mb-4">❤️</div>
                        <h3 className="font-black text-xl text-[#0b132b] mb-3">
                          Care & Health
                        </h3>
                        <p className="font-medium text-slate-600 leading-relaxed">
                          IoT sensor monitoring, ABC mood logs, health & med
                          trackers, and SOS emergency desk.
                        </p>
                      </div>
                      <div className="bg-white p-8 rounded-3xl shadow-lg border-t-8 border-[#fbbf24] hover:-translate-y-1 transition-transform">
                        <div className="text-4xl mb-4">📅</div>
                        <h3 className="font-black text-xl text-[#0b132b] mb-3">
                          Daily Living & Academic
                        </h3>
                        <p className="font-medium text-slate-600 leading-relaxed">
                          Custom routine designer, IEP roadmap translator,
                          progress charts, and gamified rewards.
                        </p>
                      </div>
                      <div className="bg-white p-8 rounded-3xl shadow-lg border-t-8 border-[#8b5cf6] hover:-translate-y-1 transition-transform">
                        <div className="text-4xl mb-4">📜</div>
                        <h3 className="font-black text-xl text-[#0b132b] mb-3">
                          Admin & Logistics
                        </h3>
                        <p className="font-medium text-slate-600 leading-relaxed">
                          Secure medical vault, UDID & government grants hub,
                          device manager, and live center feed.
                        </p>
                      </div>
                    </div>
                  </div>
                ) : authMode === "login" ? (
                  <Login onSwitchToRegister={() => setAuthMode("register")} />
                ) : (
                  <Register onSwitchToLogin={() => setAuthMode("login")} />
                )}
              </div>
            )}

            {/* CARETAKER TAB */}
            {activeTab === "caretaker" && (
              <div className="grid md:grid-cols-3 gap-6 animate-fade-in-up">
                <div className="bg-white p-8 rounded-3xl shadow-lg border-t-8 border-[#3b82f6] hover:-translate-y-1 transition-transform">
                  <div className="text-4xl mb-4">🌅</div>
                  <h3 className="font-black text-xl text-[#0b132b] mb-3">
                    Morning Handover
                  </h3>
                  <p className="font-medium text-slate-600 leading-relaxed">
                    Instantly reviews sleep, diet, and low-demand mode triggers
                    before morning sessions start.
                  </p>
                </div>
                <div className="bg-white p-8 rounded-3xl shadow-lg border-t-8 border-[#0ea5e9] hover:-translate-y-1 transition-transform">
                  <div className="text-4xl mb-4">📡</div>
                  <h3 className="font-black text-xl text-[#0b132b] mb-3">
                    Classroom Radar
                  </h3>
                  <p className="font-medium text-slate-600 leading-relaxed">
                    Real-time heart rate & oxygen monitoring during classroom
                    activities to prevent sensory overload.
                  </p>
                </div>
                <div className="bg-white p-8 rounded-3xl shadow-lg border-t-8 border-[#6366f1] hover:-translate-y-1 transition-transform">
                  <div className="text-4xl mb-4">⚡</div>
                  <h3 className="font-black text-xl text-[#0b132b] mb-3">
                    Quick-Stamp Cast
                  </h3>
                  <p className="font-medium text-slate-600 leading-relaxed">
                    One-tap updates ("Finished Physio", "Ate Lunch") sent
                    straight to parents in real-time.
                  </p>
                </div>
              </div>
            )}

            {/* ADMIN TAB */}
            {activeTab === "admin" && (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in-up">
                <div className="bg-white p-8 rounded-3xl shadow-lg border-t-8 border-[#10b981] hover:-translate-y-1 transition-transform">
                  <div className="text-4xl mb-4">🎯</div>
                  <h3 className="font-black text-xl text-[#0b132b] mb-3">
                    Clinical Triage
                  </h3>
                  <p className="font-medium text-slate-600 leading-relaxed">
                    Flagged inbox for children needing attention and
                    drag-and-drop IEP goal builders.
                  </p>
                </div>
                <div className="bg-white p-8 rounded-3xl shadow-lg border-t-8 border-[#14b8a6] hover:-translate-y-1 transition-transform">
                  <div className="text-4xl mb-4">📟</div>
                  <h3 className="font-black text-xl text-[#0b132b] mb-3">
                    IoT Fleet Tracker
                  </h3>
                  <p className="font-medium text-slate-600 leading-relaxed">
                    Centralized diagnostic screen monitoring battery health,
                    firmware, and sync for ESP32 devices globally.
                  </p>
                </div>
                <div className="bg-white p-8 rounded-3xl shadow-lg border-t-8 border-[#059669] hover:-translate-y-1 transition-transform">
                  <div className="text-4xl mb-4">🏛️</div>
                  <h3 className="font-black text-xl text-[#0b132b] mb-3">
                    Verification Desk
                  </h3>
                  <p className="font-medium text-slate-600 leading-relaxed">
                    Review medical certificates and process state/central UDID
                    benefit applications efficiently.
                  </p>
                </div>
                <div className="bg-white p-8 rounded-3xl shadow-lg border-t-8 border-red-500 hover:-translate-y-1 transition-transform">
                  <div className="text-4xl mb-4">🛑</div>
                  <h3 className="font-black text-xl text-[#0b132b] mb-3">
                    User Override
                  </h3>
                  <p className="font-medium text-slate-600 leading-relaxed">
                    Force password resets, freeze compromised accounts, or
                    permanently ban malicious users across the platform.
                  </p>
                </div>
                <div className="bg-white p-8 rounded-3xl shadow-lg border-t-8 border-orange-500 hover:-translate-y-1 transition-transform">
                  <div className="text-4xl mb-4">🔌</div>
                  <h3 className="font-black text-xl text-[#0b132b] mb-3">
                    Global Kill Switch
                  </h3>
                  <p className="font-medium text-slate-600 leading-relaxed">
                    Instantly disable vulnerable modules like the Parent Forum
                    if attacked, without impacting medical logs.
                  </p>
                </div>
                <div className="bg-white p-8 rounded-3xl shadow-lg border-t-8 border-purple-500 hover:-translate-y-1 transition-transform">
                  <div className="text-4xl mb-4">🏢</div>
                  <h3 className="font-black text-xl text-[#0b132b] mb-3">
                    NGO Onboarding
                  </h3>
                  <p className="font-medium text-slate-600 leading-relaxed">
                    Generate master credentials, configure rate limits, and
                    initialize isolated database environments.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      <section id="features" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-black text-[#0b132b] mb-4">
              Platform Features
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-[#f4f7fb] p-8 rounded-3xl border-2 border-transparent hover:border-[#ff7a59] transition-all group">
              <div className="h-16 w-16 rounded-2xl bg-white shadow-sm flex items-center justify-center font-bold text-3xl mb-6 group-hover:scale-110 transition-transform">
                📝
              </div>
              <h3 className="text-xl font-black text-[#0b132b] mb-3">
                ABC Behavioral Logger
              </h3>
              <p className="text-slate-600 font-medium leading-relaxed">
                Structured Antecedent-Behavior-Consequence logging that helps
                identify triggers mathematically.
              </p>
            </div>
            <div className="bg-[#f4f7fb] p-8 rounded-3xl border-2 border-transparent hover:border-[#fbbf24] transition-all group">
              <div className="h-16 w-16 rounded-2xl bg-white shadow-sm flex items-center justify-center font-bold text-3xl mb-6 group-hover:scale-110 transition-transform">
                🪪
              </div>
              <h3 className="text-xl font-black text-[#0b132b] mb-3">
                Dynamic Child Passport
              </h3>
              <p className="text-slate-600 font-medium leading-relaxed">
                Generate a 1-page PDF summarizing emergency contacts, triggers,
                and strategies for caregivers.
              </p>
            </div>
            <div className="bg-[#f4f7fb] p-8 rounded-3xl border-2 border-transparent hover:border-[#3b82f6] transition-all group">
              <div className="h-16 w-16 rounded-2xl bg-white shadow-sm flex items-center justify-center font-bold text-3xl mb-6 group-hover:scale-110 transition-transform">
                🌤️
              </div>
              <h3 className="text-xl font-black text-[#0b132b] mb-3">
                Weather Sensory Engine
              </h3>
              <p className="text-slate-600 font-medium leading-relaxed">
                Cross-references local weather forecasts to send proactive
                warnings for high sensory risks.
              </p>
            </div>
            <div className="bg-[#f4f7fb] p-8 rounded-3xl border-2 border-transparent hover:border-[#8b5cf6] transition-all group">
              <div className="h-16 w-16 rounded-2xl bg-white shadow-sm flex items-center justify-center font-bold text-3xl mb-6 group-hover:scale-110 transition-transform">
                🎙️
              </div>
              <h3 className="text-xl font-black text-[#0b132b] mb-3">
                Voice Quick-Log Widget
              </h3>
              <p className="text-slate-600 font-medium leading-relaxed">
                Single tap-to-talk button allowing exhausted parents to record
                audio updates that auto-populate logs.
              </p>
            </div>
            <div className="bg-[#f4f7fb] p-8 rounded-3xl border-2 border-transparent hover:border-[#10b981] transition-all group">
              <div className="h-16 w-16 rounded-2xl bg-white shadow-sm flex items-center justify-center font-bold text-3xl mb-6 group-hover:scale-110 transition-transform">
                🛋️
              </div>
              <h3 className="text-xl font-black text-[#0b132b] mb-3">
                Low-Demand Mode
              </h3>
              <p className="text-slate-600 font-medium leading-relaxed">
                Automatically strips away non-essential tasks on tough days,
                updating the ESP32 wearable to match.
              </p>
            </div>
            <div className="bg-[#f4f7fb] p-8 rounded-3xl border-2 border-transparent hover:border-[#ec4899] transition-all group">
              <div className="h-16 w-16 rounded-2xl bg-white shadow-sm flex items-center justify-center font-bold text-3xl mb-6 group-hover:scale-110 transition-transform">
                🏛️
              </div>
              <h3 className="text-xl font-black text-[#0b132b] mb-3">
                UDID & Benefit Guide
              </h3>
              <p className="text-slate-600 font-medium leading-relaxed">
                Dedicated hub tracking Unique Disability ID status and
                suggesting applicable government schemes.
              </p>
            </div>
          </div>
        </div>
      </section>

      <footer id="contact" className="bg-[#0b132b] text-slate-400 py-12">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-[#ff7a59] flex items-center justify-center text-white font-black text-lg">
              ND
            </div>
            <span className="text-xl font-black text-white tracking-tight">
              Nayi Disha
            </span>
          </div>
          <p className="text-sm text-slate-500 font-medium">
            © {new Date().getFullYear()} Nayi Disha. Built in collaboration with
            Sama Foundation.
          </p>
        </div>
      </footer>
    </div>
  );
}

// -------------------------------------------------------------
// This is the new Root Component that wraps your app in memory!
// -------------------------------------------------------------
export default function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}
