export const ROUTES = {
  HOME: '/',
  EXPLORE: '/explore',
  CATEGORIES: '/categories',
  CATEGORY_DETAILS: '/category/:slug',
  LOCATIONS: '/locations',
  LOCATION_DETAILS: '/location/:slug',
  BUSINESSES: '/businesses',
  BUSINESS_DETAILS: '/business/:slug',
  SPOT_DETAILS: '/spot/:slug',
  SEARCH: '/search',
  LOGIN: '/login',
  REGISTER: '/register',
  PROFILE: '/profile',
  SAVED: '/saved',
  COLLECTIONS: '/collections',
  COLLECTION_DETAILS: '/collections/:id',
  ARTICLES: '/articles',
  ARTICLE_DETAILS: '/articles/:slug',

  // Phase 10 & 19: Events, Offers, Jobs, Specialized Discovery & Monetization
  EVENTS: '/events',
  EVENT_DETAILS: '/events/:slug',
  OFFERS: '/offers',
  STUDENTS: '/students',
  STUDENT_OPPORTUNITIES: '/student-opportunities',
  HOUSING: '/housing',
  JOBS: '/jobs',
  SPECIAL_DISCOVERY: '/discover',
  PRICING: '/pricing',

  // Phase 21: India-wide Scalability Routes
  INDIA: '/india',
  INDIA_STATE: '/india/:stateSlug',
  INDIA_CITY: '/india/:stateSlug/:citySlug',

  // Spiritual India Nationwide Discovery Directory
  SPIRITUAL_HUB: '/india/spiritual',
  SPIRITUAL_STATE: '/india/spiritual/:stateSlug',
  SPIRITUAL_PLACE: '/india/spiritual/place/:placeSlug',
  SPIRITUAL_GUIDE: '/india/spiritual/guide/:guideSlug',
  SPIRITUAL_TRADITION: '/india/spiritual/tradition/:traditionSlug',

  // Delhi Heritage & History Specialized Discovery Hub
  DELHI_HERITAGE: '/delhi/heritage',
  DELHI_HERITAGE_CATEGORY: '/delhi/heritage/category/:categorySlug',
  DELHI_HERITAGE_PLACE: '/delhi/heritage/place/:placeSlug',
  DELHI_HERITAGE_GUIDE: '/delhi/heritage/guide/:guideSlug',

  // Top 10 Guides Content Engine
  GUIDES: '/guides',
  GUIDE_DETAILS: '/guides/:slug',

  // Book Discovery, Author & Knowledge Hub Platform
  BOOKS: '/books',
  BOOK_DETAILS: '/books/:slug',
  BOOK_AUTHORS: '/books/authors',
  BOOK_AUTHOR_DETAILS: '/books/authors/:slug',
  BOOK_CATEGORIES: '/books/categories',
  BOOK_CATEGORY_DETAILS: '/books/category/:slug',
  BOOK_READING_PATHS: '/books/paths',
  BOOK_READING_PATH_DETAILS: '/books/paths/:slug',
  BOOK_COLLECTIONS: '/books/collections',
  BOOK_COLLECTION_DETAILS: '/books/collections/:slug',
  BOOK_COMPARE: '/books/compare',

  // Business Owner Dashboard Routes
  BUSINESS_DASHBOARD: '/business/dashboard',
  BUSINESS_LISTINGS: '/business/businesses',
  BUSINESS_CREATE: '/business/businesses/new',
  BUSINESS_EDIT: '/business/businesses/:id/edit',
  BUSINESS_LEADS: '/business/leads',
  BUSINESS_SUBSCRIPTION: '/business/subscription',
  BUSINESS_REVIEWS: '/business/reviews',
  BUSINESS_OFFERS: '/business/offers',
  BUSINESS_ANALYTICS: '/business/analytics',

  // Admin Dashboard Routes
  ADMIN: '/admin',
  ADMIN_ANALYTICS: '/admin/analytics',
  ADMIN_REVENUE: '/admin/revenue',
  ADMIN_USERS: '/admin/users',
  ADMIN_BUSINESSES: '/admin/businesses',
  ADMIN_CATEGORIES: '/admin/categories',
  ADMIN_LOCATIONS: '/admin/locations',
  ADMIN_CLAIMS: '/admin/claims',
  ADMIN_REVIEWS: '/admin/reviews',
  ADMIN_REPORTS: '/admin/reports',
  ADMIN_EVENTS: '/admin/events',
  ADMIN_OFFERS: '/admin/offers',
  ADMIN_ARTICLES: '/admin/articles',
  ADMIN_OPPORTUNITIES: '/admin/opportunities',
  ADMIN_SEO_PAGES: '/admin/seo-pages',
  ADMIN_GUIDES: '/admin/guides',
  ADMIN_BOOKS: '/admin/books',
  ADMIN_AUTHORS: '/admin/authors',
  ADMIN_DATA_SOURCES: '/admin/sources',

  NOT_FOUND: '*',
} as const;

