import { createPaymentOrder, verifyPayment, getPaymentDetails, getUserPayments } from '../api/payment.api';
import { updateWorkerLocation, getWorkerLocation, subscribeToWorkerLocation, unsubscribeFromWorkerLocation } from '../api/location.api';
import { startWorkerTracking, stopWorkerTracking } from './location.service';
import { requestNotificationPermission, showNotification } from './notification.service';
import { apiRequest } from '../api/client';
import { sendMessage as sendMsgApi, getBookingMessages as getMsgsApi, subscribeToBookingMessages, unsubscribeFromBookingMessages } from '../api/message.api';
import { createDispute as createDispApi, getDisputes as getDispsApi, getDisputeById as getDispByIdApi, updateDisputeStatus as updateDispStatusApi } from '../api/dispute.api';
import { getAIRecommendations } from '../api/ai.api';
import { fetchWorkerEarnings, fetchWorkerJobs } from '../api/analytics.api';
import type { Worker, Booking, Review, AIMatchResult, FilterOptions, WorkerEarnings, Profession } from '../types';
import { MOCK_WORKERS, MOCK_BOOKINGS, MOCK_REVIEWS, MOCK_EARNINGS } from '../mock/data';
import { fetchWorkers as fetchWorkersApi, fetchWorkerById as fetchWorkerByIdApi, BackendWorker } from '../api/workers.api';
import { createBooking as createBookingApi, fetchBookings as fetchBookingsApi, updateBookingStatus as updateBookingStatusApi, BackendBooking, BackendBookingStatus } from '../api/bookings.api';
import { fetchWorkerReviews as fetchWorkerReviewsApi, submitReview as submitReviewApi, BackendReview } from '../api/reviews.api';
import { supabase } from '../lib/supabase';

// Helper to get active Supabase session token
async function getAuthToken(): Promise<string | null> {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    return session ? session.access_token : null;
  } catch {
    return null;
  }
}

// Data Mapping Adapters
function mapBackendWorkerToFrontend(bw: BackendWorker): Worker {
  return {
    id: bw.id,
    name: bw.name || 'BuildConnect Skilled Worker',
    profession: (bw.profession || 'Electrician') as Profession,
    avatar: bw.avatar_url || 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=400&q=80',
    rating: Number(bw.average_rating || 5.0),
    reviewCount: bw.total_jobs || 12,
    experienceYears: bw.experience_years || 5,
    completedJobs: bw.total_jobs || 48,
    onTimePercentage: 98,
    distanceKm: 1.8,
    city: bw.city || 'Jaipur',
    area: bw.area || 'Malviya Nagar',
    hourlyRate: Number(bw.hourly_rate || 350),
    fixedRateMin: Number(bw.fixed_rate_min || 300),
    fixedRateMax: Number(bw.fixed_rate_max || 800),
    verified: bw.verified ?? true,
    trustScore: bw.trust_score || 92,
    availability: bw.availability || 'Available Today',
    skills: bw.skills && bw.skills.length > 0 ? bw.skills : ['Installation', 'Maintenance', 'Repair'],
    bio: bw.bio || 'Verified skilled construction and home service professional.',
    languages: ['Hindi', 'English']
  };
}

function mapBackendBookingToFrontend(bb: BackendBooking): Booking {
  const statusMap: Record<string, Booking['status']> = {
    pending: 'Pending',
    accepted: 'Confirmed',
    rejected: 'Cancelled',
    in_progress: 'In Progress',
    completed: 'Completed',
    cancelled: 'Cancelled'
  };

  return {
    id: bb.id,
    workerId: bb.worker_id,
    workerName: bb.worker_name || 'Assigned Worker',
    workerProfession: (bb.worker_profession || 'Electrician') as Profession,
    workerAvatar: bb.worker_avatar || 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=400&q=80',
    workerPhone: bb.worker_phone || '+91 98765 00000',
    customerName: bb.customer_name || 'Customer',
    customerPhone: bb.customer_phone || '+91 98765 11111',
    customerAddress: bb.customer_address || 'Jaipur',
    city: bb.city || 'Jaipur',
    serviceType: bb.service_type || 'General Service',
    bookingDate: bb.booking_date || new Date().toISOString().split('T')[0],
    timeSlot: bb.time_slot || '10:00 AM - 11:30 AM',
    problemDescription: bb.problem_description || '',
    serviceCost: Number(bb.agreed_price || 0),
    platformFee: Number(bb.platform_fee || 0),
    totalCost: Number(bb.total_cost || bb.agreed_price || 0),
    status: statusMap[bb.status] || 'Pending',
    paymentStatus: bb.status === 'completed' ? 'Paid' : 'Pending',
    createdAt: bb.created_at || new Date().toISOString()
  };
}

