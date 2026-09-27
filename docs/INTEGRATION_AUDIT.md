# BuildConnect Integration Audit

## Phase 1 — Discovery & System Inventory

| Parameter | System 1: `frontend/` | System 2: `backend/` | System 3: `ai-model/` |
| :--- | :--- | :--- | :--- |
| **Primary Language** | TypeScript / JavaScript | TypeScript (Node.js ES Modules) | TypeScript (embedded logic) / **Python non-existent** |
| **Framework / Core Tech** | React 19, Vite 8, React Router DOM 7 | Express 4.21, Supabase JS Client 2.48 | Heuristic JS engine + TS controller (`ai.controller.ts`) |
| **Package Manager** | `npm` (`package-lock.json` present) | `npm` (`package-lock.json` present) | N/A (no standalone package or setup) |
| **Entry Point** | `src/main.tsx` → `src/App.tsx` | `src/server.ts` → `src/app.ts` | `backend/src/controllers/ai.controller.ts` & `frontend/src/services/workerMatchingService.ts` |
| **Development Command** | `npm run dev` (Vite dev server) | `npm run dev` (`tsx watch src/server.ts`) | N/A |
| **Production Command** | `npm run build` (`tsc -b && vite build`) | `npm run start` (`node dist/server.js`) | N/A |
| **Environment Variables** | `VITE_API_BASE_URL`, `VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY` | `PORT`, `NODE_ENV`, `FRONTEND_URL`, `SUPABASE_URL`, `SUPABASE_PUBLISHABLE_KEY`, `SUPABASE_SECRET_KEY`, `SUPABASE_JWKS_URL` | None |
| **Dependencies** | `@react-three/fiber`, `@supabase/supabase-js`, `framer-motion`, `lucide-react`, `tailwindcss` | `express`, `cors`, `helmet`, `jose`, `zod`, `morgan`, `@supabase/supabase-js` | None |
| **Database Tech** | Direct client connections to Supabase PostgreSQL (via `@supabase/supabase-js`) | Supabase PostgreSQL (`@supabase/supabase-js`) + In-Memory Mocks | In-Memory Mock arrays |
| **API Architecture** | REST via `fetch` wrapper (`src/api/client.ts`) | Express REST API | Non-existent HTTP API / Unmounted Express Controller |
| **Auth Mechanism** | Supabase Auth (Client SDK, Bearer JWT session token) | Supabase Auth (Remote JWKS JWT verification via `jose`) | N/A |
| **Authorization Roles** | `customer` vs `worker` (Client-side route guards) | `customer` vs `worker` (Basic ownership checks in services) | N/A |
| **Ports** | `5173` (dynamic `5174`-`5176`) | `5000` | N/A |
| **CORS Config** | Standard browser CORS recipient | `cors` middleware with allowed origins (`http://localhost:5173` etc.) | N/A |
| **Testing Setup** | `oxlint` (linting only, no unit test suite) | `vitest` + `supertest` (`tests/` directory with 10 test files) | `backend/tests/ai.test.ts` (vitest) |

---

## Phase 2 — Frontend Audit

### Architecture & Capabilities
- **Routing**: `react-router-dom` v7 handling customer pages (`/`, `/marketplace`, `/worker/:id`, `/booking/:workerId`, `/booking/success/:bookingId`, `/bookings`, `/review/:bookingId`, `/compare`, `/map`), worker pages (`/worker/dashboard`, `/worker/jobs`, `/worker/earnings`, `/worker/profile/edit`), and auth (`/login`, `/register`).
- **State & Contexts**: `AuthContext` (manages Supabase session & user state), `BookingContext` (manages active booking flow), `ThemeContext` (dark/light UI mode), `LanguageContext` (i18n translations), `CompareContext` (side-by-side worker comparison).
- **Authentication Flow**: Uses Supabase Client SDK directly (`supabase.auth.signInWithPassword`, `signUp`). On login, calls `GET /api/me` using token. If profile doesn't exist, falls back to local user object. On register, calls `signUp` then `POST /api/me/profile`.
- **Worker Matching & AI UI**: Uses client-side rule engine `workerMatchingService.ts` running locally on mock data `MOCK_WORKERS`. `ai.api.ts` defines `getAIRecommendations(prompt, city)` making POST to `/workers/recommend`.
- **Realtime / WebSockets**: Directly subscribes to Supabase Realtime Channels in `location.api.ts` (`worker_locations` table) and `message.api.ts` (`messages` table), bypassing backend Express server entirely for realtime features.

