import mongoose, { Document, Schema, Model } from 'mongoose';

export interface IArticle extends Document {
  _id: mongoose.Types.ObjectId;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string;
  author: string;
  authorRole?: string;
  authorAvatar?: string;
  category: string;
  tags: string[];
  locations: string[];
  seoTitle?: string;
  seoDescription?: string;
  published: boolean;
  publishedAt?: Date | null;
  readingTimeMinutes: number;
  featured: boolean;
  relatedBusinesses?: mongoose.Types.ObjectId[] | string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface IArticleModel extends Model<IArticle> {}

const ArticleSchema = new Schema<IArticle>(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, trim: true, index: true },
    excerpt: { type: String, required: true },
    content: { type: String, required: true },
    coverImage: {
      type: String,
      default: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200',
    },
    author: { type: String, default: 'SpotPicks Editorial Team' },
    authorRole: { type: String, default: 'Senior Delhi City Curator' },
    authorAvatar: {
      type: String,
      default: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200',
    },
    category: { type: String, default: 'Food & Cafes', index: true },
    tags: [{ type: String, index: true }],
    locations: [{ type: String, index: true }],
    seoTitle: { type: String },
    seoDescription: { type: String },
    published: { type: Boolean, default: true, index: true },
    publishedAt: { type: Date, default: Date.now },
    readingTimeMinutes: { type: Number, default: 5 },
    featured: { type: Boolean, default: false, index: true },
    relatedBusinesses: [{ type: Schema.Types.ObjectId, ref: 'Business' }],
  },
  { timestamps: true }
);

export const Article =
  (mongoose.models.Article as IArticleModel) ||
  mongoose.model<IArticle, IArticleModel>('Article', ArticleSchema);

