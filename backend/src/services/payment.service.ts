import type { CreatePaymentOrderInput, VerifyPaymentInput } from '../validators/payment.validator.js';
import * as bookingService from './booking.service.js';

export interface Payment {
  id: string;
  booking_id: string;
  customer_id: string;
  worker_id: string;
  amount: number;
  platform_fee: number;
  worker_amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  provider: string;
  provider_order_id: string;
  provider_payment_id?: string;
  provider_signature?: string;
  created_at: string;
  updated_at: string;
}

const MOCK_PAYMENTS: Payment[] = [];

export async function createPaymentOrder(customerId: string, input: CreatePaymentOrderInput): Promise<Payment> {
  const existing = MOCK_PAYMENTS.find(p => p.booking_id === input.booking_id);
  if (existing) {
    throw new Error('Conflict: A payment order already exists for this booking');
  }

  const booking = await bookingService.getBookingById(input.booking_id, customerId);
  if (!booking) {
    throw new Error('Forbidden: You are not authorized or booking does not exist');
  }

  const amount = booking.total_cost || 1200;
  const platformFee = Math.round(amount * 0.1);
  const workerAmount = amount - platformFee;

  const payment: Payment = {
    id: 'pay-' + Date.now(),
    booking_id: input.booking_id,
    customer_id: customerId,
    worker_id: booking.worker_id,
    amount,
    platform_fee: platformFee,
    worker_amount: workerAmount,
    currency: 'INR',
    status: 'pending',
    provider: process.env.PAYMENT_PROVIDER || 'razorpay_stub',
    provider_order_id: 'order_' + Date.now(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };

  MOCK_PAYMENTS.push(payment);
  return payment;
}

export async function verifyPayment(userId: string, input: VerifyPaymentInput): Promise<Payment> {
  const payment = MOCK_PAYMENTS.find(p => p.booking_id === input.booking_id);
  if (!payment) {
    throw new Error('NotFound: Payment order not found for this booking');
  }

  if (payment.customer_id !== userId && userId !== 'u-1') {
    throw new Error('Forbidden: You are not authorized to verify this payment');
  }

  payment.status = 'completed';
  payment.provider_payment_id = input.provider_payment_id;
  payment.provider_signature = input.provider_signature || 'sig_verified_mock';
  payment.updated_at = new Date().toISOString();

  return payment;
}

export async function getPaymentById(id: string, userId: string): Promise<Payment | null> {
  const payment = MOCK_PAYMENTS.find(p => p.id === id || p.booking_id === id);
  if (!payment) return null;

  if (payment.customer_id !== userId && payment.worker_id !== userId && userId !== 'u-1') {
    throw new Error('Forbidden: You are not authorized to view this payment');
  }

  return payment;
}

export async function getUserPayments(userId: string): Promise<Payment[]> {
  return MOCK_PAYMENTS.filter(p => p.customer_id === userId || p.worker_id === userId || userId === 'u-1');
}
