# BuildConnect Unified API Contract Specification

Version: 1.1.0  
Status: Implemented & Verified Contract  
Base URL: `/api`

---

## Overview & DTO Mapping Architecture

The BuildConnect system enforces strict layer boundary separation:
- **Backend Services & Database**: Use `snake_case` DTO schema models.
- **Frontend UI & Components**: Use `camelCase` TypeScript state models.
- **DTO Adapter Layer**: Centralized in [`frontend/src/api/mappers.ts`](file:///c:/Users/harsh/OneDrive/Desktop/bc_New%20folder/frontend/src/api/mappers.ts), performing bidirectional transformations for `Worker`, `Booking`, and `Review` objects.

---

## Standard Envelope Formats

### Standard Success Response Schema
```json
{
  "success": true,
  "data": {},
  "message": "Human readable success message"
}
```

### Standard Error Response Schema
```json
{
  "success": false,
  "message": "Primary error message",
  "errors": ["Detailed validation error 1"]
}
```

---

## 1. Authentication & Profiles (`/api/me`)

### 1.1 GET `/api/me`
Fetches active authenticated user profile.
- **Headers**: `Authorization: Bearer <supabase_jwt>`
- **Response `200 OK`**:
  ```json
  {
    "success": true,
    "data": {
      "id": "uuid-or-sub",
      "full_name": "Aarav Sharma",
      "email": "aarav@example.com",
      "phone": "+91 98765 43210",
      "role": "customer",
      "city": "Jaipur",
      "area": "Malviya Nagar",
      "avatar_url": "https://example.com/avatar.jpg"
    },
    "message": "User profile retrieved successfully"
  }
  ```

---

## 2. Workers & Smart Matching (`/api/workers`)

### 2.1 GET `/api/workers`
Lists workers with filtering options.
- **Query Parameters**: `profession`, `city`, `min_rating`, `availability`
- **Response `200 OK`**:
  ```json
  {
    "success": true,
    "data": [
      {
        "id": "w-1",
        "profile_id": "u-worker-1",
        "name": "Rajesh Kumar",
        "profession": "Electrician",
        "average_rating": 4.9,
        "review_count": 142,
        "experience_years": 8,
        "total_jobs": 320,
        "hourly_rate": 350,
        "fixed_rate_min": 400,
        "fixed_rate_max": 800,
        "verified": true,
        "trust_score": 96,
        "availability": "Available Today",
        "city": "Jaipur",
        "area": "Malviya Nagar",
        "skills": ["Short Circuit Repair", "AC Heavy Wiring"],
        "bio": "Licensed industrial electrician with 8+ years experience."
      }
    ]
  }
  ```

### 2.2 POST `/api/workers/recommend`
AI Smart Recommendation Endpoint.
- **Body**: `{ "prompt": "Electrician for short circuit in Malviya Nagar", "city": "Jaipur" }`
- **Response `200 OK`**:
  ```json
  {
    "success": true,
    "data": [
      {
        "worker": { "id": "w-1", "name": "Rajesh Kumar", "profession": "Electrician" },
        "matchScore": 95,
        "matchedSkills": ["Short Circuit Repair"],
        "reasoning": "Matches Electrician trade with skills: Short Circuit Repair"
      }
    ]
  }
  ```

---

## 3. Bookings (`/api/bookings`)

### Canonical Booking Status Mapping Table

| Backend Status (`snake_case`) | Frontend Display Label | Valid Next State Transitions |
| :--- | :--- | :--- |
| `pending` | **Pending** | `accepted`, `rejected`, `cancelled` |
| `accepted` | **Confirmed** | `in_progress`, `cancelled` |
| `in_progress` | **In Progress** | `completed`, `cancelled` |
| `completed` | **Completed** | None (Final) |
| `rejected` | **Cancelled** | None (Final) |
| `cancelled` | **Cancelled** | None (Final) |

---

## 4. Payments (`/api/payments`)

### 4.1 POST `/api/payments/create-order`
- **Body**: `{ "booking_id": "bk-101" }`
- **Response `200 OK`**:
  ```json
  {
    "success": true,
    "data": {
      "id": "pay-1700000000",
      "booking_id": "bk-101",
      "amount": 605,
      "platform_fee": 55,
      "worker_amount": 550,
      "currency": "INR",
      "status": "pending",
      "provider": "razorpay_stub"
    }
  }
  ```
