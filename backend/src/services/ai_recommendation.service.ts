import type { WorkerRecord } from './worker.service.js';

export interface RecommendationRequestInput {
  prompt?: string;
  query?: string;
  profession?: string;
  service_type?: string;
  skills?: string[];
  city?: string;
  area?: string;
  user_latitude?: number;
  user_longitude?: number;
  max_distance_km?: number;
  preferred_availability?: 'Available Today' | 'Available Tomorrow' | 'Busy';
  min_rating?: number;
  max_price?: number;
  min_experience?: number;
  limit?: number;
}

export interface RecommendationScoreBreakdown {
  tradeMatchScore: number;       // max 30
  skillMatchScore: number;       // max 25
  proximityScore: number;        // max 20
  ratingScore: number;           // max 15
  availabilityScore: number;     // max 10
  experienceTrustScore: number;  // max 10
}

export interface RecommendationResult {
  worker: WorkerRecord;
  matchScore: number;
  calculatedDistanceKm?: number;
  breakdown: RecommendationScoreBreakdown;
  matchedSkills: string[];
  reasons: string[];
  reasoning: string;
}

// Category & Profession Keyword Mapping for Trade Inference
const PROFESSION_KEYWORDS: Record<string, string[]> = {
  'Electrician': ['electric', 'electrician', 'wiring', 'wire', 'switch', 'light', 'short circuit', 'mcb', 'fuse', 'inverter', 'db board'],
  'Plumber': ['plumb', 'plumber', 'pipe', 'leak', 'leakage', 'tap', 'faucet', 'sink', 'toilet', 'bathroom', 'drain', 'water'],
  'Carpenter': ['carpenter', 'wood', 'door', 'lock', 'furniture', 'cabinet', 'table', 'chair', 'wardrobe', 'plywood'],
  'Painter': ['paint', 'painter', 'wall', 'colour', 'color', 'polish', 'waterproof', 'distemper', 'whitewash'],
  'AC Repair': ['ac', 'air conditioner', 'cooling', 'compressor', 'gas refill', 'split ac', 'hvac', 'servicing'],
  'Appliance Repair': ['appliance', 'fridge', 'refrigerator', 'washing machine', 'microwave', 'oven', 'ro', 'geyser'],
  'Skilled Helper': ['helper', 'labour', 'labor', 'shifting', 'moving', 'loading', 'unloading', 'cleaning'],
  'Mason': ['mason', 'tile', 'plaster', 'brick', 'cement', 'marble', 'granite', 'construction']
};

/**
 * Calculates geographic distance in kilometers using the Haversine formula.
 */
export function calculateHaversineDistanceKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth radius in kilometers
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round((R * c) * 10) / 10;
}

/**
 * Filter candidate workers based on strict constraints (profession, rating, price, availability, distance).
 */
export function filterCandidates(
  workers: WorkerRecord[],
  input: RecommendationRequestInput
): WorkerRecord[] {
  return workers.filter(worker => {
    // 1. Explicit Profession / Category Filter
    if (input.profession && input.profession.trim() !== '') {
      if (worker.profession.toLowerCase() !== input.profession.toLowerCase()) {
        return false;
      }
    }

    // 2. Minimum Rating Filter
    if (input.min_rating !== undefined && input.min_rating > 0) {
      const workerRating = worker.average_rating || worker.rating || 0;
      if (workerRating < input.min_rating) {
        return false;
      }
    }

    // 3. Maximum Price Filter
    if (input.max_price !== undefined && input.max_price > 0) {
      if (worker.fixed_rate_min > input.max_price && worker.hourly_rate > input.max_price) {
        return false;
      }
    }

    // 4. Availability Filter
    if (input.preferred_availability) {
      if (worker.availability === 'Busy' && input.preferred_availability !== 'Busy') {
        return false;
      }
    }

    // 5. Minimum Experience Filter
    if (input.min_experience !== undefined && input.min_experience > 0) {
      if ((worker.experience_years || 0) < input.min_experience) {
        return false;
      }
    }

    // 6. Max Distance Filter
    if (input.user_latitude !== undefined && input.user_longitude !== undefined && input.max_distance_km !== undefined) {
      const wLat = worker.latitude !== undefined ? worker.latitude : 26.8522 + ((worker.id.charCodeAt(0) % 5) * 0.005);
      const wLon = worker.longitude !== undefined ? worker.longitude : 75.8052 + ((worker.id.length % 5) * 0.005);
      const dist = calculateHaversineDistanceKm(input.user_latitude, input.user_longitude, wLat, wLon);
      if (dist > input.max_distance_km) {
        return false;
      }
    }

    return true;
  });
}

/**
 * Multi-Factor Scoring Engine for a single worker candidate.
 */
