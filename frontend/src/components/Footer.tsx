import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, MapPin, Heart, Sparkles } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-slate-950 border-t border-slate-800 text-gray-400 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 p-0.5 shadow-md shadow-cyan-500/20">
                <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5 text-cyan-400" />
                </div>
              </div>
              <span className="font-extrabold text-xl tracking-tight text-white">
                Build<span className="text-cyan-400">Connect</span>
              </span>
            </div>
            <p className="text-gray-400 text-sm max-w-sm leading-relaxed">
              BuildConnect is the digital trust layer connecting local service workers with customers in Tier-2 and Tier-3 cities across India. Discover verified skilled workers, transparent pricing, and instant booking.
            </p>
            <div className="flex items-center gap-2 pt-2">
              <span className="px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-xs font-semibold text-cyan-400 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" /> SIH 2026 Hackathon Prototype
              </span>
            </div>
          </div>

          {/* Column 1: For Customers */}
          <div>
            <h4 className="font-bold text-white mb-4 text-base">For Customers</h4>
            <ul className="space-y-2.5">
              <li>
                <Link to="/workers" className="hover:text-cyan-400 transition">
                  Find Workers Near You
                </Link>
              </li>
              <li>
                <Link to="/compare" className="hover:text-cyan-400 transition">
                  Compare Worker Pricing
                </Link>
              </li>
              <li>
                <Link to="/bookings" className="hover:text-cyan-400 transition">
                  Track Active Bookings
                </Link>
              </li>
              <li>
                <Link to="/reviews" className="hover:text-cyan-400 transition">
                  Verified Reviews
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 2: For Workers */}
          <div>
            <h4 className="font-bold text-white mb-4 text-base">For Workers</h4>
            <ul className="space-y-2.5">
              <li>
                <Link to="/register" className="hover:text-cyan-400 transition">
                  Join as Verified Worker
                </Link>
              </li>
              <li>
                <Link to="/worker-dashboard" className="hover:text-cyan-400 transition">
                  Worker Dashboard
                </Link>
              </li>
              <li>
                <Link to="/worker/earnings" className="hover:text-cyan-400 transition">
                  Payouts & Earnings
                </Link>
              </li>
              <li>
                <Link to="/worker-profile" className="hover:text-cyan-400 transition">
                  Digital Trust Profile
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Active Cities */}
          <div>
            <h4 className="font-bold text-white mb-4 text-base">Tier-2/3 Cities</h4>
            <ul className="space-y-2 text-xs">
              <li className="flex items-center gap-1.5 text-gray-300">
                <MapPin className="w-3.5 h-3.5 text-cyan-400" /> Jaipur, Rajasthan
              </li>
              <li className="flex items-center gap-1.5 text-gray-300">
                <MapPin className="w-3.5 h-3.5 text-cyan-400" /> Indore, MP
              </li>
              <li className="flex items-center gap-1.5 text-gray-300">
                <MapPin className="w-3.5 h-3.5 text-cyan-400" /> Lucknow, UP
              </li>
              <li className="flex items-center gap-1.5 text-gray-300">
                <MapPin className="w-3.5 h-3.5 text-cyan-400" /> Patna, Bihar
              </li>
              <li className="flex items-center gap-1.5 text-gray-300">
                <MapPin className="w-3.5 h-3.5 text-cyan-400" /> Coimbatore, TN
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-gray-400">
          <div>
            © {new Date().getFullYear()} BuildConnect Digital Trust Platform. All rights reserved.
          </div>
          <div className="flex items-center gap-6">
            <Link to="/settings" className="hover:text-gray-300">Privacy Policy</Link>
            <Link to="/settings" className="hover:text-gray-300">Terms of Service</Link>
            <Link to="/settings" className="hover:text-gray-300">Security & Trust</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
