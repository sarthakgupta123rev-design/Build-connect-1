import { updateWorkerLocation } from '../api/location.api';

let watchId: number | null = null;
let lastLat = 0;
let lastLng = 0;
let lastUpdateTime = 0;

function calculateDistanceMeters(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371e3;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export function startWorkerTracking(token: string, bookingId?: string) {
  if (typeof window === 'undefined' || !('geolocation' in navigator)) {
    console.warn('Browser Geolocation is not supported in this environment.');
    return;
  }

  if (watchId !== null) {
    navigator.geolocation.clearWatch(watchId);
  }

  watchId = navigator.geolocation.watchPosition(
    async (position) => {
      const lat = position.coords.latitude;
      const lng = position.coords.longitude;
      const accuracy = position.coords.accuracy;
      const now = Date.now();

      const distance = calculateDistanceMeters(lastLat, lastLng, lat, lng);
      const timeElapsed = (now - lastUpdateTime) / 1000;

      // Throttle: Send location only if moved > 10m or interval > 15s
      if (distance > 10 || timeElapsed > 15 || lastUpdateTime === 0) {
        lastLat = lat;
        lastLng = lng;
        lastUpdateTime = now;

        try {
          await updateWorkerLocation(token, {
            latitude: lat,
            longitude: lng,
            accuracy,
            booking_id: bookingId
          });
        } catch (err) {
          console.warn('Failed to publish worker location:', err);
        }
      }
    },
    (err) => {
      console.warn('Geolocation error:', err.message);
    },
    {
      enableHighAccuracy: true,
      maximumAge: 10000,
      timeout: 20000
    }
  );
}

export function stopWorkerTracking() {
  if (watchId !== null && typeof window !== 'undefined' && 'geolocation' in navigator) {
    navigator.geolocation.clearWatch(watchId);
    watchId = null;
  }
}
