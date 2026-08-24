import mongoose, { Document, Schema, Model } from 'mongoose';

export type DataSourceType = 'API' | 'SCRAPER' | 'RSS' | 'WEB_SEARCH' | 'MANUAL';
export type DataSourceStatus = 'ACTIVE' | 'PAUSED' | 'FAILED' | 'DISABLED';

export interface IRateLimitConfig {
  requestDelayMs: number; // Delay between HTTP calls in ms (e.g. 1000ms)
  maxRequestsPerRun: number; // Max items/pages per single execution run (e.g. 50)
  retryLimit: number; // Number of retries on transient error (e.g. 3)
  backoffFactor: number; // Exponential backoff multiplier (e.g. 2)
}

export interface IDataSource extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  slug: string;
  type: DataSourceType;
  categorySlug?: string;
  baseUrl: string;
  sourceUrl: string;
  status: DataSourceStatus;
  lastRun: Date | null;
  nextRun: Date | null;
  lastSuccess: Date | null;
  lastFailure: Date | null;
  itemsProcessed: number;
  itemsUpdated: number;
  errorCount: number;
  rateLimit: IRateLimitConfig;
  scheduleIntervalMinutes: number; // Periodic run interval in minutes (e.g. 360 = 6 hours)
  lastError: string | null;
  metadata: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

export interface IDataSourceModel extends Model<IDataSource> {}

const DataSourceSchema = new Schema<IDataSource>(
  {
    name: {
      type: String,
      required: [true, 'Data source name is required'],
      trim: true,
      maxlength: 120,
    },
    slug: {
      type: String,
      required: [true, 'Data source slug is required'],
      unique: true,
      trim: true,
      lowercase: true,
      index: true,
    },
    type: {
      type: String,
      enum: ['API', 'SCRAPER', 'RSS', 'WEB_SEARCH', 'MANUAL'],
      default: 'API',
      required: true,
      index: true,
    },
    categorySlug: {
      type: String,
      trim: true,
      default: '',
    },
    baseUrl: {
      type: String,
      required: [true, 'Base URL is required'],
      trim: true,
    },
    sourceUrl: {
      type: String,
      required: [true, 'Source URL is required'],
      trim: true,
    },
    status: {
      type: String,
      enum: ['ACTIVE', 'PAUSED', 'FAILED', 'DISABLED'],
      default: 'ACTIVE',
      index: true,
    },
    lastRun: {
      type: Date,
      default: null,
    },
    nextRun: {
      type: Date,
      default: () => new Date(Date.now() + 60 * 1000), // Default next run 1 min after creation
    },
    lastSuccess: {
      type: Date,
      default: null,
    },
    lastFailure: {
      type: Date,
      default: null,
    },
    itemsProcessed: {
      type: Number,
      default: 0,
    },
    itemsUpdated: {
      type: Number,
      default: 0,
    },
    errorCount: {
      type: Number,
      default: 0,
    },
    rateLimit: {
      requestDelayMs: {
        type: Number,
        default: 1000,
      },
      maxRequestsPerRun: {
        type: Number,
        default: 50,
      },
      retryLimit: {
        type: Number,
        default: 3,
      },
      backoffFactor: {
        type: Number,
        default: 2,
      },
    },
    scheduleIntervalMinutes: {
      type: Number,
      default: 360, // 6 hours
    },
    lastError: {
      type: String,
      default: null,
    },
    metadata: {
      type: Schema.Types.Mixed,
      default: () => ({
        attribution: 'Official Public Directory',
        robotsTxtCompliant: true,
        termsOfServiceUrl: '',
      }),
    },
  },
  {
    timestamps: true,
  }
);

DataSourceSchema.index({ status: 1, nextRun: 1 });

export const DataSource =
  (mongoose.models.DataSource as IDataSourceModel) ||
  mongoose.model<IDataSource, IDataSourceModel>('DataSource', DataSourceSchema);
