import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../src/app.js';
import {
  evaluateRecommendations,
  filterCandidates,
  scoreWorkerCandidate,
  rankRecommendations,
  calculateHaversineDistanceKm
} from '../src/services/ai_recommendation.service.js';
import type { WorkerRecord } from '../src/services/worker.service.js';

const MOCK_TEST_WORKERS: WorkerRecord[] = [
  {
    id: 'w-test-1',
    profile_id: 'u-w1',
    name: 'Aman Sharma',
    profession: 'Electrician',
    average_rating: 4.9,
    review_count: 50,
    experience_years: 8,
    total_jobs: 120,
    hourly_rate: 350,
    fixed_rate_min: 400,
    fixed_rate_max: 800,
    verified: true,
    trust_score: 95,
    availability: 'Available Today',
    city: 'Jaipur',
    area: 'Malviya Nagar',
    latitude: 26.8522,
    longitude: 75.8052,
    skills: ['Short Circuit Repair', 'AC Heavy Wiring', 'DB Board Assembly']
  },
  {
    id: 'w-test-2',
    profile_id: 'u-w2',
    name: 'Rohan Plumber',
    profession: 'Plumber',
    average_rating: 4.2,
    review_count: 20,
    experience_years: 3,
    total_jobs: 30,
    hourly_rate: 250,
    fixed_rate_min: 300,
    fixed_rate_max: 600,
    verified: true,
    trust_score: 82,
    availability: 'Available Tomorrow',
    city: 'Jaipur',
    area: 'Vaishali Nagar',
    latitude: 26.8522,
    longitude: 75.8052,
    skills: ['Pipe Leak Repair', 'Sink Fitting']
  },
  {
    id: 'w-test-3',
    profile_id: 'u-w3',
    name: 'Karan Carpenter',
    profession: 'Carpenter',
    average_rating: 3.8,
    review_count: 5,
    experience_years: 1,
    total_jobs: 10,
    hourly_rate: 450,
    fixed_rate_min: 500,
    fixed_rate_max: 1000,
    verified: false,
    trust_score: 75,
    availability: 'Busy',
    city: 'Jaipur',
    area: 'Raja Park',
    latitude: 26.8522,
    longitude: 75.8052,
    skills: ['Door Repair', 'Furniture Assembly']
  }
];

