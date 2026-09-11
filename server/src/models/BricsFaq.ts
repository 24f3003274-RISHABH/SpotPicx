import mongoose, { Document, Schema, Model } from 'mongoose';

export interface IBricsFaq extends Document {
  _id: mongoose.Types.ObjectId;
  slug: string;
  question: string;
  answer: string;
  category: string;
  displayOrder: number;
  sourceName: string;
  sourceUrl: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IBricsFaqModel extends Model<IBricsFaq> {}

const BricsFaqSchema = new Schema<IBricsFaq>(
  {
    slug: { type: String, required: true, unique: true, index: true, trim: true },
    question: { type: String, required: true },
    answer: { type: String, required: true },
    category: { type: String, default: 'General', index: true },
    displayOrder: { type: Number, default: 0, index: true },
    sourceName: { type: String, required: true },
    sourceUrl: { type: String, required: true },
  },
  { timestamps: true }
);

export const BricsFaq =
  (mongoose.models.BricsFaq as IBricsFaqModel) ||
  mongoose.model<IBricsFaq, IBricsFaqModel>('BricsFaq', BricsFaqSchema, 'brics_faqs');
