import mongoose, { Document, Schema, Model } from 'mongoose';

export type PriceRange = 'BUDGET' | 'MODERATE' | 'PREMIUM' | 'LUXURY';
export type BusinessStatus = 'ACTIVE' | 'PENDING' | 'REJECTED' | 'ARCHIVED';

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
  owner?: mongoose.Types.ObjectId | null;
  status: BusinessStatus;
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
    owner: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      default: null,
      index: true,
    },
    status: {
      type: String,
      enum: ['ACTIVE', 'PENDING', 'REJECTED', 'ARCHIVED'],
      default: 'ACTIVE',
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
  },
  {
    timestamps: true,
  }
);

// Indexes requirement:
// 2dsphere index for geolocation searches
BusinessSchema.index({ location: '2dsphere' });

// Compound and field filters
BusinessSchema.index({ city: 1, locality: 1, status: 1 });
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
