# SpotPicks — Local Discovery & Recommendation Platform

> **"Discover. Explore. Pick the Best."**
> SpotPicks is a scalable, data-driven local discovery and recommendation platform built for Delhi-NCR and architected for rapid expansion across major Indian metros (Mumbai, Bengaluru, Hyderabad, Pune, etc.).

---

## 🌟 Overview & System Vision

SpotPicks redefines local discovery by combining:
1. **Data-Driven Architecture**: A single dynamic pipeline rendering any category, locality, price bracket, or custom query with zero hardcoded pages.
2. **AI-Powered Natural Language Search**: Gemini 3.7-driven conversational query understanding that extracts localities, budgets, categories, and lifestyle tags with deterministic rule fallback.
3. **Interactive Geospatial Mapping**: Custom map layer supporting Google Maps, OpenStreetMap, Mapbox, and canvas rendering with live coordinate clustering, radius boundaries, and location-based sorting.
4. **Trust & Verification Layer**: Structured reviews, verified business claims, official owner response badges, moderation tools, and content reporting.
5. **SEO & Dynamic Landing Engine**: Automated Top 10 rankings, locality-category landing pages, JSON-LD structured data, XML sitemaps, and search engine optimizations.
6. **Multi-Role Portals**: Role-based access control (`USER`, `BUSINESS_OWNER`, `EDITOR`, `ADMIN`, `SUPER_ADMIN`) with dedicated analytics, claim workflows, and listing management.

---

## 🏗️ Architecture & Tech Stack

```
                                  ┌───────────────────────────────┐
                                  │      Client (React 19 + Vite)  │
                                  │  - Tailwind CSS v4            │
                                  │  - TanStack Query v5          │
                                  │  - Zustand State Stores       │
                                  │  - Lucide React & Motion      │
                                  └───────────────┬───────────────┘
                                                  │ HTTP / REST / JSON
                                                  ▼
                                  ┌───────────────────────────────┐
                                  │    Express 4 API Server       │
                                  │  - Helmet & CORS Headers      │
                                  │  - In-Memory Rate Limiting    │
                                  │  - Input Sanitization (XSS)   │
                                  │  - JWT Auth (Access/Refresh)  │
                                  │  - Zod Request Validation     │
                                  └───────┬───────────────┬───────┘
                                          │               │
                     ┌────────────────────┴──┐         ┌──┴────────────────────┐
                     ▼                       ▼         ▼                       ▼
            ┌─────────────────┐    ┌─────────────────┐ ┌─────────────────┐  ┌──────────────────┐
            │  MongoDB Atlas  │    │ Gemini 3.7 AI   │ │ Google Maps API │  │ Cloudinary CDN   │
            │  2dsphere & Text│    │ Natural Search  │ │ Geocoding & Pan │  │ Media Management │
            └─────────────────┘    └─────────────────┘ └─────────────────┘  └──────────────────┘
```

### Full-Stack Technologies

- **Frontend**: React 19, TypeScript, Vite 6, Tailwind CSS v4, TanStack React Query v5, Zustand, React Hook Form, Zod, Recharts, Lucide React, Motion.
- **Backend**: Node.js, Express, Mongoose 8+, JWT (JSON Web Tokens), BcryptJS, Helmet, CORS, Cookie-Parser, Morgan, Zod.
- **AI & Integrations**: Google Gen AI SDK (`@google/genai` Gemini 3.7), Google Maps Platform API.
- **Testing**: Vitest, Supertest.
- **Production Infrastructure**: MongoDB Atlas, Vercel, Render / Railway, Cloudinary.

---

## 📁 Folder Structure

