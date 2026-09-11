import mongoose, { Document, Schema, Model } from 'mongoose';

export interface IBricsSummit extends Document {
  _id: mongoose.Types.ObjectId;
  summitNumber: number;
  year: number;
  hostCountry: string;
  hostCity: string;
  presidencyCountry: string;
  dates: string;
  status: 'completed' | 'scheduled';
  officialName: string;
  theme: string;
  declarationName: string;
  declarationUrl: string;
  summary: string;
  majorThemes: string[];
  keyOutcomes: string[];
  sourceUrls: Array<{
    title: string;
    url: string;
  }>;
  createdAt: Date;
  updatedAt: Date;
}

export interface IBricsSummitModel extends Model<IBricsSummit> {}

const BricsSummitSchema = new Schema<IBricsSummit>(
  {
    summitNumber: { type: Number, required: true, unique: true, index: true },
    year: { type: Number, required: true, unique: true, index: true },
    hostCountry: { type: String, required: true, index: true },
    hostCity: { type: String, required: true },
    presidencyCountry: { type: String, required: true },
    dates: { type: String, required: true },
    status: {
      type: String,
      enum: ['completed', 'scheduled'],
      required: true,
      default: 'completed',
    },
    officialName: { type: String, required: true },
    theme: { type: String, required: true },
    declarationName: { type: String, default: '' },
    declarationUrl: { type: String, default: '' },
    summary: { type: String, required: true },
    majorThemes: [{ type: String }],
    keyOutcomes: [{ type: String }],
    sourceUrls: [
      {
        title: { type: String, required: true },
        url: { type: String, required: true },
      },
    ],
  },
  { timestamps: true }
);

export const BricsSummit =
  (mongoose.models.BricsSummit as IBricsSummitModel) ||
  mongoose.model<IBricsSummit, IBricsSummitModel>('BricsSummit', BricsSummitSchema, 'brics_summits');
