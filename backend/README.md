# BuildConnect Backend — Module 1

BuildConnect is a platform for connecting customers with verified local service workers in Tier-2 and Tier-3 cities in India.

This is the independent backend foundation built with Node.js, Express, and TypeScript.

---

## 🛠 Tech Stack

- **Runtime**: Node.js (v18+)
- **Language**: TypeScript
- **Framework**: Express.js
- **Middleware**: Helmet (Security headers), CORS, Morgan (HTTP request logger)
- **Validation**: Zod
- **Testing**: Vitest & Supertest
- **Development Tooling**: `tsx` (fast watcher)

---

## 📂 Directory Structure

```text
backend/
├── src/
│   ├── config/          # Environment & app configs
│   ├── controllers/     # Route handlers & logic controllers
│   ├── middleware/      # Error, CORS, & auth middlewares
│   ├── routes/          # API route definitions
│   ├── services/        # Business logic layer
│   ├── models/          # Data models & DB schemas
│   ├── types/           # TypeScript interface definitions
│   ├── utils/           # Helper utilities & standardized response envelope
│   ├── app.ts           # Express application setup
│   └── server.ts        # Entry point server listener
├── tests/               # Vitest + Supertest integration tests
├── database/            # Database scripts & migrations (Future modules)
├── .env.example         # Environment template
├── .gitignore
├── package.json
├── tsconfig.json
└── README.md
```

---

## 🚀 Getting Started

### 1. Installation

From the `backend` folder:

```bash
npm install
```

### 2. Environment Setup

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

Default variables:
```env
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

### 3. Development Server

Start the backend server in development mode with automatic hot reload:

```bash
npm run dev
```

The server will listen at:
`http://localhost:5000`

### 4. Running Tests

Run unit & integration tests using Vitest & Supertest:

```bash
npm test
```

### 5. Production Build & Execution

Build the TypeScript files into JavaScript:

```bash
npm run build
npm start
```

---

## 📡 Implemented API Endpoints

### Health Check

```http
GET /api/health
```

#### Response (HTTP 200 OK):

```json
{
  "success": true,
  "message": "BuildConnect backend is running"
}
```

---

## 🔒 Architecture & Security

- **Centralized Error Handling**: Standardized success (`{ success: true, data, message }`) and error (`{ success: false, message, errors }`) JSON envelopes across all routes.
- **CORS Restricted**: Allowed origin is restricted to `http://localhost:5173` (configurable via `FRONTEND_URL`).
- **Independent Separation**: The backend operates on port 5000 and has no direct code dependency on the frontend codebase.
