# SpotPicks — Delhi SEO Growth Engine & Organic Discovery Architecture

## 1. Executive Summary & Strategy
The SpotPicks SEO Growth Engine is engineered to establish dominant organic search visibility across Delhi NCR by systematically indexing high-intent search queries and locality-based hubs. The platform blends programmatic indexing with human-grade editorial curation and factual AI synthesis grounded exclusively in verified database records.

---

## 2. Search Intent Page System
SpotPicks programmatically and editorially powers dedicated landing pages for high-volume commercial and informational search intents:

### Supported Primary Intent Slugs
- `best-restaurants-in-delhi`
- `best-cafes-in-delhi`
- `best-momos-in-delhi`
- `best-date-places-in-delhi`
- `best-parks-in-delhi`
- `best-markets-in-delhi`
- `best-pg-near-jnu`
- `best-cafes-near-jnu`
- `best-street-food-in-delhi`
- `best-places-to-visit-in-delhi`

### Dynamic Intent Routing (`SeoPageService`)
- Exact matching against MongoDB `SeoPage` collection.
- Dynamic fallback algorithm for patterns matching `/best-<category>-in-<location>`: parses category and locality tokens, fetches top verified spots, and renders dynamic rankings with complete JSON-LD schemas.

---

## 3. Comprehensive Database-Driven Locality Pages
Full database-driven hubs are established for all 12 key Delhi localities:
1. **Connaught Place** (`/location/connaught-place` & `/location/cp`)
2. **Hauz Khas** (`/location/hauz-khas` & `/location/hauz-khas-village`)
3. **Saket** (`/location/saket`)
4. **Lajpat Nagar** (`/location/lajpat-nagar`)
5. **Karol Bagh** (`/location/karol-bagh`)
6. **Chandni Chowk** (`/location/chandni-chowk`)
7. **Dwarka** (`/location/dwarka`)
8. **Rohini** (`/location/rohini`)
9. **Vasant Kunj** (`/location/vasant-kunj`)
10. **Greater Kailash** (`/location/greater-kailash` & `/location/gk`)
11. **Nehru Place** (`/location/nehru-place`)
12. **Rajouri Garden** (`/location/rajouri-garden`)

### Standard Locality Features
- **Hero & Transit Connectivity**: Locality pin code, Delhi Metro interchange lines, and total verified spot counts.
- **Neighborhood Highlights**: Key attractions, historical context, and dining culture.
- **Filters & Sorting**: Category chips, price tiers (`₹`, `₹₹`, `₹₹₹₹`), and Grid/List toggle.
- **Interactive OpenStreetMap Embed**: Pinpointed coordinates for visual spatial orientation.
- **Nearby Locality Network**: Inter-connected graph calculating distance and linking to adjacent hubs.
- **Locality FAQs**: Collapsible accordion with schema.org `FAQPage` markup.
- **Connected Curated Guides**: Contextual links to relevant Top 10 lists.

---

## 4. AI Content Safeguards (Strict Ground-Truth Verification)
To prevent hallucinations and protect search engine trust:
- **Zero Unverified Claims Policy**: All AI-assisted drafting (via Gemini 2.5 Flash) is conditioned with verified database records (spot names, localities, ratings, review counts, price tiers, and tags).
- **Graceful Fallback**: When external LLM APIs are offline or unconfigured, the system uses deterministic rule-based template generators with verified DB metrics.

---

## 5. Structured Data & Rich Snippets (Schema.org)
Every page injects standardized JSON-LD graph objects:
- **`Place` / `LocalBusiness`**: Coordinates, address, locality, postal code, phone, and rating values.
- **`BreadcrumbList`**: Full hierarchical path (`Home > Delhi Localities > LocalityName`).
- **`FAQPage`**: Question and Answer entities for rich accordion snippets on Google SERPs.
- **`ItemList`**: Ranked Top 10 entities with position, item name, and target URL.

---

## 6. Dynamic XML Sitemap & Crawl Directives
- **Endpoint**: `/sitemap.xml` dynamically generated via `SitemapService.generateSitemapXml()`.
- **Included Routes**:
  - High-priority static pages (priority 1.0 - 0.9)
  - Curated SEO intent guides (`/best-*`, priority 0.95)
  - Locality hubs (`/location/:slug`, priority 0.80)
  - Category hubs (`/category/:slug`, `/delhi/:slug`, priority 0.80)
  - Editorial articles (`/articles/:slug`, priority 0.85)
  - Verified business profiles (`/business/:slug`, priority 0.75)
- **Robots.txt Directives** (`/robots.txt`):
  - Allows search engines across all public exploration routes.
  - Disallows private admin panels, user settings, and internal dashboards.

---

## 7. Organic Analytics & Conversion Telemetry
- **Landing Hits Tracking**: Logs organic search visits, keyword queries, device types, and referrers.
- **Conversion Tracking**: Tracks high-intent user conversions originating from organic search:
  - Direction requests (`direction_click`)
  - Phone calls (`phone_click`)
  - Official website clicks (`website_click`)
  - Lead inquiries & booking actions
- **Admin Dashboard**: Real-time performance overview showing total organic landings, conversion counts, conversion rates, and top-ranking search slugs.
