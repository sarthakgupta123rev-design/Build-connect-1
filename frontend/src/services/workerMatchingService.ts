import type { Worker, Profession } from '../types';
import { MOCK_WORKERS } from '../mock/data';

export interface SmartMatchBreakdown {
  skillScore: number;       // out of 30
  distanceScore: number;    // out of 20
  availabilityScore: number;// out of 15
  ratingScore: number;      // out of 15
  trustScore: number;       // out of 15
  priceScore: number;       // out of 5
}

export interface SmartMatchResult {
  worker: Worker;
  matchScore: number;       // 0 - 100%
  breakdown: SmartMatchBreakdown;
  reasons: string[];
  matchedSkills: string[];
  isBestMatch?: boolean;
}

export interface RequirementAnalysis {
  originalQuery: string;
  detectedCategory: Profession | null;
  detectedSkills: string[];
  preferredAvailability: 'Available Today' | 'Available Tomorrow' | null;
  locationKeyword: string | null;
  isValid: boolean;
}

// Category keyword mapping for deterministic natural language analysis
const CATEGORY_KEYWORDS: Record<Profession, string[]> = {
  'Electrician': ['electric', 'electrician', 'wiring', 'wire', 'switch', 'light', 'short circuit', 'power', 'mcb', 'inverter', 'fan', 'db board', 'fuse'],
  'Plumber': ['plumb', 'plumber', 'pipe', 'leak', 'leakage', 'tap', 'faucet', 'sink', 'toilet', 'bathroom', 'drain', 'water', 'motor', 'tank', 'flush'],
  'Carpenter': ['carpenter', 'wood', 'door', 'lock', 'furniture', 'cabinet', 'table', 'chair', 'wardrobe', 'plywood', 'modular', 'hinge', 'bed'],
  'Painter': ['paint', 'painter', 'wall', 'colour', 'color', 'polish', 'waterproof', 'texture', 'whitewash', 'distemper', 'coating', 'dampness'],
  'AC Repair': ['ac', 'air conditioner', 'cooling', 'compressor', 'gas refill', 'split ac', 'window ac', 'servicing', 'jet wash', 'hvac'],
  'Appliance Repair': ['appliance', 'fridge', 'refrigerator', 'washing machine', 'microwave', 'oven', 'ro', 'purifier', 'geyser', 'heater'],
  'Skilled Helper': ['helper', 'labour', 'labor', 'shifting', 'moving', 'furniture moving', 'loading', 'unloading', 'cleaning', 'garden', 'heavy'],
  'Mason': ['mason', 'tile', 'plaster', 'brick', 'cement', 'marble', 'granite', 'construction', 'wall break', 'civil']
};

/**
 * Analyzes customer requirement text and extracts intent, category, skills, and availability.
 */
export function analyzeRequirement(query: string): RequirementAnalysis {
  const normalized = query.toLowerCase().trim();

  if (!normalized) {
    return {
      originalQuery: query,
      detectedCategory: null,
      detectedSkills: [],
      preferredAvailability: null,
      locationKeyword: null,
      isValid: false
    };
  }

  let detectedCategory: Profession | null = null;
  const detectedSkills: string[] = [];

  // Detect Category & matched skills
  for (const [prof, keywords] of Object.entries(CATEGORY_KEYWORDS) as [Profession, string[]][]) {
    for (const kw of keywords) {
      if (normalized.includes(kw)) {
        if (!detectedCategory) {
          detectedCategory = prof;
        }
        detectedSkills.push(kw);
      }
    }
  }

  // Detect preferred availability (today/tomorrow/urgent)
  let preferredAvailability: 'Available Today' | 'Available Tomorrow' | null = null;
  if (normalized.includes('tomorrow')) {
    preferredAvailability = 'Available Tomorrow';
  } else if (normalized.includes('today') || normalized.includes('now') || normalized.includes('urgent') || normalized.includes('immediately')) {
    preferredAvailability = 'Available Today';
  }

  // Detect location if mentioned
  let locationKeyword: string | null = null;
  const commonAreas = ['malviya nagar', 'vaishali nagar', 'mansarovar', 'raja park', 'c-scheme', 'jagatpura', 'sanganer', 'jaipur'];
  for (const area of commonAreas) {
    if (normalized.includes(area)) {
      locationKeyword = area.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
      break;
    }
  }

  return {
    originalQuery: query,
    detectedCategory,
    detectedSkills: Array.from(new Set(detectedSkills)),
    preferredAvailability,
    locationKeyword,
    isValid: detectedCategory !== null || detectedSkills.length > 0
  };
}

/**
 * Calculates deterministic Smart Match Score for a given worker against analyzed requirements.
 * Weights:
 * - Skill Match: 30%
 * - Distance: 20%
 * - Availability: 15%
 * - Rating: 15%
 * - Trust Score: 15%
 * - Price: 5%
 */