```
spotpicks/
├── .env.example                       # Documented environment variables template
├── README.md                          # Comprehensive documentation (Phases 1-12)
├── metadata.json                      # AI Studio platform capabilities & permissions
├── package.json                       # Dependencies, scripts, and build pipeline
├── server.ts                          # Production Express entry point + Vite SPA middleware
├── vitest.config.ts                   # Vitest testing suite configuration
│
├── server/                            # Backend Source Code
│   └── src/
│       ├── app.ts                     # Express factory with security & route mounts
│       ├── config/                    # DB connection (db.ts) & environment variables (env.ts)
│       ├── constants/                 # Roles, HTTP statuses, category taxonomy
│       ├── controllers/               # Express request handlers for all 18 modules
│       ├── middleware/                # Auth, RateLimiter, Sanitization, ErrorHandler, 404
│       ├── models/                    # Mongoose schemas with 2dsphere & full-text indexes
│       │   ├── Business.ts            # Core directory listings with geospatial coordinates
│       │   ├── Category.ts            # Hierarchical taxonomy schema
│       │   ├── Location.ts            # Multi-city locality & coordinates registry
│       │   ├── Review.ts              # Rating breakdown, photos, verified badges
│       │   ├── User.ts                # Auth, password hashing, roles, favorites
│       │   ├── Collection.ts          # User-curated bookmarks and spot lists
│       │   ├── Report.ts              # Flagged content & abuse reporting
│       │   ├── Notification.ts        # System notifications & alerts
│       │   ├── BusinessClaim.ts       # Verification and claim requests
│       │   ├── SearchQuery.ts         # Query analytics, click-throughs, and zero results
│       │   ├── SeoPage.ts             # Programmatic SEO landing metadata
│       │   ├── Article.ts             # Editorial guides and localized blog posts
│       │   ├── Event.ts               # Local happenings and ticketed events
│       │   ├── Job.ts                 # Local hiring and business job listings
│       │   └── Offer.ts               # Exclusive discounts and happy hours
│       ├── routes/                    # REST API routes (/api/v1/*)
│       ├── seed/                      # In-memory & MongoDB database seeding engine
│       ├── services/                  # Business logic services & AI search parsing
│       ├── types/                     # Server-side TypeScript interfaces
│       ├── utils/                     # AsyncHandler, JWT helpers, Response formatters
│       └── validators/                # Zod validation schemas for requests
│
├── src/                               # Frontend Client Code
│   ├── api/                           # Centralized Axios client (apiClient.ts)
│   ├── components/                    # Modular UI and domain components
│   │   ├── business/                  # BusinessCard, BusinessGrid, QuickViewModal
│   │   ├── collections/               # CollectionCard, CreateCollectionModal
│   │   ├── discovery/                 # Student, Housing, and Special discovery widgets
│   │   ├── events/                    # EventCard, OfferCard, JobCard
│   │   ├── layout/                    # Navbar, Footer, MobileNav, ThemeToggle
│   │   ├── map/                       # InteractiveMap, MapMarker, LocationPicker
│   │   ├── reviews/                   # ReviewList, ReviewForm, StarRating, HelpfulVote
│   │   ├── search/                    # SearchAutocomplete, AISearchBox, FilterSidebar
│   │   ├── seo/                       # DynamicMetaTags, JsonLdSchema, Breadcrumbs
│   │   └── ui/                        # Button, Input, Modal, Tabs, Skeleton, Toast
│   ├── constants/                     # Localities, categories, mock data, navigation
│   ├── hooks/                         # React Query hooks (useBusinesses, useSearch, useAuth)
│   ├── layouts/                       # MainLayout, DashboardLayout, AuthLayout
│   ├── pages/                         # Client pages (Home, Search, Details, Portals, SEO)
│   ├── services/                      # Client API service abstraction layer
│   ├── store/                         # Zustand global state (auth, saved, filters, location)
│   ├── types/                         # Shared TypeScript models and UI states
│   ├── utils/                         # Helper formatting functions and cn() utility
│   ├── App.tsx                        # Root application with router & React Query Provider
│   ├── index.css                      # Tailwind CSS v4 design tokens and global styles
│   └── main.tsx                       # React DOM entry point
│
└── tests/                             # Automated Test Suites
    ├── client/                        # Frontend logic and business rule tests
    │   └── searchLogic.test.ts
    └── server/                        # Backend API integration and security tests
        ├── auth.test.ts
        ├── authorization.test.ts
        └── business.test.ts
```

---

## 🗺️ Complete Phase-by-Phase Implementation Roadmap

### Phase 1: Foundation, Environment & Core Setup
- Initialized unified Express + React 19 Vite full-stack architecture.
- Established `GET /api/v1/health` endpoint with dynamic database status checks.
- Configured Mongoose connection manager with resilient non-blocking fallback.
- Built reusable UI design system (`Button`, `Input`, `Card`, `Badge`, `Container`).
- Built responsive Homepage with locality picker, category chips, and live system status.

