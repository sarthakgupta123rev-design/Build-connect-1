# BuildConnect — Module 6 Deployment Plan

## 1. Overview & Architecture Strategy
This document outlines the step-by-step production deployment plan for the **BuildConnect** platform, comprising the React 19 frontend, Express 4 TypeScript API backend, Supabase PostgreSQL database, and embedded AI recommendation engine.

### Target Production Topology
```
[ Client Browser ]
        │
        ▼ HTTPS
[ Frontend: Vercel / Netlify / CDN ]
        │
        ▼ REST API + Bearer JWT
[ Backend API: Render / Railway / AWS / Docker Node.js ]
   │                 │                        │
   ▼                 ▼                        ▼
[ Supabase Auth ] [ Supabase PostgreSQL ] [ Embedded AI Recommendation Engine ]
(JWKS Token Check) (RLS Policy Enforced)  (110-Point Scoring Model)
```

---

## 2. Component Deployment Order

1. **Phase A — Database Migrations**: Apply idempotent schema migrations (`01_base_schema.sql` through `05_module5_rls_hardening.sql`) on Supabase PostgreSQL.
2. **Phase B — Express Backend Deployment**: Build and deploy backend to Node.js hosting platform with production environment variables (`PORT`, `NODE_ENV`, `FRONTEND_URL`, `SUPABASE_URL`, `SUPABASE_SECRET_KEY`, `SUPABASE_JWKS_URL`).
3. **Phase C — Frontend Deployment**: Build and deploy Vite production bundle to static hosting with `VITE_API_BASE_URL` pointing to backend production API URL.
4. **Phase D — Production Integration & Smoke Testing**: Execute 15-step end-to-end API and UI smoke tests against live production URLs.

---

## 3. Required Environment Variables

### Backend Production Environment (`backend/.env`)
- `PORT=5000`
- `NODE_ENV=production`
- `FRONTEND_URL=https://buildconnect.example.com`
- `SUPABASE_URL=https://your-project.supabase.co`
- `SUPABASE_PUBLISHABLE_KEY=your-publishable-key`
- `SUPABASE_SECRET_KEY=your-secret-key`
- `SUPABASE_JWKS_URL=https://your-project.supabase.co/auth/v1/.well-known/jwks.json`

### Frontend Production Environment (`frontend/.env`)
- `VITE_API_BASE_URL=https://api.buildconnect.example.com/api`
- `VITE_SUPABASE_URL=https://your-project.supabase.co`
- `VITE_SUPABASE_PUBLISHABLE_KEY=your-publishable-key`

---

## 4. Rollback Plan & Safety Procedures

1. **Database Safety**: All migrations use `IF NOT EXISTS` and non-destructive DDL (`CREATE TABLE`, `CREATE INDEX`, `CREATE POLICY`). Zero `DROP TABLE` or `DROP COLUMN` operations exist.
2. **Backend Rollback**: If backend deployment fails or exhibits unexpected latency, revert deployment alias to the previous stable release commit artifact (`e60abc4`).
3. **Frontend Rollback**: Instant instant-rollback via static host CDN snapshot routing.
