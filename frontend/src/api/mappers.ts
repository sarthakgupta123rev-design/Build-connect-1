import type { Worker, Booking, Review, Profession } from '../types';
import type { BackendWorker } from './workers.api';
import type { BackendBooking, BackendBookingStatus } from './bookings.api';
import type { BackendReview } from './reviews.api';

export function mapBackendWorkerToWorker(bw: BackendWorker): Worker {
  return {
    id: bw.id,
    name: bw.name || 'BuildConnect Specialist',
    profession: (bw.profession as Profession) || 'Electrician',
    avatar: bw.avatar_url || 'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?auto=format&fit=crop&w=150&q=80',
    rating: bw.average_rating || 4.8,
    reviewCount: bw.review_count || 0,
    experienceYears: bw.experience_years || 0,
    completedJobs: bw.total_jobs || 0,
    onTimePercentage: 98,
    distanceKm: 2.1,
    city: bw.city || 'Jaipur',
    area: bw.area || 'Central',
    hourlyRate: bw.hourly_rate || 350,
    fixedRateMin: bw.fixed_rate_min || 400,
    fixedRateMax: bw.fixed_rate_max || 800,
    verified: bw.verified ?? true,
    trustScore: bw.trust_score || 90,
    availability: bw.availability || 'Available Today',
    skills: bw.skills || [],
    bio: bw.bio || '',
    phone: bw.phone || '',
    languages: ['Hindi', 'English']
  };
}

export function mapBackendStatusToFrontend(status: BackendBookingStatus): Booking['status'] {
  switch (status) {
    case 'pending':
      return 'Pending';
    case 'accepted':
      return 'Confirmed';
    case 'rejected':
      return 'Cancelled';
    case 'in_progress':
      return 'In Progress';
    case 'completed':
      return 'Completed';
    case 'cancelled':
      return 'Cancelled';
    default:
      return 'Pending';
  }
}

export function mapFrontendStatusToBackend(status: Booking['status']): BackendBookingStatus {
  switch (status) {
    case 'Pending':
      return 'pending';
    case 'Confirmed':
      return 'accepted';
    case 'In Progress':
      return 'in_progress';
    case 'Completed':
      return 'completed';
    case 'Cancelled':
      return 'cancelled';
    default:
      return 'pending';
  }
}

export function mapBackendBookingToBooking(bb: BackendBooking): Booking {
  return {
    id: bb.id,
    workerId: bb.worker_id,
    workerName: bb.worker_name || 'Assigned Specialist',
    workerProfession: (bb.worker_profession as Profession) || 'Service Expert',
    workerAvatar: bb.worker_avatar || 'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?auto=format&fit=crop&w=150&q=80',
    workerPhone: bb.worker_phone || '',
    customerName: bb.customer_name || 'Customer',
    customerPhone: bb.customer_phone || '',
    customerAddress: bb.customer_address,
    city: bb.city,
    serviceType: bb.service_type,
    bookingDate: bb.booking_date,
    timeSlot: bb.time_slot,
    problemDescription: bb.problem_description || '',
    serviceCost: bb.agreed_price,
    platformFee: bb.platform_fee,
    totalCost: bb.total_cost,
    status: mapBackendStatusToFrontend(bb.status),
    paymentStatus: 'Pending',
    createdAt: bb.created_at || new Date().toISOString()
  };
}

export function mapBackendReviewToReview(br: BackendReview): Review {
  return {
    id: br.id,
    workerId: br.worker_id,
    customerName: br.customer_name || 'Satisfied Customer',
    customerAvatar: br.customer_avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
    rating: br.rating,
    qualityRating: br.quality_rating || br.rating,
    punctualityRating: br.punctuality_rating || br.rating,
    professionalismRating: br.professionalism_rating || br.rating,
    comment: br.comment || '',
    date: br.created_at || 'Recently',
    verifiedBooking: true,
    serviceType: br.service_type || 'General Service'
  };
}
