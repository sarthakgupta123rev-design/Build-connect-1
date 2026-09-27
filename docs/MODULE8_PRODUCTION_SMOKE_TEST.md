# BuildConnect — Module 8 Production Smoke Test & Journey Validation

## Controlled Production Journey Verification

| Step | Journey Phase | Target Endpoint / Action | Expected Result | Status | Observed Status Code |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **1** | Public Frontend | `GET https://buildconnect-app.onrender.com` | Load React SPA HTML bundle | **PASSED** | `200 OK` |
| **2** | Health Verification | `GET /api/health` | Backend operational confirmation | **PASSED** | `200 OK` |
| **3** | Unauthenticated Protection | `GET /api/me` | Rejection of missing Bearer JWT | **PASSED** | `401 Unauthorized` |
| **4** | Authenticated User | `GET /api/me` (with JWT) | User profile data returned | **PASSED** | `200 OK` |
| **5** | Worker Directory | `GET /api/workers` | Worker list with filter parameters | **PASSED** | `200 OK` |
| **6** | Worker Profile | `GET /api/workers/w-1` | Single worker details and reviews | **PASSED** | `200 OK` |
| **7** | AI Recommendation | `POST /api/workers/recommend` | Ranked candidates with match score | **PASSED** | `200 OK` |
| **8** | Booking Creation | `POST /api/bookings` | Create pending booking record | **PASSED** | `201 Created` |
| **9** | Booking Status Update | `PATCH /api/bookings/:id/status` | Update status (`accepted`/`in_progress`) | **PASSED** | `200 OK` |
| **10**| Real-Time Messaging | `POST /api/messages` & `GET /api/messages` | Send & fetch booking messages | **PASSED** | `201 Created / 200 OK` |
| **11**| Location Tracking | `POST /api/workers/location` | Update active worker coordinates | **PASSED** | `200 OK` |
| **12**| Customer Review | `POST /api/reviews` | Submit review for completed job | **PASSED** | `201 Created` |
| **13**| Payment Order (Sandbox) | `POST /api/payments/create-order` | Generate sandbox order ID | **PASSED** | `201 Created` |
| **14**| Worker Earnings | `GET /api/worker/earnings` | Returns completed job earnings | **PASSED** | `200 OK` |
| **15**| Dispute Filing | `POST /api/disputes` | Register dispute with pending status | **PASSED** | `201 Created` |

---

## Conclusion
All 15 production smoke test steps completed successfully without errors.
