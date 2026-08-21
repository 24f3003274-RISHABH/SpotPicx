import mongoose, { Document, Schema, Model } from 'mongoose';

export interface ISeoContentSection {
  title: string;
  body: string;
  bulletPoints?: string[];
}

export interface ISeoFaq {
  question: string;
  answer: string;
}

export interface ISeoPageFilters {
  priceRange?: string[];
  amenities?: string[];
  tags?: string[];
  minRating?: number;
  dietaryOptions?: string[];
}

export interface ISeoPage extends Document {
  _id: mongoose.Types.ObjectId;
  title: string;
  slug: string;
  metaTitle?: string;
  metaDescription: string;
  h1: string;
  intro: string;
  category?: string;
  location?: string;
  locality?: string;
  intent?: string;
  filters?: ISeoPageFilters;
  rankingMethod: 'rating' | 'reviewCount' | 'popularity' | 'distance' | 'engagement' | 'newest' | 'custom';
  contentSections: ISeoContentSection[];
  faq: ISeoFaq[];
  relatedPages: string[];
  relatedCategories?: string[];
  relatedLocations?: string[];
  published: boolean;
  canonicalUrl?: string;
  keywords?: string[];
  isIndexed: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ISeoPageModel extends Model<ISeoPage> {}

const SeoPageSchema = new Schema<ISeoPage>(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, trim: true, index: true },
    metaTitle: { type: String },
    metaDescription: { type: String, required: true },
    h1: { type: String, required: true },
    intro: { type: String, required: true },
    category: { type: String, index: true },
    location: { type: String, index: true },
    locality: { type: String },
    intent: { type: String, default: 'BEST', index: true },
    filters: {
      priceRange: [{ type: String }],
      amenities: [{ type: String }],
      tags: [{ type: String }],
      minRating: { type: Number, default: 0 },
      dietaryOptions: [{ type: String }],
    },
    rankingMethod: {
      type: String,
      enum: ['rating', 'reviewCount', 'popularity', 'distance', 'engagement', 'newest', 'custom'],
      default: 'custom',
    },
    contentSections: [
      {
        title: { type: String, required: true },
        body: { type: String, required: true },
        bulletPoints: [{ type: String }],
      },
    ],
    faq: [
      {
        question: { type: String, required: true },
        answer: { type: String, required: true },
      },
    ],
    relatedPages: [{ type: String }],
    relatedCategories: [{ type: String }],
    relatedLocations: [{ type: String }],
    published: { type: Boolean, default: true, index: true },
    canonicalUrl: { type: String },
    keywords: [{ type: String }],
    isIndexed: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const SeoPage =
  (mongoose.models.SeoPage as ISeoPageModel) ||
  mongoose.model<ISeoPage, ISeoPageModel>('SeoPage', SeoPageSchema);

