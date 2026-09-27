# BuildConnect Module 4 — AI Recommendation Engine Audit

## 1. Audit Overview
This audit examines the existing worker recommendation system in BuildConnect across both backend Express controllers and frontend client services prior to Module 4 enhancements.

---

## 2. System Analysis

| Parameter | Backend Engine (`ai.controller.ts`) | Frontend Engine (`workerMatchingService.ts`) |
| :--- | :--- | :--- |
| **Input Format** | `{ prompt: string, city?: string }` | `query: string` |
| **Output Format** | Array of `{ worker, matchScore, matchedSkills, reasoning }` | `{ analysis, bestMatch, alternatives, allRanked }` |
| **Primary Route** | `POST /api/workers/recommend` | Local client calculation (with async wrapper) |
| **Scoring Model** | Base 50pts + Profession (25pts) + Skills (15pts) + Bio (10pts) + City (10pts) | Weighted breakdown (Skill 30%, Proximity 20%, Availability 15%, Rating 15%, Trust 15%, Price 5%) |
| **Candidate Filtering** | None (scores all fetched workers) | Keyword/category matching filter |
| **Distance Calculation** | City name string equality check | Mock `distanceKm` threshold check |
| **Tie-Breaking** | Simple score sort (`b.matchScore - a.matchScore`) | Simple score sort |
| **Explanations** | Single static `reasoning` string | `reasons` string array |
| **DB Dependencies** | Fetches candidate workers via `workerService.getWorkers()` | `MOCK_WORKERS` array fallback |

---

## 3. Identified Deficiencies & Opportunities for Upgrade

1. **Lack of Structured Request Parameters**: Currently accepts only raw `prompt` string and optional `city`. Lacks structured fields for explicit profession, required skills, max distance, preferred availability, price range, and min rating.
2. **Missing Candidate Pre-Filtering**: Scores all workers in database without eliminating candidates who fail strict criteria (e.g. wrong category or rating below minimum).
3. **Coarse Distance Handling**: Only performs simple city string equality checks. No geographic coordinate distance calculation (Haversine formula).
4. **Static Explanation Generation**: Produces repetitive single-sentence reasoning strings rather than multi-factored, rule-backed explanation lists.
5. **No Deterministic Tie-Breaking**: When two workers achieve identical match scores, their returned order is non-deterministic (depends on array database fetch order).

---

## 4. Module 4 Upgrade Strategy

- **Contract Extension**: Expand Zod `recommendSchema` to support optional structured filter parameters (`profession`, `skills`, `user_latitude`, `user_longitude`, `max_distance_km`, `preferred_availability`, `min_rating`, `max_price`, `min_experience`).
- **Explainable Multi-Factor Scoring**: Construct a deterministic, multi-factor scoring algorithm with explicit weights for Skill, Distance, Rating, Availability, Experience, and Trust.
- **Dynamic Reasoning Engine**: Generate detailed, human-readable explanation arrays mapping directly to actual scoring breakdown points.
- **Deterministic Ranking**: Enforce strict tie-breaking rules (`score` $\rightarrow$ `average_rating` $\rightarrow$ `review_count` $\rightarrow$ `worker.id`).
- **Complete Test Suite**: Add `backend/tests/ai_recommendation.test.ts` validating all 20 recommendation scenarios.
