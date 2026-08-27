import mongoose, { Document, Schema, Model } from 'mongoose';

export type LocationType =
  | 'COUNTRY'
  | 'STATE'
  | 'DISTRICT'
  | 'CITY'
  | 'LOCALITY'
  | 'NEIGHBORHOOD';

export type LocationStatus = 'ACTIVE' | 'COMING_SOON' | 'BETA' | 'INACTIVE';

export interface ILocation extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  slug: string;
  type: LocationType;
  status: LocationStatus;
  parent?: mongoose.Types.ObjectId | null;
  country: string;
  countrySlug?: string;
  state: string;
  stateSlug?: string;
  district?: string;
  districtSlug?: string;
  city: string;
  citySlug?: string;
  locality?: string;
  neighborhood?: string;
  shortCode?: string; // e.g. 'DL', 'MH', 'KA'
  latitude: number;
  longitude: number;
  pincode: string;
  isActive: boolean;
  readinessScore?: number; // 0 - 100%
  waitlistCount?: number;
  description?: string;
  image?: string;
  bannerImage?: string;
  metaTitle?: string;
  metaDescription?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ILocationModel extends Model<ILocation> {}

const LocationSchema = new Schema<ILocation>(
  {
    name: {
      type: String,
      required: [true, 'Location name is required'],
      trim: true,
      maxlength: 100,
    },
    slug: {
      type: String,
      required: [true, 'Slug is required'],
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    type: {
      type: String,
      enum: ['COUNTRY', 'STATE', 'DISTRICT', 'CITY', 'LOCALITY', 'NEIGHBORHOOD'],
      required: true,
      index: true,
    },
    status: {
      type: String,
      enum: ['ACTIVE', 'COMING_SOON', 'BETA', 'INACTIVE'],
      default: 'ACTIVE',
      index: true,
    },
    parent: {
      type: Schema.Types.ObjectId,
      ref: 'Location',
      default: null,
      index: true,
    },
    country: {
      type: String,
      required: true,
      default: 'India',
      index: true,
    },
    countrySlug: {
      type: String,
      default: 'india',
      index: true,
    },
    state: {
      type: String,
      required: true,
      default: 'Delhi',
      index: true,
    },
    stateSlug: {
      type: String,
      default: 'delhi',
      index: true,
    },
    district: {
      type: String,
      default: '',
      index: true,
    },
    districtSlug: {
      type: String,
      default: '',
      index: true,
    },
    city: {
      type: String,
      required: true,
      default: 'Delhi',
      index: true,
    },
    citySlug: {
      type: String,
      default: 'delhi',
      index: true,
    },
    locality: {
      type: String,
      default: '',
    },
    neighborhood: {
      type: String,
      default: '',
    },
    shortCode: {
      type: String,
      default: '',
    },
    latitude: {
      type: Number,
      default: 28.6139,
    },
    longitude: {
      type: Number,
      default: 77.209,
    },
    pincode: {
      type: String,
      default: '',
      index: true,
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
    readinessScore: {
      type: Number,
      default: 100,
    },
    waitlistCount: {
      type: Number,
      default: 0,
    },
    description: {
      type: String,
      default: '',
    },
    image: {
      type: String,
      default: '',
    },
    bannerImage: {
      type: String,
      default: '',
    },
    metaTitle: {
      type: String,
      default: '',
    },
    metaDescription: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

// Compound indexes for geographic hierarchy and high-throughput data isolation
LocationSchema.index({ country: 1, state: 1, city: 1, type: 1, status: 1 });
LocationSchema.index({ stateSlug: 1, citySlug: 1, status: 1 });
LocationSchema.index({ state: 1, city: 1, type: 1 });
LocationSchema.index({ type: 1, status: 1 });
LocationSchema.index({ parent: 1, type: 1 });
LocationSchema.index({ slug: 1, type: 1 });

export const Location =
  (mongoose.models.Location as ILocationModel) ||
  mongoose.model<ILocation, ILocationModel>('Location', LocationSchema);

