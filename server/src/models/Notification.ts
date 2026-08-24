import mongoose, { Document, Schema, Model } from 'mongoose';

export type NotificationType =
  | 'NEW_OFFER'
  | 'SAVED_PLACE_UPDATE'
  | 'EVENT_ALERT'
  | 'BUSINESS_UPDATE'
  | 'REVIEW_RESPONSE'
  | 'REVIEW_LIKED'
  | 'COLLECTION_SAVED'
  | 'BUSINESS_VERIFIED'
  | 'SYSTEM_ALERT';

export interface INotification extends Document {
  _id: mongoose.Types.ObjectId;
  recipient: mongoose.Types.ObjectId;
  type: NotificationType;
  title: string;
  message: string;
  link?: string;
  isRead: boolean;
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

export interface INotificationModel extends Model<INotification> {}

const NotificationSchema = new Schema<INotification>(
  {
    recipient: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    type: {
      type: String,
      enum: [
        'NEW_OFFER',
        'SAVED_PLACE_UPDATE',
        'EVENT_ALERT',
        'BUSINESS_UPDATE',
        'REVIEW_RESPONSE',
        'REVIEW_LIKED',
        'COLLECTION_SAVED',
        'BUSINESS_VERIFIED',
        'SYSTEM_ALERT',
      ],
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    message: {
      type: String,
      required: true,
      trim: true,
    },
    link: {
      type: String,
      default: '',
    },
    isRead: {
      type: Boolean,
      default: false,
      index: true,
    },
    metadata: {
      type: Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true,
  }
);

export const Notification =
  (mongoose.models.Notification as INotificationModel) ||
  mongoose.model<INotification, INotificationModel>('Notification', NotificationSchema);
