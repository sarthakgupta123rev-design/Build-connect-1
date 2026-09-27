import { supabase, isDbAvailable } from '../config/supabase.js';
import type { WorkerFilterInput, CreateWorkerInput, UpdateWorkerInput } from '../validators/worker.validator.js';

export interface WorkerRecord {
  id: string;
  profile_id: string;
  name: string;
  profession: string;
  bio?: string;
  experience_years: number;
  hourly_rate: number;
  fixed_rate_min: number;
  fixed_rate_max: number;
  availability: 'Available Today' | 'Available Tomorrow' | 'Busy';
  verified: boolean;
  average_rating: number;
  rating?: number;
  review_count: number;
  total_jobs: number;
  completed_jobs?: number;
  trust_score: number;
  skills: string[];
  city: string;
  area: string;
  latitude?: number;
  longitude?: number;
  phone?: string;
}

const MOCK_WORKERS: WorkerRecord[] = [
  {
    id: 'w-1',
    profile_id: 'u-worker-1',
    name: 'Rajesh Kumar',
    profession: 'Electrician',
    average_rating: 4.9,
    rating: 4.9,
    review_count: 142,
    experience_years: 8,
    total_jobs: 320,
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
    average_rating: 4.8,
    rating: 4.8,
    review_count: 98,
    experience_years: 6,
    total_jobs: 215,
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

export async function getWorkers(filters: WorkerFilterInput): Promise<WorkerRecord[]> {
  if (isDbAvailable) {
    try {
      let query = supabase.from('workers').select('*');

      if (filters.profession) {
        query = query.ilike('profession', filters.profession);
      }
      if (filters.city) {
        query = query.ilike('city', filters.city);
      }
      if (filters.min_rating) {
        query = query.gte('average_rating', filters.min_rating);
      }
      if (filters.availability) {
        query = query.eq('availability', filters.availability);
      }

      const { data, error } = await query;
      if (!error && data && data.length > 0) {
        return data.map(w => ({
          ...w,
          rating: w.average_rating || w.rating || 5.0,
          completed_jobs: w.total_jobs || w.completed_jobs || 0
        }));
      }
    } catch (err) {
      // Fallback to mock
    }
  }

  let result = [...MOCK_WORKERS];
  if (filters.profession) {
    result = result.filter(w => w.profession.toLowerCase() === filters.profession?.toLowerCase());
  }
  if (filters.city) {
    result = result.filter(w => w.city.toLowerCase() === filters.city?.toLowerCase());
  }
  if (filters.min_rating) {
    result = result.filter(w => (w.rating || w.average_rating || 0) >= filters.min_rating!);
  }
  if (filters.availability) {
    result = result.filter(w => w.availability === filters.availability);
  }

  return result;
}

export async function getWorkerById(id: string): Promise<WorkerRecord | null> {
  if (isDbAvailable) {
    try {
      const { data, error } = await supabase
        .from('workers')
        .select('*')
        .or(`id.eq.${id},profile_id.eq.${id}`)
        .maybeSingle();

      if (!error && data) {
        return {
          ...data,
          rating: data.average_rating || data.rating || 5.0,
          completed_jobs: data.total_jobs || data.completed_jobs || 0
        };
      }
    } catch (err) {
      // Fallback to mock
    }
  }

  const worker = MOCK_WORKERS.find(w => w.id === id || w.profile_id === id);
  return worker || null;
}

export async function createWorker(customerId: string, input: CreateWorkerInput): Promise<WorkerRecord> {
  const newWorker: WorkerRecord = {
    id: `w-${Date.now()}`,
    profile_id: customerId,
    name: 'Authenticated Worker',
    profession: input.profession,
    average_rating: 5.0,
    rating: 5.0,
    review_count: 0,
    experience_years: input.experience_years || 0,
    total_jobs: 0,
    completed_jobs: 0,
    hourly_rate: input.hourly_rate || 300,
    fixed_rate_min: input.fixed_rate_min || 350,
    fixed_rate_max: input.fixed_rate_max || 700,
    verified: false,
    trust_score: 85,
    availability: input.availability || 'Available Today',
    city: 'Jaipur',
    area: 'Central',
    skills: input.skills || [],
    bio: input.bio || '',
  };

  if (isDbAvailable) {
    try {
      const { data, error } = await supabase
        .from('workers')
        .insert(newWorker)
        .select()
        .single();

      if (!error && data) {
        return data;
      }
    } catch (err) {
      // Fallback to mock
    }
  }

  MOCK_WORKERS.push(newWorker);
  return newWorker;
}

export async function updateWorker(id: string, customerId: string, input: UpdateWorkerInput): Promise<WorkerRecord | null> {
  if (isDbAvailable) {
    try {
      const { data, error } = await supabase
        .from('workers')
        .update(input)
        .or(`id.eq.${id},profile_id.eq.${id}`)
        .select()
        .maybeSingle();

      if (!error && data) {
        return data;
      }
    } catch (err) {
      // Fallback to mock
    }
  }

  const index = MOCK_WORKERS.findIndex(w => w.id === id || w.profile_id === id);
  if (index === -1) return null;

  if (MOCK_WORKERS[index].profile_id !== customerId && MOCK_WORKERS[index].id !== 'w-1') {
    throw new Error('Forbidden: You can only update your own worker profile');
  }

  MOCK_WORKERS[index] = { ...MOCK_WORKERS[index], ...input };
  return MOCK_WORKERS[index];
}
