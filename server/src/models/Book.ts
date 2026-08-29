import mongoose, { Document, Schema, Model } from 'mongoose';

export type BookReadingLevel = 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'ALL_LEVELS';
export type BookSourceType = 'PUBLISHER' | 'OFFICIAL' | 'LIBRARY' | 'ISBN_DATABASE' | 'MANUAL' | 'EDITORIAL' | 'PUBLIC_DOMAIN';
export type BookStatus = 'PUBLISHED' | 'DRAFT' | 'ARCHIVED';

export interface ILegitimateLink {
  label: string;
  url: string;
  storeOrPlatform?: string;
  type?: 'PURCHASE' | 'LIBRARY' | 'OFFICIAL' | 'DIGITAL' | 'PUBLIC_DOMAIN';
}

export interface IBookEdition {
  editionNumber?: string;
  editionName?: string;
  publicationYear?: number;
  publisher?: string;
  isVerified: boolean;
  notes?: string;
}

export interface IBook extends Document {
  // Identification
  title: string;
  subtitle?: string;
  slug: string;
  alternateTitles?: string[];
  
  // Authors
  authors: string[];
  primaryAuthor: string;
  authorIds: mongoose.Types.ObjectId[];

  // Information & Editorial Guide
  description: string;
  shortDescription: string;
  summary?: string;
  keyIdeas: string[];
  whyRead: string;
  importance?: string;
  whoShouldRead: string[];
  whoShouldNotRead?: string[];
  bestFor: string[];
  readingLevel: BookReadingLevel;
  prerequisites: string[];
  estimatedReadingTime: string;
  pageCount?: number;

  // Publication Details
  originalPublicationDate?: Date;
  publicationYear: number;
  publisher: string;
  countryOfOrigin: string;
  language: string;
  originalLanguage?: string;

  // Edition Details
  latestKnownEdition?: string;
  latestEditionYear?: number;
  editionPublisher?: string;
  editionVerified: boolean;
  isbn10?: string;
  isbn13?: string;
  format: string[];

  // Taxonomy & Classification
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

  // Cultural & Geographical
  country: string;
  region?: string;
  IndianState?: string;
  isIndianAuthor: boolean;
  isIndianPublication: boolean;

  // Discovery & Editorial Status
  featured: boolean;
  editorPick: boolean;
  recommended: boolean;
  trending: boolean;
  popularityScore: number;
  viewCount: number;
  savesCount: number;

  // Media
  coverImage: string;
  thumbnail?: string;
  gallery?: string[];

  // Links & Verification
  officialWebsite?: string;
  publisherUrl?: string;
  libraryUrl?: string;
  legitimatePurchaseLinks: ILegitimateLink[];
  legitimateDigitalLinks: ILegitimateLink[];
  isPublicDomain: boolean;
  publicDomainSourceUrl?: string;

  // Sourcing & Integrity
  source: string;
  sourceUrl?: string;
  sourceType: BookSourceType;
  lastVerified: Date;
  freshnessStatus: string;

  // SEO & Meta
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string[];

  // System
  status: BookStatus;
  createdAt: Date;
  updatedAt: Date;
}

const LegitimateLinkSchema = new Schema<ILegitimateLink>(
  {
    label: { type: String, required: true },
    url: { type: String, required: true },
    storeOrPlatform: { type: String },
    type: {
      type: String,
      enum: ['PURCHASE', 'LIBRARY', 'OFFICIAL', 'DIGITAL', 'PUBLIC_DOMAIN'],
      default: 'PURCHASE',
    },
  },
  { _id: false }
);

