import type { CreateMessageInput } from '../validators/message.validator.js';
import * as bookingService from './booking.service.js';

export interface Message {
  id: string;
  booking_id: string;
  sender_id: string;
  recipient_id: string;
  content: string;
  created_at: string;
}

const MOCK_MESSAGES: Message[] = [
  {
    id: 'msg-101',
    booking_id: 'bk-101',
    sender_id: 'u-1',
    recipient_id: 'w-1',
    content: 'Hello, please confirm if you will bring DB board components.',
    created_at: new Date().toISOString()
  }
];

export async function createMessage(senderId: string, input: CreateMessageInput): Promise<Message> {
  const booking = await bookingService.getBookingById(input.booking_id, senderId);
  if (!booking) {
    throw new Error('Forbidden: You are not authorized or booking does not exist');
  }

  const newMessage: Message = {
    id: 'msg-' + Date.now(),
    booking_id: input.booking_id,
    sender_id: senderId,
    recipient_id: input.recipient_id,
    content: input.content,
    created_at: new Date().toISOString()
  };

  MOCK_MESSAGES.push(newMessage);
  return newMessage;
}

export async function getBookingMessages(userId: string, bookingId: string): Promise<Message[]> {
  const booking = await bookingService.getBookingById(bookingId, userId);
  if (!booking) {
    throw new Error('Forbidden: You are not authorized to view messages for this booking');
  }

  return MOCK_MESSAGES.filter(m => m.booking_id === bookingId);
}
