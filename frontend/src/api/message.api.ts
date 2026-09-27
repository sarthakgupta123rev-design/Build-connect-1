import { apiRequest } from './client';
import { supabase } from '../lib/supabase';

export async function sendMessage(token: string, bookingId: string, recipientId: string, content: string) {
  return await apiRequest('/messages', {
    method: 'POST',
    token,
    body: {
      booking_id: bookingId,
      recipient_id: recipientId,
      content
    }
  });
}

export async function getBookingMessages(token: string, bookingId: string) {
  return await apiRequest(`/messages/booking/${bookingId}`, {
    method: 'GET',
    token
  });
}

export function subscribeToBookingMessages(bookingId: string, onNewMessage: (payload: any) => void) {
  const channel = supabase
    .channel(`booking_chat_${bookingId}`)
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `booking_id=eq.${bookingId}`
      },
      (payload) => {
        if (payload.new) {
          onNewMessage(payload.new);
        }
      }
    )
    .subscribe();

  return channel;
}

export function unsubscribeFromBookingMessages(channel: any) {
  if (channel) {
    supabase.removeChannel(channel);
  }
}
