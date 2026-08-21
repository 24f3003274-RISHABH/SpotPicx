import mongoose, { Document, Schema, Model } from 'mongoose';

export type CollectionVisibility = 'PUBLIC' | 'PRIVATE';

export interface ICollection extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  slug: string;
  description: string;
  coverImage: string;
  visibility: CollectionVisibility;
  owner: mongoose.Types.ObjectId | {
    _id: string;
    name: string;
    avatar?: string;
    username?: string;
  };
  items: mongoose.Types.ObjectId[];
  itemCount: number;
  likes: mongoose.Types.ObjectId[];
  isCurated: boolean;
  category?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ICollectionModel extends Model<ICollection> {}

const CollectionSchema = new Schema<ICollection>(
  {
    name: {
      type: String,
      required: [true, 'Collection name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters'],
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },
    slug: {
      type: String,
      required: [true, 'Slug is required'],
      lowercase: true,
      trim: true,
      index: true,
    },
    description: {
      type: String,
      default: '',
      trim: true,
      maxlength: [500, 'Description cannot exceed 500 characters'],
    },
    coverImage: {
      type: String,
      default: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&auto=format&fit=crop&q=80',
    },
    visibility: {
      type: String,
      enum: ['PUBLIC', 'PRIVATE'],
      default: 'PUBLIC',
      index: true,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Collection owner is required'],
      index: true,
    },
    items: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Business',
      },
    ],
    itemCount: {
      type: Number,
      default: 0,
    },
    likes: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    isCurated: {
      type: Boolean,
      default: false,
    },
    category: {
      type: String,
      default: 'General',
    },
  },
  {
    timestamps: true,
  }
);

// Pre-save hook to update itemCount
CollectionSchema.pre('save', function () {
  if (this.items) {
    this.itemCount = this.items.length;
  }
});

export const Collection =
  (mongoose.models.Collection as ICollectionModel) ||
  mongoose.model<ICollection, ICollectionModel>('Collection', CollectionSchema);
