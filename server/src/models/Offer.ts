import mongoose, { Document, Schema, Model } from 'mongoose';

export type OfferStatus = 'ACTIVE' | 'EXPIRED' | 'DRAFT' | 'PENDING';

export type OfferCategoryType =
  | 'Restaurant'
  | 'Cafe'
  | 'Shopping'
  | 'Student'
  | 'Movie'
  | 'Events'
  | 'Services'
  | 'Other';

export interface IOffer extends Document {
  _id: mongoose.Types.ObjectId;
  business: mongoose.Types.ObjectId;
  title: string;
  description: string;
  discount: string;
  couponCode: string;
  category: OfferCategoryType | string;
  validFrom: Date;
  validUntil: Date;
  terms: string[];
  status: OfferStatus;
  isActive: boolean;
  claimedCount: number;
  featured?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface IOfferModel extends Model<IOffer> {}

const OfferSchema = new Schema<IOffer>(
  {
    business: {
      type: Schema.Types.ObjectId,
      ref: 'Business',
      required: [true, 'Business reference is required'],
      index: true,
    },
    title: {
      type: String,
      required: [true, 'Offer title is required'],
      trim: true,
      maxlength: 140,
    },
    description: {
      type: String,
      default: '',
      trim: true,
      maxlength: 600,
    },
    discount: {
      type: String,
      required: [true, 'Discount details are required'],
      trim: true,
      default: '20% OFF',
    },
    couponCode: {
      type: String,
      default: '',
      trim: true,
      uppercase: true,
    },
    category: {
      type: String,
      enum: ['Restaurant', 'Cafe', 'Shopping', 'Student', 'Movie', 'Events', 'Services', 'Other'],
      default: 'Restaurant',
      index: true,
    },
    validFrom: {
      type: Date,
      default: Date.now,
    },
    validUntil: {
      type: Date,
      default: () => new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // +30 days
      index: true,
    },
    terms: [
      {
        type: String,
        trim: true,
      },
    ],
    status: {
      type: String,
      enum: ['ACTIVE', 'EXPIRED', 'DRAFT', 'PENDING'],
      default: 'ACTIVE',
      index: true,
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
    claimedCount: {
      type: Number,
      default: 0,
    },
    featured: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

OfferSchema.index({ business: 1, isActive: 1 });
OfferSchema.index({ validUntil: 1, status: 1 });

export const Offer =
  (mongoose.models.Offer as IOfferModel) ||
  mongoose.model<IOffer, IOfferModel>('Offer', OfferSchema);
