import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Sparkles, CheckCircle, ArrowRight, Star, MapPin, Scale, 
  Check, ChevronRight, HelpCircle, ShieldCheck, Zap, Info
} from 'lucide-react';
import type { Worker } from '../types';
import { getSmartWorkerMatches, SmartMatchResult, RequirementAnalysis } from '../services/workerMatchingService';
import { VerifiedBadge } from './VerifiedBadge';
import { useCompare } from '../context/CompareContext';
import { useBooking } from '../context/BookingContext';

interface SmartMatchSectionProps {
  onMatchSelected?: (bestMatchWorker: Worker | null, category: string | null) => void;
}

const QUICK_SUGGESTIONS = [
  'I need an electrician for AC wiring tomorrow',
  'Plumber for leaking pipe',
  'Carpenter for door repair',
  'AC repair and gas filling',
  'Painter for waterproof texture painting',
  'Skilled helper for shifting furniture'
];

const POPULAR_CATEGORIES = [
  { name: 'Electrician', icon: Zap, color: 'text-cyan-400', query: 'Electrician for switch and wiring fix' },
  { name: 'Plumber', icon: CheckCircle, color: 'text-emerald-400', query: 'Plumber for water leak and taps' },
  { name: 'Carpenter', icon: Star, color: 'text-amber-400', query: 'Carpenter for door and modular wood repair' },
  { name: 'AC Repair', icon: Sparkles, color: 'text-sky-400', query: 'AC Repair and split servicing' },
  { name: 'Painter', icon: ShieldCheck, color: 'text-purple-400', query: 'Painter for wall coating' },
  { name: 'Appliance Repair', icon: Zap, color: 'text-rose-400', query: 'Appliance repair for washing machine and fridge' }
];

