import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Building2, Users, ShieldCheck, ArrowRight, Sparkles, Compass, Globe, PhoneCall } from 'lucide-react';
import { IndiaMapComponent } from '../components/IndiaMapComponent';
import { INDIA_CITIES } from '../data/indiaCities';
import { SearchLocationResult } from '../services/geocodingService';

export const IndiaMapPage: React.FC = () => {
  const navigate = useNavigate();
  const [selectedPlace, setSelectedPlace] = useState<SearchLocationResult | null>({
    id: 'jaipur',
    name: 'Jaipur',
    displayName: 'Jaipur, Rajasthan, India',
    lat: 26.9124,
    lng: 75.7873,
    state: 'Rajasthan',
    country: 'India',
    activeWorkersCount: 210,
    description: 'The Pink City - flagship hub for BuildConnect direct dispatch network.'
  });

  const handleSelectPlace = (place: SearchLocationResult) => {
    setSelectedPlace(place);
  };

  const handleNavigateToMarketplace = () => {
    if (selectedPlace) {
      navigate(`/workers?city=${encodeURIComponent(selectedPlace.name)}`);
    } else {
      navigate('/workers');
    }
  };

  return (
    <div className="min-h-screen bg-[#090d16] text-gray-100 pb-16">
      {/* Top Hero Section */}
      <div className="relative border-b border-slate-800 bg-gradient-to-b from-slate-900/80 via-slate-950 to-[#090d16] py-10 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-semibold mb-3">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Pan-India Coverage Explorer</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                Search & Explore <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-400">All Places in India</span>
              </h1>
              <p className="mt-2 text-sm sm:text-base text-gray-400 max-w-2xl">
                Locate any city, town, landmark, or pin code across 28 States and 8 Union Territories. View active verified workers and dispatch home services in real time.
              </p>
            </div>

            {/* Quick Action button */}
            <div className="flex items-center gap-3">
              <button
                onClick={handleNavigateToMarketplace}
                className="px-5 py-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-sm shadow-xl shadow-cyan-500/20 flex items-center gap-2 transition"
              >
                <span>Browse Workers in {selectedPlace ? selectedPlace.name : 'India'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 pt-6 border-t border-slate-800/80">
            <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-900/50 border border-slate-800">
              <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <div className="text-lg font-extrabold text-white">120+ Hubs</div>
                <div className="text-xs text-gray-400">Tier-1, 2 & 3 Cities</div>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-900/50 border border-slate-800">
              <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-400">
                <Globe className="w-5 h-5" />
              </div>
              <div>
                <div className="text-lg font-extrabold text-white">28 States & 8 UTs</div>
                <div className="text-xs text-gray-400">Full Nationwide Geocoding</div>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-900/50 border border-slate-800">
              <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <div className="text-lg font-extrabold text-white">10,000+</div>
                <div className="text-xs text-gray-400">Verified Service Workers</div>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-900/50 border border-slate-800">
              <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <div className="text-lg font-extrabold text-white">100% Trust</div>
                <div className="text-xs text-gray-400">Aadhaar & Police Verified</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Map & Sidebar Workspace */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left / Top: Interactive Map (Span 2 cols on lg) */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Compass className="w-5 h-5 text-cyan-400" />
                <span>Interactive Pan-India Map</span>
              </h2>
              <span className="text-xs text-gray-400">Click anywhere on the map or type in search</span>
            </div>

            <IndiaMapComponent
              height="650px"
              selectedCityName={selectedPlace?.name}
              onSelectPlace={handleSelectPlace}
              showFullControls={true}
            />
          </div>

          {/* Right Sidebar: Selected Place Details Drawer */}
          <div className="space-y-6">
            {/* Selected Location Card */}
            <div className="bg-slate-900 border border-cyan-500/30 rounded-3xl p-6 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none" />

              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">Active Location Details</span>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-bold">
                  ✓ Service Active
                </span>
              </div>

              {selectedPlace ? (
                <div className="mt-4 space-y-4">
                  <div>
                    <h3 className="text-2xl font-black text-white flex items-center gap-2">
                      <MapPin className="w-6 h-6 text-cyan-400" />
                      <span>{selectedPlace.name}</span>
                    </h3>
                    <p className="text-xs text-gray-400 mt-1">{selectedPlace.displayName}</p>
                  </div>

                  {selectedPlace.description && (
                    <p className="text-xs text-gray-300 bg-slate-950 p-3 rounded-2xl border border-slate-800 leading-relaxed">
                      {selectedPlace.description}
                    </p>
                  )}

                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <div className="p-3 bg-slate-950 border border-slate-800 rounded-2xl">
                      <div className="text-[10px] text-gray-400">GPS Coordinates</div>
                      <div className="text-xs font-mono font-bold text-cyan-300 mt-0.5">
                        {selectedPlace.lat.toFixed(4)}°, {selectedPlace.lng.toFixed(4)}°
                      </div>
                    </div>
                    <div className="p-3 bg-slate-950 border border-slate-800 rounded-2xl">
                      <div className="text-[10px] text-gray-400">Available Workers</div>
                      <div className="text-xs font-bold text-emerald-400 mt-0.5">
                        {selectedPlace.activeWorkersCount || 35} Technicians
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="space-y-2 pt-2">
                    <button
                      onClick={handleNavigateToMarketplace}
                      className="w-full py-3 px-4 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold rounded-2xl text-sm transition flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20"
                    >
                      <span>Find Workers in {selectedPlace.name}</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        alert(`Direct dispatch request initiated for ${selectedPlace.name}. Connecting with nearest available worker...`);
                      }}
                      className="w-full py-2.5 px-4 bg-slate-800 hover:bg-slate-700 text-cyan-300 font-semibold rounded-2xl text-xs transition flex items-center justify-center gap-2 border border-slate-700"
                    >
                      <PhoneCall className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Request Immediate Dispatch</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="p-6 text-center text-sm text-gray-400">
                  Select a city or place on the map to view details.
                </div>
              )}
            </div>

            {/* Featured State Hubs Quick Jump */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl">
              <h4 className="text-sm font-extrabold text-white mb-3 flex items-center justify-between">
                <span>Top Regional Hubs</span>
                <span className="text-[10px] text-cyan-400">Click to Fly Map</span>
              </h4>

              <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                {INDIA_CITIES.slice(0, 8).map((city) => (
                  <button
                    key={city.id}
                    onClick={() =>
                      handleSelectPlace({
                        id: city.id,
                        name: city.name,
                        displayName: `${city.name}, ${city.state}`,
                        lat: city.lat,
                        lng: city.lng,
                        state: city.state,
                        activeWorkersCount: city.activeWorkersCount,
                        description: city.description
                      })
                    }
                    className="w-full p-2.5 rounded-2xl bg-slate-950 hover:bg-slate-800/80 border border-slate-800 hover:border-cyan-500/30 transition text-left flex items-center justify-between group"
                  >
                    <div>
                      <div className="text-xs font-bold text-gray-200 group-hover:text-cyan-300 transition-colors">
                        {city.name}
                      </div>
                      <div className="text-[10px] text-gray-400">{city.state} • {city.tier}</div>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-400 font-bold border border-cyan-500/20">
                      {city.activeWorkersCount} wks
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
