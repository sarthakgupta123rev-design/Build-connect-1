import { apiRequest, ApiResponse } from './client';

export interface BackendProfile {
  id: string;
  full_name: string;
  phone?: string;
  email?: string;
  role: 'customer' | 'worker';
  avatar_url?: string;
  city?: string;
  area?: string;
}

export async function getMe(token: string): Promise<ApiResponse<BackendProfile>> {
  return apiRequest<BackendProfile>('/me', {
    method: 'GET',
    token
  });
}

export async function createProfile(
  token: string,
  profileData: {
    full_name: string;
    phone?: string;
    city?: string;
    area?: string;
    role: 'customer' | 'worker';
    avatar_url?: string;
  }
): Promise<ApiResponse<BackendProfile>> {
  return apiRequest<BackendProfile>('/me/profile', {
    method: 'POST',
    token,
    body: profileData
  });
}

export async function updateProfile(
  token: string,
  profileData: {
    full_name?: string;
    phone?: string;
    city?: string;
    area?: string;
    avatar_url?: string;
  }
): Promise<ApiResponse<BackendProfile>> {
  // CRITICAL RULE: PATCH /api/me/profile MUST NEVER SEND ROLE
  const payload = { ...profileData };
  delete (payload as any).role;

  return apiRequest<BackendProfile>('/me/profile', {
    method: 'PATCH',
    token,
    body: payload
  });
}

export async function getRole(token: string): Promise<ApiResponse<{ role: 'customer' | 'worker' }>> {
  return apiRequest<{ role: 'customer' | 'worker' }>('/me/role', {
    method: 'GET',
    token
  });
}
