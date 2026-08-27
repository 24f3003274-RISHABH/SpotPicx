import mongoose, { Document, Schema, Model } from 'mongoose';

export type AdType =
  | 'BANNER'
  | 'NATIVE_CARD'
  | 'SPONSORED_LISTING'
  | 'PROMOTED_CATEGORY'
  | 'PROMOTED_EVENT'
  | 'SPONSORED_COLLECTION';

export type AdPlacement =
  | 'HOME_FEED'
  | 'HOME_HERO'
  | 'SEARCH_TOP'
  | 'SEARCH_SIDEBAR'
  | 'CATEGORY_HEADER'
  | 'CATEGORY_FEED'
  | 'EVENTS_HEADER'
  | 'COLLECTION_SPONSOR'
  | 'SPOT_DETAIL_SIDEBAR';

export type AdStatus = 'ACTIVE' | 'PAUSED' | 'SCHEDULED' | 'COMPLETED' | 'PENDING_APPROVAL';

export interface IAdvertisement extends Document {
  _id: mongoose.Types.ObjectId;
  title: string;
  type: AdType;
  placement: AdPlacement;
  business?: mongoose.Types.ObjectId;
  headline: string;
  description: string;
  callToAction: string;
  targetUrl: string;
  imageUrl?: string;
  badgeLabel: 'Sponsored' | 'Promoted' | 'Featured Partner' | 'Ad';
  targetCategories?: string[];
  targetLocalities?: string[];
  targetTags?: string[];
  startDate: Date;
  endDate: Date;
  status: AdStatus;
  pricingModel: 'FLAT_RATE' | 'CPM' | 'CPC';
  price: number;
  currency: string;
  impressions: number;
  clicks: number;
  dailyBudget?: number;
  totalBudget?: number;
  spent: number;
  priorityScore: number;
  sponsorName?: string;
  sponsorLogo?: string;
  createdBy?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

export interface IAdvertisementModel extends Model<IAdvertisement> {}

const AdvertisementSchema = new Schema<IAdvertisement>(
  {
    title: {
      type: String,
      required: [true, 'Ad title is required'],
      trim: true,
    },
    type: {
      type: String,
      enum: [
        'BANNER',
        'NATIVE_CARD',
        'SPONSORED_LISTING',
        'PROMOTED_CATEGORY',
        'PROMOTED_EVENT',
        'SPONSORED_COLLECTION',
      ],
      required: true,
      index: true,
    },
    placement: {
      type: String,
      enum: [
        'HOME_FEED',
        'HOME_HERO',
        'SEARCH_TOP',
        'SEARCH_SIDEBAR',
        'CATEGORY_HEADER',
        'CATEGORY_FEED',
        'EVENTS_HEADER',
        'COLLECTION_SPONSOR',
        'SPOT_DETAIL_SIDEBAR',
      ],
      required: true,
      index: true,
    },
    business: {
      type: Schema.Types.ObjectId,
      ref: 'Business',
      index: true,
    },
    headline: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    callToAction: {
      type: String,
      default: 'Learn More',
      trim: true,
    },
    targetUrl: {
      type: String,
      required: true,
      trim: true,
    },
    imageUrl: {
      type: String,
      default: '',
    },
    badgeLabel: {
      type: String,
      enum: ['Sponsored', 'Promoted', 'Featured Partner', 'Ad'],
      default: 'Sponsored',
    },
    targetCategories: [{ type: String, trim: true }],
    targetLocalities: [{ type: String, trim: true }],
    targetTags: [{ type: String, trim: true }],
    startDate: {
      type: Date,
      default: Date.now,
    },
    endDate: {
      type: Date,
      default: () => new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    },
    status: {
      type: String,
      enum: ['ACTIVE', 'PAUSED', 'SCHEDULED', 'COMPLETED', 'PENDING_APPROVAL'],
      default: 'ACTIVE',
      index: true,
    },
    pricingModel: {
      type: String,
      enum: ['FLAT_RATE', 'CPM', 'CPC'],
      default: 'FLAT_RATE',
    },
    price: {
      type: Number,
      default: 0,
    },
    currency: {
      type: String,
      default: 'INR',
    },
    impressions: {
      type: Number,
      default: 0,
    },
    clicks: {
      type: Number,
      default: 0,
    },
    dailyBudget: {
      type: Number,
      default: 0,
    },
    totalBudget: {
      type: Number,
      default: 0,
    },
    spent: {
      type: Number,
      default: 0,
    },
    priorityScore: {
      type: Number,
      default: 10,
    },
    sponsorName: {
      type: String,
      default: '',
    },
    sponsorLogo: {
      type: String,
      default: '',
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
);

AdvertisementSchema.index({ placement: 1, status: 1, priorityScore: -1 });
AdvertisementSchema.index({ targetCategories: 1 });
AdvertisementSchema.index({ targetLocalities: 1 });

export const Advertisement =
  (mongoose.models.Advertisement as IAdvertisementModel) ||
  mongoose.model<IAdvertisement, IAdvertisementModel>('Advertisement', AdvertisementSchema);
