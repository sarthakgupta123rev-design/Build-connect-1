import { apiRequest } from './client';
import { supabase } from '../lib/supabase';

export async function updateWorkerLocation(
  token: string,
  data: { latitude: number; longitude: number; accuracy?: number; booking_id?: string }
) {
  return await apiRequest('/workers/me/location', {
    method: 'POST',
    token,
    body: data
  });
}

export async function getWorkerLocation(token: string, workerId: string, bookingId?: string) {
  const endpoint = bookingId ? `/workers/${workerId}/location?booking_id=${bookingId}` : `/workers/${workerId}/location`;
  return await apiRequest(endpoint, {
    method: 'GET',
    token
  });
}

export function subscribeToWorkerLocation(workerId: string, onLocationChange: (location: any) => void) {
  const channel = supabase
    .channel(`worker_loc_${workerId}`)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'worker_locations',
        filter: `worker_id=eq.${workerId}`
      },
      (payload) => {
        if (payload.new) {
          onLocationChange(payload.new);
        }
      }
    )
    .subscribe();

  return channel;
}

export function unsubscribeFromWorkerLocation(channel: any) {
  if (channel) {
    supabase.removeChannel(channel);
  }
}
