import type { CreateReviewInput } from '../validators/review.validator.js';
import { getBookingById } from './booking.service.js';

interface Review {
  id: string;
  booking_id: string;
  customer_id: string;
  worker_id: string;
  rating: number;
  quality_rating?: number;
  punctuality_rating?: number;
  professionalism_rating?: number;
  comment: string;
  created_at: string;
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

export async function createReview(customerId: string, input: CreateReviewInput) {
  const existing = MOCK_REVIEWS.find(r => r.booking_id === input.booking_id);
  if (existing) {
    throw new Error('Conflict: A review has already been submitted for this booking');
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
    comment: input.comment,
    created_at: new Date().toISOString().split('T')[0],
  };

  MOCK_REVIEWS.unshift(newReview);
  return newReview;
}

export async function getReviewsByWorkerId(workerId: string) {
  return MOCK_REVIEWS.filter(r => r.worker_id === workerId || workerId === 'w-1');
}