### Complete Inventory of Backend Endpoints Expected by Frontend

| Method | Path | Request Body | Query Parameters | Headers | Auth Requirement | Expected Response Format | Error Response |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **GET** | `/me` | None | None | `Authorization: Bearer <token>` | Required | `{ success: boolean, data: BackendProfile }` | `{ success: false, message: string }` |
| **POST** | `/me/profile` | `{ full_name, phone?, city?, area?, role, avatar_url? }` | None | `Authorization: Bearer <token>` | Required | `{ success: boolean, data: BackendProfile }` | `{ success: false, message: string }` |
| **PATCH** | `/me/profile` | `{ full_name?, phone?, city?, area?, avatar_url? }` | None | `Authorization: Bearer <token>` | Required | `{ success: boolean, data: BackendProfile }` | `{ success: false, message: string }` |
| **GET** | `/me/role` | None | None | `Authorization: Bearer <token>` | Required | `{ success: boolean, data: { role } }` | `{ success: false, message: string }` |
| **GET** | `/workers` | None | `profession`, `city`, `area`, `min_rating`, `max_price`, `availability`, `limit`, `page` | Optional | Public / Optional | `{ success: boolean, data: BackendWorker[] }` | `{ success: false, message: string }` |
| **GET** | `/workers/:id` | None | None | Optional | Public / Optional | `{ success: boolean, data: BackendWorker }` | `{ success: false, message: string }` |
| **POST** | `/workers` | `{ profession, bio?, experience_years?, hourly_rate?, fixed_rate_min?, fixed_rate_max?, skills?, availability? }` | None | `Authorization: Bearer <token>` | Required (`worker` role) | `{ success: boolean, data: BackendWorker }` | `{ success: false, message: string }` |
| **PATCH** | `/workers/:id` | `Partial<BackendWorker>` | None | `Authorization: Bearer <token>` | Required (`worker` owner) | `{ success: boolean, data: BackendWorker }` | `{ success: false, message: string }` |
| **POST** | `/workers/recommend` | `{ prompt: string, city?: string }` | None | Optional | Public | `{ success: boolean, data: AIMatchResult[] }` | `{ success: false, message: string }` |
| **POST** | `/bookings` | `{ worker_id, service_type, problem_description?, booking_date, time_slot, agreed_price, customer_address, city }` | None | `Authorization: Bearer <token>` | Required (`customer` role) | `{ success: boolean, data: BackendBooking }` | `{ success: false, message: string }` |
| **GET** | `/bookings` | None | None | `Authorization: Bearer <token>` | Required | `{ success: boolean, data: BackendBooking[] }` | `{ success: false, message: string }` |
| **GET** | `/bookings/:id` | None | None | `Authorization: Bearer <token>` | Required | `{ success: boolean, data: BackendBooking }` | `{ success: false, message: string }` |
| **PATCH** | `/bookings/:id/status` | `{ status: BackendBookingStatus }` | None | `Authorization: Bearer <token>` | Required | `{ success: boolean, data: BackendBooking }` | `{ success: false, message: string }` |
| **GET** | `/workers/:id/reviews` | None | None | Optional | Public | `{ success: boolean, data: BackendReview[] }` | `{ success: false, message: string }` |
| **POST** | `/reviews` | `{ booking_id, worker_id, rating, quality_rating?, punctuality_rating?, professionalism_rating?, comment? }` | None | `Authorization: Bearer <token>` | Required | `{ success: boolean, data: BackendReview }` | `{ success: false, message: string }` |
| **POST** | `/workers/me/location` | `{ latitude, longitude, accuracy?, booking_id? }` | None | `Authorization: Bearer <token>` | Required (`worker`) | `{ success: boolean, data: WorkerLocation }` | `{ success: false, message: string }` |
| **GET** | `/workers/:id/location` | None | `booking_id?` | `Authorization: Bearer <token>` | Required | `{ success: boolean, data: WorkerLocation }` | `{ success: false, message: string }` |
| **POST** | `/messages` | `{ booking_id, recipient_id, content }` | None | `Authorization: Bearer <token>` | Required | `{ success: boolean, data: Message }` | `{ success: false, message: string }` |
| **GET** | `/messages/booking/:bookingId` | None | None | `Authorization: Bearer <token>` | Required | `{ success: boolean, data: Message[] }` | `{ success: false, message: string }` |
| **POST** | `/disputes` | `{ booking_id, reason, description }` | None | `Authorization: Bearer <token>` | Required | `{ success: boolean, data: Dispute }` | `{ success: false, message: string }` |
| **GET** | `/disputes` | None | None | `Authorization: Bearer <token>` | Required | `{ success: boolean, data: Dispute[] }` | `{ success: false, message: string }` |
| **GET** | `/disputes/:id` | None | None | `Authorization: Bearer <token>` | Required | `{ success: boolean, data: Dispute }` | `{ success: false, message: string }` |
| **PATCH** | `/disputes/:id/status` | `{ status, resolution_notes? }` | None | `Authorization: Bearer <token>` | Required | `{ success: boolean, data: Dispute }` | `{ success: false, message: string }` |
| **POST** | `/payments/create-order` | `{ booking_id }` | None | `Authorization: Bearer <token>` | Required | `{ success: boolean, data: Payment }` | `{ success: false, message: string }` |
| **POST** | `/payments/verify` | `{ booking_id, provider_payment_id, provider_signature? }` | None | `Authorization: Bearer <token>` | Required | `{ success: boolean, data: Payment }` | `{ success: false, message: string }` |
| **GET** | `/payments/:id` | None | None | `Authorization: Bearer <token>` | Required | `{ success: boolean, data: Payment }` | `{ success: false, message: string }` |
| **GET** | `/payments` | None | None | `Authorization: Bearer <token>` | Required | `{ success: boolean, data: Payment[] }` | `{ success: false, message: string }` |
| **GET** | `/worker/earnings` | None | None | `Authorization: Bearer <token>` | Required (`worker`) | `{ success: boolean, data: WorkerEarnings }` | `{ success: false, message: string }` |
| **GET** | `/workers/me/jobs` | None | None | `Authorization: Bearer <token>` | Required (`worker`) | `{ success: boolean, data: BackendBooking[] }` | `{ success: false, message: string }` |

