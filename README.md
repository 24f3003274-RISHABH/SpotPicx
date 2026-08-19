# SpotPicks — Local Discovery & Recommendation Platform

> **"Discover. Explore. Pick the Best."**

SpotPicks is a scalable, data-driven local discovery and recommendation platform initially focused on **Delhi, India**, architected for rapid expansion to Delhi NCR and metro cities across India (Mumbai, Bengaluru, Hyderabad, Pune, etc.).

---

## 🌟 Vision & Core Product Principles

Unlike traditional directories with hundreds of hardcoded duplicate pages, SpotPicks utilizes a **purely data-driven engine**:
- Single reusable pipeline for any category, locality, intent, or query configuration (e.g., *"Best momos in Majnu Ka Tilla"*, *"Best PGs near JNU"*, *"Laptop repair near me"*).
- Multi-city normalized geographic schema (`country`, `state`, `city`, `locality`) with zero city-hardcoding in database models.
- Distinct User Roles: `USER`, `BUSINESS_OWNER`, `EDITOR`, `ADMIN`, `SUPER_ADMIN`.

---

## 🛠️ Technology Stack

### Frontend (`client/` / `src/`)
- **Framework:** React 19 + Vite 6
- **Routing:** React Router v7
- **Styling:** Tailwind CSS v4
- **State & Data Fetching:** TanStack Query v5 + Zustand
- **Forms & Validation:** React Hook Form + Zod
- **Icons & Animation:** Lucide React + Motion

### Backend (`server/`)
- **Runtime:** Node.js + Express
- **Database ORM:** MongoDB + Mongoose
- **Security & Headers:** Helmet, CORS, JWT, BcryptJS
- **Validation:** Zod
- **Logging:** Morgan

---

## 📂 Project Architecture

```
spotpicks/
├── .env.example                # Documented environment variables
├── README.md                   # Project documentation & guide
├── package.json                # Project dependencies and unified scripts
├── server.ts                   # Full-stack entry point (Express API + Vite SPA)
│
├── server/                     # Backend Architecture (Routes -> Controllers -> Services -> Models)
│   └── src/
│       ├── config/             # DB connection service (Mongoose) & Environment config
│       ├── constants/          # User roles, categories taxonomy, HTTP status codes
│       ├── controllers/        # Health controller & business response handlers
│       ├── middleware/         # Centralized error handler & 404 middleware
│       ├── models/             # Scalable Mongoose models (User, Spot)
│       ├── routes/             # Versioned API routes (/api/v1)
│       ├── seed/               # Initial database seed script
│       ├── services/           # Reusable service layer (DbService, HealthService)
│       ├── utils/              # AsyncHandler, response formatters, logger
│       ├── validators/         # Zod input validation schemas
│       ├── app.ts              # Express application factory
│       └── server.ts           # Standalone server starter
│
└── src/                        # Frontend Client Architecture
    ├── api/                    # Centralized Axios client instance
    ├── components/
    │   ├── layout/             # Navbar, Footer
    │   └── ui/                 # Design System (Button, Input, Card, Badge, Container)
    ├── constants/              # Categories taxonomy, Delhi localities, Routes
    ├── hooks/                  # TanStack query hooks (useHealth)
    ├── layouts/                # MainLayout, AuthLayout
    ├── pages/                  # HomePage, ExplorePage, SearchPage, LoginPage, RegisterPage, NotFoundPage
    ├── routes/                 # React Router routing table
    ├── services/               # Frontend API services (healthService)
    ├── store/                  # Zustand state stores (useFilterStore, useAuthStore)
    ├── types/                  # Shared TypeScript interfaces
    ├── utils/                  # Tailwind cn utility, helpers
    ├── App.tsx                 # Root React component with providers
    ├── index.css               # Global CSS & Tailwind configuration
    └── main.tsx                # Client entry point
```

---

## 🚀 Getting Started

### 1. Installation

Install all required dependencies:
```bash
npm install
```

### 2. Environment Variables Configuration

Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

Key environment variables:
```env
PORT=3000
NODE_ENV=development
CORS_ORIGIN=*
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/spotpicks?retryWrites=true&w=majority
JWT_SECRET=your_spotpicks_super_secret_jwt_key_32_characters_long
VITE_API_URL=/api/v1
```

### 3. Running the Application

To start the unified full-stack development server (Express backend + Vite client):
```bash
npm run dev
```

To run a production build:
```bash
npm run build
npm start
```

---

## 🔌 API Endpoints (Phase 1)

### Health Check
- **Endpoint:** `GET /api/v1/health`
- **Response Format:**
```json
{
  "success": true,
  "message": "SpotPicks API is running",
  "data": {
    "status": "healthy",
    "timestamp": "2026-08-19T16:00:00.000Z",
    "uptimeSeconds": 120,
    "environment": "development",
    "database": {
      "isConnected": true,
      "state": "connected"
    },
    "version": "1.0.0-phase1"
  }
}
```

---

## 🧭 Phase 1 Deliverables Summary

- [x] Full-stack directory structure (`server/` + `src/` / `client/`)
- [x] Express application with `express.json()`, `cors()`, `helmet()`, `morgan()`, centralized error handling, and 404 handler
- [x] `GET /api/v1/health` returning `{ success: true, message: "SpotPicks API is running" }`
- [x] Mongoose connection service with resilient non-blocking lifecycle
- [x] Scalable User and Spot Mongoose models supporting multi-city geographical taxonomy
- [x] Centralized Axios instance (`apiClient`) respecting `VITE_API_URL`
- [x] SpotPicks Design System: Button, Input, Card, Badge, Container
- [x] Interactive responsive Homepage with search engine, Delhi locality selector, category cards, and live system health monitor
- [x] React Router setup with Explore, Search, Login, Register, and NotFound pages
- [x] Verified `lint_applet` and `compile_applet` compilation
