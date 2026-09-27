import { apiRequest } from './client';

export async function createPaymentOrder(token: string, bookingId: string) {
  return await apiRequest('/payments/create-order', {
    method: 'POST',
    token,
    body: { booking_id: bookingId }
  });
}

export async function verifyPayment(
  token: string,
  bookingId: string,
  providerPaymentId: string,
  providerSignature?: string
) {
  return await apiRequest('/payments/verify', {
    method: 'POST',
    token,
    body: {
      booking_id: bookingId,
      provider_payment_id: providerPaymentId,
      provider_signature: providerSignature
    }
  });
}

export async function getPaymentDetails(token: string, id: string) {
  return await apiRequest(`/payments/${id}`, {
    method: 'GET',
    token
  });
}

export async function getUserPayments(token: string) {
  return await apiRequest('/payments', {
    method: 'GET',
    token
  });
}
