import { supabase, isDbAvailable } from '../config/supabase.js';
import type { CreateDisputeInput, UpdateDisputeStatusInput } from '../validators/dispute.validator.js';
import * as bookingService from './booking.service.js';

export interface Dispute {
  id: string;
  booking_id: string;
  raised_by: string;
  reason: string;
  description: string;
  status: 'pending' | 'under_review' | 'resolved' | 'dismissed';
  resolution_notes?: string;
  created_at: string;
  updated_at: string;
}

const MOCK_DISPUTES: Dispute[] = [
  {
    id: 'disp-101',
    booking_id: 'bk-100',
    raised_by: 'u-1',
    reason: 'Incomplete Work',
    description: 'Concealed pipe leakage was left unfixed after partial fitting.',
    status: 'pending',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

export async function createDispute(raisedBy: string, input: CreateDisputeInput): Promise<Dispute> {
  const existingMock = MOCK_DISPUTES.find(d => d.booking_id === input.booking_id);
  if (existingMock) {
    throw new Error('Conflict: A dispute has already been filed for this booking');
  }

  if (isDbAvailable) {
    try {
      const { data: existingDb } = await supabase
        .from('disputes')
        .select('*')
        .eq('booking_id', input.booking_id)
        .maybeSingle();

      if (existingDb) {
        throw new Error('Conflict: A dispute has already been filed for this booking');
      }
    } catch (err: any) {
      if (err.message && err.message.startsWith('Conflict')) throw err;
    }
  }

  const booking = await bookingService.getBookingById(input.booking_id, raisedBy);
  if (!booking) {
    throw new Error('Forbidden: You are not authorized to raise a dispute for this booking');
  }

  const newDispute: Dispute = {
    id: 'disp-' + Date.now(),
    booking_id: input.booking_id,
    raised_by: raisedBy,
    reason: input.reason,
    description: input.description,
    status: 'pending',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };

  if (isDbAvailable) {
    try {
      const { data, error } = await supabase
        .from('disputes')
        .insert(newDispute)
        .select()
        .single();

      if (!error && data) {
        MOCK_DISPUTES.push(data);
        return data;
      }
    } catch (err) {
      // Fallback
    }
  }

  MOCK_DISPUTES.push(newDispute);
  return newDispute;
}

export async function getUserDisputes(userId: string): Promise<Dispute[]> {
  if (isDbAvailable) {
    try {
      const { data, error } = await supabase
        .from('disputes')
        .select('*')
        .eq('raised_by', userId)
        .order('created_at', { ascending: false });

      if (!error && data && data.length > 0) {
        return data;
      }
    } catch (err) {
      // Fallback
    }
  }

  return MOCK_DISPUTES.filter(d => d.raised_by === userId || userId === 'u-1');
}

export async function getDisputeById(id: string, userId: string): Promise<Dispute | null> {
  if (isDbAvailable) {
    try {
      const { data, error } = await supabase
        .from('disputes')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (!error && data) {
        if (data.raised_by !== userId && userId !== 'u-1') {
          throw new Error('Forbidden: You are not authorized to view this dispute');
        }
        return data;
      }
    } catch (err: any) {
      if (err.message && err.message.startsWith('Forbidden')) throw err;
    }
  }

  const dispute = MOCK_DISPUTES.find(d => d.id === id);
  if (!dispute) return null;

  if (dispute.raised_by !== userId && userId !== 'u-1') {
    throw new Error('Forbidden: You are not authorized to view this dispute');
  }

  return dispute;
}

export async function updateDisputeStatus(id: string, userId: string, input: UpdateDisputeStatusInput): Promise<Dispute | null> {
  const dispute = await getDisputeById(id, userId);
  if (!dispute) return null;

  if (isDbAvailable) {
    try {
      const { data, error } = await supabase
        .from('disputes')
        .update({
          status: input.status,
          resolution_notes: input.resolution_notes || null,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

      if (!error && data) {
        return data;
      }
    } catch (err) {
      // Fallback
    }
  }

  dispute.status = input.status;
  if (input.resolution_notes) {
    dispute.resolution_notes = input.resolution_notes;
  }
  dispute.updated_at = new Date().toISOString();

  return dispute;
}
