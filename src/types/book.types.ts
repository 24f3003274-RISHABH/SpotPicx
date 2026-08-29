export interface IAuthorSource {
  name: string;
  url: string;
}

export interface IAuthor {
  _id?: string;
  name: string;
  slug: string;
  alternateNames?: string[];
  biography: string;
  shortBiography: string;
  nationality: string;
  country: string;
  isIndian: boolean;
  birthYear?: number;
  deathYear?: number;
  profession: string[];
  fields: string[];
  notableWorks: string[];
  portrait: string;
  coverImage?: string;
  officialWebsite?: string;
  wikipediaUrl?: string;
  sources: IAuthorSource[];
  featured: boolean;
  popular: boolean;
  bookCount: number;
  status: 'ACTIVE' | 'ARCHIVED';
  createdAt?: string;
  updatedAt?: string;
}

export interface ILegitimateLink {
  label: string;
  url: string;
  storeOrPlatform?: string;
  type?: 'PURCHASE' | 'LIBRARY' | 'OFFICIAL' | 'DIGITAL' | 'PUBLIC_DOMAIN';
}

export interface IBook {
  _id?: string;
  title: string;
  subtitle?: string;
  slug: string;
  alternateTitles?: string[];
  authors: string[];
  primaryAuthor: string;
  description: string;
  shortDescription: string;
  summary?: string;
  keyIdeas: string[];
  whyRead: string;
  importance?: string;
  whoShouldRead: string[];
  whoShouldNotRead?: string[];
  bestFor: string[];
  readingLevel: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'ALL_LEVELS';
  prerequisites: string[];
  estimatedReadingTime: string;
  pageCount?: number;
  originalPublicationDate?: string;
  publicationYear: number;
  publisher: string;
  countryOfOrigin: string;
  language: string;
  originalLanguage?: string;
  latestKnownEdition?: string;
  latestEditionYear?: number;
  editionPublisher?: string;
  editionVerified: boolean;
  isbn10?: string;
  isbn13?: string;
  format: string[];
  category: string;
  subcategory?: string;
  subjects: string[];
  topics: string[];
  genres: string[];
  tags: string[];
  bookTypes: string[];
  readingPurposes: string[];
  careers: string[];
  goals: string[];
  country: string;
  region?: string;
  IndianState?: string;
  isIndianAuthor: boolean;
  isIndianPublication: boolean;
  featured: boolean;
  editorPick: boolean;
  recommended: boolean;
  trending: boolean;
  popularityScore: number;
  viewCount?: number;
  coverImage: string;
  officialWebsite?: string;
  publisherUrl?: string;
  libraryUrl?: string;
  legitimatePurchaseLinks: Array<{ label: string; url: string; storeOrPlatform: string }>;
  legitimateDigitalLinks: ILegitimateLink[];
  isPublicDomain: boolean;
  publicDomainSourceUrl?: string;
  source: string;
  sourceType: string;
  lastVerified: string;
  freshnessStatus: string;
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string[];
  status: 'PUBLISHED' | 'DRAFT' | 'ARCHIVED';
  createdAt?: string;
  updatedAt?: string;
}

export interface BookCategoryDefinition {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  color: string;
  subcategories: Array<{
    name: string;
    slug: string;
    description?: string;
    topics: string[];
  }>;
}

export interface ReadingPathDefinition {
  id: string;
  title: string;
  slug: string;
  description: string;
  targetAudience: string;
  difficulty: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'COMPREHENSIVE';
  estimatedDuration: string;
  steps: Array<{
    order: number;
    title: string;
    description: string;
    recommendedBookSlugs: string[];
    keyTakeaway: string;
  }>;
}

export interface EditorialCollectionDefinition {
  id: string;
  title: string;
  slug: string;
  subtitle: string;
  description: string;
  badge: string;
  bookSlugs: string[];
  categorySlug?: string;
  readingLevel?: string;
}
