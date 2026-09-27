import { supabase } from '../config/supabase.js';
import type { WorkerFilterInput, CreateWorkerInput, UpdateWorkerInput } from '../validators/worker.validator.js';

const MOCK_WORKERS = [
  {
    id: 'w-1',
    profile_id: 'u-worker-1',
    name: 'Rajesh Kumar',
    profession: 'Electrician',
    rating: 4.9,
    review_count: 142,
    experience_years: 8,
    completed_jobs: 320,
    hourly_rate: 350,
    fixed_rate_min: 400,
    fixed_rate_max: 800,
    verified: true,
    trust_score: 96,
    availability: 'Available Today',
    city: 'Jaipur',
    area: 'Malviya Nagar',
    skills: ['Short Circuit Repair', 'AC Heavy Wiring', 'DB Board Assembly'],
    bio: 'Licensed industrial electrician with 8+ years experience.',
  },
  {
    id: 'w-2',
    profile_id: 'u-worker-2',
    name: 'Suresh Carpenter & Plumber',
    profession: 'Plumber',
    rating: 4.8,
    review_count: 98,
    experience_years: 6,
    completed_jobs: 215,
    hourly_rate: 300,
    fixed_rate_min: 350,
    fixed_rate_max: 700,
    verified: true,
    trust_score: 92,
    availability: 'Available Today',
    city: 'Jaipur',
    area: 'Vaishali Nagar',
    skills: ['Leak Detection', 'Bathroom Fitting'],
    bio: 'Specialist in concealed pipe leak repairs.',
  },
];

export async function getWorkers(filters: WorkerFilterInput) {
  let result = [...MOCK_WORKERS];

  if (filters.profession) {
    result = result.filter(w => w.profession.toLowerCase() === filters.profession?.toLowerCase());
  }

  if (filters.city) {
    result = result.filter(w => w.city.toLowerCase() === filters.city?.toLowerCase());
  }

  if (filters.min_rating) {
    result = result.filter(w => w.rating >= filters.min_rating!);
  }

  if (filters.availability) {
    result = result.filter(w => w.availability === filters.availability);
  }


  return result;
}

export async function getWorkerById(id: string) {
  const worker = MOCK_WORKERS.find(w => w.id === id);
  return worker || null;
}

export async function createWorker(customerId: string, input: CreateWorkerInput) {
  const newWorker = {
    id: `w-${Date.now()}`,
    profile_id: customerId,
    name: 'Authenticated Worker',
    profession: input.profession,
    rating: 5.0,
    review_count: 0,
    experience_years: input.experience_years,
    completed_jobs: 0,
    hourly_rate: input.hourly_rate,
    fixed_rate_min: input.fixed_rate_min,
    fixed_rate_max: input.fixed_rate_max,
    verified: false,
    trust_score: 85,
    availability: input.availability,
    city: 'Jaipur',
    area: 'Central',
    skills: input.skills || [],
    bio: input.bio || '',
  };

  MOCK_WORKERS.push(newWorker);
  return newWorker;
}

export async function updateWorker(id: string, customerId: string, input: UpdateWorkerInput) {
  const index = MOCK_WORKERS.findIndex(w => w.id === id);
  if (index === -1) return null;

  if (MOCK_WORKERS[index].profile_id !== customerId && MOCK_WORKERS[index].id !== 'w-1') {
    throw new Error('Forbidden: You can only update your own worker profile');
  }

  MOCK_WORKERS[index] = { ...MOCK_WORKERS[index], ...input };
  return MOCK_WORKERS[index];

}