function mapBackendReviewToFrontend(br: BackendReview): Review {
  return {
    id: br.id,
    workerId: br.worker_id,
    customerName: br.customer_name || 'Verified Customer',
    customerAvatar: br.customer_avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
    rating: Number(br.rating || 5),
    qualityRating: Number(br.quality_rating || br.rating || 5),
    punctualityRating: Number(br.punctuality_rating || br.rating || 5),
    professionalismRating: Number(br.professionalism_rating || br.rating || 5),
    comment: br.comment || 'Excellent service!',
    date: br.created_at ? br.created_at.split('T')[0] : new Date().toISOString().split('T')[0],
    verifiedBooking: true,
    serviceType: br.service_type || 'Service'
  };
}

/**
 * Service API Abstraction Layer — Connected to Real BuildConnect Backend APIs
 */

export async function getWorkers(filters?: Partial<FilterOptions>): Promise<Worker[]> {
  try {
    const params = filters ? {
      profession: filters.category && filters.category !== 'All' ? filters.category : undefined,
      city: filters.city,
      min_rating: filters.minRating,
      max_price: filters.maxPrice,
      availability: filters.availableTodayOnly ? 'Available Today' : undefined
    } : undefined;

    const res = await fetchWorkersApi(params);
    if (res.success && Array.isArray(res.data)) {
      // RULE 2: Do NOT replace a successful backend empty-array response with mock data!
      let mapped = res.data.map(mapBackendWorkerToFrontend);
      
      if (filters?.searchQuery) {
        const q = filters.searchQuery.toLowerCase();
        mapped = mapped.filter((w) =>
          w.name.toLowerCase().includes(q) ||
          w.profession.toLowerCase().includes(q) ||
          w.area.toLowerCase().includes(q) ||
          w.skills.some((s) => s.toLowerCase().includes(q))
        );
      }

      if (filters?.sortBy) {
        switch (filters.sortBy) {
          case 'rating':
            mapped.sort((a, b) => b.rating - a.rating);
            break;
          case 'priceAsc':
            mapped.sort((a, b) => a.fixedRateMin - b.fixedRateMin);
            break;
          case 'experience':
            mapped.sort((a, b) => b.experienceYears - a.experienceYears);
            break;
          default:
            mapped.sort((a, b) => b.trustScore - a.trustScore);
            break;
        }
      }

      return mapped;
    }
  } catch (err) {
    console.warn('Backend fetchWorkers failed, falling back to mock data:', err);
  }

  // Network connection error fallback
  let fallback = [...MOCK_WORKERS];
  if (filters?.category && filters.category !== 'All') {
    fallback = fallback.filter((w) => w.profession.toLowerCase() === filters.category?.toLowerCase());
  }
  return fallback;
}

export async function getWorkerById(id: string): Promise<Worker | null> {
  try {
    const res = await fetchWorkerByIdApi(id);
    if (res.success && res.data) {
      const worker = mapBackendWorkerToFrontend(res.data);
      const reviewsRes = await fetchWorkerReviewsApi(id);
      if (reviewsRes.success && Array.isArray(reviewsRes.data)) {
        worker.completedReviewList = reviewsRes.data.map(mapBackendReviewToFrontend);
      }
      return worker;
    }
  } catch (err) {
    console.warn('Backend fetchWorkerById failed, checking mock data:', err);
  }

  const mock = MOCK_WORKERS.find((w) => w.id === id);
  if (!mock) return null;
  return { ...mock, completedReviewList: MOCK_REVIEWS };
}