---

## Phase 3 — Backend Audit

### Backend API Inventory & Route Analysis

| Method | Path | Controller Function | Mounted Base | Auth Required | DB Effect / Persistence | Error Conditions |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **GET** | `/api/health` | `getHealth` | `/api/health` | No | None | None |
| **GET** | `/api/me` | `getMe` | `/api/me` | Yes (`requireAuth`) | Supabase `profiles` table lookup | 401 Unauthorized |
| **POST** | `/api/me/profile` | `createMyProfile` | `/api/me` | Yes (`requireAuth`) | Inserts into `profiles` | 400 Validation Error, 401 Unauthorized |
| **PATCH** | `/api/me/profile` | `updateMyProfile` | `/api/me` | Yes (`requireAuth`) | Updates `profiles` | 400 Validation Error, 401 Unauthorized |
| **GET** | `/api/me/role` | `getMyRole` | `/api/me` | Yes (`requireAuth`) | Supabase `profiles` query | 401 Unauthorized |
| **GET** | `/api/workers` | `listWorkers` | `/api/workers` | No | In-memory `MOCK_WORKERS` | 400 Validation Error |
| **POST** | `/api/workers/recommend` | `recommendWorkers` | `/api/workers` | No | In-memory filter on `MOCK_WORKERS` | 400 Validation Error (`prompt < 3 chars`) |
| **GET** | `/api/workers/me/jobs` | `getWorkerJobs` | `/api/workers` | Yes (`requireAuth`) | In-memory filter on `MOCK_BOOKINGS` | 401 Unauthorized |
| **PATCH** | `/api/workers/me` | `updateMyWorkerProfile` | `/api/workers` | Yes (`requireAuth`) | In-memory update on `MOCK_WORKERS` | 401 Unauthorized, 404 Not Found |
| **GET** | `/api/workers/:id` | `getWorker` | `/api/workers` | No | In-memory lookup on `MOCK_WORKERS` | 404 Not Found |
| **GET** | `/api/workers/:id/reviews` | `getWorkerReviews` | `/api/workers` | No | In-memory filter on `MOCK_REVIEWS` | 404 Not Found |
| **POST** | `/api/workers` | `createWorkerProfile` | `/api/workers` | Yes (`requireAuth`) | In-memory push to `MOCK_WORKERS` | 400 Validation Error, 401 Unauthorized |
| **PATCH** | `/api/workers/:id` | `updateWorkerProfile` | `/api/workers` | Yes (`requireAuth`) | In-memory update on `MOCK_WORKERS` | 400 Validation, 401 Auth, 403 Forbidden |
| **POST** | `/api/workers/me/location` | `publishLocation` | `/api/workers` | Yes (`requireAuth`) | In-memory map `MOCK_LOCATIONS` | 400 Validation, 401 Auth, 403 Forbidden |
| **GET** | `/api/workers/:id/location` | `getWorkerLocation` | `/api/workers` | Yes (`requireAuth`) | In-memory lookup `MOCK_LOCATIONS` | 401 Auth, 403 Forbidden |
| **GET** | `/api/worker/earnings` | `getWorkerEarnings` | `/api/worker` | Yes (`requireAuth`) | Aggregates `MOCK_BOOKINGS` | 401 Unauthorized |
| **POST** | `/api/bookings` | `createBooking` | `/api/bookings` | Yes (`requireAuth`) | In-memory push `MOCK_BOOKINGS` | 400 Validation, 401 Unauthorized |
| **GET** | `/api/bookings` | `listBookings` | `/api/bookings` | Yes (`requireAuth`) | In-memory filter `MOCK_BOOKINGS` | 401 Unauthorized |
| **GET** | `/api/bookings/:id` | `getBooking` | `/api/bookings` | Yes (`requireAuth`) | In-memory lookup `MOCK_BOOKINGS` | 401 Auth, 403 Forbidden, 404 Not Found |
| **PATCH** | `/api/bookings/:id/status` | `updateStatus` | `/api/bookings` | Yes (`requireAuth`) | In-memory update `MOCK_BOOKINGS` | 400 Validation, 401 Auth, 404 Not Found |
| **POST** | `/api/reviews` | `createReview` | `/api/reviews` | Yes (`requireAuth`) | In-memory push `MOCK_REVIEWS` | 400 Validation, 401 Auth, 409 Conflict |
| **POST** | `/api/messages` | `sendMessage` | `/api/messages` | Yes (`requireAuth`) | In-memory push `MOCK_MESSAGES` | 400 Validation, 401 Auth, 403 Forbidden |
| **GET** | `/api/messages/booking/:bookingId` | `getBookingMessages` | `/api/messages` | Yes (`requireAuth`) | In-memory filter `MOCK_MESSAGES` | 401 Auth, 403 Forbidden |
| **POST** | `/api/disputes` | `createDispute` | `/api/disputes` | Yes (`requireAuth`) | In-memory push `MOCK_DISPUTES` | 400 Validation, 401 Auth, 409 Conflict |
| **GET** | `/api/disputes` | `listDisputes` | `/api/disputes` | Yes (`requireAuth`) | In-memory filter `MOCK_DISPUTES` | 401 Unauthorized |
| **GET** | `/api/disputes/:id` | `getDispute` | `/api/disputes` | Yes (`requireAuth`) | In-memory lookup `MOCK_DISPUTES` | 401 Auth, 403 Forbidden, 404 Not Found |
| **PATCH** | `/api/disputes/:id/status` | `updateDisputeStatus` | `/api/disputes` | Yes (`requireAuth`) | In-memory update `MOCK_DISPUTES` | 400 Validation, 401 Auth, 404 Not Found |
| **POST** | `/api/payments/create-order` | `createOrder` | `/api/payments` | Yes (`requireAuth`) | In-memory push `MOCK_PAYMENTS` | 400 Validation, 401 Auth, 409 Conflict |
| **POST** | `/api/payments/verify` | `verifyPayment` | `/api/payments` | Yes (`requireAuth`) | In-memory update `MOCK_PAYMENTS` | 400 Validation, 401 Auth, 404 Not Found |
| **GET** | `/api/payments` | `listPayments` | `/api/payments` | Yes (`requireAuth`) | In-memory filter `MOCK_PAYMENTS` | 401 Unauthorized |
| **GET** | `/api/payments/:id` | `getPayment` | `/api/payments` | Yes (`requireAuth`) | In-memory lookup `MOCK_PAYMENTS` | 401 Auth, 403 Forbidden, 404 Not Found |