### Phase 2: Category & Location Architecture
- Modeled hierarchical Categories (`FOOD`, `STAYS`, `SERVICES`, `SHOPPING`, `HERITAGE`, `NIGHTLIFE`, `FITNESS`, `COACHING`).
- Created Delhi-NCR locality dataset with latitude/longitude coordinates (Connaught Place, Hauz Khas, Majnu Ka Tilla, etc.).
- Implemented `/api/v1/categories` and `/api/v1/locations` REST endpoints.
- Developed category browsing grids and locality filter drawers on the frontend.

### Phase 3: Business Listing Core & Data Modeling
- Implemented `Business` Mongoose schema with `2dsphere` geospatial indexing and compound indexes.
- Built comprehensive business CRUD controllers and pagination engine.
- Created rich seed dataset of 52+ realistic spots across Delhi-NCR.
- Developed interactive `BusinessCard`, grid/list view toggles, and responsive listing pages.

### Phase 4: Full-Text Search, Geolocation & Map Engine
- Built full-text search index over business name, description, tags, and locality.
- Added `/api/v1/search` supporting combined text, category, price range, rating, and distance filters.
- Built provider-agnostic `MapService` with custom interactive map canvas, Leaflet/OSM, Mapbox, and Google Maps integration.
- Added user geolocation detection (`Near Me` radius query) with distance calculation.

### Phase 5: Authentication, JWT Security & Role-Based Access Control (RBAC)
- Implemented secure JWT Access + HTTP-Only Refresh Token authentication flow.
- Password hashing with `bcryptjs` (salt rounds: 10).
- Created user roles: `USER`, `BUSINESS_OWNER`, `EDITOR`, `ADMIN`, `SUPER_ADMIN`.
- Built registration, login, logout, and token refresh endpoints with sliding-window rate limiting.
- Developed frontend `useAuthStore` with session persistence and protected route guards.

### Phase 6: Reviews, Ratings & User Engagement
- Implemented `Review` schema with multi-criteria rating breakdown (food, service, ambiance, value).
- Added photo uploads, verified visit indicators, and helpful voting mechanisms.
- Built business aggregate rating recalculation hook on review mutations.
- Implemented review submission forms, photo carousels, and owner reply indicators.

### Phase 7: User Profiles, Favorites & Curated Collections
- Implemented `Favorite` toggle and private/public `Collection` creation systems.
- Developed User Profile dashboard displaying saved spots, user reviews, and active collections.
- Added collection sharing, exportable links, and custom list curation (e.g. *"Best Sunday Brunches in South Delhi"*).

### Phase 8: Business Owner Portal & Claim Verification
- Built business claim verification workflow (`PENDING`, `APPROVED`, `REJECTED`).
- Created dedicated Business Owner Dashboard for editing listing details, opening hours, amenities, and photos.
- Added official owner reply functionality to customer reviews with verified badge.
- Implemented listing performance overview (views, clicks, review score trends).

### Phase 9: Admin Control Center & Content Moderation
- Developed comprehensive Admin Dashboard with real-time platform statistics.
- Added user management, role assignments, and account deactivation controls.
- Implemented claim approval/rejection queue with proof document inspection.
- Built content moderation suite for user-flagged reviews, businesses, and abuse reports.

### Phase 10: Programmatic SEO Platform, Dynamic Top 10 & Sitemap
- Engineered dynamic Programmatic SEO engine generating keyword landing pages (`/top-10/best-:category-in-:locality`).
- Built automated `/sitemap.xml` and `/robots.txt` generation service with lastmod tracking.
- Created `DynamicMetaTags` and `JsonLdSchema` components injecting Schema.org `LocalBusiness`, `BreadcrumbList`, and OpenGraph tags.
- Added editorial localized blog articles and neighborhood discovery guides.

### Phase 11: AI Search, Search Analytics & Personalization
- Built natural language AI search modal powered by server-side Gemini 3.7 with deterministic rule-based fallback.
- Implemented `SearchQuery` telemetry logging user search volume, click-through rates (CTR), and zero-result queries.
- Built personalization recommendation engine with cold-start guard (minimum 3 interactions) explaining match recommendations.
- Developed Admin Search Intelligence Analytics tab with Recharts trend visualizers.

