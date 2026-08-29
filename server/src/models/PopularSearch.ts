import mongoose, { Document, Schema, Model } from 'mongoose';

export type PopularSearchGroup =
  | 'ALL'
  | 'FOOD'
  | 'EXPERIENCES'
  | 'PLACES'
  | 'SERVICES'
  | 'STUDENTS'
  | 'TRAVEL';

export interface IPopularSearchFilters {
  category?: string;
  locality?: string;
  city?: string;
  rating?: number;
  priceRange?: string;
  priceMax?: number;
  tags?: string[];
  amenities?: string[];
  sort?: string;
}

export interface IPopularSearch extends Document {
  _id: mongoose.Types.ObjectId;
  title: string;
  slug: string;
  query: string;
  category?: string;
  location?: string;
  filters?: IPopularSearchFilters;
  description?: string;
  icon?: string;
  group: PopularSearchGroup;
  badge?: string;
  priority: number;
  isActive: boolean;
  clickCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface IPopularSearchModel extends Model<IPopularSearch> {}

const PopularSearchSchema = new Schema<IPopularSearch>(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: 120,
    },
    slug: {
      type: String,
      required: [true, 'Slug is required'],
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    query: {
      type: String,
      required: [true, 'Query string is required'],
      trim: true,
      index: true,
    },
    category: {
      type: String,
      trim: true,
      default: '',
    },
    location: {
      type: String,
      trim: true,
      default: '',
    },
    filters: {
      type: Schema.Types.Mixed,
      default: {},
    },
    description: {
      type: String,
      default: '',
      trim: true,
    },
    icon: {
      type: String,
      default: 'Sparkles',
      trim: true,
    },
    group: {
      type: String,
      enum: ['ALL', 'FOOD', 'EXPERIENCES', 'PLACES', 'SERVICES', 'STUDENTS', 'TRAVEL'],
      default: 'ALL',
      index: true,
    },
    badge: {
      type: String,
      default: '',
      trim: true,
    },
    priority: {
      type: Number,
      default: 0,
      index: true,
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
    clickCount: {
      type: Number,
      default: 0,
      index: true,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: (_, ret: any) => {
        ret.id = ret._id;
        delete ret.__v;
        return ret;
      },
    },
  }
);

// Compound index for querying active items sorted by priority
PopularSearchSchema.index({ isActive: 1, priority: -1, clickCount: -1 });

export const PopularSearch =
  (mongoose.models.PopularSearch as IPopularSearchModel) ||
  mongoose.model<IPopularSearch, IPopularSearchModel>('PopularSearch', PopularSearchSchema);
