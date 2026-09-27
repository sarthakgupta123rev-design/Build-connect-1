# BuildConnect — Production Go-Live Checklist

## Pre-Flight Security & Secret Checklist
- [x] Zero plain text secrets in Git repository (`.gitignore` verified).
- [x] No backend secrets (`SUPABASE_SECRET_KEY`) present in frontend source code or static bundle.
- [x] Environment variable templates updated in `backend/.env.example` and `frontend/.env.example`.
- [x] Helmet HTTP security headers active (`Content-Security-Policy`, `X-Content-Type-Options`, `X-Frame-Options`).
- [x] Express rate limiting configured (`apiLimiter`: 1000 req/15m, `sensitiveLimiter`: 100 req/15m).
- [x] Body parser payload size constrained (`limit: '2mb'`).
- [x] Production error handler active (masks internal stack trace details in production).

## Database & Schema Checklist
- [x] Migration scripts verified idempotent (`01_base_schema.sql` through `05_module5_rls_hardening.sql`).
- [x] Zero destructive DDL commands (`DROP TABLE`, `DROP COLUMN`) present in migration files.
- [x] Row Level Security (RLS) enabled across all 8 tables (`profiles`, `workers`, `bookings`, `reviews`, `messages`, `disputes`, `worker_locations`, `payments`).
- [x] Database authentication policies enforce `auth.uid()::text` matching.

## Build & Test Verification Checklist
- [x] Backend TypeScript compilation (`npx tsc --noEmit`) passes with 0 errors.
- [x] Backend Vitest suite passes 100% (**12/12 test files, 70/70 tests passing**).
- [x] AI Recommendation Engine suite passes 100% (**20/20 test scenarios passing**).
- [x] Frontend TypeScript compilation (`tsc -b`) passes with 0 errors.
- [x] Frontend Vite production build succeeds in **1.00s**.

## API & End-to-End Verification Checklist
- [x] `/api/health` returns `200 OK`.
- [x] Unauthenticated calls to protected routes return `401 Unauthorized`.
- [x] Authenticated user profile retrieval (`GET /api/me`) succeeds.
- [x] Worker discovery directory (`GET /api/workers`) returns worker records.
- [x] AI recommendation (`POST /api/workers/recommend`) calculates scores in < 6ms.
- [x] Booking lifecycle (`pending` $\rightarrow$ `accepted` $\rightarrow$ `in_progress` $\rightarrow$ `completed`) verified.
- [x] Real-time messaging, review submission, payments, and disputes functional.