export const SmartMatchSection: React.FC<SmartMatchSectionProps> = ({ onMatchSelected }) => {
  const navigate = useNavigate();
  const { isInCompare, addWorker, removeWorker } = useCompare();
  const { selectWorkerForBooking } = useBooking();

  const [query, setQuery] = useState('');
  const [hasSearched, setHasSearched] = useState(false);
  const [matchData, setMatchData] = useState<{
    analysis: RequirementAnalysis;
    bestMatch: SmartMatchResult | null;
    alternatives: SmartMatchResult[];
  } | null>(null);

  const [showScoreModal, setShowScoreModal] = useState(false);

  const handleSearch = (searchQuery: string) => {
    const textToSearch = searchQuery.trim();
    if (!textToSearch) {
      setHasSearched(true);
      setMatchData(null);
      return;
    }

    const results = getSmartWorkerMatches(textToSearch);
    setMatchData({
      analysis: results.analysis,
      bestMatch: results.bestMatch,
      alternatives: results.alternatives
    });
    setHasSearched(true);

    if (results.bestMatch && onMatchSelected) {
      onMatchSelected(results.bestMatch.worker, results.analysis.detectedCategory || 'All');
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch(query);
  };

  const handleQuickSuggestionClick = (suggestion: string) => {
    setQuery(suggestion);
    handleSearch(suggestion);
  };

  return (
    <div className="w-full space-y-6">
      {/* Search Input Box with Smart Natural Language Extraction */}
      <form
        onSubmit={handleFormSubmit}
        className="p-2 rounded-2xl glass-panel border border-cyan-500/40 shadow-2xl shadow-cyan-500/10 flex flex-col sm:flex-row items-center gap-2 max-w-2xl"
      >
        <div className="flex-1 flex items-center gap-3 px-3 w-full">
          <Sparkles className="w-5 h-5 text-cyan-400 shrink-0 animate-pulse" />
          <input
            type="text"
            placeholder="Tell us what you need (e.g. 'AC repair tomorrow' or 'Electrician for wiring')..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-transparent text-white placeholder-gray-400 text-sm focus:outline-none py-2 font-medium"
          />
        </div>
        <button
          type="submit"
          className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500 hover:brightness-110 text-slate-950 font-black text-xs sm:text-sm shadow-lg shadow-cyan-500/25 transition flex items-center justify-center gap-2"
        >
          <span>Find Best Worker</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </form>

      {/* Quick Prompt Suggestions */}
      <div className="flex items-center gap-2 flex-wrap text-xs text-gray-400">
        <span className="text-cyan-400 font-bold flex items-center gap-1">
          <Zap className="w-3.5 h-3.5" /> Try:
        </span>
        {QUICK_SUGGESTIONS.slice(0, 3).map((item, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => handleQuickSuggestionClick(item)}
            className="px-2.5 py-1 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-800 text-gray-300 hover:text-cyan-300 text-[11px] transition"
          >
            "{item}"
          </button>
        ))}
      </div>

      {/* Unclear Requirement Fallback State */}
      {hasSearched && (!matchData || !matchData.analysis.isValid || !matchData.bestMatch) && (
        <div className="glass-card rounded-3xl p-6 border border-amber-500/30 text-left space-y-4 animate-in fade-in">
          <div className="flex items-center gap-2 text-amber-400">
            <Info className="w-5 h-5" />
            <h4 className="font-bold text-sm text-white">Tell us what service you need.</h4>
          </div>
          <p className="text-xs text-gray-400 leading-relaxed">
            We couldn't identify the exact trade in your query. Select a service category below to find the highest-rated verified workers in Jaipur:
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-2">
            {POPULAR_CATEGORIES.map((cat, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleQuickSuggestionClick(cat.query)}
                className="p-3 rounded-2xl bg-slate-900/80 hover:bg-slate-800 border border-slate-800 hover:border-cyan-500/40 text-left transition flex items-center justify-between group"
              >
                <div className="font-bold text-xs text-white group-hover:text-cyan-300">{cat.name}</div>
                <ChevronRight className="w-3.5 h-3.5 text-gray-500 group-hover:text-cyan-400" />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Match Results Display */}
      {matchData && matchData.bestMatch && (
        <div className="space-y-6 animate-in fade-in duration-300">
          {/* Best Match Result Card */}
          <div className="glass-panel-glow rounded-3xl p-6 sm:p-7 relative overflow-hidden border-2 border-cyan-400 shadow-2xl shadow-cyan-500/20">
            {/* Header / Pill */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-500 text-slate-950 shadow-md shadow-cyan-500/20">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-black text-cyan-400 uppercase tracking-widest block">
                    ✨ SMART MATCH RESULT
                  </span>
                  <h3 className="font-black text-lg text-white">
                    BEST MATCH FOR YOUR REQUIREMENT
                  </h3>
                </div>
              </div>

              {/* Match Score Gauge */}
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <div className="text-xs font-bold text-gray-400">Smart Match Score</div>
                  <div className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-emerald-400">
                    {matchData.bestMatch.matchScore}%
                  </div>
                </div>

                <div className="w-16 h-2 rounded-full bg-slate-800 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-cyan-400 to-emerald-400 rounded-full"
                    style={{ width: `${matchData.bestMatch.matchScore}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Worker Details Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 my-5 items-center">
              {/* Profile Card Col */}
              <div className="lg:col-span-5 flex items-start gap-4">
                <img
                  src={matchData.bestMatch.worker.avatar}
                  alt={matchData.bestMatch.worker.name}
                  className="w-20 h-20 rounded-2xl object-cover border-2 border-cyan-400 shadow-xl shrink-0"
                />
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5">
                    <h4 className="font-extrabold text-xl text-white">{matchData.bestMatch.worker.name}</h4>
                    <VerifiedBadge size="sm" showText={false} />
                  </div>
                  <p className="text-xs font-bold text-cyan-400">{matchData.bestMatch.worker.profession}</p>

                  <div className="flex flex-wrap items-center gap-2 text-xs text-gray-300 pt-1">
                    <span className="flex items-center gap-1 text-amber-400 font-bold">
                      <Star className="w-3.5 h-3.5 fill-amber-400" />
                      <span>{matchData.bestMatch.worker.rating}</span>
                      <span className="text-gray-400 font-normal">({matchData.bestMatch.worker.reviewCount})</span>
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1 text-cyan-300">
                      <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                      <span>{matchData.bestMatch.worker.distanceKm} km away</span>
                    </span>
                  </div>

                  <div className="pt-1">
                    <span className="text-[10px] px-2 py-0.5 rounded-md bg-cyan-950/80 border border-cyan-500/30 text-cyan-300 font-extrabold">
                      🛡 {matchData.bestMatch.worker.trustScore}/100 Trust Score
                    </span>
                  </div>
                </div>
              </div>

              {/* Why We Recommend This Worker Checklist */}
              <div className="lg:col-span-7 p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-cyan-400 pb-1 border-b border-slate-800">
                  <span>WHY WE RECOMMEND THIS WORKER</span>
                  <button
                    onClick={() => setShowScoreModal(true)}
                    className="text-[10px] text-gray-400 hover:text-cyan-300 flex items-center gap-1"
                  >
                    <HelpCircle className="w-3 h-3" />
                    <span>How it's scored</span>
                  </button>
                </div>

                <div className="space-y-1.5 text-xs text-gray-200">
                  {matchData.bestMatch.reasons.map((reason, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>{reason}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Action Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-800">
              <div className="text-xs text-gray-400">
                <span>Estimated Pricing: </span>
                <span className="font-extrabold text-white">
                  ₹{matchData.bestMatch.worker.fixedRateMin} - ₹{matchData.bestMatch.worker.fixedRateMax}
                </span>
                <span className="text-[10px]"> (Pay after work guarantee)</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    const id = matchData.bestMatch?.worker.id;
                    if (id) {
                      if (isInCompare(id)) {
                        removeWorker(id);
                      } else {
                        addWorker(id);
                      }
                    }
                  }}
                  className={`px-3 py-2 rounded-xl text-xs font-bold border transition flex items-center gap-1.5 ${
                    isInCompare(matchData.bestMatch.worker.id)
                      ? 'bg-cyan-950 text-cyan-300 border-cyan-500'
                      : 'bg-slate-900 text-gray-300 border-slate-700 hover:text-white'
                  }`}
                >
                  {isInCompare(matchData.bestMatch.worker.id) ? <Check className="w-3.5 h-3.5 text-cyan-400" /> : <Scale className="w-3.5 h-3.5" />}
                  <span>{isInCompare(matchData.bestMatch.worker.id) ? 'Comparing' : 'Compare'}</span>
                </button>

                <Link
                  to={`/workers/${matchData.bestMatch.worker.id}`}
                  className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-gray-200 font-bold text-xs transition flex items-center gap-1"
                >
                  <span>View Profile</span>
                </Link>

                <button
                  onClick={() => {
                    if (matchData.bestMatch) {
                      selectWorkerForBooking(matchData.bestMatch.worker);
                      navigate('/booking');
                    }
                  }}
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 hover:brightness-110 text-slate-950 font-black text-xs shadow-lg shadow-cyan-500/20 transition flex items-center gap-1.5"
                >
                  <span>Hire Now</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Alternative Matches Section */}
          {matchData.alternatives.length > 0 && (
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between text-xs font-bold text-gray-400">
                <span>OTHER GOOD MATCHES</span>
                <Link to="/workers" className="text-cyan-400 hover:underline flex items-center gap-1">
                  <span>Explore All {matchData.analysis.detectedCategory || 'Workers'}</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {matchData.alternatives.map((alt) => {
                  const isCompared = isInCompare(alt.worker.id);
                  return (
                    <div
                      key={alt.worker.id}
                      className="glass-card rounded-2xl p-4 border border-slate-800 hover:border-cyan-500/40 transition flex flex-col justify-between"
                    >
                      <div className="space-y-2.5">
                        <div className="flex items-center justify-between">
                          <span className="px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-500/30 text-[10px] font-black">
                            {alt.matchScore}% Match
                          </span>
                          <span className="text-[10px] text-gray-400 font-semibold">{alt.worker.distanceKm} km</span>
                        </div>

                        <div className="flex items-center gap-2.5">
                          <img
                            src={alt.worker.avatar}
                            alt={alt.worker.name}
                            className="w-10 h-10 rounded-xl object-cover border border-cyan-400"
                          />
                          <div className="min-w-0">
                            <h5 className="font-bold text-xs text-white truncate">{alt.worker.name}</h5>
                            <p className="text-[11px] text-cyan-400 font-medium">{alt.worker.profession}</p>
                            <div className="text-[10px] text-amber-400 font-bold flex items-center gap-1">
                              <Star className="w-2.5 h-2.5 fill-amber-400" />
                              <span>{alt.worker.rating}</span>
                              <span className="text-gray-500 font-normal">({alt.worker.reviewCount})</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="pt-3 mt-3 border-t border-slate-800 flex items-center justify-between gap-2">
                        <button
                          onClick={() => isCompared ? removeWorker(alt.worker.id) : addWorker(alt.worker.id)}
                          className={`p-1.5 rounded-lg border text-xs transition ${
                            isCompared ? 'bg-cyan-950 text-cyan-300 border-cyan-500' : 'bg-slate-850 border-slate-700 text-gray-400'
                          }`}
                          title="Compare"
                        >
                          <Scale className="w-3.5 h-3.5" />
                        </button>
                        <Link
                          to={`/workers/${alt.worker.id}`}
                          className="flex-1 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-center text-xs font-bold text-gray-200 transition"
                        >
                          Profile
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Explanatory Scoring Modal */}
      {showScoreModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
          <div className="bg-slate-900 border border-cyan-500/40 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="font-extrabold text-sm text-white">Smart Match Scoring Breakdown</h3>
              <button
                onClick={() => setShowScoreModal(false)}
                className="p-1 rounded-xl text-gray-400 hover:text-white"
              >
                ✕
              </button>
            </div>
            <div className="space-y-2 text-xs text-gray-300 leading-relaxed">
              <p>BuildConnect's deterministic matching algorithm weights 6 key customer factors:</p>
              <div className="space-y-1.5 pt-1">
                <div className="flex justify-between p-2 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="font-bold text-white">Skill & Trade Match</span>
                  <span className="text-cyan-400 font-extrabold">30% Weight</span>
                </div>
                <div className="flex justify-between p-2 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="font-bold text-white">Hyper-Local Proximity</span>
                  <span className="text-cyan-400 font-extrabold">20% Weight</span>
                </div>
                <div className="flex justify-between p-2 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="font-bold text-white">Schedule Availability</span>
                  <span className="text-cyan-400 font-extrabold">15% Weight</span>
                </div>
                <div className="flex justify-between p-2 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="font-bold text-white">Customer Rating & Reviews</span>
                  <span className="text-cyan-400 font-extrabold">15% Weight</span>
                </div>
                <div className="flex justify-between p-2 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="font-bold text-white">Verified Trust Score</span>
                  <span className="text-cyan-400 font-extrabold">15% Weight</span>
                </div>
                <div className="flex justify-between p-2 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="font-bold text-white">Pricing Transparency</span>
                  <span className="text-cyan-400 font-extrabold">5% Weight</span>
                </div>
              </div>
            </div>
            <button
              onClick={() => setShowScoreModal(false)}
              className="w-full py-2.5 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs"
            >
              Got it
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