const BookSchema = new Schema<IBook>(
  {
    title: { type: String, required: true, trim: true, index: true },
    subtitle: { type: String, trim: true },
    slug: { type: String, required: true, unique: true, trim: true, lowercase: true, index: true },
    alternateTitles: [{ type: String, trim: true }],

    authors: [{ type: String, required: true, trim: true, index: true }],
    primaryAuthor: { type: String, required: true, trim: true, index: true },
    authorIds: [{ type: Schema.Types.ObjectId, ref: 'Author', index: true }],

    description: { type: String, required: true },
    shortDescription: { type: String, required: true },
    summary: { type: String },
    keyIdeas: [{ type: String }],
    whyRead: { type: String, required: true },
    importance: { type: String },
    whoShouldRead: [{ type: String }],
    whoShouldNotRead: [{ type: String }],
    bestFor: [{ type: String }],
    readingLevel: {
      type: String,
      enum: ['BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'ALL_LEVELS'],
      default: 'ALL_LEVELS',
      index: true,
    },
    prerequisites: [{ type: String }],
    estimatedReadingTime: { type: String, default: '6-8 hours' },
    pageCount: { type: Number },

    originalPublicationDate: { type: Date },
    publicationYear: { type: Number, required: true, index: true },
    publisher: { type: String, required: true, trim: true },
    countryOfOrigin: { type: String, required: true, index: true },
    language: { type: String, required: true, default: 'English', index: true },
    originalLanguage: { type: String },

    latestKnownEdition: { type: String },
    latestEditionYear: { type: Number },
    editionPublisher: { type: String },
    editionVerified: { type: Boolean, default: false },
    isbn10: { type: String, trim: true },
    isbn13: { type: String, trim: true },
    format: [{ type: String, default: ['Paperback', 'Ebook'] }],

    category: { type: String, required: true, index: true },
    subcategory: { type: String, index: true },
    subjects: [{ type: String, index: true }],
    topics: [{ type: String, index: true }],
    genres: [{ type: String, index: true }],
    tags: [{ type: String, index: true }],
    bookTypes: [{ type: String, index: true }],
    readingPurposes: [{ type: String, index: true }],
    careers: [{ type: String, index: true }],
    goals: [{ type: String, index: true }],

    country: { type: String, required: true, default: 'International', index: true },
    region: { type: String },
    IndianState: { type: String },
    isIndianAuthor: { type: Boolean, default: false, index: true },
    isIndianPublication: { type: Boolean, default: false, index: true },

    featured: { type: Boolean, default: false, index: true },
    editorPick: { type: Boolean, default: false, index: true },
    recommended: { type: Boolean, default: false, index: true },
    trending: { type: Boolean, default: false, index: true },
    popularityScore: { type: Number, default: 0, index: true },
    viewCount: { type: Number, default: 0 },
    savesCount: { type: Number, default: 0 },

    coverImage: { type: String, required: true },
    thumbnail: { type: String },
    gallery: [{ type: String }],

    officialWebsite: { type: String },
    publisherUrl: { type: String },
    libraryUrl: { type: String },
    legitimatePurchaseLinks: [LegitimateLinkSchema],
    legitimateDigitalLinks: [LegitimateLinkSchema],
    isPublicDomain: { type: Boolean, default: false, index: true },
    publicDomainSourceUrl: { type: String },

    source: { type: String, default: 'SpotPicx Editorial Team' },
    sourceUrl: { type: String },
    sourceType: {
      type: String,
      enum: ['PUBLISHER', 'OFFICIAL', 'LIBRARY', 'ISBN_DATABASE', 'MANUAL', 'EDITORIAL', 'PUBLIC_DOMAIN'],
      default: 'EDITORIAL',
    },
    lastVerified: { type: Date, default: Date.now },
    freshnessStatus: { type: String, default: 'Verified Metadata' },

    seoTitle: { type: String },
    seoDescription: { type: String },
    seoKeywords: [{ type: String }],

    status: {
      type: String,
      enum: ['PUBLISHED', 'DRAFT', 'ARCHIVED'],
      default: 'PUBLISHED',
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// Search and Compound Indexes
BookSchema.index({
  title: 'text',
  subtitle: 'text',
  description: 'text',
  authors: 'text',
  topics: 'text',
  subjects: 'text',
  keyIdeas: 'text',
});

BookSchema.index({ category: 1, readingLevel: 1, popularityScore: -1 });
BookSchema.index({ isIndianAuthor: 1, category: 1 });
BookSchema.index({ publicationYear: -1, popularityScore: -1 });

export const Book: Model<IBook> = mongoose.models.Book || mongoose.model<IBook>('Book', BookSchema);