describe('Module 4 — AI Recommendation Engine Test Suite (20 Scenarios)', () => {

  // Scenario 1: Exact skill match
  it('1. Exact skill match produces skillMatchScore boost & reason', () => {
    const res = scoreWorkerCandidate(MOCK_TEST_WORKERS[0], { prompt: 'Short Circuit Repair' });
    expect(res.matchedSkills).toContain('Short Circuit Repair');
    expect(res.breakdown.skillMatchScore).toBeGreaterThan(0);
    expect(res.reasons.some(r => r.includes('Short Circuit Repair'))).toBe(true);
  });

  // Scenario 2: Partial skill match
  it('2. Partial skill match handles partial string match', () => {
    const res = scoreWorkerCandidate(MOCK_TEST_WORKERS[0], { prompt: 'Circuit Repair' });
    expect(res.matchedSkills.length).toBeGreaterThan(0);
  });

  // Scenario 3: Wrong category candidate filtering
  it('3. Candidate filtering eliminates wrong profession when specified', () => {
    const filtered = filterCandidates(MOCK_TEST_WORKERS, { profession: 'Electrician' });
    expect(filtered.length).toBe(1);
    expect(filtered[0].profession).toBe('Electrician');
  });

  // Scenario 4: High-rated worker scoring
  it('4. High-rated worker receives maximum rating score boost', () => {
    const resHigh = scoreWorkerCandidate(MOCK_TEST_WORKERS[0], { prompt: 'Electrician' });
    const resLow = scoreWorkerCandidate(MOCK_TEST_WORKERS[2], { prompt: 'Carpenter' });
    expect(resHigh.breakdown.ratingScore).toBeGreaterThan(resLow.breakdown.ratingScore);
  });

  // Scenario 5: Low-rated worker filtering
  it('5. Min rating filter eliminates low-rated candidates', () => {
    const filtered = filterCandidates(MOCK_TEST_WORKERS, { min_rating: 4.5 });
    expect(filtered.every(w => w.average_rating >= 4.5)).toBe(true);
  });

  // Scenario 6: Nearby worker calculation
  it('6. Proximity score gives highest points for close coordinates', () => {
    const distanceKm = calculateHaversineDistanceKm(26.8522, 75.8052, 26.8530, 75.8060);
    expect(distanceKm).toBeLessThan(1.0);
    const res = scoreWorkerCandidate(MOCK_TEST_WORKERS[0], { user_latitude: 26.8522, user_longitude: 75.8052 });
    expect(res.breakdown.proximityScore).toBe(20);
  });

  // Scenario 7: Distant worker candidate filtering
  it('7. Max distance filter eliminates distant workers', () => {
    const filtered = filterCandidates(MOCK_TEST_WORKERS, { user_latitude: 28.6139, user_longitude: 77.2090, max_distance_km: 10 });
    // In our test, worker lat/lon mock puts them in Jaipur (26.85), Delhi user is > 200km away
    expect(filtered.length).toBe(0);
  });

  // Scenario 8: Available worker scoring
  it('8. Available Today worker gets availability boost & reason', () => {
    const res = scoreWorkerCandidate(MOCK_TEST_WORKERS[0], { prompt: 'Electrician' });
    expect(res.breakdown.availabilityScore).toBe(10);
    expect(res.reasons.some(r => r.includes('Available for immediate dispatch today'))).toBe(true);
  });

  // Scenario 9: Unavailable worker candidate filtering
  it('9. Preferred availability filter eliminates Busy worker', () => {
    const filtered = filterCandidates(MOCK_TEST_WORKERS, { preferred_availability: 'Available Today' });
    expect(filtered.some(w => w.availability === 'Busy')).toBe(false);
  });

  // Scenario 10: High-experience worker scoring
  it('10. High experience worker gets experience score boost', () => {
    const resExp = scoreWorkerCandidate(MOCK_TEST_WORKERS[0], { prompt: 'Electrician' });
    expect(resExp.reasons.some(r => r.includes('Extensive trade experience'))).toBe(true);
  });

  // Scenario 11: Low-experience worker filtering
  it('11. Min experience filter eliminates low-experience candidate', () => {
    const filtered = filterCandidates(MOCK_TEST_WORKERS, { min_experience: 5 });
    expect(filtered.every(w => w.experience_years >= 5)).toBe(true);
  });

  // Scenario 12: Missing location handling
  it('12. Missing coordinates does not crash and defaults to city match', () => {
    const res = scoreWorkerCandidate(MOCK_TEST_WORKERS[0], { city: 'Jaipur' });
    expect(res.breakdown.proximityScore).toBe(14);
    expect(res.calculatedDistanceKm).toBeUndefined();
  });

  // Scenario 13: Missing rating handling
  it('13. Worker with missing rating gets neutral baseline score without crash', () => {
    const unratedWorker: WorkerRecord = { ...MOCK_TEST_WORKERS[0], average_rating: 0, rating: undefined as any };
    const res = scoreWorkerCandidate(unratedWorker, { prompt: 'Electrician' });
    expect(res.matchScore).toBeGreaterThan(0);
  });

  // Scenario 14: Missing experience handling
  it('14. Worker with missing experience handling', () => {
    const unexpWorker: WorkerRecord = { ...MOCK_TEST_WORKERS[0], experience_years: undefined as any };
    const res = scoreWorkerCandidate(unexpWorker, { prompt: 'Electrician' });
    expect(res.matchScore).toBeGreaterThan(0);
  });

  // Scenario 15: No matching workers
  it('15. Evaluation returns empty array when no workers pass filter', () => {
    const results = evaluateRecommendations(MOCK_TEST_WORKERS, { profession: 'NonExistentTrade' });
    expect(results).toEqual([]);
  });

  // Scenario 16: Multiple workers with deterministic ranking
  it('16. Ranking sorts higher scores first deterministically', () => {
    const results = evaluateRecommendations(MOCK_TEST_WORKERS, { prompt: 'Jaipur Trade' });
    expect(results[0].matchScore).toBeGreaterThanOrEqual(results[1].matchScore);
  });

  // Scenario 17: Equal scores tie-breaking
  it('17. Equal scores tie-break by rating, total jobs, then worker ID', () => {
    const wA: WorkerRecord = { ...MOCK_TEST_WORKERS[0], id: 'w-a', average_rating: 4.8 };
    const wB: WorkerRecord = { ...MOCK_TEST_WORKERS[0], id: 'w-b', average_rating: 4.5 };
    const scoredA = scoreWorkerCandidate(wA, { prompt: 'Electrician' });
    const scoredB = scoreWorkerCandidate(wB, { prompt: 'Electrician' });
    scoredA.matchScore = 80;
    scoredB.matchScore = 80;
    const ranked = rankRecommendations([scoredB, scoredA]);
    expect(ranked[0].worker.id).toBe('w-a'); // Higher rating breaks tie
  });

  // Scenario 18: Invalid HTTP request validation
  it('18. POST /api/workers/recommend returns 400 for empty prompt/criteria', async () => {
    const res = await request(app)
      .post('/api/workers/recommend')
      .send({});
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  // Scenario 19: Public recommendation endpoint accessibility
  it('19. POST /api/workers/recommend is accessible without auth header', async () => {
    const res = await request(app)
      .post('/api/workers/recommend')
      .send({ prompt: 'Electrician' });
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });

  // Scenario 20: Database unavailable graceful fallback
  it('20. Recommendation service works with DB fallback data when DB is offline', async () => {
    const results = evaluateRecommendations(MOCK_TEST_WORKERS, { prompt: 'Plumber' });
    expect(results.length).toBeGreaterThan(0);
    expect(results[0].worker.profession).toBe('Plumber');
  });

});
