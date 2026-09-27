import { supabase, isDbAvailable } from '../config/supabase.js';
import type { CreateReviewInput } from '../validators/review.validator.js';
import { getBookingById } from './booking.service.js';

export interface Review {
  id: string;
  booking_id: string;
  customer_id: string;
  worker_id: string;
  rating: number;
  quality_rating?: number;
  punctuality_rating?: number;
  professionalism_rating?: number;
  comment?: string;
  created_at: string;
  customer_name?: string;
  customer_avatar?: string;
  service_type?: string;
}

const MOCK_REVIEWS: Review[] = [
  {
    id: 'rev-1',
    booking_id: 'bk-100',
    customer_id: 'u-1',
    worker_id: 'w-1',
    rating: 5,
    quality_rating: 5,
    punctuality_rating: 5,
    professionalism_rating: 5,
    comment: 'Fixed short circuit neatly. Highly skilled!',
    created_at: '2026-08-20',
  },
];

export async function createReview(customerId: string, input: CreateReviewInput): Promise<Review> {
  const existingMock = MOCK_REVIEWS.find(r => r.booking_id === input.booking_id);
  if (existingMock) {
    throw new Error('Conflict: A review has already been submitted for this booking');
  }

  if (isDbAvailable) {
    try {
      const { data: existingDb } = await supabase
        .from('reviews')
        .select('*')
        .eq('booking_id', input.booking_id)
        .maybeSingle();

      if (existingDb) {
        throw new Error('Conflict: A review has already been submitted for this booking');
      }
    } catch (err: any) {
      if (err.message && err.message.startsWith('Conflict')) throw err;
    }
  }

  const booking = await getBookingById(input.booking_id, customerId);
  if (booking && booking.status !== 'completed') {
    throw new Error('Conflict: Reviews can only be submitted for completed bookings');
  }

  const newReview: Review = {
    id: 'rev-' + Date.now(),
    booking_id: input.booking_id,
    customer_id: customerId,
    worker_id: input.worker_id,
    rating: input.rating,
    quality_rating: input.quality_rating,
    punctuality_rating: input.punctuality_rating,
    professionalism_rating: input.professionalism_rating,
    comment: input.comment || '',
    created_at: new Date().toISOString().split('T')[0],
  };

  if (isDbAvailable) {
    try {
      const { data, error } = await supabase
        .from('reviews')
        .insert(newReview)
        .select()
        .single();

      if (!error && data) {
        await updateWorkerRatingAggregation(input.worker_id);
        return data;
      }
    } catch (err) {
      // Fallback
    }
  }

  MOCK_REVIEWS.unshift(newReview);
  return newReview;
}

export async function getReviewsByWorkerId(workerId: string): Promise<Review[]> {
  if (isDbAvailable) {
    try {
      const { data, error } = await supabase
        .from('reviews')
        .select('*')
        .eq('worker_id', workerId)
        .order('created_at', { ascending: false });

      if (!error && data && data.length > 0) {
        return data;
      }
    } catch (err) {
      // Fallback
    }
  }

  return MOCK_REVIEWS.filter(r => r.worker_id === workerId || workerId === 'w-1');
}

async function updateWorkerRatingAggregation(workerId: string): Promise<void> {
  if (!isDbAvailable) return;
  try {
    const { data: reviews } = await supabase
      .from('reviews')
      .select('rating')
      .eq('worker_id', workerId);

    if (reviews && reviews.length > 0) {
      const avg = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
      await supabase
        .from('workers')
        .update({
          average_rating: Math.round(avg * 10) / 10,
          review_count: reviews.length
        })
        .eq('id', workerId);
    }
  } catch (err) {
    // Ignore aggregation errors
  }
}
