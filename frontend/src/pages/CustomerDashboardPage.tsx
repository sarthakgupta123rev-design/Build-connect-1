import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, Search, ShieldCheck, Star } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { MOCK_WORKERS } from '../mock/data';
import { WorkerCard } from '../components/WorkerCard';

export const CustomerDashboardPage: React.FC = () => {
  const { user } = useAuth();
  const recommended = MOCK_WORKERS.slice(0, 2);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="glass-panel-glow rounded-3xl p-6 sm:p-8 border border-cyan-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <img
            src={user?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'}
            alt={user?.name}
            className="w-16 h-16 rounded-2xl object-cover border-2 border-cyan-400"
          />
          <div>
            <h1 className="text-2xl font-black text-white">Welcome back, {user?.name}!</h1>
            <p className="text-xs text-gray-400 flex items-center gap-1.5 mt-0.5">
              <MapPin className="w-3.5 h-3.5 text-cyan-400" />
              <span>Jaipur Hub • Customer Account</span>
            </p>
          </div>
        </div>

        <Link
          to="/workers"
          className="px-6 py-3 rounded-2xl bg-gradient-to-r from-cyan-400 to-blue-500 hover:brightness-110 text-slate-950 font-extrabold text-xs shadow-lg shadow-cyan-500/20 transition flex items-center gap-2"
        >
          <Search className="w-4 h-4" />
          <span>Find a Worker</span>
        </Link>
      </div>

      {/* Quick Action Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link
          to="/bookings"
          className="glass-card rounded-3xl p-6 border border-slate-800 hover:border-cyan-500/40 transition space-y-3 group"
        >
          <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400 group-hover:scale-110 transition-transform">
            <Calendar className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-lg text-white">My Active Bookings</h3>
          <p className="text-xs text-gray-400">Track scheduled visits and completed job histories.</p>
        </Link>

        <Link
          to="/compare"
          className="glass-card rounded-3xl p-6 border border-slate-800 hover:border-cyan-500/40 transition space-y-3 group"
        >
          <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 group-hover:scale-110 transition-transform">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-lg text-white">Comparison Tray</h3>
          <p className="text-xs text-gray-400">Evaluate side-by-side rates, ratings, and distances.</p>
        </Link>

        <Link
          to="/reviews"
          className="glass-card rounded-3xl p-6 border border-slate-800 hover:border-cyan-500/40 transition space-y-3 group"
        >
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 group-hover:scale-110 transition-transform">
            <Star className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-lg text-white">Rate Completed Job</h3>
          <p className="text-xs text-gray-400">Help local workers build their digital trust score.</p>
        </Link>
      </div>

      {/* Recommended Local Workers */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-white">Recommended Pros Near You</h2>
          <Link to="/workers" className="text-xs text-cyan-400 hover:underline">
            View All Marketplace Workers
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {recommended.map((w) => (
            <WorkerCard key={w.id} worker={w} />
          ))}
        </div>
      </div>
    </div>
  );
};
