# SpotPicks — Phase 21: India-Wide Scalability Architecture

## Overview
Phase 21 expands SpotPicks from a single-city production directory (focused on Delhi NCR) into a multi-tier, database-driven geographic platform architected for nationwide expansion across India.

> **Key Rule**: Production focus remains **Delhi NCR** with fully indexed, verified spots. Expansion states (Maharashtra, Karnataka, Tamil Nadu, Telangana, West Bengal, Gujarat, etc.) are structured cleanly in the schema without generating hallucinated or fake business listings.

---

## 1. 6-Level Geographic Hierarchy

Every location node in SpotPicks adheres to the standardized 6-level taxonomy:

```
Level 1: Country        (e.g., India)
Level 2: State          (e.g., Maharashtra, Karnataka, Delhi, Tamil Nadu)
Level 3: District       (e.g., South Delhi, Mumbai Suburban, Bangalore Urban)
Level 4: City           (e.g., Mumbai, Bangalore, Pune, Kolkata, Hyderabad, Chennai)
Level 5: Locality       (e.g., Bandra, Koramangala, Connaught Place, Hauz Khas)
Level 6: Neighborhood   (e.g., Pali Hill, Sony Signal, HKV, Outer Circle)
```

### Schema Attributes:
- `name`: Human-readable name (e.g., "Maharashtra", "Mumbai", "Bandra")
- `slug`: URL-safe unique slug (e.g., "maharashtra", "mumbai", "bandra")
- `type`: `COUNTRY` | `STATE` | `DISTRICT` | `CITY` | `LOCALITY` | `NEIGHBORHOOD`
- `status`:
  - `ACTIVE`: Fully launched with verified local businesses (e.g., Delhi NCR)
  - `COMING_SOON`: Architectural expansion wave node with waitlist and scout enrollment
  - `BETA`: Invite-only scout validation in progress
  - `INACTIVE`: Temporarily paused or deprecated
- `readinessScore`: Progress integer from 0 to 100 representing mapping & verification maturity
- `waitlistCount`: User demand and scout registration count
- `stateSlug`, `citySlug`, `district`: Parent relational slugs for zero-query hierarchy resolution

---

## 2. Configured Target States & Initial Municipal Hubs

The database and backend services are configured with 14 foundational states and union territories:

1. **Delhi (NCT)**: `ACTIVE` — Live production focus with 50+ verified spots and 12+ locality hubs.
2. **Maharashtra**: `COMING_SOON` — Cities: Mumbai, Pune, Nagpur. Localities: Bandra, Powai, South Mumbai, Koregaon Park.
3. **Karnataka**: `COMING_SOON` — Cities: Bangalore, Mysore. Localities: Koramangala, Indiranagar, HSR Layout.
4. **Tamil Nadu**: `COMING_SOON` — Cities: Chennai, Coimbatore. Localities: Anna Nagar, T. Nagar.
5. **Telangana**: `COMING_SOON` — Cities: Hyderabad. Localities: Hitec City, Jubilee Hills, Gachibowli.
6. **West Bengal**: `COMING_SOON` — Cities: Kolkata. Localities: Park Street, Salt Lake.
7. **Uttar Pradesh**: `COMING_SOON` — Cities: Noida, Lucknow, Varanasi.
8. **Gujarat**: `COMING_SOON` — Cities: Ahmedabad, Surat.
9. **Rajasthan**: `COMING_SOON` — Cities: Jaipur, Udaipur.
10. **Kerala**: `COMING_SOON` — Cities: Kochi, Thiruvananthapuram.
11. **Punjab**: `COMING_SOON` — Cities: Chandigarh, Amritsar.
12. **Haryana**: `COMING_SOON` — Cities: Gurgaon (Gurugram), Faridabad.
13. **Bihar**: `COMING_SOON` — Cities: Patna.
14. **Madhya Pradesh**: `COMING_SOON` — Cities: Indore, Bhopal.

---

## 3. Database-Driven Routing Strategy

Dynamic client-side and server-side routes avoid hardcoded components:

- `/india` — High-level India directory with state cards, rollout roadmap, and nationwide intent search.
- `/india/:stateSlug` — Dynamic state overview page displaying child cities, municipal statistics, and expansion readiness.
- `/india/:stateSlug/:citySlug` — Dynamic city discovery page:
  - If `ACTIVE`: Full verified spot listings, filters, and locality grids.
  - If `COMING_SOON`: Launch countdown, early-access waitlist signup, and community scout nomination engine.
- `/location/:slug` — Deep locality page (e.g., `/location/connaught-place`, `/location/bandra`).
- `/delhi` and `/city/:citySlug` — Backward-compatible hub routes.

---

## 4. Search Intent Engine Across India

The `QueryParserService` dynamically loads geographic nodes from the database / seed service to parse cross-India search queries without requiring manual keyword rule definitions:

Supported search intents:
- `Best cafes in Mumbai` &rarr; Intent: `food-dining`, Locality/City: `Mumbai`, State: `Maharashtra`
- `Best restaurants in Bangalore` &rarr; Intent: `food-dining`, Locality/City: `Bangalore`, State: `Karnataka`
- `PG near IIT Bombay` &rarr; Intent: `stays-living`, College/Locality: `IIT Bombay / Powai`, City: `Mumbai`
- `Best street food in Kolkata` &rarr; Intent: `food-dining`, Locality/City: `Kolkata`, State: `West Bengal`

---

## 5. Administration & Governance

Admins can manage geographic hierarchy nodes directly from the Admin Control Center (`/admin/locations`):
- Filter hierarchy nodes by level (`STATE`, `DISTRICT`, `CITY`, `LOCALITY`, `NEIGHBORHOOD`)
- Toggle node status (`ACTIVE`, `COMING_SOON`, `BETA`, `INACTIVE`)
- Track waitlist registrations and adjust `readinessScore`
- Create new territorial nodes without code deployments
