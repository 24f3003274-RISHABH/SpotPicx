export interface BricsMember {
  _id?: string;
  name: string;
  officialName: string;
  slug: string;
  capital: string;
  region: string;
  isoCode: string;
  flagEmoji: string;
  flagUrl: string;
  joinedYear: number;
  membershipType: 'founding' | 'expanded_2011' | 'expanded_2024' | 'expanded_2025';
  status: 'full_member' | 'partner_country';
  description: string;
  bricsRole: string;
  economicProfile: {
    population?: string;
    gdpNominal?: string;
    currency?: string;
    keyExports?: string[];
    gdpPppShare?: string;
  };
  presidenciesHeld: number[];
  officialSourceUrl: string;
  sourceName: string;
  displayOrder: number;
}

export interface BricsSummit {
  _id?: string;
  summitNumber: number;
  year: number;
  hostCountry: string;
  hostCity: string;
  presidencyCountry: string;
  dates: string;
  status: 'completed' | 'scheduled';
  officialName: string;
  theme: string;
  declarationName: string;
  declarationUrl: string;
  summary: string;
  majorThemes: string[];
  keyOutcomes: string[];
  sourceUrls: Array<{ title: string; url: string }>;
}

export interface BricsPresidency {
  _id?: string;
  year: number;
  presidencyCountry: string;
  summitHost: string;
  theme: string;
  importantInitiatives: string[];
  globalContext: string;
  status: 'completed' | 'current' | 'upcoming';
  officialSource: { title: string; url: string };
}

export interface BricsFact {
  _id?: string;
  key: string;
  label: string;
  value: string;
  description: string;
  category: 'governance' | 'economy' | 'membership' | 'institutions' | 'summit_2026' | 'general';
  sourceName: string;
  sourceUrl: string;
  verifiedAt: string;
  displayOrder: number;
  featured: boolean;
}

export interface BricsInstitution {
  _id?: string;
  slug: string;
  name: string;
  acronym: string;
  yearEstablished: number;
  establishmentSummit: string;
  headquarters: string;
  purpose: string;
  keyFunctions: string[];
  significance: string;
  capitalStructure?: string;
  isIndependentLegalEntity: boolean;
  officialSourceUrl: string;
  sourceName: string;
  displayOrder: number;
}

export interface BricsFaq {
  _id?: string;
  slug: string;
  question: string;
  answer: string;
  category: string;
  displayOrder: number;
  sourceName: string;
  sourceUrl: string;
}

export interface BricsSource {
  _id?: string;
  sourceName: string;
  sourceUrl: string;
  sourceType: string;
  description: string;
  publishedDate?: string;
  accessedDate: string;
  isPrimary: boolean;
  displayOrder: number;
}

export interface BricsHubPayload {
  meta: {
    title: string;
    presidencyYear: number;
    presidencyCountry: string;
    officialTheme: string;
    summitDates: string;
    summitLocation: string;
    officialPortalUrl: string;
    memberCount: number;
    partnerCount: number;
    lastVerified: string;
  };
  pillars: Array<{
    letter: string;
    title: string;
    tagline: string;
    description: string;
    focusAreas: string[];
  }>;
  members: BricsMember[];
  partnerCountries: Array<{
    name: string;
    region: string;
    iso: string;
  }>;
  summits: BricsSummit[];
  presidencies: BricsPresidency[];
  facts: BricsFact[];
  institutions: BricsInstitution[];
  faqs: BricsFaq[];
  sources: BricsSource[];
  didYouKnow: Array<{
    id: string;
    title: string;
    fact: string;
    source: string;
  }>;
  indiaRole: {
    presidenciesHeld: number[];
    foundingContributions: string[];
    theme2026: string;
  };
  articleSlug: string;
}
