import mongoose, { Document, Schema, Model } from 'mongoose';

export interface IBricsInstitution extends Document {
  _id: mongoose.Types.ObjectId;
  slug: string;
  name: string;
  acronym: string;
  yearEstablished: number;
  establishmentSummit: string;
  headquarters: string;
  purpose: string;
  keyFunctions: string[];
  significance: string;
  capitalStructure?: string;
  isIndependentLegalEntity: boolean;
  officialSourceUrl: string;
  sourceName: string;
  displayOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface IBricsInstitutionModel extends Model<IBricsInstitution> {}

const BricsInstitutionSchema = new Schema<IBricsInstitution>(
  {
    slug: { type: String, required: true, unique: true, index: true, trim: true },
    name: { type: String, required: true },
    acronym: { type: String, required: true },
    yearEstablished: { type: Number, required: true },
    establishmentSummit: { type: String, required: true },
    headquarters: { type: String, required: true },
    purpose: { type: String, required: true },
    keyFunctions: [{ type: String }],
    significance: { type: String, required: true },
    capitalStructure: { type: String },
    isIndependentLegalEntity: { type: Boolean, required: true, default: false },
    officialSourceUrl: { type: String, required: true },
    sourceName: { type: String, required: true },
    displayOrder: { type: Number, default: 0, index: true },
  },
  { timestamps: true }
);

export const BricsInstitution =
  (mongoose.models.BricsInstitution as IBricsInstitutionModel) ||
  mongoose.model<IBricsInstitution, IBricsInstitutionModel>(
    'BricsInstitution',
    BricsInstitutionSchema,
    'brics_institutions'
  );
