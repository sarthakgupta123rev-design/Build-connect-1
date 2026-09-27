import React, { useState } from 'react';
import { Settings, Sparkles, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { CITIES } from '../mock/data';

export const SettingsPage: React.FC = () => {
  const { user, role, setRole } = useAuth();
  const [defaultCity, setDefaultCity] = useState(user?.city || 'Jaipur');
  const [notifications, setNotifications] = useState(true);
  const [smsAlerts, setSmsAlerts] = useState(true);
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div>
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 text-xs font-bold mb-2">
          <Settings className="w-4 h-4 text-cyan-400" />
          <span>SYSTEM PREFERENCES</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white">Account & App Settings</h1>
        <p className="text-sm text-gray-400 mt-1">
          Manage your default dispatch location, role preferences, and notification channels.
        </p>
      </div>

      {saved && (
        <div className="p-4 rounded-2xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          <span>Preferences updated successfully!</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* Active Role Selector */}
        <div className="glass-card rounded-3xl p-6 border border-slate-800 space-y-4">
          <h3 className="font-bold text-white text-base pb-2 border-b border-slate-800">Active Platform Role</h3>
          <div className="flex items-center justify-between text-xs">
            <div>
              <div className="font-bold text-gray-200">Current Role: {role.toUpperCase()}</div>
              <div className="text-gray-400 mt-0.5">Toggle between Customer booking mode and Worker dispatch mode.</div>
            </div>
            <div className="flex items-center p-1 rounded-2xl bg-slate-900 border border-slate-800">
              <button
                type="button"
                onClick={() => setRole('customer')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                  role === 'customer' ? 'bg-blue-600 text-white' : 'text-gray-400'
                }`}
              >
                Customer
              </button>
              <button
                type="button"
                onClick={() => setRole('worker')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                  role === 'worker' ? 'bg-cyan-600 text-white' : 'text-gray-400'
                }`}
              >
                Worker
              </button>
            </div>
          </div>
        </div>

        {/* Location & Hub Settings */}
        <div className="glass-card rounded-3xl p-6 border border-slate-800 space-y-4">
          <h3 className="font-bold text-white text-base pb-2 border-b border-slate-800">Dispatch City Hub</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="text-gray-300 font-semibold mb-1.5 block">Default City Hub</label>
              <select
                value={defaultCity}
                onChange={(e) => setDefaultCity(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-cyan-500/50"
              >
                {CITIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Notification Settings */}
        <div className="glass-card rounded-3xl p-6 border border-slate-800 space-y-4">
          <h3 className="font-bold text-white text-base pb-2 border-b border-slate-800">Dispatch Notifications</h3>
          <div className="space-y-3 text-xs">
            <label className="flex items-center justify-between cursor-pointer p-3 rounded-2xl bg-slate-900/60 border border-slate-800">
              <span className="text-gray-300 font-medium">Push Notifications for Real-Time Dispatch</span>
              <input
                type="checkbox"
                checked={notifications}
                onChange={(e) => setNotifications(e.target.checked)}
                className="w-4 h-4 accent-cyan-400"
              />
            </label>

            <label className="flex items-center justify-between cursor-pointer p-3 rounded-2xl bg-slate-900/60 border border-slate-800">
              <span className="text-gray-300 font-medium">SMS Alerts for Booking Status & OTP</span>
              <input
                type="checkbox"
                checked={smsAlerts}
                onChange={(e) => setSmsAlerts(e.target.checked)}
                className="w-4 h-4 accent-cyan-400"
              />
            </label>
          </div>
        </div>

        {/* SIH Hackathon Metadata Banner */}
        <div className="glass-panel-glow rounded-3xl p-6 border border-cyan-500/30 space-y-2 text-xs">
          <div className="flex items-center gap-2 text-cyan-400 font-bold">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span>SIH 2026 Internal Demonstration Build</span>
          </div>
          <p className="text-gray-400">
            BuildConnect Frontend Version 1.0.0 (Vite + React + TS + Tailwind + R3F 3D Engine). API functions ready for microservices backend wiring.
          </p>
        </div>

        <button
          type="submit"
          className="w-full py-4 rounded-2xl bg-cyan-500 text-slate-950 font-black text-sm hover:bg-cyan-400 transition"
        >
          Save Preferences
        </button>
      </form>
    </div>
  );
};
