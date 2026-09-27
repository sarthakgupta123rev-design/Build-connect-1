import { apiRequest } from './client';

export async function createDispute(token: string, bookingId: string, reason: string, description: string) {
  return await apiRequest('/disputes', {
    method: 'POST',
    token,
    body: {
      booking_id: bookingId,
      reason,
      description
    }
  });
}

export async function getDisputes(token: string) {
  return await apiRequest('/disputes', {
    method: 'GET',
    token
  });
}

export async function getDisputeById(token: string, id: string) {
  return await apiRequest(`/disputes/${id}`, {
    method: 'GET',
    token
  });
}

export async function updateDisputeStatus(token: string, id: string, status: string, resolutionNotes?: string) {
  return await apiRequest(`/disputes/${id}/status`, {
    method: 'PATCH',
    token,
    body: {
      status,
      resolution_notes: resolutionNotes
    }
  });
}
