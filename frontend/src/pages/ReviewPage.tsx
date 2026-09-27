import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Star, CheckCircle2, Sparkles } from 'lucide-react';
import { submitReview } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { VerifiedBadge } from '../components/VerifiedBadge';

export const ReviewPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const bookingIdParam = searchParams.get('bookingId') || 'bk-100';
  const workerIdParam = searchParams.get('workerId') || 'w-1';

  const [rating, setRating] = useState(5);
  const [qualityRating, setQualityRating] = useState(5);
  const [punctualityRating, setPunctualityRating] = useState(5);
  const [professionalismRating, setProfessionalismRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return;

    setSubmitting(true);
    try {
      await submitReview({
        bookingId: bookingIdParam,
        workerId: workerIdParam,
        customerName: user?.name || 'Aarav Sharma',
        customerAvatar: user?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
        rating,
        qualityRating,
        punctualityRating,
        professionalismRating,
        comment,
        serviceType: 'Electrical Repair & Inspection'
      });
      setSubmitted(true);
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const renderStarSelector = (value: number, setValue: (v: number) => void) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => setValue(star)}
            className="p-1 text-amber-400 hover:scale-110 transition-transform"
          >
            <Star
              className={`w-6 h-6 ${star <= value ? 'fill-amber-400 text-amber-400' : 'text-slate-700'}`}
            />
          </button>
        ))}
      </div>
    );
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-10 space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 text-xs font-bold">
          <Sparkles className="w-4 h-4 text-cyan-400" />
          <span>VERIFIED REPUTATION FEEDBACK</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white">Rate Your Worker Experience</h1>
        <p className="text-sm text-gray-400">
          Your feedback directly shapes worker trust scores across Jaipur and helps future customers hire with confidence.
        </p>
      </div>

      {submitted ? (
        <div className="glass-panel-glow rounded-3xl p-8 text-center border border-cyan-500/30 space-y-4">
          <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-400 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h3 className="text-2xl font-extrabold text-white">Review Submitted!</h3>
          <p className="text-xs text-gray-300 leading-relaxed max-w-md mx-auto">
            Thank you! Your 5-star review has been cryptographic-verified and added to Rajesh Kumar's digital trust profile.
          </p>
          <button
            onClick={() => navigate('/bookings')}
            className="px-6 py-3 rounded-2xl bg-cyan-500 text-slate-950 font-bold text-xs hover:bg-cyan-400 transition"
          >
            Back to Bookings
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="glass-card rounded-3xl p-6 sm:p-8 border border-slate-800 space-y-6">
          {/* Worker Reviewee Pill */}
          <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
            <img
              src="https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=400&q=80"
              alt="Rajesh Kumar"
              className="w-14 h-14 rounded-2xl object-cover border-2 border-cyan-400"
            />
            <div>
              <div className="font-bold text-white text-base">Rajesh Kumar</div>
              <div className="text-xs font-semibold text-cyan-400">Electrician</div>
              <div className="mt-0.5">
                <VerifiedBadge size="sm" showText={true} />
              </div>
            </div>
          </div>

          {/* Overall Rating */}
          <div className="text-center space-y-2 p-4 rounded-2xl bg-slate-900/50 border border-slate-800">
            <label className="text-xs font-bold text-gray-300 uppercase tracking-wider block">Overall Experience Rating</label>
            <div className="flex justify-center">{renderStarSelector(rating, setRating)}</div>
          </div>

          {/* Detailed Criteria Ratings */}
          <div className="space-y-4 text-xs">
            <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-900/60 border border-slate-800">
              <span className="font-semibold text-gray-300">Quality of Work</span>
              {renderStarSelector(qualityRating, setQualityRating)}
            </div>

            <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-900/60 border border-slate-800">
              <span className="font-semibold text-gray-300">Punctuality & Arrival Time</span>
              {renderStarSelector(punctualityRating, setPunctualityRating)}
            </div>

            <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-900/60 border border-slate-800">
              <span className="font-semibold text-gray-300">Professionalism & Cleanliness</span>
              {renderStarSelector(professionalismRating, setProfessionalismRating)}
            </div>
          </div>

          {/* Review Text */}
          <div>
            <label className="text-xs font-semibold text-gray-300 mb-1.5 block">Your Detailed Feedback</label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={4}
              required
              className="w-full px-4 py-3 rounded-2xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-500/50 placeholder-gray-500"
              placeholder="Describe what went well (e.g., prompt arrival, clean DB board wiring, transparent pricing)..."
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-cyan-400 to-blue-500 hover:brightness-110 text-slate-950 font-black text-sm shadow-xl shadow-cyan-500/20 transition flex items-center justify-center gap-2"
          >
            {submitting ? 'Publishing Review...' : 'Submit Review & Build Reputation'}
          </button>
        </form>
      )}
    </div>
  );
};
