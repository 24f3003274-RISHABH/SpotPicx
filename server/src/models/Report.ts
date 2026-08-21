import mongoose, { Document, Schema, Model } from 'mongoose';

export type ReportTargetType = 'BUSINESS' | 'REVIEW' | 'PHOTO' | 'COLLECTION' | 'USER' | 'CONTENT';
export type ReportReason =
  | 'SPAM_OR_FAKE'
  | 'INAPPROPRIATE_CONTENT'
  | 'OUTDATED_OR_CLOSED'
  | 'INCORRECT_LOCATION'
  | 'HARASSMENT'
  | 'COPYRIGHT'
  | 'OTHER';
export type ReportStatus = 'PENDING' | 'INVESTIGATING' | 'RESOLVED' | 'DISMISSED';

export interface IReport extends Document {
  _id: mongoose.Types.ObjectId;
  targetType: ReportTargetType;
  targetId: string;
  targetName?: string;
  reason: ReportReason;
  details: string;
  reporter: mongoose.Types.ObjectId | {
    _id: string;
    name: string;
    email: string;
  };
  reporterEmail?: string;
  status: ReportStatus;
  adminNotes?: string;
  resolvedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface IReportModel extends Model<IReport> {}

const ReportSchema = new Schema<IReport>(
  {
    targetType: {
      type: String,
      enum: ['BUSINESS', 'REVIEW', 'PHOTO', 'COLLECTION', 'USER', 'CONTENT'],
      required: [true, 'Target type is required'],
      index: true,
    },
    targetId: {
      type: String,
      required: [true, 'Target ID is required'],
      index: true,
    },
    targetName: {
      type: String,
      default: '',
    },
    reason: {
      type: String,
      enum: [
        'SPAM_OR_FAKE',
        'INAPPROPRIATE_CONTENT',
        'OUTDATED_OR_CLOSED',
        'INCORRECT_LOCATION',
        'HARASSMENT',
        'COPYRIGHT',
        'OTHER',
      ],
      required: [true, 'Reason is required'],
      index: true,
    },
    details: {
      type: String,
      required: [true, 'Details are required'],
      trim: true,
      maxlength: [1000, 'Details cannot exceed 1000 characters'],
    },
    reporter: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      index: true,
    },
    reporterEmail: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: ['PENDING', 'INVESTIGATING', 'RESOLVED', 'DISMISSED'],
      default: 'PENDING',
      index: true,
    },
    adminNotes: {
      type: String,
      default: '',
    },
    resolvedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

export const Report =
  (mongoose.models.Report as IReportModel) ||
  mongoose.model<IReport, IReportModel>('Report', ReportSchema);
