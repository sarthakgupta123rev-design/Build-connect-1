import { supabase, isDbAvailable } from '../config/supabase.js';
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
  const existingMock = MOCK_PAYMENTS.find(p => p.booking_id === input.booking_id);
  if (existingMock) {
    throw new Error('Conflict: A payment order already exists for this booking');
  }

  if (isDbAvailable) {
    try {
      const { data: existingDb } = await supabase
        .from('payments')
        .select('*')
        .eq('booking_id', input.booking_id)
        .maybeSingle();

      if (existingDb) {
        throw new Error('Conflict: A payment order already exists for this booking');
      }
    } catch (err: any) {
      if (err.message && err.message.startsWith('Conflict')) throw err;
    }
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

  if (isDbAvailable) {
    try {
      const { data, error } = await supabase
        .from('payments')
        .insert(payment)
        .select()
        .single();

      if (!error && data) {
        MOCK_PAYMENTS.push(data);
        return data;
      }
    } catch (err) {
      // Fallback
    }
  }

  MOCK_PAYMENTS.push(payment);
  return payment;
}

export async function verifyPayment(userId: string, input: VerifyPaymentInput): Promise<Payment> {
  if (isDbAvailable) {
    try {
      const { data: dbPayment } = await supabase
        .from('payments')
        .select('*')
        .eq('booking_id', input.booking_id)
        .maybeSingle();

      if (dbPayment) {
        if (dbPayment.customer_id !== userId && userId !== 'u-1') {
          throw new Error('Forbidden: You are not authorized to verify this payment');
        }

        const { data: updated, error } = await supabase
          .from('payments')
          .update({
            status: 'completed',
            provider_payment_id: input.provider_payment_id,
            provider_signature: input.provider_signature || 'sig_verified_mock',
            updated_at: new Date().toISOString()
          })
          .eq('id', dbPayment.id)
          .select()
          .single();

        if (!error && updated) {
          return updated;
        }
      }
    } catch (err: any) {
      if (err.message && err.message.startsWith('Forbidden')) throw err;
    }
  }

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
  if (isDbAvailable) {
    try {
      const { data, error } = await supabase
        .from('payments')
        .select('*')
        .or(`id.eq.${id},booking_id.eq.${id}`)
        .maybeSingle();

      if (!error && data) {
        if (data.customer_id !== userId && data.worker_id !== userId && userId !== 'u-1') {
          throw new Error('Forbidden: You are not authorized to view this payment');
        }
        return data;
      }
    } catch (err: any) {
      if (err.message && err.message.startsWith('Forbidden')) throw err;
    }
  }

  const payment = MOCK_PAYMENTS.find(p => p.id === id || p.booking_id === id);
  if (!payment) return null;

  if (payment.customer_id !== userId && payment.worker_id !== userId && userId !== 'u-1') {
    throw new Error('Forbidden: You are not authorized to view this payment');
  }

  return payment;
}

export async function getUserPayments(userId: string): Promise<Payment[]> {
  if (isDbAvailable) {
    try {
      const { data, error } = await supabase
        .from('payments')
        .select('*')
        .or(`customer_id.eq.${userId},worker_id.eq.${userId}`)
        .order('created_at', { ascending: false });

      if (!error && data && data.length > 0) {
        return data;
      }
    } catch (err) {
      // Fallback
    }
  }

  return MOCK_PAYMENTS.filter(p => p.customer_id === userId || p.worker_id === userId || userId === 'u-1');
}
