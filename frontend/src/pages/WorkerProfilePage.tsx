import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  Star, MapPin, CheckCircle2, Scale, ArrowRight, ArrowLeft, MessageSquare, Check
} from 'lucide-react';
import type { Worker } from '../types';
import { getWorkerById } from '../services/api';
import { VerifiedBadge } from '../components/VerifiedBadge';
import { TrustScore } from '../components/TrustScore';
import { useCompare } from '../context/CompareContext';
import { useBooking } from '../context/BookingContext';

export const WorkerProfilePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [worker, setWorker] = useState<Worker | null>(null);
  const [loading, setLoading] = useState(true);

  const { isInCompare, addWorker, removeWorker } = useCompare();
  const { selectWorkerForBooking } = useBooking();

  useEffect(() => {
    if (id) {
      setLoading(true);
      getWorkerById(id).then((w) => {
        setWorker(w);
        setLoading(false);
      });
    }
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <div className="w-10 h-10 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-gray-400 text-sm">Loading verified worker profile...</p>
      </div>
    );
  }

  if (!worker) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-4">
        <h3 className="text-2xl font-bold text-white">Worker Profile Not Found</h3>
        <p className="text-sm text-gray-400">The requested service worker profile does not exist or was deactivated.</p>
        <Link
          to="/workers"
          className="inline-block px-6 py-3 rounded-2xl bg-cyan-500 text-slate-950 font-bold text-xs"
        >
          Back to Marketplace
        </Link>
      </div>
    );
  }

  const isCompared = isInCompare(worker.id);

  const handleHireNow = () => {
    selectWorkerForBooking(worker);
    navigate('/booking');
  };

  const handleCompareToggle = () => {
    if (isCompared) {
      removeWorker(worker.id);
    } else {
      addWorker(worker.id);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Back button */}
      <div>
        <Link
          to="/workers"
          className="inline-flex items-center gap-2 text-xs font-bold text-gray-400 hover:text-cyan-400 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Marketplace</span>
        </Link>
      </div>

      {/* Main Profile Header Banner */}
      <div className="glass-panel-glow rounded-3xl p-6 sm:p-8 border border-cyan-500/30 relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          {/* Avatar + Main Info */}
          <div className="flex items-start sm:items-center gap-6">
            <div className="relative">
              <img
                src={worker.avatar}
                alt={worker.name}
                className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl object-cover border-2 border-cyan-400 shadow-xl"
              />
              {worker.verified && (
                <div className="absolute -bottom-2 -right-2">
                  <VerifiedBadge size="md" showText={false} />
                </div>
              )}
            </div>

            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-black text-white">{worker.name}</h1>
                <VerifiedBadge size="sm" showText={true} />
              </div>
              <p className="text-sm font-bold text-cyan-400">{worker.profession}</p>

              <div className="flex flex-wrap items-center gap-4 text-xs text-gray-300 pt-1">
                <span className="flex items-center gap-1 text-amber-400 font-bold">
                  <Star className="w-4 h-4 fill-amber-400" />
                  <span>{worker.rating}</span>
                  <span className="text-gray-400 font-normal">({worker.reviewCount} reviews)</span>
                </span>
                <span>•</span>
                <span className="flex items-center gap-1 text-gray-300">
                  <MapPin className="w-4 h-4 text-cyan-400" />
                  <span>{worker.area}, {worker.city} ({worker.distanceKm} km)</span>
                </span>
              </div>
            </div>
          </div>

          {/* Action Drawer Buttons */}
          <div className="flex flex-wrap md:flex-col gap-3 w-full md:w-auto">
            <button
              onClick={handleHireNow}
              className="flex-1 md:w-48 py-3.5 px-6 rounded-2xl bg-gradient-to-r from-cyan-400 to-blue-500 hover:brightness-110 text-slate-950 font-black text-sm shadow-xl shadow-cyan-500/20 transition flex items-center justify-center gap-2"
            >
              <span>Hire Now</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={handleCompareToggle}
              className={`flex-1 md:w-48 py-3 px-4 rounded-2xl border text-xs font-bold flex items-center justify-center gap-2 transition ${
                isCompared
                  ? 'bg-cyan-950 text-cyan-300 border-cyan-500'
                  : 'bg-slate-900 border-slate-700 text-gray-300 hover:text-white'
              }`}
            >
              {isCompared ? <Check className="w-4 h-4 text-cyan-400" /> : <Scale className="w-4 h-4 text-gray-400" />}
              <span>{isCompared ? 'In Comparison Tray' : 'Compare Worker'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Grid: Left Bio & Skills, Right Digital Trust Score */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column (8 cols) */}
        <div className="lg:col-span-8 space-y-8">
          {/* Bio Section */}
          <div className="glass-card rounded-3xl p-6 border border-slate-800 space-y-3">
            <h3 className="font-bold text-lg text-white">About & Experience</h3>
            <p className="text-sm text-gray-300 leading-relaxed">{worker.bio}</p>

            <div className="pt-2 flex flex-wrap gap-2 text-xs text-gray-400">
              <span className="font-semibold text-gray-300">Languages Spoken:</span>
              {worker.languages.map((lang, idx) => (
                <span key={idx} className="px-2.5 py-0.5 rounded-lg bg-slate-900 border border-slate-800 text-gray-300">
                  {lang}
                </span>
              ))}
            </div>
          </div>

          {/* Key Skills & Services */}
          <div className="glass-card rounded-3xl p-6 border border-slate-800 space-y-4">
            <h3 className="font-bold text-lg text-white">Verified Skills & Specializations</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {worker.skills.map((skill, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-2xl bg-slate-900/60 border border-slate-800/80 flex items-center gap-3"
                >
                  <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span className="text-xs font-semibold text-gray-200">{skill}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Reviews List Section */}
          <div className="glass-card rounded-3xl p-6 border border-slate-800 space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-lg text-white flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-cyan-400" />
                <span>Verified Customer Reviews</span>
              </h3>
              <span className="text-xs text-gray-400">{worker.reviewCount} total reviews</span>
            </div>

            <div className="space-y-4">
              {worker.completedReviewList?.map((rev) => (
                <div key={rev.id} className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <img
                        src={rev.customerAvatar}
                        alt={rev.customerName}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                      <div>
                        <div className="font-bold text-white text-xs">{rev.customerName}</div>
                        <div className="text-[10px] text-gray-400">{rev.serviceType} • {rev.date}</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 text-amber-400 font-bold text-xs">
                      <Star className="w-3.5 h-3.5 fill-amber-400" />
                      <span>{rev.rating}</span>
                    </div>
                  </div>

                  <p className="text-xs text-gray-300 leading-relaxed italic">"{rev.comment}"</p>

                  <div className="flex items-center gap-3 text-[10px] text-cyan-400/80 pt-1">
                    <span>Quality: {rev.qualityRating}★</span>
                    <span>•</span>
                    <span>Punctuality: {rev.punctualityRating}★</span>
                    <span>•</span>
                    <span>Professionalism: {rev.professionalismRating}★</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column (4 cols): Digital Trust Card + Pricing */}
        <div className="lg:col-span-4 space-y-6">
          {/* Trust Profile Card */}
          <TrustScore worker={worker} />

          {/* Pricing Box */}
          <div className="glass-card rounded-3xl p-6 border border-slate-800 space-y-4">
            <h4 className="font-bold text-white text-base">Transparent Pricing Rate</h4>

            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 text-center space-y-1">
              <span className="text-xs text-gray-400 uppercase font-semibold">Estimated Service Charge</span>
              <div className="text-2xl font-black text-white">₹{worker.fixedRateMin} - ₹{worker.fixedRateMax}</div>
              <div className="text-xs text-cyan-400 font-medium">Approx ₹{worker.hourlyRate} / hour labor</div>
            </div>

            <ul className="text-xs text-gray-400 space-y-2">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Zero hidden visitation charges</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Pay only after job completion</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>30-Day BuildConnect warranty</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
