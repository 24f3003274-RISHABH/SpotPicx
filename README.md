# SpotPicx — Local Discovery & Recommendation Platform
# Spotpicx

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

### Phase 21: India-Wide Scalability & Geographic Taxonomy
- Implemented 6-tier nationwide geographic taxonomy: `Country (India)` -> `State` -> `District` -> `City` -> `Locality` -> `Neighborhood`.
- Engineered database-driven routing supporting `/india/:stateSlug` and `/india/:stateSlug/:citySlug` with zero hardcoding.
- Built national discovery hub allowing seekers to browse states (Delhi, Maharashtra, Karnataka, Tamil Nadu, Telangana, etc.) and explore local culinary, heritage, stay, and shopping spots.
- Integrated nationwide search intent parsing (e.g. *"Best cafes in Mumbai"*, *"Best restaurants in Bangalore"*, *"PG near IIT Bombay"*).
- Expanded Admin Control Center with Geographic Hierarchy Governance for managing states, cities, and localities dynamically.

### Phase 22: Production Launch, Cloud Hardening & Telemetry
- **Frontend Optimization & Vercel**: Created `vercel.json` with SPA routing rewrites, security response headers, and asset caching rules.
- **Backend Deployment (Render/Railway)**: Created `render.yaml` infrastructure specification with health check path `/api/v1/health` and region configuration.
- **Database & Indexes**: Verified compound indexes and `2dsphere` geospatial indexing across `Business` and `Location` models for low-latency queries.
- **Security Hardening**: Enforced strict Helmet headers, CORS origin whitelisting, sliding-window rate limiting, and password hashing.
- **Diagnostic Telemetry**: Built `SystemLog` Mongoose model with automatic 30-day TTL index and `LoggerService` tracking server health, AI query performance, scraper runs, and background jobs.
- **SEO & Discoverability**: Published static and dynamic `robots.txt` and `sitemap.xml` with XML namespace standard compliance.
- **Production Rollback Plan**: Documented blue-green deployment lifecycle, database backup policies, and zero-downtime rollback procedures.

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

## 🤖 Phase 14: Ask SpotPicks — Conversational AI Search & Grounding

SpotPicks integrates Google's official `@google/genai` SDK to power **"Ask SpotPicks"**, a conversational discovery experience:

### Key Capabilities:
- **Natural Language Query Understanding**: Converts natural questions (e.g., *"Best cafe near JNU under 500?"*, *"Romantic dinner in Hauz Khas"*, *"Cheap laptop repair in Nehru Place"*) into structured filters (`category`, `locality`, `priceMax`, `amenities`, `tags`, `intent`).
- **Database-First Strategy**: Real verified businesses in MongoDB are searched first. Their verified metadata (pricing tier, ratings, addresses, verified status) is passed as ground truth context to Gemini.
- **Google Search Grounding**: When users ask questions requiring real-time context (events tonight, timings today, recent updates), Google Search grounding (`tools: [{ googleSearch: {} }]`) provides live context and web citations.
- **Anti-Hallucination Guardrails**: Gemini is strictly constrained by system instructions to never fabricate prices, phone numbers, addresses, or hours. Unverified information is flagged transparently.
- **Resilient Fallback Engine**: If Gemini is offline, unconfigured, or rate-limited, the system transparently falls back to our sub-millisecond rule-based regex engine and verified database curation.
- **Cost Control & Caching**: Server-side in-memory TTL caching (15-minute window) reduces redundant API calls for common discovery prompts.

---

## 🔄 Phase 15: Controlled Data Ingestion & Freshness Engine

SpotPicks implements a robust, compliant data ingestion architecture:
- **DataSource Management**: Supports `API`, `RSS`, `WEB_SEARCH`, and `MANUAL` pipelines with automatic rate limiting, interval scheduling, run statistics, and exponential backoff.
- **Normalization Pipeline**: Ingests diverse schemas from open government feeds, transport data, and licensed directories into normalized `Business` documents with 2dsphere geocoding and category taxonomy mapping.
- **Data Freshness Tracker**: Automatically labels listings as `FRESH` (< 30 days), `RECENT` (< 90 days), or `STALE` (> 90 days), flagging stale spots for automated re-verification.
- **Compliance & Attribution Policy**: Strictly respects `robots.txt`, Terms of Service, rate limits, and copyright. Never bypasses CAPTCHAs, paywalls, or anti-bot protections. Every listing preserves full `source` and `sourceUrl` transparency.

---

## 🎨 Phase 16: Rich Place Intelligence & Visual Discovery

