import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ShieldCheck, MapPin, Scale, User, LogOut, Briefcase, Layers, Menu, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCompare } from '../context/CompareContext';
import { CitySelectorModal } from './CitySelectorModal';

export const Navbar: React.FC = () => {
  const { user, role, setRole, logout } = useAuth();
  const { compareList } = useCompare();
  const navigate = useNavigate();
  const location = useLocation();

  const [selectedCity, setSelectedCity] = useState('Jaipur');
  const [isCityModalOpen, setIsCityModalOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      <header className="sticky top-0 z-40 w-full glass-panel border-b border-cyan-500/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* Logo & Brand */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 p-0.5 shadow-lg shadow-cyan-500/20 group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
                <ShieldCheck className="w-5 h-5 text-cyan-400" />
              </div>
            </div>
            <div>
              <div className="font-extrabold text-xl tracking-tight text-white flex items-center gap-1.5">
                Build<span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">Connect</span>
              </div>
              <div className="text-[10px] text-gray-400 font-medium tracking-wide">Find. Connect. Work.</div>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-1 bg-slate-900/60 p-1.5 rounded-2xl border border-slate-800">
            <Link
              to="/"
              className={`px-4 py-2 rounded-xl text-sm font-medium transition ${
                isActive('/') ? 'bg-cyan-500/15 text-cyan-300 font-semibold' : 'text-gray-300 hover:text-white'
              }`}
            >
              Home
            </Link>
            <Link
              to="/workers"
              className={`px-4 py-2 rounded-xl text-sm font-medium transition ${
                isActive('/workers') ? 'bg-cyan-500/15 text-cyan-300 font-semibold' : 'text-gray-300 hover:text-white'
              }`}
            >
              Find Workers
            </Link>
            <Link
              to="/compare"
              className={`px-4 py-2 rounded-xl text-sm font-medium transition flex items-center gap-1.5 ${
                isActive('/compare') ? 'bg-cyan-500/15 text-cyan-300 font-semibold' : 'text-gray-300 hover:text-white'
              }`}
            >
              <Scale className="w-4 h-4 text-cyan-400" />
              <span>Compare</span>
              {compareList.length > 0 && (
                <span className="ml-1 px-1.5 py-0.2 text-[11px] rounded-full bg-cyan-500 text-slate-950 font-bold">
                  {compareList.length}
                </span>
              )}
            </Link>

            {role === 'customer' ? (
              <Link
                to="/bookings"
                className={`px-4 py-2 rounded-xl text-sm font-medium transition ${
                  isActive('/bookings') ? 'bg-cyan-500/15 text-cyan-300 font-semibold' : 'text-gray-300 hover:text-white'
                }`}
              >
                My Bookings
              </Link>
            ) : (
              <Link
                to="/worker-dashboard"
                className={`px-4 py-2 rounded-xl text-sm font-medium transition ${
                  isActive('/worker-dashboard') ? 'bg-cyan-500/15 text-cyan-300 font-semibold' : 'text-gray-300 hover:text-white'
                }`}
              >
                Worker Dashboard
              </Link>
            )}
          </nav>

          {/* Right Actions: City + Role Switcher + Auth */}
          <div className="hidden lg:flex items-center gap-3">
            {/* City selector button */}
            <button
              onClick={() => setIsCityModalOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-cyan-500/40 text-xs font-semibold text-gray-200 transition"
            >
              <MapPin className="w-3.5 h-3.5 text-cyan-400" />
              <span>{selectedCity}</span>
            </button>

            {/* Role Switcher Pills */}
            <div className="flex items-center p-1 rounded-xl bg-slate-900 border border-slate-800">
              <button
                onClick={() => setRole('customer')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                  role === 'customer'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-gray-400 hover:text-gray-200'
                }`}
              >
                Customer
              </button>
              <button
                onClick={() => setRole('worker')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                  role === 'worker'
                    ? 'bg-cyan-600 text-white shadow-md'
                    : 'text-gray-400 hover:text-gray-200'
                }`}
              >
                Worker
              </button>
            </div>

            {/* Auth / Profile dropdown */}
            {user ? (
              <div className="flex items-center gap-2">
                <Link
                  to={role === 'customer' ? '/customer' : '/worker-profile'}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700 text-xs font-semibold text-white transition"
                >
                  <img
                    src={user.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'}
                    alt={user.name}
                    className="w-6 h-6 rounded-full object-cover border border-cyan-400/50"
                  />
                  <span>{user.name.split(' ')[0]}</span>
                </Link>
                <button
                  onClick={() => {
                    logout();
                    navigate('/login');
                  }}
                  className="p-2 rounded-xl text-gray-400 hover:text-rose-400 hover:bg-slate-800 transition"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-300 hover:text-white transition"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-950 bg-gradient-to-r from-cyan-400 to-blue-400 hover:brightness-110 shadow-lg shadow-cyan-500/20 transition"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile hamburger button */}
          <div className="lg:hidden flex items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-gray-300 hover:bg-slate-800 transition"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile dropdown menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden px-4 pt-2 pb-6 border-t border-slate-800 bg-slate-950/95 space-y-3">
            <div className="flex items-center justify-between py-2 border-b border-slate-800">
              <button
                onClick={() => setIsCityModalOpen(true)}
                className="flex items-center gap-1.5 text-xs font-medium text-cyan-400"
              >
                <MapPin className="w-4 h-4" />
                <span>City: {selectedCity}</span>
              </button>
              <div className="flex items-center p-1 rounded-xl bg-slate-900 border border-slate-800">
                <button
                  onClick={() => setRole('customer')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${
                    role === 'customer' ? 'bg-blue-600 text-white' : 'text-gray-400'
                  }`}
                >
                  Cust
                </button>
                <button
                  onClick={() => setRole('worker')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${
                    role === 'worker' ? 'bg-cyan-600 text-white' : 'text-gray-400'
                  }`}
                >
                  Work
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-sm font-medium">
              <Link
                to="/"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-gray-200"
              >
                Home
              </Link>
              <Link
                to="/workers"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-gray-200"
              >
                Find Workers
              </Link>
              <Link
                to="/compare"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-gray-200 flex items-center justify-between"
              >
                <span>Compare</span>
                {compareList.length > 0 && (
                  <span className="px-2 py-0.5 rounded-full bg-cyan-400 text-slate-950 font-bold text-xs">
                    {compareList.length}
                  </span>
                )}
              </Link>
              <Link
                to={role === 'customer' ? '/bookings' : '/worker-dashboard'}
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-gray-200"
              >
                {role === 'customer' ? 'My Bookings' : 'Worker Hub'}
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* City selector modal */}
      <CitySelectorModal
        isOpen={isCityModalOpen}
        onClose={() => setIsCityModalOpen(false)}
        selectedCity={selectedCity}
        onSelectCity={(city) => setSelectedCity(city)}
      />
    </>
  );
};
