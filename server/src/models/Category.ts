import mongoose, { Document, Schema, Model } from 'mongoose';

export interface ICategory extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  slug: string;
  description: string;
  icon: string;
  image: string;
  parent?: mongoose.Types.ObjectId | null;
  type: 'ROOT' | 'SUBCATEGORY' | 'LEAF';
  isActive: boolean;
  order: number;
  seoTitle?: string;
  seoDescription?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ICategoryModel extends Model<ICategory> {}

const CategorySchema = new Schema<ICategory>(
  {
    name: {
      type: String,
      required: [true, 'Category name is required'],
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
    description: {
      type: String,
      default: '',
      trim: true,
    },
    icon: {
      type: String,
      default: 'Sparkles',
    },
    image: {
      type: String,
      default: '',
    },
    parent: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
      default: null,
      index: true,
    },
    type: {
      type: String,
      enum: ['ROOT', 'SUBCATEGORY', 'LEAF'],
      default: 'ROOT',
      index: true,
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
    order: {
      type: Number,
      default: 0,
      index: true,
    },
    seoTitle: {
      type: String,
      default: '',
    },
    seoDescription: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

CategorySchema.index({ parent: 1, order: 1 });
CategorySchema.index({ isActive: 1, order: 1 });

export const Category =
  (mongoose.models.Category as ICategoryModel) ||
  mongoose.model<ICategory, ICategoryModel>('Category', CategorySchema);
