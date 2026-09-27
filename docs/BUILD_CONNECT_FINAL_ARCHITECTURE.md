# BuildConnect — Final Architecture Specification

## Executive Overview
**BuildConnect** is an enterprise-grade full-stack trade services marketplace connecting customers with verified skilled workers (electricians, plumbers, carpenters, AC technicians, painters).

The architecture integrates four primary subsystems:
1. **React 19 Frontend App** (`frontend/`)
2. **Express 4 TypeScript API Server** (`backend/`)
3. **Supabase Managed PostgreSQL & Auth** (`database/`)
4. **Embedded AI Recommendation Engine** (`ai-model`)

---

## Complete System Architecture Diagram

```
[ Client Browser (Desktop / Mobile) ]
                 │
                 ▼ HTTPS
[ Frontend: React 19 + Vite 8 SPA ] ─── (Render Static Site / Vercel Edge CDN)
                 │
                 ▼ REST API Requests (Bearer Supabase JWT)
[ Backend: Express 4 API Server ] ─── (Render Web Service Node.js Container)
   │                  │                         │
   ▼                  ▼                         ▼
[ Supabase Auth ]  [ Supabase DB ]    [ AI Recommendation Engine ]
(JWKS Token Check) (PostgreSQL RLS)   (110-Point Heuristic Matcher)
```

---

## Core Architectural Modules & Specifications

### 1. Frontend Subsystem (`frontend/`)
- **Core Stack**: React 19, TypeScript 6, Vite 8, React Router DOM 7, Tailwind CSS
- **DTO Mappers**: `frontend/src/api/mappers.ts` transforms snake_case backend fields (`hourly_rate`, `total_jobs`, `average_rating`) into camelCase UI props (`hourlyRate`, `completedJobs`, `rating`).
- **Resilience**: Features automatic fallback to thread-safe mock data repositories when network or database connectivity is absent.

### 2. Express Backend API (`backend/`)
- **Core Stack**: Express 4, Node.js, TypeScript 5 (ES Modules)
- **Middleware**:
  - `helmet`: Enforces HTTP security headers.
  - `cors`: Restricts requests to `process.env.FRONTEND_URL` and cloud domains.
  - `express-rate-limit`: Enforces global (1000 req/15m) and sensitive endpoint (100 req/15m) rate limiting.
  - `express.json({ limit: '2mb' })`: Prevents large payload DoS attacks.
  - `errorHandler`: Sanitizes internal stack trace details in production.

### 3. Supabase Database & Auth (`database/`)
- **Database Engine**: Managed PostgreSQL 15+
- **Auth Model**: Supabase JWT checked via remote JWKS endpoint (`SUPABASE_JWKS_URL`).
- **Database Tables (8 Total)**:
  1. `profiles`: Customer and worker identity records.
  2. `workers`: Worker professional attributes, rates, trade, trust score, skills.
  3. `bookings`: Service booking lifecycle and pricing breakdown.
  4. `reviews`: Customer reviews and star ratings.
  5. `messages`: Real-time booking chat messages.
  6. `disputes`: Conflict resolution cases.
  7. `worker_locations`: Real-time GPS coordinates for active jobs.
  8. `payments`: Payment transactions, platform fee cuts, and payout records.
- **Row Level Security (RLS)**: Enforced across all 8 tables.

### 4. AI Recommendation Engine (`backend/src/services/ai_recommendation.service.ts`)
- **Classification**: Explainable Multi-Factor Heuristic Matching Engine.
- **Scoring Breakdown (Raw Max: 110 Points)**:
  - Trade / Profession Match: 30 points
  - Specialized Skill Match: 25 points
  - Geographic Proximity (Haversine Formula): 20 points
  - Customer Rating (1–5 Stars): 15 points
  - Preferred Availability: 10 points
  - Experience & Trust Score: 10 points
- **Display Score Normalization**: Clamped to 35%–99% match percentage scale.
- **Tie-Breaking Order**: `matchScore` $\rightarrow$ `rating` $\rightarrow$ `total_jobs` $\rightarrow$ `id`.

### 5. Booking & Payment Lifecycle
- **Status Pipeline**: `pending` $\rightarrow$ `accepted` $\rightarrow$ `in_progress` $\rightarrow$ `completed`.
- **Platform Fee**: Standard 10% platform commission computed server-side.
- **Payments**: Order generation and signature verification in Sandbox/Stub mode.
