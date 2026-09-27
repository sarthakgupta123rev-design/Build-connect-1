import { INDIA_CITIES, IndiaCity } from '../data/indiaCities';

export interface SearchLocationResult {
  id: string;
  name: string;
  displayName: string;
  lat: number;
  lng: number;
  state?: string;
  country?: string;
  isOfflineMatch?: boolean;
  type?: string;
  activeWorkersCount?: number;
  description?: string;
}

/**
 * Searches offline static India city index instantly
 */
export function searchOfflineIndiaCities(query: string): SearchLocationResult[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];

  return INDIA_CITIES.filter((city) => {
    const nameMatch = city.name.toLowerCase().includes(q);
    const stateMatch = city.state.toLowerCase().includes(q);
    const areaMatch = city.popularAreas?.some((area) => area.toLowerCase().includes(q));
    return nameMatch || stateMatch || areaMatch;
  }).map((city) => ({
    id: city.id,
    name: city.name,
    displayName: `${city.name}, ${city.state}`,
    lat: city.lat,
    lng: city.lng,
    state: city.state,
    country: 'India',
    isOfflineMatch: true,
    activeWorkersCount: city.activeWorkersCount,
    description: city.description
  }));
}

/**
 * Searches OpenStreetMap Nominatim API limited to India (countrycodes=in)
 */
export async function searchIndiaPlacesOnline(query: string): Promise<SearchLocationResult[]> {
  const q = query.trim();
  if (!q || q.length < 2) return [];

  try {
    const encodedQuery = encodeURIComponent(q.includes('India') ? q : `${q}, India`);
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodedQuery}&countrycodes=in&addressdetails=1&limit=8`;

    const response = await fetch(url, {
      headers: {
        'Accept-Language': 'en',
        'User-Agent': 'BuildConnectIndiaApp/1.0'
      }
    });

    if (!response.ok) return [];

    const data = await response.json();

    return data.map((item: any) => {
      const address = item.address || {};
      const placeName =
        address.city ||
        address.town ||
        address.village ||
        address.suburb ||
        address.county ||
        address.state_district ||
        item.name ||
        item.display_name.split(',')[0];

      const stateName = address.state || address.region || 'India';

      return {
        id: `osm-${item.place_id}`,
        name: placeName,
        displayName: item.display_name,
        lat: parseFloat(item.lat),
        lng: parseFloat(item.lon),
        state: stateName,
        country: 'India',
        isOfflineMatch: false,
        type: item.type || item.category,
        activeWorkersCount: Math.floor(Math.random() * 40) + 15
      };
    });
  } catch (error) {
    console.warn('Online place search error, falling back to offline index:', error);
    return [];
  }
}

/**
 * Reverse geocodes lat/lng to human-readable address in India
 */
export async function reverseGeocodeIndia(lat: number, lng: number): Promise<string> {
  try {
    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1`;
    const response = await fetch(url, {
      headers: {
        'Accept-Language': 'en',
        'User-Agent': 'BuildConnectIndiaApp/1.0'
      }
    });

    if (!response.ok) return `${lat.toFixed(4)}°, ${lng.toFixed(4)}°`;

    const data = await response.json();
    if (data && data.display_name) {
      return data.display_name;
    }
    return `${lat.toFixed(4)}°, ${lng.toFixed(4)}°`;
  } catch (err) {
    return `${lat.toFixed(4)}°, ${lng.toFixed(4)}°`;
  }
}
