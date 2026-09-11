import mongoose, { Document, Schema, Model } from 'mongoose';

export interface IBricsSource extends Document {
  _id: mongoose.Types.ObjectId;
  sourceName: string;
  sourceUrl: string;
  sourceType:
    | 'government'
    | 'official_presidency'
    | 'multilateral_institution'
    | 'treaty_declaration'
    | 'academic_thinktank'
    | 'authoritative_media';
  description: string;
  publishedDate?: string;
  accessedDate: string;
  isPrimary: boolean;
  displayOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface IBricsSourceModel extends Model<IBricsSource> {}

const BricsSourceSchema = new Schema<IBricsSource>(
  {
    sourceName: { type: String, required: true },
    sourceUrl: { type: String, required: true, unique: true, trim: true },
    sourceType: {
      type: String,
      enum: [
        'government',
        'official_presidency',
        'multilateral_institution',
        'treaty_declaration',
        'academic_thinktank',
        'authoritative_media',
      ],
      required: true,
      index: true,
    },
    description: { type: String, required: true },
    publishedDate: { type: String },
    accessedDate: { type: String, required: true },
    isPrimary: { type: Boolean, default: true, index: true },
    displayOrder: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const BricsSource =
  (mongoose.models.BricsSource as IBricsSourceModel) ||
  mongoose.model<IBricsSource, IBricsSourceModel>('BricsSource', BricsSourceSchema, 'brics_sources');
