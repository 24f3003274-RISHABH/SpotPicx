import mongoose, { Document, Schema, Model } from 'mongoose';

export type AuthorStatus = 'ACTIVE' | 'ARCHIVED';

export interface IAuthorSource {
  name: string;
  url: string;
}

export interface IAuthor extends Document {
  name: string;
  slug: string;
  alternateNames?: string[];
  
  biography: string;
  shortBiography: string;
  
  nationality: string;
  country: string;
  isIndian: boolean;
  birthYear?: number;
  deathYear?: number;
  
  profession: string[];
  fields: string[];
  notableWorks: string[];
  
  portrait: string;
  coverImage?: string;
  
  officialWebsite?: string;
  wikipediaUrl?: string;
  socialLinks?: Record<string, string>;
  
  sources: IAuthorSource[];
  
  featured: boolean;
  popular: boolean;
  bookCount: number;
  
  seoTitle?: string;
  seoDescription?: string;
  
  status: AuthorStatus;
  createdAt: Date;
  updatedAt: Date;
}

const AuthorSchema = new Schema<IAuthor>(
  {
    name: { type: String, required: true, trim: true, index: true },
    slug: { type: String, required: true, unique: true, trim: true, lowercase: true, index: true },
    alternateNames: [{ type: String, trim: true }],

    biography: { type: String, required: true },
    shortBiography: { type: String, required: true },

    nationality: { type: String, required: true, index: true },
    country: { type: String, required: true, index: true },
    isIndian: { type: Boolean, default: false, index: true },
    birthYear: { type: Number },
    deathYear: { type: Number },

    profession: [{ type: String, index: true }],
    fields: [{ type: String, index: true }],
    notableWorks: [{ type: String }],

    portrait: { type: String, required: true },
    coverImage: { type: String },

    officialWebsite: { type: String },
    wikipediaUrl: { type: String },
    socialLinks: { type: Map, of: String },

    sources: [
      {
        name: { type: String, required: true },
        url: { type: String, required: true },
      },
    ],

    featured: { type: Boolean, default: false, index: true },
    popular: { type: Boolean, default: false, index: true },
    bookCount: { type: Number, default: 0 },

    seoTitle: { type: String },
    seoDescription: { type: String },

    status: {
      type: String,
      enum: ['ACTIVE', 'ARCHIVED'],
      default: 'ACTIVE',
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

AuthorSchema.index({ name: 'text', biography: 'text', fields: 'text', profession: 'text' });
AuthorSchema.index({ isIndian: 1, popular: -1 });

export const Author: Model<IAuthor> = mongoose.models.Author || mongoose.model<IAuthor>('Author', AuthorSchema);
