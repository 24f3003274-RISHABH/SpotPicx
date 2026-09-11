import mongoose, { Document, Schema, Model } from 'mongoose';

export interface IBricsPresidency extends Document {
  _id: mongoose.Types.ObjectId;
  year: number;
  presidencyCountry: string;
  summitHost: string;
  theme: string;
  importantInitiatives: string[];
  globalContext: string;
  status: 'completed' | 'current' | 'upcoming';
  officialSource: {
    title: string;
    url: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface IBricsPresidencyModel extends Model<IBricsPresidency> {}

const BricsPresidencySchema = new Schema<IBricsPresidency>(
  {
    year: { type: Number, required: true, unique: true, index: true },
    presidencyCountry: { type: String, required: true },
    summitHost: { type: String, required: true },
    theme: { type: String, required: true },
    importantInitiatives: [{ type: String }],
    globalContext: { type: String, default: '' },
    status: {
      type: String,
      enum: ['completed', 'current', 'upcoming'],
      default: 'completed',
    },
    officialSource: {
      title: { type: String, required: true },
      url: { type: String, required: true },
    },
  },
  { timestamps: true }
);

export const BricsPresidency =
  (mongoose.models.BricsPresidency as IBricsPresidencyModel) ||
  mongoose.model<IBricsPresidency, IBricsPresidencyModel>(
    'BricsPresidency',
    BricsPresidencySchema,
    'brics_presidencies'
  );
