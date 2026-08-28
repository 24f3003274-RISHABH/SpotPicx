import mongoose, { Document, Schema, Model } from 'mongoose';

export type PriceRange = 'BUDGET' | 'MODERATE' | 'PREMIUM' | 'LUXURY';
export type BusinessStatus = 'PUBLISHED' | 'ACTIVE' | 'DRAFT' | 'PENDING_REVIEW' | 'PENDING' | 'REJECTED' | 'ARCHIVED';
export type ClaimStatus = 'UNCLAIMED' | 'PENDING' | 'VERIFIED' | 'REJECTED';

export interface PlaceAccessibility {
  wheelchairAccessible: boolean;
  elevator?: boolean;
  groundFloor?: boolean;
  notes?: string;
}

export interface PlaceParking {
  available: boolean;
  type?: 'VALET' | 'STREET' | 'DEDICATED_LOT' | 'MALL_PARKING' | 'NONE';
  valet?: boolean;
  notes?: string;
}

export interface PlaceTransport {
  metroNearby?: string;
  metroLine?: string;
  walkingDistance?: string;
  busStop?: string;
  autoStand?: string;
}

export interface PlaceAISummary {
  whyVisit?: string;
  bestFor?: string;
  whatToExpect?: string;
  generatedAt?: Date;
}

export interface PlaceSourceRef {
  name: string;
  url?: string;
  verified: boolean;
  license?: string;
  note?: string;
}

export interface PlaceIntelligence {
  highlights?: string[];
  bestFor?: string[];
  popularItems?: string[];
  priceLevel?: string; // e.g. "₹₹" or "₹600 - ₹1,200 for two"
  ambience?: string[];
  amenities?: string[];
  goodFor?: string[];
  nearbyAttractions?: Array<{ name: string; distance: string; type?: string }>;
  recommendedDuration?: string;
  bestTimeToVisit?: string;
  accessibility?: PlaceAccessibility;
  parking?: PlaceParking;
  transport?: PlaceTransport;
  metroNearby?: string;
  aiSummary?: PlaceAISummary;
  sources?: PlaceSourceRef[];
}

export interface IBusinessGalleryItem {
  url: string;
  caption?: string;
  isHero?: boolean;
  sourceAttribution?: string;
}

export interface IBusiness extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  slug: string;
  description: string;
  shortDescription: string;
  category: mongoose.Types.ObjectId;
  categories: mongoose.Types.ObjectId[];
  location: {
    type: 'Point';
    coordinates: [number, number]; // [longitude, latitude]
  };
  address: string;
  locality: string;
  city: string;
  state: string;
  country: string;
  pincode: string;
  latitude: number;
  longitude: number;
  phone: string;
  email: string;
  website: string;
  // Image Pipeline (Phase 16)
  coverImage: string;
  thumbnail: string;
  gallery: IBusinessGalleryItem[] | string[];
  images: string[];
  logo: string;
  priceRange: PriceRange;
  rating: number;
  reviewCount: number;
  tags: string[];
  amenities: string[];
  features: string[];
  openingHours: Record<string, string>;
  verified: boolean;
  claimed: boolean;
  claimStatus: ClaimStatus;
  owner?: mongoose.Types.ObjectId | null;
  status: BusinessStatus;
  // Place Intelligence (Phase 16)
  placeIntelligence?: PlaceIntelligence;
  // Source Tracking & Freshness (Phase 15)
  source: string;
  sourceUrl: string;
  sourceType: 'API' | 'SCRAPER' | 'RSS' | 'WEB_SEARCH' | 'MANUAL' | 'DIRECT';
  lastUpdated: Date;
  lastVerified: Date;
  freshnessStatus: 'FRESH' | 'RECENT' | 'STALE' | 'EXPIRED';
  createdAt: Date;
  updatedAt: Date;
}

export interface IBusinessModel extends Model<IBusiness> {}

