import React, { useEffect, useRef, useState, useTransition } from 'react';
import L from 'leaflet';
import { Search, MapPin, Navigation, Compass, Layers, Check, X, Loader2, Sparkles, Building2, Users, ArrowRight } from 'lucide-react';
import { INDIA_CITIES, IndiaCity, CITY_REGIONS } from '../data/indiaCities';
import {
  searchOfflineIndiaCities,
  searchIndiaPlacesOnline,
  reverseGeocodeIndia,
  SearchLocationResult
} from '../services/geocodingService';

interface IndiaMapComponentProps {
  onSelectPlace?: (place: SearchLocationResult) => void;
  selectedCityName?: string;
  height?: string;
  showFullControls?: boolean;
}

export const IndiaMapComponent: React.FC<IndiaMapComponentProps> = ({
  onSelectPlace,
  selectedCityName,
  height = '600px',
  showFullControls = true
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);

  const [query, setQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchLocationResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [activeRegion, setActiveRegion] = useState<string>('All');
  const [selectedPlace, setSelectedPlace] = useState<SearchLocationResult | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [isPending, startTransition] = useTransition();

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    // Center on India
    const map = L.map(mapContainerRef.current, {
      center: [22.5937, 78.9629],
      zoom: 5,
      zoomControl: false
    });

    // Custom dark theme tile layer (CartoDB Dark Matter)
    const cartoDark = L.tileLayer(
      'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
      {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: 'abcd',
        maxZoom: 19
      }
    );

    cartoDark.addTo(map);

    // Zoom control in top right
    L.control.zoom({ position: 'topright' }).addTo(map);

    const markersLayer = L.layerGroup().addTo(map);
    markersLayerRef.current = markersLayer;
    mapRef.current = map;

    // Handle map clicks (reverse geocode point)
    map.on('click', async (e: L.LeafletMouseEvent) => {
      const { lat, lng } = e.latlng;
      const addressName = await reverseGeocodeIndia(lat, lng);
      
      const clickPlace: SearchLocationResult = {
        id: `custom-click-${Date.now()}`,
        name: addressName.split(',')[0] || 'Selected Location',
        displayName: addressName,
        lat,
        lng,
        state: 'India',
        country: 'India',
        activeWorkersCount: Math.floor(Math.random() * 25) + 10,
        description: 'Pinpoint location selected on India map'
      };

      setSelectedPlace(clickPlace);
      addCustomMarker(clickPlace, true);
    });

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // Update map markers when activeRegion changes
  useEffect(() => {
    if (!mapRef.current || !markersLayerRef.current) return;

    const markersLayer = markersLayerRef.current;
    markersLayer.clearLayers();

    // Filter cities based on region tab
    const filteredCities = INDIA_CITIES.filter((city) => {
      if (activeRegion === 'All') return true;
      if (activeRegion === 'Metros (Tier-1)') return city.tier === 'Tier-1';
      if (activeRegion === 'Tier-2 Hubs') return city.tier === 'Tier-2';
      if (activeRegion === 'Tier-3') return city.tier === 'Tier-3';
      return city.region === activeRegion;
    });

    filteredCities.forEach((city) => {
      const isSelected = selectedCityName?.toLowerCase() === city.name.toLowerCase();
      
      // Marker color by tier
      const badgeColor = city.tier === 'Tier-1' ? 'bg-cyan-500 shadow-cyan-500/50' : city.tier === 'Tier-2' ? 'bg-blue-500' : 'bg-emerald-500';

      const customIcon = L.divIcon({
        className: 'custom-map-pin',
        html: `
          <div class="relative group cursor-pointer">
            <div class="w-7 h-7 rounded-full ${badgeColor} p-1 text-slate-950 flex items-center justify-center font-bold text-xs shadow-lg transition-transform group-hover:scale-125 ring-2 ring-slate-950">
              ${city.name.charAt(0)}
            </div>
            <div class="absolute left-1/2 -translate-x-1/2 bottom-8 hidden group-hover:block whitespace-nowrap bg-slate-900 border border-cyan-500/30 text-white text-[11px] font-medium px-2 py-1 rounded-md shadow-xl z-50">
              ${city.name} (${city.activeWorkersCount} workers)
            </div>
          </div>
        `,
        iconSize: [28, 28],
        iconAnchor: [14, 14]
      });

      const marker = L.marker([city.lat, city.lng], { icon: customIcon });

      const popupContent = document.createElement('div');
      popupContent.className = 'p-3 bg-slate-900 text-white rounded-xl border border-slate-800 font-sans max-w-xs';
      popupContent.innerHTML = `
        <div class="flex items-center justify-between gap-2 border-b border-slate-800 pb-2 mb-2">
          <h4 class="font-bold text-sm text-cyan-300 flex items-center gap-1">
            <span>📍 ${city.name}</span>
          </h4>
          <span class="text-[10px] px-2 py-0.5 rounded-full ${city.tier === 'Tier-1' ? 'bg-cyan-950 text-cyan-300 border border-cyan-500/30' : 'bg-slate-800 text-gray-300'} font-semibold">
            ${city.tier}
          </span>
        </div>
        <p class="text-xs text-gray-400 mb-2">${city.description || `State: ${city.state}`}</p>
        <div class="flex items-center justify-between text-xs text-cyan-400 font-medium bg-slate-950 p-2 rounded-lg mb-3">
          <span>Active Workers Available:</span>
          <span class="font-bold text-white">${city.activeWorkersCount}</span>
        </div>
        <button id="btn-select-${city.id}" class="w-full py-1.5 px-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold rounded-lg text-xs transition">
          Select ${city.name}
        </button>
      `;

      marker.bindPopup(popupContent, { maxWidth: 260, className: 'custom-leaflet-popup' });

      marker.on('popupopen', () => {
        const btn = document.getElementById(`btn-select-${city.id}`);
        if (btn) {
          btn.onclick = () => {
            const placeRes: SearchLocationResult = {
              id: city.id,
              name: city.name,
              displayName: `${city.name}, ${city.state}`,
              lat: city.lat,
              lng: city.lng,
              state: city.state,
              activeWorkersCount: city.activeWorkersCount
            };
            setSelectedPlace(placeRes);
            if (mapRef.current) mapRef.current.closePopup();
          };
        }
      });

      marker.addTo(markersLayer);
    });
  }, [activeRegion, selectedCityName]);

  // Live input search effect (Offline instant + Online geocoder)
  useEffect(() => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    const timer = setTimeout(async () => {
      // 1. Instant local offline matches
      const offlineMatches = searchOfflineIndiaCities(query);

      // 2. Fetch online places if query >= 3 chars
      let onlineMatches: SearchLocationResult[] = [];
      if (query.trim().length >= 3) {
        onlineMatches = await searchIndiaPlacesOnline(query);
      }

      // Combine & filter duplicates
      const existingNames = new Set(offlineMatches.map((m) => m.name.toLowerCase()));
      const filteredOnline = onlineMatches.filter(
        (om) => !existingNames.has(om.name.toLowerCase())
      );

      const combined = [...offlineMatches, ...filteredOnline];
      startTransition(() => {
        setSearchResults(combined);
        setIsSearching(false);
      });
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  // Add custom marker for searched location and fly map to it
  const addCustomMarker = (place: SearchLocationResult, openPopup = true) => {
    if (!mapRef.current || !markersLayerRef.current) return;

    const map = mapRef.current;
    
    // Pan and zoom smoothly
    map.flyTo([place.lat, place.lng], 12, { animate: true, duration: 1.4 });

    const customIcon = L.divIcon({
      className: 'searched-map-pin',
      html: `
        <div class="relative animate-bounce">
          <div class="w-9 h-9 rounded-full bg-cyan-400 text-slate-950 p-1 flex items-center justify-center font-black shadow-2xl shadow-cyan-400 ring-4 ring-cyan-500/30">
            📍
          </div>
        </div>
      `,
      iconSize: [36, 36],
      iconAnchor: [18, 18]
    });

    const marker = L.marker([place.lat, place.lng], { icon: customIcon }).addTo(markersLayerRef.current);

    const popupHtml = `
      <div class="p-3 bg-slate-900 text-white rounded-xl border border-cyan-500/40 font-sans max-w-xs">
        <div class="font-bold text-sm text-cyan-300 mb-1">📍 ${place.name}</div>
        <div class="text-[11px] text-gray-300 mb-2 leading-relaxed">${place.displayName}</div>
        <div class="text-xs text-emerald-400 font-semibold mb-2">
          ✓ ${place.activeWorkersCount || 24} Verified Workers Available
        </div>
      </div>
    `;

    marker.bindPopup(popupHtml).openPopup();
  };

  // Select place handler
  const handleSelectResult = (place: SearchLocationResult) => {
    setSelectedPlace(place);
    setQuery(place.name);
    setSearchResults([]);
    addCustomMarker(place);
    if (onSelectPlace) {
      onSelectPlace(place);
    }
  };

  // GPS Locate me handler
  const handleLocateMe = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        const address = await reverseGeocodeIndia(latitude, longitude);

        const currentLoc: SearchLocationResult = {
          id: `gps-${Date.now()}`,
          name: address.split(',')[0] || 'My Current Location',
          displayName: address,
          lat: latitude,
          lng: longitude,
          state: 'India',
          country: 'India',
          activeWorkersCount: 42
        };

        setSelectedPlace(currentLoc);
        setIsLocating(false);
        addCustomMarker(currentLoc);
        if (onSelectPlace) onSelectPlace(currentLoc);
      },
      (err) => {
        setIsLocating(false);
        alert('Could not retrieve your GPS location. Please select a city on the map.');
      },
      { timeout: 10000 }
    );
  };

  return (
    <div className="relative w-full rounded-3xl overflow-hidden border border-slate-800 bg-slate-950 shadow-2xl">
      {/* Top Search & Filter Floating Overlay */}
      {showFullControls && (
        <div className="absolute top-4 left-4 right-4 z-[400] flex flex-col gap-3 max-w-2xl mx-auto">
          {/* Main Search Input */}
          <div className="relative w-full shadow-2xl">
            <div className="flex items-center bg-slate-900/90 backdrop-blur-md border border-cyan-500/30 rounded-2xl p-1.5 focus-within:border-cyan-400 focus-within:ring-2 focus-within:ring-cyan-500/20 transition-all">
              <Search className="w-5 h-5 text-cyan-400 ml-3 flex-shrink-0" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search any place in India (e.g. Jaipur, Connaught Place, Whitefield, Pune)..."
                className="w-full bg-transparent px-3 py-2 text-sm text-white placeholder-gray-400 outline-none font-medium"
              />
              {query && (
                <button
                  onClick={() => {
                    setQuery('');
                    setSearchResults([]);
                  }}
                  className="p-1.5 rounded-xl hover:bg-slate-800 text-gray-400 hover:text-white mr-1 transition"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
              <button
                onClick={handleLocateMe}
                disabled={isLocating}
                title="Locate me on map"
                className="flex items-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-cyan-950 border border-slate-700 hover:border-cyan-500/50 text-cyan-300 rounded-xl text-xs font-semibold transition flex-shrink-0"
              >
                {isLocating ? (
                  <Loader2 className="w-4 h-4 animate-spin text-cyan-400" />
                ) : (
                  <Navigation className="w-4 h-4 text-cyan-400" />
                )}
                <span className="hidden sm:inline">Near Me</span>
              </button>
            </div>

            {/* Autocomplete Dropdown */}
            {(searchResults.length > 0 || isSearching) && (
              <div className="absolute left-0 right-0 top-full mt-2 bg-slate-900/95 backdrop-blur-xl border border-slate-800 rounded-2xl p-2 shadow-2xl max-h-80 overflow-y-auto z-[500] divide-y divide-slate-800/50">
                {isSearching ? (
                  <div className="p-4 text-center text-xs text-cyan-400 flex items-center justify-center gap-2 font-medium">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Searching places across India...</span>
                  </div>
                ) : (
                  searchResults.map((res) => (
                    <button
                      key={res.id}
                      onClick={() => handleSelectResult(res)}
                      className="w-full text-left p-3 hover:bg-slate-800/80 rounded-xl transition flex items-start justify-between group"
                    >
                      <div className="flex items-start gap-2.5">
                        <MapPin className="w-4 h-4 text-cyan-400 mt-0.5 flex-shrink-0 group-hover:scale-110 transition-transform" />
                        <div>
                          <div className="font-semibold text-sm text-white group-hover:text-cyan-300 transition-colors">
                            {res.name}
                          </div>
                          <div className="text-xs text-gray-400 line-clamp-1">
                            {res.displayName}
                          </div>
                        </div>
                      </div>
                      <span className="text-[10px] px-2 py-1 rounded-md bg-slate-950 text-cyan-400 border border-cyan-500/20 font-bold ml-2 flex-shrink-0">
                        {res.isOfflineMatch ? 'Hub' : 'Place'}
                      </span>
                    </button>
                  ))
                )}
              </div>
            )}
          </div>

          {/* Region & Tier Filters Bar */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
            {CITY_REGIONS.map((reg) => (
              <button
                key={reg}
                onClick={() => setActiveRegion(reg)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border ${
                  activeRegion === reg
                    ? 'bg-cyan-500 text-slate-950 border-cyan-400 shadow-md font-bold'
                    : 'bg-slate-900/80 backdrop-blur-md text-gray-300 border-slate-800 hover:border-cyan-500/40 hover:text-white'
                }`}
              >
                {reg}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Selected Location Banner Bottom Left */}
      {selectedPlace && (
        <div className="absolute bottom-4 left-4 z-[400] max-w-sm bg-slate-900/90 backdrop-blur-md border border-cyan-500/30 p-3 rounded-2xl shadow-2xl flex items-center justify-between gap-3 animate-fade-in">
          <div>
            <div className="text-[10px] text-cyan-400 font-bold tracking-wider uppercase">Selected Location</div>
            <div className="font-bold text-sm text-white">{selectedPlace.name}</div>
            <div className="text-xs text-gray-400">{selectedPlace.state || 'India'}</div>
          </div>
          {onSelectPlace && (
            <button
              onClick={() => onSelectPlace(selectedPlace)}
              className="px-3 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition flex items-center gap-1"
            >
              <span>Confirm</span>
              <Check className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      )}

      {/* Map Container */}
      <div ref={mapContainerRef} style={{ height }} className="w-full z-10" />
    </div>
  );
};
