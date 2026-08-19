import mongoose, { Document, Schema } from 'mongoose';

export interface ISpotLocation {
  country: string;
  state: string;
  city: string;
  locality: string;
  address: string;
  postalCode?: string;
  landmark?: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
}

export interface ISpotReviewStats {
  averageRating: number;
  totalReviews: number;
  ratingDistribution: {
    1: number;
    2: number;
    3: number;
    4: number;
    5: number;
  };
}

export interface ISpot extends Document {
  title: string;
  slug: string;
  tagline?: string;
  description: string;
  categories: string[];
  subCategories: string[];
  tags: string[];
  location: ISpotLocation;
  priceRange?: 'BUDGET' | 'MODERATE' | 'PREMIUM' | 'LUXURY';
  averageCostForTwo?: number;
  images: Array<{
    url: string;
    caption?: string;
    isFeatured?: boolean;
  }>;
  contact?: {
    phone?: string;
    email?: string;
    website?: string;
  };
  timings?: {
    openDays?: string[];
    openingTime?: string;
    closingTime?: string;
    is24Hours?: boolean;
  };
  features: string[]; // e.g. "WiFi", "Outdoor Seating", "AC", "Pet Friendly", "Valet Parking"
  reviewStats: ISpotReviewStats;
  isVerified: boolean;
  isFeatured: boolean;
  ownerId?: mongoose.Types.ObjectId;
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  createdAt: Date;
  updatedAt: Date;
}

const SpotSchema = new Schema<ISpot>(
  {
    title: {
      type: String,
      required: [true, 'Spot title is required'],
      trim: true,
      maxlength: 150,
      index: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    tagline: {
      type: String,
      trim: true,
      maxlength: 250,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
    },
    categories: [
      {
        type: String,
        required: true,
        index: true,
      },
    ],
    subCategories: [
      {
        type: String,
        index: true,
      },
    ],
    tags: [
      {
        type: String,
        index: true,
      },
    ],
    location: {
      country: { type: String, required: true, default: 'India', index: true },
      state: { type: String, required: true, default: 'Delhi', index: true },
      city: { type: String, required: true, default: 'Delhi', index: true },
      locality: { type: String, required: true, index: true },
      address: { type: String, required: true },
      postalCode: { type: String },
      landmark: { type: String },
      coordinates: {
        latitude: { type: Number },
        longitude: { type: Number },
      },
    },
    priceRange: {
      type: String,
      enum: ['BUDGET', 'MODERATE', 'PREMIUM', 'LUXURY'],
      default: 'MODERATE',
    },
    averageCostForTwo: {
      type: Number,
    },
    images: [
      {
        url: { type: String, required: true },
        caption: { type: String },
        isFeatured: { type: Boolean, default: false },
      },
    ],
    contact: {
      phone: { type: String },
      email: { type: String },
      website: { type: String },
    },
    timings: {
      openDays: [{ type: String }],
      openingTime: { type: String },
      closingTime: { type: String },
      is24Hours: { type: Boolean, default: false },
    },
    features: [{ type: String }],
    reviewStats: {
      averageRating: { type: Number, default: 0, min: 0, max: 5 },
      totalReviews: { type: Number, default: 0 },
      ratingDistribution: {
        1: { type: Number, default: 0 },
        2: { type: Number, default: 0 },
        3: { type: Number, default: 0 },
        4: { type: Number, default: 0 },
        5: { type: Number, default: 0 },
      },
    },
    isVerified: {
      type: Boolean,
      default: false,
      index: true,
    },
    isFeatured: {
      type: Boolean,
      default: false,
      index: true,
    },
    ownerId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    status: {
      type: String,
      enum: ['DRAFT', 'PUBLISHED', 'ARCHIVED'],
      default: 'PUBLISHED',
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// Compound indexes for high performance scalable searches
SpotSchema.index({ 'location.city': 1, categories: 1, 'reviewStats.averageRating': -1 });
SpotSchema.index({ 'location.city': 1, 'location.locality': 1 });
SpotSchema.index({ title: 'text', description: 'text', tags: 'text' });

export const Spot = mongoose.models.Spot || mongoose.model<ISpot>('Spot', SpotSchema);
