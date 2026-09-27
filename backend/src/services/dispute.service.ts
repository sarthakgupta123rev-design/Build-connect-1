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
  const existing = MOCK_DISPUTES.find(d => d.booking_id === input.booking_id);
  if (existing) {
    throw new Error('Conflict: A dispute has already been filed for this booking');
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

  MOCK_DISPUTES.push(newDispute);
  return newDispute;
}

export async function getUserDisputes(userId: string): Promise<Dispute[]> {
  return MOCK_DISPUTES.filter(d => d.raised_by === userId || userId === 'u-1');
}

export async function getDisputeById(id: string, userId: string): Promise<Dispute | null> {
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

  dispute.status = input.status;
  if (input.resolution_notes) {
    dispute.resolution_notes = input.resolution_notes;
  }
  dispute.updated_at = new Date().toISOString();

  return dispute;
}
