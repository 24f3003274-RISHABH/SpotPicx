export interface PlanFeature {
  name: string;
  included: boolean;
  limit?: string | number;
  highlight?: boolean;
}
// Ok this is the file , where we can set the business plan , for earning the subscription based money from the type of the user 

export interface BusinessPlan {
  id: 'FREE' | 'BASIC' | 'PREMIUM' | 'ENTERPRISE';
  name: string;
  tagline: string;
  popular?: boolean;
  badgeText?: string;
  pricing: {
    monthly: {
      amount: number;
      currency: 'INR' | 'USD';
      displayPrice: string;
      period: string;
    };
    annual: {
      amount: number;
      currency: 'INR' | 'USD';
      displayPrice: string;
      period: string;
      savingsPercent: number;
    };
  };


  // whatevr features of the plan should be there it is mentioned here 

  features: PlanFeature[];
  limits: {
    activeOffers: number;
    photosUpload: number;
    leadTrackingHistoryDays: number;
    supportLevel: 'COMMUNITY' | 'EMAIL' | 'PRIORITY' | 'DEDICATED_MANAGER';
    aiConciergeCitations: boolean;
    sponsoredRotationCredits: number;
    verifiedBadge: boolean;
    whatsappDirectLead: boolean;
    customerPhoneAccess: boolean;
  };
}

export const BUSINESS_PLANS_CONFIG: Record<'FREE' | 'BASIC' | 'PREMIUM' | 'ENTERPRISE', BusinessPlan> = {
  FREE: {
    id: 'FREE',
    name: 'Free Starter',
    tagline: 'Essential local presence for Delhi NCR merchants',
    pricing: {
      monthly: {
        amount: 0,
        currency: 'INR',
        displayPrice: '₹0',
        period: '/month',
      },
      annual: {
        amount: 0,
        currency: 'INR',
        displayPrice: '₹0',
        period: '/year',
        savingsPercent: 0,
      },
    },
    features: [
      { name: 'Standard Search Listing', included: true },
      { name: 'Basic Business Profile & Hours', included: true },
      { name: 'Up to 5 Photos in Gallery', included: true },
      { name: '1 Active Promotional Offer', included: true },
      { name: 'Basic Profile View Counts', included: true },
      { name: 'Verified Merchant Blue Tick', included: false },
      { name: 'Direct WhatsApp Contact Button', included: false },
      { name: 'Lead Inquiries & Customer Phone CRM', included: false },
      { name: 'Sponsored / Featured Placement', included: false },
      { name: 'AI Concierge Recommendation Boost', included: false },
    ],
    limits: {
      activeOffers: 1,
      photosUpload: 5,
      leadTrackingHistoryDays: 7,
      supportLevel: 'COMMUNITY',
      aiConciergeCitations: false,
      sponsoredRotationCredits: 0,
      verifiedBadge: false,
      whatsappDirectLead: false,
      customerPhoneAccess: false,
    },
  },
  BASIC: {
    id: 'BASIC',
    name: 'Growth Basic',
    tagline: 'Boost discovery, trust badge & direct customer calls',
    pricing: {
      monthly: {
        amount: 999,
        currency: 'INR',
        displayPrice: '₹999',
        period: '/month',
      },
      annual: {
        amount: 9990,
        currency: 'INR',
        displayPrice: '₹832',
        period: '/month (billed annually)',
        savingsPercent: 17,
      },
    },
    features: [
      { name: 'Standard Search Listing', included: true },
      { name: 'Verified Merchant Trust Badge', included: true, highlight: true },
      { name: 'Direct WhatsApp & Call Lead Button', included: true, highlight: true },
      { name: 'Up to 20 Photos in Gallery', included: true },
      { name: '5 Active Deals & Promo Coupons', included: true },
      { name: '30-Day Lead & Click Analytics', included: true },
      { name: 'Priority Search Rank Boost (+15%)', included: true },
      { name: 'Customer Phone & Inquiry CRM', included: false },
      { name: 'Sponsored Category Banner Rotation', included: false },
      { name: 'AI Concierge Top Citation', included: false },
    ],
    limits: {
      activeOffers: 5,
      photosUpload: 20,
      leadTrackingHistoryDays: 30,
      supportLevel: 'EMAIL',
      aiConciergeCitations: false,
      sponsoredRotationCredits: 0,
      verifiedBadge: true,
      whatsappDirectLead: true,
      customerPhoneAccess: false,
    },
  },
  PREMIUM: {
    id: 'PREMIUM',
    name: 'Featured Premium',
    tagline: 'Maximum visibility, lead capture & featured spotlight',
    popular: true,
    badgeText: 'MOST POPULAR',
    pricing: {
      monthly: {
        amount: 2499,
        currency: 'INR',
        displayPrice: '₹2,499',
        period: '/month',
      },
      annual: {
        amount: 24990,
        currency: 'INR',
        displayPrice: '₹2,082',
        period: '/month (billed annually)',
        savingsPercent: 20,
      },
    },
    features: [
      { name: 'All Basic Features Included', included: true },
      { name: 'Featured Spot Gold Badge', included: true, highlight: true },
      { name: 'Homepage & Category Sponsored Rotation', included: true, highlight: true },
      { name: 'Full Lead CRM with Customer Phone & Name', included: true, highlight: true },
      { name: 'AI Concierge Priority Place Citation', included: true, highlight: true },
      { name: 'Unlimited Promo Offers & Deals', included: true },
      { name: 'Unlimited High-Res Gallery Photos', included: true },
      { name: '90-Day Deep Trend & Conversion Analytics', included: true },
      { name: 'Priority 24/7 Email & Chat Support', included: true },
      { name: 'Sponsored Collection Partnership', included: false },
    ],
    limits: {
      activeOffers: 999,
      photosUpload: 100,
      leadTrackingHistoryDays: 90,
      supportLevel: 'PRIORITY',
      aiConciergeCitations: true,
      sponsoredRotationCredits: 500,
      verifiedBadge: true,
      whatsappDirectLead: true,
      customerPhoneAccess: true,
    },
  },
  ENTERPRISE: {
    id: 'ENTERPRISE',
    name: 'Brand Enterprise',
    tagline: 'Multi-outlet dominance, sponsored collections & custom campaigns',
    badgeText: 'ELITE PARTNER',
    pricing: {
      monthly: {
        amount: 6999,
        currency: 'INR',
        displayPrice: '₹6,999',
        period: '/month',
      },
      annual: {
        amount: 69990,
        currency: 'INR',
        displayPrice: '₹5,832',
        period: '/month (billed annually)',
        savingsPercent: 20,
      },
    },
    features: [
      { name: 'All Premium Features Included', included: true },
      { name: 'Top-of-Category Pinned Sponsored Placement', included: true, highlight: true },
      { name: 'Exclusive Sponsored Collection Branding', included: true, highlight: true },
      { name: 'Multi-Outlet & Franchise Account Management', included: true, highlight: true },
      { name: 'Custom Ad Banner Placements (10,000 imp/mo)', included: true },
      { name: 'Full Data Export & Custom Webhook Leads', included: true },
      { name: 'Dedicated Delhi NCR Account Manager', included: true, highlight: true },
      { name: 'Zero Third-Party Ad Placement on Your Page', included: true },
      { name: '365-Day Historical Analytics Retention', included: true },
    ],
    limits: {
      activeOffers: 999,
      photosUpload: 500,
      leadTrackingHistoryDays: 365,
      supportLevel: 'DEDICATED_MANAGER',
      aiConciergeCitations: true,
      sponsoredRotationCredits: 2500,
      verifiedBadge: true,
      whatsappDirectLead: true,
      customerPhoneAccess: true,
    },
  },
};

