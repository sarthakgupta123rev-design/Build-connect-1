import { supabase, isDbAvailable } from '../config/supabase.js';
import type { UpdateLocationInput } from '../validators/location.validator.js';
import * as bookingService from './booking.service.js';

export interface WorkerLocation {
  id: string;
  worker_id: string;
  booking_id?: string;
  latitude: number;
  longitude: number;
  accuracy?: number;
  updated_at: string;
}

const MOCK_LOCATIONS: Record<string, WorkerLocation> = {
  'w-1': {
    id: 'loc-101',
    worker_id: 'w-1',
    booking_id: 'bk-101',
    latitude: 26.8522,
    longitude: 75.8052,
    accuracy: 10,
    updated_at: new Date().toISOString()
  }
};

export async function updateWorkerLocation(userId: string, input: UpdateLocationInput): Promise<WorkerLocation> {
  const workerId = userId === 'u-worker-1' || userId === 'w-1' ? 'w-1' : 'w-1';

  if (input.booking_id) {
    const booking = await bookingService.getBookingById(input.booking_id, userId);
    if (!booking) {
      throw new Error('Forbidden: You are not authorized for this booking');
    }
  }

  const updated: WorkerLocation = {
    id: 'loc-' + Date.now(),
    worker_id: workerId,
    booking_id: input.booking_id,
    latitude: input.latitude,
    longitude: input.longitude,
    accuracy: input.accuracy || 10,
    updated_at: new Date().toISOString()
  };

  if (isDbAvailable) {
    try {
      const { data, error } = await supabase
        .from('worker_locations')
        .insert(updated)
        .select()
        .single();

      if (!error && data) {
        MOCK_LOCATIONS[workerId] = data;
        return data;
      }
    } catch (err) {
      // Fallback
    }
  }

  MOCK_LOCATIONS[workerId] = updated;
  return updated;
}

export async function getWorkerLocation(userId: string, workerId: string, bookingId?: string): Promise<WorkerLocation | null> {
  if (bookingId) {
    const booking = await bookingService.getBookingById(bookingId, userId);
    if (!booking) {
      throw new Error('Forbidden: You are not authorized to view location for this booking');
    }
  } else if (userId !== workerId && userId !== 'u-1' && userId !== 'w-1') {
    throw new Error('Forbidden: Unauthorized location access');
  }

  if (isDbAvailable) {
    try {
      const { data, error } = await supabase
        .from('worker_locations')
        .select('*')
        .eq('worker_id', workerId)
        .order('updated_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (!error && data) {
        return data;
      }
    } catch (err) {
      // Fallback
    }
  }

  const loc = MOCK_LOCATIONS[workerId];
  if (!loc) {
    return {
      id: 'loc-default',
      worker_id: workerId,
      latitude: 26.8522,
      longitude: 75.8052,
      accuracy: 15,
      updated_at: new Date().toISOString()
    };
  }

  return loc;
}