### Phase 12: Production Readiness, Security Hardening, Testing & Deployment
- Implemented recursive input sanitization middleware against MongoDB operator injections and script-based XSS.
- Configured HTTP security headers with `helmet`, CORS validation, and sliding-window IP rate limiting.
- Built automated test suites using Vitest and Supertest across Auth, Businesses, RBAC, and Frontend logic.
- Standardized API error responses (400 Zod/Mongoose errors, 401 Auth, 403 Forbidden, 404 Not Found, 500 Server Errors).
- Prepared production-ready deployment configurations for Vercel, Render, MongoDB Atlas, and Cloudinary.

### Phase 13: Public Website Cleanup & Consumer Experience
- Removed all developer-oriented UI artifacts from the public frontend (version tags, raw status codes, database IDs, debug counters).
- Cleaned up navigation and footer headers, transforming micro-bars into consumer-focused neighborhood taglines.
- Replaced technical error objects with friendly, user-centric error boundaries and intuitive recovery actions.
- Polished business cards, discovery hubs, and location detail pages to highlight verified community standards.
- Standardized smooth skeleton loading states for enhanced visual performance across all categories and search pages.

---

## 🔒 Security Architecture

| Security Domain | Implementation |
| :--- | :--- |
| **HTTP Headers** | `helmet` configured with strict headers and secure cookie parsing |
| **CORS Policy** | Whitelisted origin validation with `credentials: true` for secure cookies |
| **Rate Limiting** | Sliding-window in-memory rate limiter for authentication endpoints (30 reqs/min) |
| **Data Sanitization** | Recursive input middleware stripping MongoDB `$` query operators and `<script>` XSS vectors |
| **Password Security** | Bcrypt hashing with automated 10-round salt generation |
| **Token Architecture** | Short-lived JWT Access Tokens (15m) + secure HTTP-Only Refresh Tokens (7d) |
| **Role Authorization** | Granular middleware verification (`authorize(USER_ROLES.ADMIN)`) |
| **Ownership Isolation**| Business mutation endpoints enforce strict `business.owner === req.user.id` checks |
| **Error Handling** | Redaction of stack traces in production; standardized error schemas with HTTP status codes |

---

## 🔌 API Reference Summary

### Authentication (`/api/v1/auth`)
- `POST /register` — Register a new account
- `POST /login` — Authenticate and receive JWT tokens + HTTP-only cookie
- `POST /refresh` — Refresh expired access token
- `POST /logout` — Invalidate session and clear auth cookie
- `GET /me` — Get authenticated user profile (`Protected`)
- `GET /users` — List all registered users (`Admin only`)
- `PATCH /users/:id/role` — Update user authorization role (`Admin only`)

### Businesses (`/api/v1/businesses`)
- `GET /` — Search and filter businesses (pagination, category, locality, price, rating)
- `GET /:slug` — Get comprehensive single business details
- `POST /` — Create a new business listing (`Owner/Admin`)
- `PUT /:id` — Update existing listing (`Owner/Admin verified`)
- `DELETE /:id` — Archive or remove listing (`Admin only`)

### Search & AI Intelligence (`/api/v1/search`)
- `GET /` — Full-text multi-criteria search
- `GET /suggestions` — Fast debounced autocomplete suggestions
- `GET /trending` — Top trending searches and popular spots
- `POST /ai` — Gemini 3.7 natural language conversational query parser
- `POST /personalization` — User taste profile tailored recommendations
- `POST /track-click` — Telemetry click-through logging
- `GET /analytics/admin` — Search volume, CTR, and zero-result analytics (`Admin only`)

### Reviews & Community (`/api/v1/reviews`)
- `GET /business/:businessId` — Fetch reviews for a specific spot
- `POST /` — Submit a structured review with ratings and photos (`Protected`)
- `POST /:id/reply` — Owner official response to review (`Owner only`)
- `POST /:id/helpful` — Upvote a helpful review (`Protected`)

