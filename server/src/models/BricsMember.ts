import mongoose, { Document, Schema, Model } from 'mongoose';

export interface IBricsMember extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  officialName: string;
  slug: string;
  capital: string;
  region: string;
  isoCode: string;
  flagEmoji: string;
  flagUrl: string;
  joinedYear: number;
  membershipType: 'founding' | 'expanded_2011' | 'expanded_2024' | 'expanded_2025';
  status: 'full_member' | 'partner_country';
  description: string;
  bricsRole: string;
  economicProfile: {
    population?: string;
    gdpNominal?: string;
    currency?: string;
    keyExports?: string[];
    gdpPppShare?: string;
  };
  presidenciesHeld: number[];
  officialSourceUrl: string;
  sourceName: string;
  displayOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface IBricsMemberModel extends Model<IBricsMember> {}

const BricsMemberSchema = new Schema<IBricsMember>(
  {
    name: { type: String, required: true, trim: true },
    officialName: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, trim: true, index: true },
    capital: { type: String, required: true },
    region: { type: String, required: true, index: true },
    isoCode: { type: String, required: true, uppercase: true },
    flagEmoji: { type: String, required: true },
    flagUrl: { type: String, required: true },
    joinedYear: { type: Number, required: true, index: true },
    membershipType: {
      type: String,
      enum: ['founding', 'expanded_2011', 'expanded_2024', 'expanded_2025'],
      required: true,
      index: true,
    },
    status: {
      type: String,
      enum: ['full_member', 'partner_country'],
      default: 'full_member',
      index: true,
    },
    description: { type: String, required: true },
    bricsRole: { type: String, required: true },
    economicProfile: {
      population: { type: String },
      gdpNominal: { type: String },
      currency: { type: String },
      keyExports: [{ type: String }],
      gdpPppShare: { type: String },
    },
    presidenciesHeld: [{ type: Number }],
    officialSourceUrl: { type: String, required: true },
    sourceName: { type: String, required: true },
    displayOrder: { type: Number, default: 0, index: true },
  },
  { timestamps: true }
);

export const BricsMember =
  (mongoose.models.BricsMember as IBricsMemberModel) ||
  mongoose.model<IBricsMember, IBricsMemberModel>('BricsMember', BricsMemberSchema, 'brics_members');