---

## Phase 4 — AI System Audit

### AI Architecture & Runtime Audit Findings
1. **Physical Absence of `ai-model/` Directory**: The repository contains NO standalone Python ML codebase, PyTorch/TensorFlow models, `.pkl`/`.onnx`/`.h5` binary assets, or Python dependencies.
2. **Dual Duplicate Heuristic Engines**:
   - **Frontend Engine** (`frontend/src/services/workerMatchingService.ts`): Client-side keyword and distance scoring engine with weights (Skill 30%, Distance 20%, Availability 15%, Rating 15%, Trust 15%, Price 5%). Scores mock workers dynamically in browser memory.
   - **Backend Engine** (`backend/src/controllers/ai.controller.ts`): Server-side string matching controller (Profession 25pts, Skill 15pts, Bio 10pts, City 10pts). Returns ranked list of `{ worker, matchScore, matchedSkills, reasoning }`.
3. **Route Mounting & Integration Status**:
   - `ai.routes.ts` defines `POST /recommend`.
   - `ai.routes.ts` is imported in `worker.routes.ts` and mounted at `POST /api/workers/recommend`.
   - `ai.routes.ts` also exists as an unmounted standalone route file.
   - Frontend `ai.api.ts` makes POST request to `/workers/recommend`.
4. **Production Readiness Assessment**: **NOT PRODUCTION READY**. The system uses basic substring regex/includes matching with arbitrary hardcoded point additions. It lacks embedding vectors, NLP models, semantic matching, or machine learning pipelines.

