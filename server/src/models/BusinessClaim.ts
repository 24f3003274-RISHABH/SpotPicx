import mongoose, { Document, Schema, Model } from 'mongoose';

export type ClaimStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export interface IBusinessClaim extends Document {
  _id: mongoose.Types.ObjectId;
  business: mongoose.Types.ObjectId;
  user: mongoose.Types.ObjectId;
  documents: string[];
  message: string;
  status: ClaimStatus;
  reviewedBy?: mongoose.Types.ObjectId | null;
  reviewedAt?: Date | null;
  rejectionReason?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IBusinessClaimModel extends Model<IBusinessClaim> {}

const BusinessClaimSchema = new Schema<IBusinessClaim>(
  {
    business: {
      type: Schema.Types.ObjectId,
      ref: 'Business',
      required: [true, 'Business is required'],
      index: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Claimant user is required'],
      index: true,
    },
    documents: [
      {
        type: String,
        trim: true,
      },
    ],
    message: {
      type: String,
      default: '',
      trim: true,
      maxlength: 1000,
    },
    status: {
      type: String,
      enum: ['PENDING', 'APPROVED', 'REJECTED'],
      default: 'PENDING',
      index: true,
    },
    reviewedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    reviewedAt: {
      type: Date,
      default: null,
    },
    rejectionReason: {
      type: String,
      default: '',
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

BusinessClaimSchema.index({ business: 1, user: 1, status: 1 });
BusinessClaimSchema.index({ createdAt: -1 });

export const BusinessClaim =
  (mongoose.models.BusinessClaim as IBusinessClaimModel) ||
  mongoose.model<IBusinessClaim, IBusinessClaimModel>('BusinessClaim', BusinessClaimSchema);

