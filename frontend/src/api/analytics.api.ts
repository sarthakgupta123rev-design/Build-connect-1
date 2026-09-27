import { apiRequest } from './client';

export async function fetchWorkerEarnings(token: string) {
  return await apiRequest('/worker/earnings', {
    method: 'GET',
    token
  });
}

export async function fetchWorkerJobs(token: string) {
  return await apiRequest('/workers/me/jobs', {
    method: 'GET',
    token
  });
}
