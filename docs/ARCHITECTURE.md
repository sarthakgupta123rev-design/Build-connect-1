# BuildConnect Target Architecture Document

## Implemented System Architecture (Module 2 Verified)

```
[ Frontend: React 19 + Vite 8 + React Router DOM 7 ]
                     │
                     │  HTTPS REST API Requests (Bearer Supabase JWT)
                     ▼
[ Express Backend API (Node.js + TS ES Modules) ]
     │                │                 │
     │ Auth           │ DB Persistence  │ Consolidated AI Engine
     ▼                ▼                 ▼
[ Supabase JWKS ] [ Supabase DB / ] [ Multi-Factor Matcher ]
(Token Check)    [ Mock Fallback ] (POST /workers/recommend)
```

---

## Key Architecture & Integration Features Implemented

### 1. Dual Persistence Strategy (Supabase DB + Mock Fallback)
- Services check `isDbAvailable` flag in `config/supabase.ts`.
- When database connection is available, operations read/write to Supabase PostgreSQL.
- When database is unconfigured or offline during test runs, services fall back to thread-safe mock memory repositories.

### 2. Explicit ID Mapping Layer
- `worker.service.ts` explicitly maps and resolves queries against both `workers.id` (e.g. `w-1`) and `workers.profile_id` (e.g. `u-worker-1`).

### 3. Centralized DTO Adapters
- `frontend/src/api/mappers.ts` standardizes field name transformations (`hourly_rate` $\rightarrow$ `hourlyRate`, `total_jobs` $\rightarrow$ `completedJobs`, `average_rating` $\rightarrow$ `rating`) and canonical booking status translations.

### 4. Consolidated AI Recommendation Architecture
- `POST /api/workers/recommend` serves as the primary backend AI endpoint.
- `frontend/src/services/workerMatchingService.ts` contains `getSmartWorkerMatchesAsync`, calling the backend AI endpoint with graceful fallback to the local engine.