export const PROMOTION_PACKAGES_CONFIG = [
  {
    id: 'promo_featured_spot_7d',
    type: 'FEATURED_BUSINESS',
    name: '7-Day Featured Business Spotlight',
    price: 1499,
    currency: 'INR',
    durationDays: 7,
    description: 'Guaranteed top 3 rotation in your locality and primary category feed.',
    placement: 'CATEGORY_TOP',
  },
  {
    id: 'promo_sponsored_listing_14d',
    type: 'SPONSORED_LISTING',
    name: '14-Day Sponsored Search Listing',
    price: 2499,
    currency: 'INR',
    durationDays: 14,
    description: 'Promoted highlight badge on search result queries matching your tags.',
    placement: 'SEARCH_TOP',
  },
  {
    id: 'promo_category_takeover_30d',
    type: 'PROMOTED_CATEGORY',
    name: '30-Day Category Header Sponsor',
    price: 4999,
    currency: 'INR',
    durationDays: 30,
    description: 'Exclusive banner header and curated top spot on category landing pages.',
    placement: 'CATEGORY_HEADER',
  },
  {
    id: 'promo_event_boost_7d',
    type: 'PROMOTED_EVENT',
    name: '7-Day City Event Boost',
    price: 1299,
    currency: 'INR',
    durationDays: 7,
    description: 'Top placement in Weekend Agenda & Tonight feeds with instant push notifications.',
    placement: 'EVENTS_HEADER',
  },
  {
    id: 'promo_collection_sponsor_30d',
    type: 'SPONSORED_COLLECTION',
    name: '30-Day Curated Collection Sponsor',
    price: 3999,
    currency: 'INR',
    durationDays: 30,
    description: '"Presented by [Your Brand]" custom themed city guide (e.g. Best Rooftops).',
    placement: 'COLLECTION_SPONSOR',
  },
];
