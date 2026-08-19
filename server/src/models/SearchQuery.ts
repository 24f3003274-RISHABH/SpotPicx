import mongoose, { Document, Schema, Model } from 'mongoose';

export interface ISearchQuery extends Document {
  _id: mongoose.Types.ObjectId;
  query: string;
  category?: string;
  locality?: string;
  city?: string;
  intent?: string;
  resultCount: number;
  hasFilters: boolean;
  filtersUsed?: Record<string, any>;
  executionTimeMs?: number;
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
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

SearchQuerySchema.index({ createdAt: -1 });

export const SearchQuery =
  (mongoose.models.SearchQuery as ISearchQueryModel) ||
  mongoose.model<ISearchQuery, ISearchQueryModel>('SearchQuery', SearchQuerySchema);
