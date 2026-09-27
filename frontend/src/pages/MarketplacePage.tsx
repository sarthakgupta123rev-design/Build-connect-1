import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { 
  Search, SlidersHorizontal, Sparkles, X, Filter, RefreshCw
} from 'lucide-react';
import type { Worker, FilterOptions, AIMatchResult } from '../types';
import { getWorkers, getRecommendations } from '../services/api';
import { WorkerCard } from '../components/WorkerCard';
import { AIRecommendationCard } from '../components/AIRecommendationCard';

const CATEGORIES = [
  'All',
  'Electrician',
  'Plumber',
  'Carpenter',
  'Painter',
  'AC Repair',
  'Appliance Repair',
  'Skilled Helper'
];

export const MarketplacePage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const initialSearch = searchParams.get('search') || '';

  const [workers, setWorkers] = useState<Worker[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);

  // Filters State
  const [filters, setFilters] = useState<FilterOptions>({
    category: 'All',
    searchQuery: initialSearch,
    city: 'Jaipur',
    maxDistanceKm: 10,
    minRating: 0,
    maxPrice: 3000,
    minExperience: 0,
    verifiedOnly: false,
    availableTodayOnly: false,
    sortBy: 'recommended'
  });

  // AI Match Simulation State
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiResults, setAiResults] = useState<AIMatchResult[]>([]);
  const [isAiLoading, setIsAiLoading] = useState(false);

  const fetchWorkerList = async () => {
    setLoading(true);
    try {
      const data = await getWorkers(filters);
      setWorkers(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkerList();
  }, [filters]);

  const handleAiMatchSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiPrompt.trim()) return;
    setIsAiLoading(true);
    try {
      const results = await getRecommendations(aiPrompt, filters.city);
      setAiResults(results.slice(0, 2));
    } catch (err) {
      console.error(err);
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleCategorySelect = (cat: string) => {
    setFilters((prev) => ({ ...prev, category: cat }));
  };

  const resetFilters = () => {
    setFilters({
      category: 'All',
      searchQuery: '',
      city: 'Jaipur',
      maxDistanceKm: 10,
      minRating: 0,
      maxPrice: 3000,
      minExperience: 0,
      verifiedOnly: false,
      availableTodayOnly: false,
      sortBy: 'recommended'
    });
    setAiResults([]);
    setAiPrompt('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-black text-white">Find a Worker Near You</h1>
          <p className="text-sm text-gray-400 mt-1">
            Browse verified local professionals in <span className="text-cyan-400 font-bold">{filters.city}</span>
          </p>
        </div>

        {/* AI Quick Match Toggle Bar */}
        <form onSubmit={handleAiMatchSubmit} className="w-full md:w-auto flex items-center gap-2 p-1.5 rounded-2xl glass-panel-glow border border-cyan-500/40">
          <Sparkles className="w-4 h-4 text-cyan-400 ml-2 animate-spin" style={{ animationDuration: '6s' }} />
          <input
            type="text"
            placeholder="AI Match: 'Need electrician for AC wiring'"
            value={aiPrompt}
            onChange={(e) => setAiPrompt(e.target.value)}
            className="bg-transparent text-xs text-white placeholder-gray-400 focus:outline-none w-48 sm:w-64 px-1"
          />
          <button
            type="submit"
            disabled={isAiLoading}
            className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 text-slate-950 font-bold text-xs hover:brightness-110 transition shrink-0"
          >
            {isAiLoading ? 'Matching...' : 'AI Match'}
          </button>
        </form>
      </div>

      {/* AI Recommendation Box if Triggered */}
      {aiResults.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-cyan-300 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span>AI Recommended Match Results for "{aiPrompt}"</span>
            </h3>
            <button
              onClick={() => setAiResults([])}
              className="text-xs text-gray-400 hover:text-white flex items-center gap-1"
            >
              <X className="w-3.5 h-3.5" /> Clear AI Results
            </button>
          </div>
          <div className="grid grid-cols-1 gap-4">
            {aiResults.map((match) => (
              <AIRecommendationCard key={match.workerId} match={match} />
            ))}
          </div>
        </div>
      )}

      {/* Search & Category Chips Bar */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Main Search Input */}
          <div className="flex-1 flex items-center gap-3 px-4 py-3 rounded-2xl glass-card border border-slate-800 focus-within:border-cyan-500/50 transition">
            <Search className="w-5 h-5 text-cyan-400 shrink-0" />
            <input
              type="text"
              placeholder="Search by worker name, profession, or skill..."
              value={filters.searchQuery}
              onChange={(e) => setFilters((prev) => ({ ...prev, searchQuery: e.target.value }))}
              className="w-full bg-transparent text-white placeholder-gray-400 text-sm focus:outline-none"
            />
            {filters.searchQuery && (
              <button
                onClick={() => setFilters((prev) => ({ ...prev, searchQuery: '' }))}
                className="text-gray-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Filter Toggle Button */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`px-4 py-3 rounded-2xl border text-xs font-bold flex items-center justify-center gap-2 transition ${
              showFilters
                ? 'bg-cyan-950 border-cyan-500 text-cyan-300'
                : 'bg-slate-900 border-slate-800 text-gray-300 hover:border-slate-700'
            }`}
          >
            <Filter className="w-4 h-4 text-cyan-400" />
            <span>Filters</span>
          </button>

          {/* Sorting Dropdown */}
          <select
            value={filters.sortBy}
            onChange={(e) => setFilters((prev) => ({ ...prev, sortBy: e.target.value as FilterOptions['sortBy'] }))}
            className="px-4 py-3 rounded-2xl bg-slate-900 border border-slate-800 text-xs font-semibold text-gray-200 focus:outline-none focus:border-cyan-500/50"
          >
            <option value="recommended">Sort: Recommended (Trust Score)</option>
            <option value="rating">Sort: Highest Rated</option>
            <option value="distance">Sort: Nearest First</option>
            <option value="priceAsc">Sort: Lowest Price</option>
            <option value="experience">Sort: Most Experienced</option>
          </select>
        </div>

        {/* Category Filter Chips */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {CATEGORIES.map((cat) => {
            const isSelected = filters.category === cat;
            return (
              <button
                key={cat}
                onClick={() => handleCategorySelect(cat)}
                className={`px-4 py-2 rounded-2xl text-xs font-semibold whitespace-nowrap transition-all ${
                  isSelected
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-bold shadow-lg shadow-cyan-500/20'
                    : 'bg-slate-900/80 border border-slate-800 text-gray-300 hover:bg-slate-800'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* Expandable Filter Drawer Panel */}
      {showFilters && (
        <div className="glass-card rounded-3xl p-6 border border-cyan-500/30 space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h3 className="font-bold text-white text-base flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-cyan-400" />
              <span>Advanced Search Filters</span>
            </h3>
            <button
              onClick={resetFilters}
              className="text-xs text-cyan-400 hover:underline flex items-center gap-1"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Reset Filters
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-xs">
            {/* Distance Slider */}
            <div>
              <label className="text-gray-300 font-semibold mb-2 block">
                Max Distance: <span className="text-cyan-400 font-bold">{filters.maxDistanceKm} km</span>
              </label>
              <input
                type="range"
                min={1}
                max={20}
                value={filters.maxDistanceKm}
                onChange={(e) => setFilters((prev) => ({ ...prev, maxDistanceKm: Number(e.target.value) }))}
                className="w-full accent-cyan-400 bg-slate-800 rounded-lg cursor-pointer"
              />
            </div>

            {/* Rating Filter */}
            <div>
              <label className="text-gray-300 font-semibold mb-2 block">
                Minimum Rating: <span className="text-amber-400 font-bold">{filters.minRating > 0 ? `${filters.minRating}★` : 'Any'}</span>
              </label>
              <div className="flex gap-1">
                {[0, 4.5, 4.8].map((val) => (
                  <button
                    key={val}
                    onClick={() => setFilters((prev) => ({ ...prev, minRating: val }))}
                    className={`flex-1 py-1.5 rounded-xl border text-xs font-semibold ${
                      filters.minRating === val
                        ? 'bg-amber-950 border-amber-500 text-amber-300'
                        : 'bg-slate-900 border-slate-800 text-gray-400'
                    }`}
                  >
                    {val === 0 ? 'Any' : `${val}★+`}
                  </button>
                ))}
              </div>
            </div>

            {/* Checkbox toggles */}
            <div className="flex flex-col justify-center space-y-3">
              <label className="flex items-center gap-2 cursor-pointer text-gray-300 font-medium">
                <input
                  type="checkbox"
                  checked={filters.verifiedOnly}
                  onChange={(e) => setFilters((prev) => ({ ...prev, verifiedOnly: e.target.checked }))}
                  className="rounded accent-cyan-400 w-4 h-4"
                />
                <span>BuildConnect Verified Only</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer text-gray-300 font-medium">
                <input
                  type="checkbox"
                  checked={filters.availableTodayOnly}
                  onChange={(e) => setFilters((prev) => ({ ...prev, availableTodayOnly: e.target.checked }))}
                  className="rounded accent-cyan-400 w-4 h-4"
                />
                <span>Available Today Only</span>
              </label>
            </div>
          </div>
        </div>
      )}

      {/* Main Workers Grid Container */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
            Showing {workers.length} {workers.length === 1 ? 'Worker' : 'Workers'}
          </span>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-80 rounded-3xl bg-slate-900/60 animate-pulse border border-slate-800" />
            ))}
          </div>
        ) : workers.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {workers.map((worker) => (
              <WorkerCard key={worker.id} worker={worker} />
            ))}
          </div>
        ) : (
          <div className="glass-card rounded-3xl p-12 text-center border border-slate-800 max-w-md mx-auto space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-slate-800 flex items-center justify-center mx-auto text-gray-400">
              <Search className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-white">No Workers Found</h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              No service professionals matched your search criteria in {filters.city}. Try increasing your max distance or resetting filters.
            </p>
            <button
              onClick={resetFilters}
              className="px-6 py-2.5 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs hover:bg-cyan-400 transition"
            >
              Reset Search Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
