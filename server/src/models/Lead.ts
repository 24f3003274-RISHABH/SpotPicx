import mongoose, { Document, Schema, Model } from 'mongoose';

export type LeadType = 'CALL' | 'WEBSITE' | 'DIRECTION' | 'WHATSAPP' | 'BOOKING' | 'ENQUIRY';
export type LeadStatus = 'NEW' | 'CONTACTED' | 'CONVERTED' | 'ARCHIVED';

export interface ILead extends Document {
  _id: mongoose.Types.ObjectId;
  business: mongoose.Types.ObjectId;
  user?: mongoose.Types.ObjectId;
  type: LeadType;
  customerName?: string;
  customerPhone?: string;
  customerEmail?: string;
  message?: string;
  partySize?: number;
  preferredDate?: string;
  preferredTime?: string;
  sourceUrl?: string;
  device?: string;
  ipAddress?: string;
  status: LeadStatus;
  notes?: string;
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

export interface ILeadModel extends Model<ILead> {}

const LeadSchema = new Schema<ILead>(
  {
    business: {
      type: Schema.Types.ObjectId,
      ref: 'Business',
      required: true,
      index: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      index: true,
    },
    type: {
      type: String,
      enum: ['CALL', 'WEBSITE', 'DIRECTION', 'WHATSAPP', 'BOOKING', 'ENQUIRY'],
      required: true,
      index: true,
    },
    customerName: {
      type: String,
      trim: true,
      default: '',
    },
    customerPhone: {
      type: String,
      trim: true,
      default: '',
    },
    customerEmail: {
      type: String,
      trim: true,
      default: '',
    },
    message: {
      type: String,
      trim: true,
      default: '',
    },
    partySize: {
      type: Number,
    },
    preferredDate: {
      type: String,
      default: '',
    },
    preferredTime: {
      type: String,
      default: '',
    },
    sourceUrl: {
      type: String,
      default: '',
    },
    device: {
      type: String,
      default: 'web',
    },
    ipAddress: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: ['NEW', 'CONTACTED', 'CONVERTED', 'ARCHIVED'],
      default: 'NEW',
      index: true,
    },
    notes: {
      type: String,
      default: '',
    },
    metadata: {
      type: Map,
      of: Schema.Types.Mixed,
      default: () => ({}),
    },
  },
  {
    timestamps: true,
  }
);

LeadSchema.index({ business: 1, createdAt: -1 });
LeadSchema.index({ business: 1, type: 1 });
LeadSchema.index({ createdAt: -1 });

export const Lead =
  (mongoose.models.Lead as ILeadModel) ||
  mongoose.model<ILead, ILeadModel>('Lead', LeadSchema);
