import mongoose, { Document, Schema, Model } from 'mongoose';

/**
 * Interface representing a Search Query Analytics Record
 * Used by SpotPicks to track user search behaviors, identify trending topics,
 * discover zero-result queries (for SEO & category expansion), and refine recommendations.
 */
export interface ISearchQuery extends Document {
  _id: mongoose.Types.ObjectId;
  query: string;
  naturalQuery?: string;
  category?: string;
  locality?: string;
  city?: string;
  intent?: string;
  resultCount: number;
  isZeroResult: boolean;
  clickedBusiness?: {
    businessId: string;
    name: string;
    position?: number;
    clickedAt?: Date;
  };
  hasFilters: boolean;
  filtersUsed?: Record<string, any>;
  executionTimeMs?: number;
  userId?: string;
  sessionId?: string;
  createdAt: Date;
}

export interface ISearchQueryModel extends Model<ISearchQuery> {}

const SearchQuerySchema = new Schema<ISearchQuery>(
  {
    query: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    naturalQuery: {
      type: String,
      trim: true,
      default: '',
    },
    category: {
      type: String,
      trim: true,
      default: '',
      index: true,
    },
    locality: {
      type: String,
      trim: true,
      default: '',
      index: true,
    },
    city: {
      type: String,
      trim: true,
      default: 'Delhi',
      index: true,
    },
    intent: {
      type: String,
      trim: true,
      default: 'STANDARD',
      index: true,
    },
    resultCount: {
      type: Number,
      default: 0,
      index: true,
    },
    isZeroResult: {
      type: Boolean,
      default: false,
      index: true,
    },
    clickedBusiness: {
      businessId: { type: String },
      name: { type: String },
      position: { type: Number },
      clickedAt: { type: Date },
    },
    hasFilters: {
      type: Boolean,
      default: false,
    },
    filtersUsed: {
      type: Schema.Types.Mixed,
      default: {},
    },
    executionTimeMs: {
      type: Number,
      default: 0,
    },
    userId: {
      type: String,
      default: '',
      index: true,
    },
    sessionId: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

SearchQuerySchema.index({ createdAt: -1 });
SearchQuerySchema.index({ category: 1, locality: 1 });
SearchQuerySchema.index({ isZeroResult: 1, createdAt: -1 });

export const SearchQuery =
  (mongoose.models.SearchQuery as ISearchQueryModel) ||
  mongoose.model<ISearchQuery, ISearchQueryModel>('SearchQuery', SearchQuerySchema);
