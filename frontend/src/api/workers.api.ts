import { apiRequest, ApiResponse } from './client';

export interface BackendWorker {
  id: string;
  profile_id: string;
  profession: string;
  bio?: string;
  experience_years: number;
  hourly_rate: number;
  fixed_rate_min: number;
  fixed_rate_max: number;
  availability: 'Available Today' | 'Available Tomorrow' | 'Busy';
  verified: boolean;
  average_rating: number;
  total_jobs: number;
  trust_score: number;
  skills?: string[];
  city?: string;
  area?: string;
  name?: string;
  avatar_url?: string;
  phone?: string;
}

export interface WorkerFilterParams {
  profession?: string;
  city?: string;
  area?: string;
  min_rating?: number;
  max_price?: number;
  availability?: string;
  limit?: number;
  page?: number;
}

export async function fetchWorkers(filters?: WorkerFilterParams): Promise<ApiResponse<BackendWorker[]>> {
  return apiRequest<BackendWorker[]>('/workers', {
    method: 'GET',
    params: filters as Record<string, string | number | boolean | undefined>
  });
}

export async function fetchWorkerById(id: string): Promise<ApiResponse<BackendWorker>> {
  return apiRequest<BackendWorker>(`/workers/${id}`, {
    method: 'GET'
  });
}

export async function createWorker(
  token: string,
  workerData: {
    profession: string;
    bio?: string;
    experience_years?: number;
    hourly_rate?: number;
    fixed_rate_min?: number;
    fixed_rate_max?: number;
    skills?: string[];
    availability?: 'Available Today' | 'Available Tomorrow' | 'Busy';
  }
): Promise<ApiResponse<BackendWorker>> {
  return apiRequest<BackendWorker>('/workers', {
    method: 'POST',
    token,
    body: workerData
  });
}

export async function updateWorker(
  token: string,
  id: string,
  workerData: Partial<BackendWorker>
): Promise<ApiResponse<BackendWorker>> {
  return apiRequest<BackendWorker>(`/workers/${id}`, {
    method: 'PATCH',
    token,
    body: workerData
  });
}