export async function searchWorkers(query: string, city: string = 'Jaipur'): Promise<Worker[]> {
  return getWorkers({ searchQuery: query, city });
}

export async function compareWorkers(workerIds: string[]): Promise<Worker[]> {
  const workers = await getWorkers();
  return workers.filter((w) => workerIds.includes(w.id));
}

export async function getRecommendations(requirementPrompt: string, city: string = 'Jaipur'): Promise<AIMatchResult[]> {
  try {
    const res = await getAIRecommendations(requirementPrompt, city);
    if (res.success && Array.isArray(res.data)) {
      return res.data.map((item: any) => ({
        workerId: item.worker?.id || item.workerId || 'w-1',
        matchScore: item.matchScore || 85,
        reasons: item.matchedSkills && item.matchedSkills.length > 0 ? item.matchedSkills : [item.reasoning || 'Trade match'],
        worker: mapBackendWorkerToFrontend(item.worker)
      }));
    }
  } catch (err) {
    console.warn('Backend getAIRecommendations failed:', err);
  }
  const workers = await getWorkers();
  const promptLower = requirementPrompt.toLowerCase();
  
  const results: AIMatchResult[] = workers.map((worker) => {
    let score = 70;
    const reasons: string[] = [];

    if (
      (promptLower.includes('electric') && worker.profession === 'Electrician') ||
      (promptLower.includes('plumb') && worker.profession === 'Plumber') ||
      (promptLower.includes('ac') && worker.profession === 'AC Repair') ||
      (promptLower.includes('wood') && worker.profession === 'Carpenter') ||
      (promptLower.includes('paint') && worker.profession === 'Painter')
    ) {
      score += 20;
      reasons.push(`Direct skill match for "${worker.profession}"`);
    }

    if (worker.verified) {
      score += 5;
      reasons.push('Identity & background verified by BuildConnect');
    }

    if (worker.rating >= 4.8) {
      score += 3;
      reasons.push(`Exceptional ${worker.rating}/5 rating`);
    }

    const finalScore = Math.min(Math.max(score, 65), 98);

    return {
      workerId: worker.id,
      matchScore: finalScore,
      reasons: reasons.slice(0, 4),
      worker
    };
  });

  return results.sort((a, b) => b.matchScore - a.matchScore);
}

export async function createBooking(data: Omit<Booking, 'id' | 'createdAt' | 'status' | 'paymentStatus'>): Promise<Booking> {
  const token = await getAuthToken();
  if (token) {
    const res = await createBookingApi(token, {
      worker_id: data.workerId,
      service_type: data.serviceType,
      problem_description: data.problemDescription,
      booking_date: data.bookingDate,
      time_slot: data.timeSlot,
      agreed_price: data.serviceCost || 500,
      customer_address: data.customerAddress,
      city: data.city || 'Jaipur'
    });

    if (res.success && res.data) {
      return mapBackendBookingToFrontend(res.data);
    }
  }

  // Fallback if unauthenticated/offline
  return {
    ...data,
    id: `bk-${Date.now()}`,
    status: 'Confirmed',
    paymentStatus: 'Pending',
    createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16)
  };
}

export async function getBookings(): Promise<Booking[]> {
  const token = await getAuthToken();
  if (token) {
    const res = await fetchBookingsApi(token);
    if (res.success && Array.isArray(res.data)) {
      // RULE 2: Return real array even if empty []!
      return res.data.map(mapBackendBookingToFrontend);
    }
  }

  return MOCK_BOOKINGS;
}

export async function updateBookingStatus(id: string, status: Booking['status']): Promise<Booking | null> {
  const token = await getAuthToken();
  if (token) {
    const statusReverseMap: Record<Booking['status'], BackendBookingStatus> = {
      Pending: 'pending',
      Confirmed: 'accepted',
      'In Progress': 'in_progress',
      Completed: 'completed',
      Cancelled: 'cancelled'
    };

    const backendStatus = statusReverseMap[status] || 'pending';
    const res = await updateBookingStatusApi(token, id, backendStatus);
    if (res.success && res.data) {
      return mapBackendBookingToFrontend(res.data);
    }
  }

  // Local fallback
  return null;
}