export function scoreWorkerCandidate(
  worker: WorkerRecord,
  input: RecommendationRequestInput
): RecommendationResult {
  const reasons: string[] = [];
  const matchedSkills: string[] = [];
  const searchText = `${input.prompt || ''} ${input.query || ''} ${input.service_type || ''}`.toLowerCase();
  const searchWords = searchText.split(/\s+/).filter(w => w.length > 2);

  // 1. Trade Match Score (max 30 pts)
  let tradeMatchScore = 10;
  if (input.profession && worker.profession.toLowerCase() === input.profession.toLowerCase()) {
    tradeMatchScore = 30;
    reasons.push(`Direct trade match for ${worker.profession}`);
  } else if (searchText.includes(worker.profession.toLowerCase())) {
    tradeMatchScore = 25;
    reasons.push(`Trade match for ${worker.profession}`);
  } else {
    for (const [prof, keywords] of Object.entries(PROFESSION_KEYWORDS)) {
      if (prof.toLowerCase() === worker.profession.toLowerCase()) {
        if (keywords.some(kw => searchText.includes(kw))) {
          tradeMatchScore = 20;
          reasons.push(`Relevant trade for ${worker.profession}`);
          break;
        }
      }
    }
  }

  // 2. Specialized Skill Match Score (max 25 pts)
  let skillMatchScore = 0;
  if (worker.skills && Array.isArray(worker.skills)) {
    worker.skills.forEach(skill => {
      const skillLower = skill.toLowerCase();
      if (searchWords.some(w => skillLower.includes(w)) || (input.skills && input.skills.some(s => skillLower.includes(s.toLowerCase())))) {
        skillMatchScore = Math.min(25, skillMatchScore + 10);
        if (!matchedSkills.includes(skill)) {
          matchedSkills.push(skill);
        }
      }
    });
  }
  if (matchedSkills.length > 0) {
    reasons.push(`Specialized skill match: ${matchedSkills.join(', ')}`);
  }

  // 3. Proximity / Distance Score (max 20 pts)
  let proximityScore = 10;
  let calculatedDistanceKm: number | undefined = undefined;

  if (input.user_latitude !== undefined && input.user_longitude !== undefined) {
    const workerLat = worker.latitude !== undefined ? worker.latitude : 26.8522 + ((worker.id.charCodeAt(0) % 5) * 0.005);
    const workerLon = worker.longitude !== undefined ? worker.longitude : 75.8052 + ((worker.id.length % 5) * 0.005);
    calculatedDistanceKm = calculateHaversineDistanceKm(input.user_latitude, input.user_longitude, workerLat, workerLon);

    if (calculatedDistanceKm <= 2.0) {
      proximityScore = 20;
      reasons.push(`Hyper-local proximity (${calculatedDistanceKm} km away)`);
    } else if (calculatedDistanceKm <= 5.0) {
      proximityScore = 16;
      reasons.push(`Close proximity (${calculatedDistanceKm} km away)`);
    } else if (calculatedDistanceKm <= 10.0) {
      proximityScore = 12;
    } else {
      proximityScore = 8;
    }
  } else if (input.city && worker.city.toLowerCase() === input.city.toLowerCase()) {
    proximityScore = 14;
    reasons.push(`Local service provider in ${worker.city}`);
  }

  // 4. Rating Score (max 15 pts)
  const ratingVal = worker.average_rating || worker.rating || 4.5;
  const ratingScore = Math.round(Math.min(15, Math.max(5, ((ratingVal - 3.5) / 1.5) * 15)));
  if (ratingVal >= 4.8) {
    reasons.push(`Top-rated customer satisfaction (${ratingVal}★)`);
  }

  // 5. Availability Score (max 10 pts)
  let availabilityScore = 6;
  if (input.preferred_availability && worker.availability === input.preferred_availability) {
    availabilityScore = 10;
    reasons.push(`Available on requested schedule (${worker.availability})`);
  } else if (worker.availability === 'Available Today') {
    availabilityScore = 10;
    reasons.push(`Available for immediate dispatch today`);
  } else if (worker.availability === 'Available Tomorrow') {
    availabilityScore = 8;
  }

  // 6. Experience & Trust Score (max 10 pts)
  let experienceTrustScore = 5;
  if ((worker.experience_years || 0) >= 5) {
    experienceTrustScore += 3;
    reasons.push(`Extensive trade experience (${worker.experience_years}+ years)`);
  }
  if ((worker.trust_score || 0) >= 90) {
    experienceTrustScore += 2;
    reasons.push(`Verified high trust score (${worker.trust_score}/100)`);
  }

  const rawScore = tradeMatchScore + skillMatchScore + proximityScore + ratingScore + availabilityScore + experienceTrustScore;
  const matchScore = Math.min(99, Math.max(35, rawScore));

  const reasoning = reasons.length > 0
    ? reasons.join(' • ')
    : `Qualified ${worker.profession} specialist in ${worker.city}.`;

  return {
    worker,
    matchScore,
    calculatedDistanceKm,
    breakdown: {
      tradeMatchScore,
      skillMatchScore,
      proximityScore,
      ratingScore,
      availabilityScore,
      experienceTrustScore
    },
    matchedSkills,
    reasons: reasons.slice(0, 5),
    reasoning
  };
}

/**
 * Ranks candidate worker recommendations with deterministic tie-breaking:
 * 1. matchScore (descending)
 * 2. average_rating (descending)
 * 3. review_count / total_jobs (descending)
 * 4. worker.id (ascending, lexicographical)
 */
export function rankRecommendations(results: RecommendationResult[]): RecommendationResult[] {
  return [...results].sort((a, b) => {
    if (b.matchScore !== a.matchScore) {
      return b.matchScore - a.matchScore;
    }
    const ratingA = a.worker.average_rating || a.worker.rating || 0;
    const ratingB = b.worker.average_rating || b.worker.rating || 0;
    if (ratingB !== ratingA) {
      return ratingB - ratingA;
    }
    const jobsA = a.worker.total_jobs || a.worker.completed_jobs || 0;
    const jobsB = b.worker.total_jobs || b.worker.completed_jobs || 0;
    if (jobsB !== jobsA) {
      return jobsB - jobsA;
    }
    return a.worker.id.localeCompare(b.worker.id);
  });
}

/**
 * Main AI Recommendation Service Pipeline.
 */
export function evaluateRecommendations(
  allWorkers: WorkerRecord[],
  input: RecommendationRequestInput
): RecommendationResult[] {
  const filtered = filterCandidates(allWorkers, input);
  const scored = filtered.map(w => scoreWorkerCandidate(w, input));
  const ranked = rankRecommendations(scored);
  const limit = input.limit || 10;
  return ranked.slice(0, limit);
}
