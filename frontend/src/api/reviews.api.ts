import { apiRequest, ApiResponse } from './client';

export interface BackendReview {
  id: string;
  booking_id: string;
  customer_id: string;
  worker_id: string;
  rating: number;
  quality_rating?: number;
  punctuality_rating?: number;
  professionalism_rating?: number;
  comment?: string;
  created_at?: string;
  customer_name?: string;
  customer_avatar?: string;
  service_type?: string;
}

export async function fetchWorkerReviews(workerId: string): Promise<ApiResponse<BackendReview[]>> {
  return apiRequest<BackendReview[]>(`/workers/${workerId}/reviews`, {
    method: 'GET'
  });
}

export async function submitReview(
  token: string,
  reviewData: {
    booking_id: string;
    worker_id: string;
    rating: number;
    quality_rating?: number;
    punctuality_rating?: number;
    professionalism_rating?: number;
    comment?: string;
  }
): Promise<ApiResponse<BackendReview>> {
  return apiRequest<BackendReview>('/reviews', {
    method: 'POST',
    token,
    body: reviewData
  });
}
