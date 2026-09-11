import mongoose, { Document, Schema, Model } from 'mongoose';

export interface IBricsFact extends Document {
  _id: mongoose.Types.ObjectId;
  key: string;
  label: string;
  value: string;
  description: string;
  category: 'governance' | 'economy' | 'membership' | 'institutions' | 'summit_2026' | 'general';
  sourceName: string;
  sourceUrl: string;
  verifiedAt: string;
  displayOrder: number;
  featured: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface IBricsFactModel extends Model<IBricsFact> {}

const BricsFactSchema = new Schema<IBricsFact>(
  {
    key: { type: String, required: true, unique: true, index: true, trim: true },
    label: { type: String, required: true },
    value: { type: String, required: true },
    description: { type: String, required: true },
    category: {
      type: String,
      enum: ['governance', 'economy', 'membership', 'institutions', 'summit_2026', 'general'],
      default: 'general',
      index: true,
    },
    sourceName: { type: String, required: true },
    sourceUrl: { type: String, required: true },
    verifiedAt: { type: String, required: true },
    displayOrder: { type: Number, default: 0, index: true },
    featured: { type: Boolean, default: true, index: true },
  },
  { timestamps: true }
);

export const BricsFact =
  (mongoose.models.BricsFact as IBricsFactModel) ||
  mongoose.model<IBricsFact, IBricsFactModel>('BricsFact', BricsFactSchema, 'brics_facts');
