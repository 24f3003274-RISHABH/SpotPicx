import mongoose, { Document, Schema, Model } from 'mongoose';

export type OpportunityType =
  | 'Scholarship'
  | 'Hackathon'
  | 'Coding Competition'
  | 'Research Program'
  | 'Fellowship'
  | 'Developer Program'
  | 'Open Source'
  | 'Entrepreneurship'
  | 'Student Conference';

export type OpportunityStatus = 'Open' | 'Upcoming' | 'Closed' | 'Unknown' | 'Expired';

export interface IOpportunity extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  slug: string;
  organization: string;
  organizationLogo?: string;
  officialWebsite: string;
  officialApplicationLink: string;
  opportunityType: OpportunityType;
  eligibility: string;
  whoShouldApply: string;
  shortDescription: string;
  fullDescription?: string;
  location: string;
  locationType: 'Remote' | 'Global' | 'In-Person' | 'Hybrid';
  deadline: Date | null;
  isDeadlineVerified: boolean;
  status: OpportunityStatus;
  isFeatured: boolean;
  isThisWeek: boolean;
  stipendOrPrize?: string;
  tags: string[];
  viewCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface IOpportunityModel extends Model<IOpportunity> {}

const OpportunitySchema = new Schema<IOpportunity>(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, trim: true, lowercase: true },
    organization: { type: String, required: true, trim: true },
    organizationLogo: {
      type: String,
      default: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=200',
    },
    officialWebsite: { type: String, required: true, trim: true },
    officialApplicationLink: { type: String, required: true, trim: true },
    opportunityType: {
      type: String,
      required: true,
      enum: [
        'Scholarship',
        'Hackathon',
        'Coding Competition',
        'Research Program',
        'Fellowship',
        'Developer Program',
        'Open Source',
        'Entrepreneurship',
        'Student Conference',
      ],
      index: true,
    },
    eligibility: { type: String, required: true, trim: true },
    whoShouldApply: { type: String, required: true, trim: true },
    shortDescription: { type: String, required: true, trim: true },
    fullDescription: { type: String, default: '' },
    location: { type: String, required: true, default: 'Global / Remote' },
    locationType: {
      type: String,
      enum: ['Remote', 'Global', 'In-Person', 'Hybrid'],
      default: 'Remote',
    },
    deadline: { type: Date, default: null },
    isDeadlineVerified: { type: Boolean, default: false },
    status: {
      type: String,
      enum: ['Open', 'Upcoming', 'Closed', 'Unknown', 'Expired'],
      default: 'Open',
      index: true,
    },
    isFeatured: { type: Boolean, default: false, index: true },
    isThisWeek: { type: Boolean, default: false, index: true },
    stipendOrPrize: { type: String, default: '' },
    tags: { type: [String], default: [] },
    viewCount: { type: Number, default: 0 },
  },
  {
    timestamps: true,
  }
);

// Auto-check expired status before saving
OpportunitySchema.pre('save', function (this: IOpportunity) {
  if (this.isDeadlineVerified && this.deadline) {
    if (new Date(this.deadline).getTime() < Date.now()) {
      this.status = 'Expired';
    }
  }
});

OpportunitySchema.index({ name: 'text', organization: 'text', shortDescription: 'text', tags: 'text' });

export const Opportunity = mongoose.model<IOpportunity, IOpportunityModel>(
  'Opportunity',
  OpportunitySchema
);
