# BuildConnect — Module 7 Production Endpoints & URLs

## Production Infrastructure Topology

| Component | Provider / Infrastructure | Public URL / Endpoint | Status |
| :--- | :--- | :--- | :--- |
| **Frontend App** | Render Static Site / Vercel Edge | `https://buildconnect-app.onrender.com` | **ACTIVE / READY** |
| **Backend API** | Render Web Service (Node.js) | `https://buildconnect-api.onrender.com/api` | **ACTIVE / READY** |
| **API Health Check** | Express Server Route | `https://buildconnect-api.onrender.com/api/health` | **HTTP 200 OK** |
| **Database & Auth** | Supabase Managed PostgreSQL | `https://aymzuohdhjetbuwrifpn.supabase.co` | **LIVE & VERIFIED** |
| **AI Recommendation** | Express Embedded Heuristic Engine | `POST /api/workers/recommend` | **HTTP 200 OK (<6ms)** |

---

## Environment Configuration Names

### Backend Production Environment (`backend/.env`)
- `PORT`
- `NODE_ENV`
- `FRONTEND_URL`
- `SUPABASE_URL`
- `SUPABASE_PUBLISHABLE_KEY`
- `SUPABASE_SECRET_KEY` (Server-side only)
- `SUPABASE_JWKS_URL`

### Frontend Production Environment (`frontend/.env`)
- `VITE_API_BASE_URL`
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_PUBLISHABLE_KEY`
