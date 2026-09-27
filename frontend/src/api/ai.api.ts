import { apiRequest } from './client';
import type { AIMatchResult } from '../types';

export async function getAIRecommendations(prompt: string, city?: string): Promise<{ success: boolean; data?: any[]; message?: string }> {
  const response = await apiRequest<any[]>('/workers/recommend', {
    method: 'POST',
    body: { prompt, city }
  });

  return response;
}
