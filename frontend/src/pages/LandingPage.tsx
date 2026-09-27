import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ShieldCheck, Search, ArrowRight, Star, MapPin, Scale, Zap, 
  Sparkles, TrendingUp, ChevronRight
} from 'lucide-react';
import { Hero3DScene } from '../components/Hero3DScene';
import { WorkerCard } from '../components/WorkerCard';
import { MOCK_WORKERS } from '../mock/data';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const [heroSearch, setHeroSearch] = useState('');

  const featuredWorkers = MOCK_WORKERS.slice(0, 3);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (heroSearch.trim()) {
      navigate(`/workers?search=${encodeURIComponent(heroSearch.trim())}`);
    } else {
      navigate('/workers');
    }
  };

  return (
    <div className="w-full space-y-24 pb-20">
      {/* Hero Section */}
      <section className="relative pt-12 lg:pt-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Hero Text */}
          <div className="lg:col-span-7 space-y-8 text-left">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 text-xs font-bold shadow-lg shadow-cyan-500/10">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span>SIH 2026 Innovation • Digital Trust Layer for Local Hiring</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.1]">
              Find Trusted <br className="hidden sm:inline" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-emerald-400">
                Local Workers
              </span> Near You.
            </h1>

            <p className="text-gray-300 text-base sm:text-lg max-w-2xl leading-relaxed">
              Discover verified local professionals in Tier-2 & Tier-3 cities. Compare experience, transparent pricing, and real customer ratings before booking with confidence.
            </p>

            {/* Quick Search Bar */}
            <form onSubmit={handleSearchSubmit} className="p-2 rounded-2xl glass-panel border border-cyan-500/30 flex flex-col sm:flex-row items-center gap-2 shadow-2xl shadow-cyan-500/10 max-w-xl">
              <div className="flex-1 flex items-center gap-3 px-3 w-full">
                <Search className="w-5 h-5 text-cyan-400 shrink-0" />
                <input
                  type="text"
                  placeholder="Electrician, Plumber, Carpenter, AC Repair..."
                  value={heroSearch}
                  onChange={(e) => setHeroSearch(e.target.value)}
                  className="w-full bg-transparent text-white placeholder-gray-400 text-sm focus:outline-none py-2"
                />
              </div>
              <button
                type="submit"
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 hover:brightness-110 text-slate-950 font-extrabold text-sm shadow-lg shadow-cyan-500/20 transition flex items-center justify-center gap-2"
              >
                <span>Find Worker</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            {/* CTAs & Tags */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link
                to="/workers"
                className="px-6 py-3.5 rounded-2xl bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/40 text-cyan-300 font-bold text-sm transition flex items-center gap-2"
              >
                <span>Browse Marketplace</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
              <Link
                to="/register"
                className="px-6 py-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-gray-200 font-bold text-sm transition"
              >
                Join as a Worker
              </Link>
            </div>
          </div>

          {/* Right 3D Scene Container */}
          <div className="lg:col-span-5 relative">
            <Hero3DScene />
          </div>
        </div>
      </section>

      {/* Trust Statistics Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          <div className="glass-card rounded-3xl p-6 text-center border border-cyan-500/20">
            <div className="text-3xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">
              10K+
            </div>
            <div className="text-xs sm:text-sm font-semibold text-gray-300 mt-1">Verified Workers</div>
            <div className="text-[11px] text-gray-500">ID & Skill Checked</div>
          </div>

          <div className="glass-card rounded-3xl p-6 text-center border border-emerald-500/20">
            <div className="text-3xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400">
              50K+
            </div>
            <div className="text-xs sm:text-sm font-semibold text-gray-300 mt-1">Jobs Completed</div>
            <div className="text-[11px] text-gray-500">Across 25+ Hub Cities</div>
          </div>

          <div className="glass-card rounded-3xl p-6 text-center border border-amber-500/20">
            <div className="text-3xl sm:text-4xl font-black text-amber-400 flex items-center justify-center gap-1">
              <span>4.8</span>
              <Star className="w-6 h-6 fill-amber-400 text-amber-400" />
            </div>
            <div className="text-xs sm:text-sm font-semibold text-gray-300 mt-1">Average Rating</div>
            <div className="text-[11px] text-gray-500">From Real Customers</div>
          </div>

          <div className="glass-card rounded-3xl p-6 text-center border border-purple-500/20">
            <div className="text-3xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
              25+
            </div>
            <div className="text-xs sm:text-sm font-semibold text-gray-300 mt-1">Tier 2 & 3 Cities</div>
            <div className="text-[11px] text-gray-500">Hyper-Local Coverage</div>
          </div>
        </div>
      </section>

      {/* Core Journey — 5 Steps */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <span className="px-3.5 py-1 rounded-full text-xs font-extrabold bg-blue-950 border border-blue-500/30 text-blue-400">
            SIMPLE 5-STEP JOURNEY
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-white">How BuildConnect Works</h2>
          <p className="text-gray-400 text-sm">
            Eliminating middlemen dependence and bringing transparency to local service booking.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {[
            { step: '01', title: 'Requirement', desc: 'Describe what job you need done at your home or shop.', icon: Search },
            { step: '02', title: 'Discover', desc: 'Find nearby verified workers with real-time location.', icon: MapPin },
            { step: '03', title: 'Compare', desc: 'Compare side-by-side on price, rating, and experience.', icon: Scale },
            { step: '04', title: 'Hire', desc: 'Book with transparent fixed pricing and time slot.', icon: Zap },
            { step: '05', title: 'Review', desc: 'Rate performance to build worker digital reputation.', icon: Star }
          ].map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={index}
                className="glass-card rounded-3xl p-6 relative border border-slate-800 flex flex-col justify-between group hover:border-cyan-500/40 transition"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-black text-cyan-400 font-mono tracking-widest">{item.step}</span>
                    <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 group-hover:scale-110 transition-transform">
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>
                  <h4 className="font-bold text-white text-lg mb-2">{item.title}</h4>
                  <p className="text-xs text-gray-400 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Why BuildConnect Features Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <span className="px-3.5 py-1 rounded-full text-xs font-extrabold bg-cyan-950 border border-cyan-500/30 text-cyan-400">
            THE DIGITAL TRUST LAYER
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-white">Why Customers & Workers Choose Us</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass-card rounded-3xl p-6 border border-slate-800 space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-xl text-white">Verified Worker Profiles</h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              Every worker undergoes identity check and skill validation before being listed.
            </p>
          </div>

          <div className="glass-card rounded-3xl p-6 border border-slate-800 space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Scale className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-xl text-white">Transparent Pricing</h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              No surprise charges. Compare minimum labor charges upfront before booking.
            </p>
          </div>

          <div className="glass-card rounded-3xl p-6 border border-slate-800 space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <TrendingUp className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-xl text-white">Digital Reputation</h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              Verified reviews permanently build worker credibility and help them command fair wages.
            </p>
          </div>
        </div>
      </section>

      {/* Featured Worker Showcase */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-3xl font-black text-white">Top Rated Workers in Jaipur</h2>
            <p className="text-sm text-gray-400">Verified professionals ready for immediate dispatch</p>
          </div>
          <Link
            to="/workers"
            className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-bold text-cyan-300 transition flex items-center gap-1.5"
          >
            <span>View All Workers</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredWorkers.map((worker) => (
            <WorkerCard key={worker.id} worker={worker} />
          ))}
        </div>
      </section>

      {/* Call to Action Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="glass-panel-glow rounded-3xl p-8 sm:p-12 text-center relative overflow-hidden border border-cyan-500/40">
          <div className="relative z-10 max-w-2xl mx-auto space-y-6">
            <h2 className="text-3xl sm:text-5xl font-black text-white leading-tight">
              Ready to find the right worker for your job?
            </h2>
            <p className="text-gray-300 text-sm sm:text-base">
              Join thousands of satisfied homeowners and business owners across Jaipur, Indore, and Lucknow.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
              <Link
                to="/workers"
                className="px-8 py-4 rounded-2xl bg-gradient-to-r from-cyan-400 to-blue-500 hover:brightness-110 text-slate-950 font-black text-sm shadow-xl shadow-cyan-500/20 transition"
              >
                Find a Worker Now
              </Link>
              <Link
                to="/register"
                className="px-8 py-4 rounded-2xl bg-slate-900 border border-slate-700 text-gray-200 font-bold text-sm hover:bg-slate-800 transition"
              >
                Register as a Worker
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