const BusinessSchema = new Schema<IBusiness>(
  {
    name: {
      type: String,
      required: [true, 'Business name is required'],
      trim: true,
      maxlength: 150,
      index: true,
    },
    slug: {
      type: String,
      required: [true, 'Slug is required'],
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
    },
    shortDescription: {
      type: String,
      default: '',
      trim: true,
      maxlength: 300,
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
      required: [true, 'Primary category is required'],
      index: true,
    },
    categories: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Category',
        index: true,
      },
    ],
    location: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point',
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        required: true,
        default: [77.209, 28.6139],
      },
    },
    address: {
      type: String,
      required: [true, 'Address is required'],
      trim: true,
    },
    locality: {
      type: String,
      required: [true, 'Locality is required'],
      trim: true,
      index: true,
    },
    city: {
      type: String,
      required: true,
      default: 'Delhi',
      trim: true,
      index: true,
    },
    state: {
      type: String,
      default: 'Delhi',
      trim: true,
    },
    country: {
      type: String,
      default: 'India',
      trim: true,
    },
    pincode: {
      type: String,
      default: '',
      trim: true,
    },
    latitude: {
      type: Number,
      default: 28.6139,
    },
    longitude: {
      type: Number,
      default: 77.209,
    },
    phone: {
      type: String,
      default: '',
      trim: true,
    },
    email: {
      type: String,
      default: '',
      trim: true,
    },
    website: {
      type: String,
      default: '',
      trim: true,
    },
    coverImage: {
      type: String,
      default: '',
      trim: true,
    },
    thumbnail: {
      type: String,
      default: '',
      trim: true,
    },
    gallery: [
      {
        url: { type: String, required: true },
        caption: { type: String, default: '' },
        isHero: { type: Boolean, default: false },
        sourceAttribution: { type: String, default: '' },
      },
    ],
    images: [
      {
        type: String,
      },
    ],
    logo: {
      type: String,
      default: '',
    },
    priceRange: {
      type: String,
      enum: ['BUDGET', 'MODERATE', 'PREMIUM', 'LUXURY'],
      default: 'MODERATE',
      index: true,
    },
    rating: {
      type: Number,
      default: 4.5,
      min: 0,
      max: 5,
      index: true,
    },
    reviewCount: {
      type: Number,
      default: 0,
    },
    tags: [
      {
        type: String,
        trim: true,
        index: true,
      },
    ],
    amenities: [
      {
        type: String,
        trim: true,
      },
    ],
    features: [
      {
        type: String,
        trim: true,
      },
    ],
    openingHours: {
      type: Map,
      of: String,
      default: () => ({
        Monday: '09:00 AM - 10:00 PM',
        Tuesday: '09:00 AM - 10:00 PM',
        Wednesday: '09:00 AM - 10:00 PM',
        Thursday: '09:00 AM - 10:00 PM',
        Friday: '09:00 AM - 10:00 PM',
        Saturday: '09:00 AM - 11:00 PM',
        Sunday: '09:00 AM - 11:00 PM',
      }),
    },
    verified: {
      type: Boolean,
      default: false,
      index: true,
    },
    claimed: {
      type: Boolean,
      default: false,
      index: true,
    },
    claimStatus: {
      type: String,
      enum: ['UNCLAIMED', 'PENDING', 'VERIFIED', 'REJECTED'],
      default: 'UNCLAIMED',
      index: true,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      default: null,
      index: true,
    },
    status: {
      type: String,
      enum: ['PUBLISHED', 'ACTIVE', 'DRAFT', 'PENDING_REVIEW', 'PENDING', 'REJECTED', 'ARCHIVED'],
      default: 'PUBLISHED',
      index: true,
    },
    // Source Tracking & Freshness (Phase 15)
    source: {
      type: String,
      default: 'DIRECT',
      trim: true,
      index: true,
    },
    sourceUrl: {
      type: String,
      default: '',
      trim: true,
    },
    sourceType: {
      type: String,
      enum: ['API', 'SCRAPER', 'RSS', 'WEB_SEARCH', 'MANUAL', 'DIRECT'],
      default: 'DIRECT',
      index: true,
    },
    lastUpdated: {
      type: Date,
      default: Date.now,
      index: true,
    },
    lastVerified: {
      type: Date,
      default: Date.now,
      index: true,
    },
    freshnessStatus: {
      type: String,
      enum: ['FRESH', 'RECENT', 'STALE', 'EXPIRED'],
      default: 'FRESH',
      index: true,
    },
    // Place Intelligence (Phase 16)
    placeIntelligence: {
      highlights: [{ type: String, trim: true }],
      bestFor: [{ type: String, trim: true }],
      popularItems: [{ type: String, trim: true }],
      priceLevel: { type: String, default: '' },
      ambience: [{ type: String, trim: true }],
      amenities: [{ type: String, trim: true }],
      goodFor: [{ type: String, trim: true }],
      nearbyAttractions: [
        {
          name: { type: String, required: true },
          distance: { type: String, required: true },
          type: { type: String, default: 'Landmark' },
        },
      ],
      recommendedDuration: { type: String, default: '' },
      bestTimeToVisit: { type: String, default: '' },
      accessibility: {
        wheelchairAccessible: { type: Boolean, default: false },
        elevator: { type: Boolean, default: false },
        groundFloor: { type: Boolean, default: false },
        notes: { type: String, default: '' },
      },
      parking: {
        available: { type: Boolean, default: true },
        type: { type: String, default: 'STREET' },
        valet: { type: Boolean, default: false },
        notes: { type: String, default: '' },
      },
      transport: {
        metroNearby: { type: String, default: '' },
        metroLine: { type: String, default: '' },
        walkingDistance: { type: String, default: '' },
        busStop: { type: String, default: '' },
        autoStand: { type: String, default: '' },
      },
      metroNearby: { type: String, default: '' },
      aiSummary: {
        whyVisit: { type: String, default: '' },
        bestFor: { type: String, default: '' },
        whatToExpect: { type: String, default: '' },
        generatedAt: { type: Date },
      },
      sources: [
        {
          name: { type: String, required: true },
          url: { type: String, default: '' },
          verified: { type: Boolean, default: true },
          license: { type: String, default: '' },
          note: { type: String, default: '' },
        },
      ],
    },
  },
  {
    timestamps: true,
  }
);

// Indexes requirement:
// 2dsphere index for geolocation searches
BusinessSchema.index({ location: '2dsphere' });

// Compound and field filters for India-wide data isolation
BusinessSchema.index({ country: 1, state: 1, city: 1, status: 1 });
BusinessSchema.index({ state: 1, city: 1, locality: 1, status: 1 });
BusinessSchema.index({ city: 1, locality: 1, status: 1 });
BusinessSchema.index({ city: 1, category: 1, rating: -1, status: 1 });
BusinessSchema.index({ category: 1, rating: -1 });
BusinessSchema.index({ categories: 1 });
BusinessSchema.index({ priceRange: 1, rating: -1 });
BusinessSchema.index({ tags: 1 });

// Full text search index
BusinessSchema.index({
  name: 'text',
  description: 'text',
  shortDescription: 'text',
  tags: 'text',
  locality: 'text',
  city: 'text',
});

export const Business =
  (mongoose.models.Business as IBusinessModel) ||
  mongoose.model<IBusiness, IBusinessModel>('Business', BusinessSchema);
