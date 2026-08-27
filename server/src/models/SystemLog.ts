import mongoose, { Document, Schema, Model } from 'mongoose';

export type LogLevel = 'INFO' | 'WARN' | 'ERROR' | 'FATAL';
export type LogCategory = 'REQUEST' | 'AUTH' | 'DATABASE' | 'AI' | 'SCRAPER' | 'JOB' | 'PAYMENT' | 'SECURITY';

export interface ISystemLog extends Document {
  _id: mongoose.Types.ObjectId;
  level: LogLevel;
  category: LogCategory;
  message: string;
  details?: Record<string, any>;
  path?: string;
  method?: string;
  statusCode?: number;
  ip?: string;
  userId?: string;
  durationMs?: number;
  timestamp: Date;
}

export interface ISystemLogModel extends Model<ISystemLog> {}

const SystemLogSchema = new Schema<ISystemLog>(
  {
    level: {
      type: String,
      enum: ['INFO', 'WARN', 'ERROR', 'FATAL'],
      default: 'INFO',
      index: true,
    },
    category: {
      type: String,
      enum: ['REQUEST', 'AUTH', 'DATABASE', 'AI', 'SCRAPER', 'JOB', 'PAYMENT', 'SECURITY'],
      default: 'REQUEST',
      index: true,
    },
    message: {
      type: String,
      required: true,
      trim: true,
    },
    details: {
      type: Schema.Types.Mixed,
      default: {},
    },
    path: {
      type: String,
      default: '',
      index: true,
    },
    method: {
      type: String,
      default: '',
    },
    statusCode: {
      type: Number,
      index: true,
    },
    ip: {
      type: String,
      default: '',
    },
    userId: {
      type: String,
      default: '',
    },
    durationMs: {
      type: Number,
      default: 0,
    },
    timestamp: {
      type: Date,
      default: Date.now,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// TTL index to automatically purge production logs after 30 days
SystemLogSchema.index({ timestamp: 1 }, { expireAfterSeconds: 30 * 24 * 60 * 60 });
SystemLogSchema.index({ level: 1, category: 1, timestamp: -1 });

export const SystemLog =
  (mongoose.models.SystemLog as ISystemLogModel) ||
  mongoose.model<ISystemLog, ISystemLogModel>('SystemLog', SystemLogSchema);