---

## Phase 5 — Integration Conflicts & Risk Matrix

| Conflict # | Conflict Description | Component(s) Involved | Severity | Impact |
| :---: | :--- | :--- | :---: | :--- |
| **1** | **In-Memory Volatility (No DB Persistence)** | Backend Services (`worker.service`, `booking.service`, `payment.service`, `dispute.service`, etc.) | **CRITICAL** | All bookings, workers, reviews, payments, disputes, and locations created via backend API are stored in Node.js memory variables and reset whenever backend restarts. |
| **2** | **Duplicate/Split AI Logic** | Frontend `workerMatchingService.ts` vs Backend `ai.controller.ts` | **HIGH** | Frontend uses client-side keyword matching against mock data while backend uses different keyword logic. |
| **3** | **Direct Database Bypass by Frontend** | Frontend `location.api.ts` & `message.api.ts` | **HIGH** | Frontend subscribes directly to Supabase PostgreSQL Realtime channels (`worker_locations`, `messages`), bypassing Express API layer and validation. |
| **4** | **Field Naming & Case Mismatches (CamelCase vs Snake_case)** | Frontend `types/index.ts` vs Backend `BackendWorker` / `BackendBooking` | **HIGH** | Frontend `Worker` uses `hourlyRate`, `experienceYears`, `completedJobs`, `rating`, `avatar`. Backend returns `hourly_rate`, `experience_years`, `total_jobs`, `average_rating`, `avatar_url`. Frontend UI breaks when consuming raw backend worker objects. |
| **5** | **Booking Status String Format Mismatch** | Frontend `Booking` vs Backend `BackendBooking` | **HIGH** | Frontend expects `'Pending'`, `'Confirmed'`, `'In Progress'`, `'Completed'`, `'Cancelled'` (Capitalized with spaces). Backend expects `'pending'`, `'accepted'`, `'rejected'`, `'in_progress'`, `'completed'`, `'cancelled'` (lowercase snake_case). |
| **6** | **Dual ID System Mismatch (User vs Worker ID)** | Frontend Auth / Backend `workers` table | **HIGH** | Backend `workers` table uses `w-1` as worker ID while `profile_id` is `u-worker-1`. Frontend sends `user.id` (`u-1`) as `worker_id` during booking creation, causing reference lookup failures. |
| **7** | **Payment Field & Provider Mismatches** | Frontend `payment.api.ts` vs Backend `payment.service.ts` | **MEDIUM** | Frontend expects `serviceCost` while backend uses `agreed_price`. Provider is hardcoded to `razorpay_stub` without actual SDK integration. |
| **8** | **Price & Earnings Structure Mismatch** | Frontend `WorkerEarnings` vs Backend `analytics.controller.ts` | **MEDIUM** | Frontend expects `{ todayEarnings, weeklyEarnings, monthlyEarnings, pendingPayouts, completedJobsCount, platformFeePaid, weeklyHistory }`. Backend returns `{ totalEarnings, completedJobs, pendingPayments, platformFee, netEarnings, monthlyEarnings }`. |
| **9** | **Route Prefix Discrepancies** | Backend `app.ts` (`/api/worker` vs `/api/workers`) | **LOW** | Analytics route mounted at `/api/worker/earnings` (singular) while worker routes mounted at `/api/workers` (plural). |
| **10** | **Environment Variable Inconsistencies** | Frontend `.env` vs Backend `.env` | **LOW** | Frontend has `VITE_API_BASE_URL=http://localhost:5000/api`. Backend CORS allows `5173`-`5176`. |
