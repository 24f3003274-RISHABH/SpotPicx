export type GuideMethodologyType =
  | "Editor's selection"
  | 'Popular choices'
  | 'Recommended places'
  | 'Historical & cultural significance'
  | 'Footfall & heritage registry index';

export type GuideCategory =
  | 'Sightseeing & Attractions'
  | 'Heritage & History'
  | 'Spiritual & Religious'
  | 'Cafes & Food'
  | 'Student & Budget Friendly'
  | 'Hidden Gems & Offbeat'
  | 'Weekend Getaways'
  | 'Museums & Culture'
  | 'Shopping & Markets'
  | 'Nature & Wildlife';

export interface GuideImportantInfo {
  timings?: string;
  entryFee?: string;
  nearestMetroOrTransit?: string;
  bestTimeToVisit?: string;
  recommendedDuration?: string;
  photographyRules?: string;
  accessibility?: string;
  officialBookingOrWebsite?: string;
}

export interface GuideSource {
  title: string;
  publisher: string;
  url?: string;
  accessDate?: string;
  verificationNote?: string;
}

export interface GuideFaq {
  question: string;
  answer: string;
}

export interface Top10GuideItem {
  id: string;
  rank: number; // 1 to 10
  name: string;
  category: string;
  selectionReason: string; // "Why this was selected"
  factualDescription: string; // Factual, non-hallucinated description
  location: string; // Specific address / locality / city / district
  state?: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
  image?: string;
  importantInfo?: GuideImportantInfo;
  highlights?: string[];
  internalLink?: {
    label: string;
    url: string;
  };
  source?: GuideSource;
}

export interface Top10Guide {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  category: GuideCategory;
  location: string; // e.g. "Delhi", "Dehradun", "Uttarakhand", "Uttar Pradesh", "Rajasthan", "India"
  state?: string;
  country: string;
  heroImage: string;
  badgeText: string; // e.g. "Editor's Selection • Factual Index"
  methodologyType: GuideMethodologyType;
  selectionMethodology: string; // Transparent explanation of how places were picked
  introduction: string; // Rich editorial overview
  editorialNotes: string; // Practical tips, safety, transit caveats
  items: Top10GuideItem[]; // Exactly 10 (or up to 10 verified items)
  faq: GuideFaq[];
  sources: GuideSource[];
  seo: {
    metaTitle: string;
    metaDescription: string;
    canonicalUrl: string;
    keywords: string[];
  };
  isPublished: boolean;
  isFeatured: boolean;
  publishedDate: string; // ISO or YYYY-MM-DD
  lastReviewedDate: string; // ISO or YYYY-MM-DD
  author: {
    name: string;
    role: string;
    avatar?: string;
  };
  relatedGuideSlugs?: string[];
  relatedCategorySlugs?: string[];
  viewCount?: number;
}

export type FreshnessStatus = 'FRESH' | 'UP_TO_DATE' | 'REVIEW_DUE';

export interface FreshnessInfo {
  status: FreshnessStatus;
  daysSinceReview: number;
  label: string;
  badgeClass: string;
  isStale: boolean;
}