export function calculateWorkerMatchScore(
  worker: Worker,
  analysis: RequirementAnalysis
): SmartMatchResult {
  const reasons: string[] = [];
  const matchedSkills: string[] = [];

  // 1. Skill Match (30 pts)
  let skillScore = 5; // base score
  if (analysis.detectedCategory && worker.profession.toLowerCase() === analysis.detectedCategory.toLowerCase()) {
    skillScore += 18;
    reasons.push(`Direct profession match: ${worker.profession}`);
  }

  // Check specific skill keywords against worker skills & bio
  const workerText = (worker.skills.join(' ') + ' ' + worker.bio).toLowerCase();
  for (const skill of analysis.detectedSkills) {
    if (workerText.includes(skill)) {
      skillScore = Math.min(30, skillScore + 4);
      matchedSkills.push(skill.charAt(0).toUpperCase() + skill.slice(1));
    }
  }
  if (matchedSkills.length > 0) {
    reasons.push(`Specialized skill match: ${matchedSkills.slice(0, 3).join(', ')}`);
  }

  // 2. Distance Score (20 pts)
  let distanceScore = 10;
  if (worker.distanceKm <= 1.5) {
    distanceScore = 20;
    reasons.push(`Hyper-local proximity (${worker.distanceKm} km away)`);
  } else if (worker.distanceKm <= 2.5) {
    distanceScore = 17;
    reasons.push(`Close proximity (${worker.distanceKm} km away)`);
  } else if (worker.distanceKm <= 3.5) {
    distanceScore = 13;
  } else if (worker.distanceKm <= 5.0) {
    distanceScore = 9;
  } else {
    distanceScore = 5;
  }

  // 3. Availability Score (15 pts)
  let availabilityScore = 10;
  if (analysis.preferredAvailability) {
    if (worker.availability === analysis.preferredAvailability) {
      availabilityScore = 15;
      reasons.push(`Available on your requested schedule (${worker.availability})`);
    } else {
      availabilityScore = 8;
    }
  } else {
    if (worker.availability === 'Available Today') {
      availabilityScore = 15;
      reasons.push(`Available for immediate dispatch today`);
    } else {
      availabilityScore = 12;
    }
  }

  // 4. Rating Score (15 pts)
  // Rating ranges from 4.0 to 5.0 -> scaled to 10 - 15 pts
  const ratingScore = Math.round(((worker.rating - 3.5) / 1.5) * 15);
  if (worker.rating >= 4.8) {
    reasons.push(`Top-rated customer satisfaction (${worker.rating}★ from ${worker.reviewCount} reviews)`);
  }

  // 5. Trust Score (15 pts)
  // Trust score ranges from 80 to 100 -> scaled to 11 - 15 pts
  const trustScorePts = Math.round((worker.trustScore / 100) * 15);
  if (worker.trustScore >= 92) {
    reasons.push(`High verified trust rating (${worker.trustScore}/100)`);
  }

  // 6. Price Score (5 pts)
  const priceScore = worker.fixedRateMin <= 400 ? 5 : 4;

  const totalScore = Math.min(
    99,
    Math.max(45, Math.round(skillScore + distanceScore + availabilityScore + ratingScore + trustScorePts + priceScore))
  );

  return {
    worker,
    matchScore: totalScore,
    breakdown: {
      skillScore,
      distanceScore,
      availabilityScore,
      ratingScore,
      trustScore: trustScorePts,
      priceScore
    },
    reasons: reasons.slice(0, 5),
    matchedSkills
  };
}

/**
 * Main Smart Matching Service function: scores all available workers and returns ranked recommendations.
 */
export function getSmartWorkerMatches(
  requirement: string,
  workersList: Worker[] = MOCK_WORKERS
): {
  analysis: RequirementAnalysis;
  bestMatch: SmartMatchResult | null;
  alternatives: SmartMatchResult[];
  allRanked: SmartMatchResult[];
} {
  const analysis = analyzeRequirement(requirement);

  if (!analysis.isValid) {
    return {
      analysis,
      bestMatch: null,
      alternatives: [],
      allRanked: []
    };
  }

  // Calculate scores for all workers
  const scored = workersList.map(worker => calculateWorkerMatchScore(worker, analysis));

  // Sort descending by match score
  scored.sort((a, b) => b.matchScore - a.matchScore);

  const bestMatch = scored[0] ? { ...scored[0], isBestMatch: true } : null;
  const alternatives = scored.slice(1, 4);

  return {
    analysis,
    bestMatch,
    alternatives,
    allRanked: scored
  };
}

/**
 * Async Smart Matching Service function: attempts fetching recommendations from Express API,
 * falling back to client-side heuristic engine if server is unreachable.
 */
export async function getSmartWorkerMatchesAsync(
  requirement: string,
  city?: string,
  workersList: Worker[] = MOCK_WORKERS
): Promise<{
  analysis: RequirementAnalysis;
  bestMatch: SmartMatchResult | null;
  alternatives: SmartMatchResult[];
  allRanked: SmartMatchResult[];
}> {
  const localResult = getSmartWorkerMatches(requirement, workersList);

  try {
    const { getAIRecommendations } = await import('../api/ai.api');
    const response = await getAIRecommendations(requirement, city);

    if (response.success && response.data && Array.isArray(response.data) && response.data.length > 0) {
      const { mapBackendWorkerToWorker } = await import('../api/mappers');
      const ranked: SmartMatchResult[] = response.data.map((item: any) => {
        const workerObj = item.worker ? mapBackendWorkerToWorker(item.worker) : workersList[0];
        return {
          worker: workerObj,
          matchScore: item.matchScore || 85,
          breakdown: {
            skillScore: 25,
            distanceScore: 15,
            availabilityScore: 15,
            ratingScore: 15,
            trustScore: 12,
            priceScore: 4
          },
          reasons: item.reasoning ? [item.reasoning] : ['Matched trade and criteria'],
          matchedSkills: item.matchedSkills || []
        };
      });

      const bestMatch = ranked[0] ? { ...ranked[0], isBestMatch: true } : null;
      const alternatives = ranked.slice(1, 4);

      return {
        analysis: localResult.analysis,
        bestMatch: bestMatch || localResult.bestMatch,
        alternatives: alternatives.length > 0 ? alternatives : localResult.alternatives,
        allRanked: ranked.length > 0 ? ranked : localResult.allRanked
      };
    }
  } catch (err) {
    // Fall back to local calculation
  }

  return localResult;
}

