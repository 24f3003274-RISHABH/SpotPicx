import mongoose, { Document, Schema, Model } from 'mongoose';

export interface IReviewResponse {
  comment: string;
  respondedAt: Date;
  respondedBy: string; // Business name or Owner name
}

export interface IReview extends Document {
  _id: mongoose.Types.ObjectId;
  rating: number; // 1 to 5
  title: string;
  comment: string;
  images: string[];
  visitDate?: Date;
  business: mongoose.Types.ObjectId;
  user: mongoose.Types.ObjectId | {
    _id: string;
    name: string;
    avatar?: string;
    username?: string;
    role?: string;
  };
  likes: mongoose.Types.ObjectId[];
  likeCount: number;
  isReported: boolean;
  response?: IReviewResponse;
  status: 'PUBLISHED' | 'PENDING' | 'FLAGGED' | 'REMOVED';
  createdAt: Date;
  updatedAt: Date;
}

export interface IReviewModel extends Model<IReview> {}

const ReviewSchema = new Schema<IReview>(
  {
    rating: {
      type: Number,
      required: [true, 'Rating is required'],
      min: [1, 'Rating must be at least 1'],
      max: [5, 'Rating cannot exceed 5'],
      validate: {
        validator: Number.isInteger,
        message: 'Rating must be an integer between 1 and 5',
      },
      index: true,
    },
    title: {
      type: String,
      required: [true, 'Review title is required'],
      trim: true,
      maxlength: [120, 'Title cannot exceed 120 characters'],
    },
    comment: {
      type: String,
      required: [true, 'Review comment is required'],
      trim: true,
      minlength: [10, 'Review comment must be at least 10 characters'],
      maxlength: [2000, 'Review comment cannot exceed 2000 characters'],
    },
    images: {
      type: [String],
      default: [],
      validate: {
        validator: (val: string[]) => val.length <= 6,
        message: 'You can upload a maximum of 6 images per review',
      },
    },
    visitDate: {
      type: Date,
      default: Date.now,
    },
    business: {
      type: Schema.Types.ObjectId,
      ref: 'Business',
      required: [true, 'Business reference is required'],
      index: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User reference is required'],
      index: true,
    },
    likes: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    likeCount: {
      type: Number,
      default: 0,
    },
    isReported: {
      type: Boolean,
      default: false,
    },
    response: {
      comment: { type: String, trim: true, maxlength: 1000 },
      respondedAt: { type: Date },
      respondedBy: { type: String, trim: true },
    },
    status: {
      type: String,
      enum: ['PUBLISHED', 'PENDING', 'FLAGGED', 'REMOVED'],
      default: 'PUBLISHED',
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index to prevent duplicate reviews by the same user on the same business
ReviewSchema.index({ business: 1, user: 1 }, { unique: true });

export const Review =
  (mongoose.models.Review as IReviewModel) ||
  mongoose.model<IReview, IReviewModel>('Review', ReviewSchema);