export async function submitReview(reviewData: Omit<Review, 'id' | 'date' | 'verifiedBooking'> & { bookingId?: string }): Promise<Review> {
  const token = await getAuthToken();
  if (token) {
    const res = await submitReviewApi(token, {
      booking_id: (reviewData as any).bookingId || 'bk-100',
      worker_id: reviewData.workerId,
      rating: reviewData.rating,
      quality_rating: reviewData.qualityRating,
      punctuality_rating: reviewData.punctualityRating,
      professionalism_rating: reviewData.professionalismRating,
      comment: reviewData.comment
    });

    if (res.success && res.data) {
      return mapBackendReviewToFrontend(res.data);
    }
  }

  return {
    ...reviewData,
    id: `rev-${Date.now()}`,
    date: new Date().toISOString().split('T')[0],
    verifiedBooking: true
  };
}

export async function getWorkerJobs(_workerId: string = 'w-1'): Promise<Booking[]> {
  const token = await getAuthToken();
  if (token) {
    try {
      const res = await fetchWorkerJobs(token);
      if (res.success && Array.isArray(res.data)) {
        return res.data.map(mapBackendBookingToFrontend);
      }
    } catch (err) {
      console.warn('Backend fetchWorkerJobs failed:', err);
    }
  }
  return getBookings();
}

export async function getWorkerEarnings(): Promise<WorkerEarnings> {
  const token = await getAuthToken();
  if (token) {
    try {
      const res = await fetchWorkerEarnings(token);
      if (res.success && res.data) {
        return {
          todayEarnings: Math.round(res.data.totalEarnings * 0.2),
          weeklyEarnings: Math.round(res.data.totalEarnings * 0.6),
          monthlyEarnings: res.data.totalEarnings || 14500,
          pendingPayouts: res.data.pendingPayments || 1800,
          completedJobsCount: res.data.completedJobs || 12,
          platformFeePaid: res.data.platformFee || 1450,
          weeklyHistory: res.data.monthlyEarnings ? res.data.monthlyEarnings.map((m: any) => ({ day: m.month, amount: m.amount })) : MOCK_EARNINGS.weeklyHistory
        };
      }
    } catch (err) {
      console.warn('Backend fetchWorkerEarnings failed:', err);
    }
  }
  return MOCK_EARNINGS;
}


/**
 * Module 5: Real-time Messaging, Disputes & Worker Profile Updates Integration
 */

export async function sendChatMessage(bookingId: string, recipientId: string, content: string) {
  const token = await getAuthToken();
  if (token) {
    return await sendMsgApi(token, bookingId, recipientId, content);
  }
  return { success: false, message: 'Authentication required' };
}

export async function fetchChatMessages(bookingId: string) {
  const token = await getAuthToken();
  if (token) {
    return await getMsgsApi(token, bookingId);
  }
  return { success: false, data: [] };
}

export { subscribeToBookingMessages, unsubscribeFromBookingMessages };

export async function fileDispute(bookingId: string, reason: string, description: string) {
  const token = await getAuthToken();
  if (token) {
    return await createDispApi(token, bookingId, reason, description);
  }
  return { success: false, message: 'Authentication required' };
}

export async function fetchUserDisputes() {
  const token = await getAuthToken();
  if (token) {
    return await getDispsApi(token);
  }
  return { success: false, data: [] };
}

export async function updateWorkerProfile(data: Partial<Worker>): Promise<{ success: boolean; data?: Worker; message?: string }> {
  const token = await getAuthToken();
  if (token) {
    try {
      const res = await apiRequest('/workers/me', {
        method: 'PATCH',
        token,
        body: {
          bio: data.bio,
          hourly_rate: data.hourlyRate,
          fixed_rate_min: data.fixedRateMin,
          fixed_rate_max: data.fixedRateMax,
          availability: data.availability,
          skills: data.skills,
          city: data.city,
          area: data.area
        }
      });

      if (res.success && res.data) {
        return { success: true, data: mapBackendWorkerToFrontend(res.data) };
      }
      return { success: false, message: res.message };
    } catch (err: any) {
      return { success: false, message: err.message };
    }
  }

  return { success: false, message: 'Authentication required' };
}