### Portals & Administration
- `GET /api/v1/admin/overview` — Platform KPI overview, users, listings, claims (`Admin only`)
- `GET /api/v1/business-owner/businesses` — Manage owned listings and analytics (`Owner only`)
- `POST /api/v1/business-owner/claim` — Submit business ownership claim request (`Protected`)

---

## 🧪 Testing & Verification

The project includes unit and integration tests powered by **Vitest** and **Supertest**.

### Running the Test Suite:
```bash
npm test
```

### Test Coverage Highlights:
- ✅ **Auth & Token Lifecycle**: Access token generation, token expiration handling, registration validation.
- ✅ **Business & Directory Search**: Category listing, locality resolution, pagination, search suggestions.
- ✅ **Role-Based Access Control**: Unauthorized access prevention (401), privilege escalation blocks (403).
- ✅ **Client Logic & Geographic Datasets**: Category taxonomy verification, Delhi locality coordinate checks.

---

## 🚀 Production Deployment Guide

### 1. Database Setup (MongoDB Atlas)
1. Create a free cluster on [MongoDB Atlas](https://www.mongodb.com/atlas).
2. Create a database user with read/write access.
3. Configure Network Access (whitelist IP `0.0.0.0/0` for cloud serverless platforms).
4. Copy the connection URI:
   ```
   mongodb+srv://<username>:<password>@cluster0.mongodb.net/spotpicks?retryWrites=true&w=majority
   ```

### 2. Backend Server Deployment (Render / Railway)
1. Connect your GitHub repository to Render or Railway.
2. Build Command:
   ```bash
   npm run build
   ```
3. Start Command:
   ```bash
   npm start
   ```
4. Configure Environment Variables:
   - `NODE_ENV=production`
   - `PORT=3000`
   - `MONGODB_URI=<your-atlas-uri>`
   - `JWT_ACCESS_SECRET=<32-char-random-string>`
   - `JWT_REFRESH_SECRET=<32-char-random-string>`
   - `CORS_ORIGIN=https://your-frontend-domain.com`
   - `GEMINI_API_KEY=<your-google-ai-api-key>`

### 3. Frontend Static Deployment (Vercel)
1. Deploy the repository to Vercel.
2. Set Framework Preset to **Vite**.
3. Build Command: `npm run build` (output directory: `dist`).
4. Set Environment Variables:
   - `VITE_API_URL=https://your-backend-api.onrender.com/api/v1`
   - `VITE_MAP_PROVIDER=google` (or `osm` for OpenStreetMap)
   - `VITE_GOOGLE_MAPS_API_KEY=<your-maps-key>`

### 4. Media & Asset Management (Cloudinary)
1. Create a free Cloudinary account.
2. Set `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, and `CLOUDINARY_API_SECRET` on your server for user review and business photo uploads.

---

## 📈 SEO & Search Engine Optimization

SpotPicks is built search-first:
- **Server-Generated Sitemaps**: `GET /sitemap.xml` dynamically aggregates all active businesses, categories, and Top 10 landing pages.
- **Search Crawlers**: `GET /robots.txt` directs search engines to the sitemap while protecting private routes (`/admin/*`, `/dashboard/*`).
- **Structured Data (JSON-LD)**: Injected on all detail and category pages supporting Google Rich Snippets for `LocalBusiness`, `AggregateRating`, and `BreadcrumbList`.
- **OpenGraph & Twitter Cards**: Dynamic social sharing cards with high-resolution business cover photos.

---

## 🔮 Future Roadmap

- [ ] **Real-time Table Booking & Reservations**: Direct integration with restaurant reservation systems.
- [ ] **Multi-City Nationwide Expansion**: Instant onboarding modules for Mumbai, Bangalore, Pune, and Kolkata.
- [ ] **Mobile Applications**: Cross-platform iOS and Android mobile app utilizing React Native.
- [ ] **Merchant Subscription Tier**: Premium verified badges, highlighted placement in search results, and advanced competitor analytics.
- [ ] **Audio & Visual AR Navigation**: Augmented reality camera discovery for finding spots within dense shopping complexes (e.g. Connaught Place inner circles).

---

## 📄 License & Attribution

SpotPicks is open-source under the MIT License. Developed with precision craftsmanship for seamless local discovery across India.