### 1. Visual Discovery & Image Pipeline
- **Four-Tier Media Architecture**: Every business supports `coverImage` (hero banners), `thumbnail` (search & map views), `gallery` (multi-photo mosaics with captions & credits), and `logo`.
- **Approved Image Sources Policy**: Strictly employs owned photography, licensed media pools, verified user-submitted reviews, and permitted public provider images. Disallows ungrounded scraping of copyrighted assets.
- **Visual Search Results**: Search and category cards feature high-resolution cover photos, open/closed indicators, rating pills, verified badges, Delhi Metro station pills, and signature food/highlights tags.

### 2. Rich Place Intelligence Structure
- **Highlights & Best For**: Curated bullet points on standout features and target demographics (e.g. *Couples*, *Solo Working*, *Heritage Lovers*).
- **Popular & Signature Items**: Community favorites and top-ordered dishes/services highlighted with ranking indices.
- **Transit & Metro Intelligence**: Direct station names, line colors, and walking distance derived from Delhi Metro transit mappings.
- **Accessibility & Parking**: Clear indicators for wheelchair ramps, elevator access, valet services, and street parking tips.
- **Best Time & Duration**: Optimal visit hours and recommended stay lengths for planning itineraries.

### 3. Grounded AI Place Concierge ("Ask About This Place")
- **Interactive Question Box**: Real-time Gemini 3.7 Q&A embedded on every place page (e.g., *"Is this quiet for working?"*, *"What should I order?"*, *"How to reach via metro?"*).
- **Zero-Hallucination Grounding**: The model is strictly supplied with verified JSON venue attributes. It synthesizes concise answers, takeaway badges, and source attributions without inventing non-existent facilities or pricing.
- **Dynamic AI Summary**: Generates structured *Why Visit*, *What to Expect*, and *Best Suited For* overviews with on-demand user refresh.

---

## 💎 Phase 19: Monetization Foundation & Merchant Infrastructure

SpotPicks implements a sustainable, transparent, and non-intrusive monetization infrastructure designed to empower local merchants while strictly protecting organic discovery integrity:

### 1. Business Promotion Types
- **Featured Business**: Premium home feed and category highlight cards marked with clear `Sponsored` badges.
- **Sponsored Listing**: Native cards in discovery feeds clearly labeled to prevent misleading users.
- **Promoted Category**: Curated sponsor highlights on dedicated category taxonomy pages.
- **Promoted Event**: Featured listings on local events and cultural calendar hubs.
- **Sponsored Collection**: Themed community lists supported by verified local partners.

### 2. Configurable Business Plans
Pricing and plan features are fully dynamic and decoupled from code via server configuration (`BUSINESS_PLANS`):
- **FREE**: 1 active business listing, standard search placement, basic analytics, direct customer reviews.
- **BASIC** (₹1,499/mo): Up to 3 listings, verified merchant badge, phone & website lead capture, 1 monthly sponsored boost.
- **PREMIUM** (₹3,999/mo): Up to 10 listings, priority search placement, direct enquiry & reservation lead routing, competitor traffic insights, 5 sponsored boosts.
- **ENTERPRISE** (₹9,999/mo): Unlimited listings, dedicated account concierge, multi-city placement, custom ad campaign manager, full API export.

### 3. Transparent Advertising & User Experience Guardrails
- **Mandatory Disclosures**: All paid placements feature an unmistakable `Sponsored` or `Promoted` tag.
- **No Organic Manipulation**: Organic search relevance and natural algorithmic rankings remain uncorrupted by ad spend.
- **Anti-Intrusive Standards**: Zero full-screen takeover popups, zero deceptive clickbait buttons, and zero auto-playing audio ads.

### 4. High-Intent Lead Generation Engine
Tracks and aggregates verifiable customer intent for business owners in real-time:
- **Phone Calls**: Click-to-call events logged with timestamp and device type.
- **Website Visits**: Outbound traffic routed to merchant domains.
- **Direction Requests**: Google Maps and native navigation requests.
- **WhatsApp Direct Connect**: Immediate customer inquiries via WhatsApp Web / Mobile.
- **Direct Enquiries & Table Bookings**: Structured booking and quote forms delivered directly to owner dashboards.

### 5. Pluggable Payment Gateway Strategy Pattern
Payment logic is isolated behind an `IPaymentGateway` strategy interface to ensure provider independence:
- **Razorpay Integration**: Native Indian UPI, NetBanking, Cards, and Wallets via checkout orders and cryptographic signature verification (`razorpay_signature`).
- **Stripe Integration**: Global card and international payment processing via checkout sessions and webhooks.
- **Mock Fallback**: Instant local sandboxing when live credentials are not configured.

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
