import mongoose, { Document, Schema, Model } from 'mongoose';

export type PlanTier = 'FREE' | 'BASIC' | 'PREMIUM' | 'ENTERPRISE';
export type BillingStatus = 'ACTIVE' | 'TRIALING' | 'PAST_DUE' | 'CANCELLED' | 'EXPIRED';
export type BillingCycle = 'MONTHLY' | 'ANNUAL';
export type PaymentProviderType = 'RAZORPAY' | 'STRIPE' | 'OFFLINE' | 'MANUAL' | 'MOCK';

export interface ISubscription extends Document {
  _id: mongoose.Types.ObjectId;
  business: mongoose.Types.ObjectId;
  user: mongoose.Types.ObjectId;
  plan: PlanTier;
  billingStatus: BillingStatus;
  billingCycle: BillingCycle;
  amount: number;
  currency: string;
  startDate: Date;
  endDate: Date;
  nextBillingDate: Date;
  autoRenew: boolean;
  paymentProvider: PaymentProviderType;
  providerSubscriptionId?: string;
  providerCustomerId?: string;
  lastPaymentId?: string;
  invoiceHistory: Array<{
    invoiceId: string;
    amount: number;
    currency: string;
    date: Date;
    status: 'PAID' | 'FAILED' | 'PENDING';
    pdfUrl?: string;
  }>;
  featuresSnapshot?: Record<string, any>;
  cancelledAt?: Date;
  cancellationReason?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ISubscriptionModel extends Model<ISubscription> {}

const SubscriptionSchema = new Schema<ISubscription>(
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
      required: true,
      index: true,
    },
    plan: {
      type: String,
      enum: ['FREE', 'BASIC', 'PREMIUM', 'ENTERPRISE'],
      default: 'FREE',
      index: true,
    },
    billingStatus: {
      type: String,
      enum: ['ACTIVE', 'TRIALING', 'PAST_DUE', 'CANCELLED', 'EXPIRED'],
      default: 'ACTIVE',
      index: true,
    },
    billingCycle: {
      type: String,
      enum: ['MONTHLY', 'ANNUAL'],
      default: 'MONTHLY',
    },
    amount: {
      type: Number,
      default: 0,
    },
    currency: {
      type: String,
      default: 'INR',
    },
    startDate: {
      type: Date,
      default: Date.now,
    },
    endDate: {
      type: Date,
      default: () => new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    },
    nextBillingDate: {
      type: Date,
      default: () => new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    },
    autoRenew: {
      type: Boolean,
      default: true,
    },
    paymentProvider: {
      type: String,
      enum: ['RAZORPAY', 'STRIPE', 'OFFLINE', 'MANUAL', 'MOCK'],
      default: 'MOCK',
    },
    providerSubscriptionId: {
      type: String,
      default: '',
    },
    providerCustomerId: {
      type: String,
      default: '',
    },
    lastPaymentId: {
      type: String,
      default: '',
    },
    invoiceHistory: [
      {
        invoiceId: { type: String, required: true },
        amount: { type: Number, required: true },
        currency: { type: String, default: 'INR' },
        date: { type: Date, default: Date.now },
        status: { type: String, enum: ['PAID', 'FAILED', 'PENDING'], default: 'PAID' },
        pdfUrl: { type: String, default: '' },
      },
    ],
    featuresSnapshot: {
      type: Map,
      of: Schema.Types.Mixed,
      default: () => ({}),
    },
    cancelledAt: {
      type: Date,
    },
    cancellationReason: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

SubscriptionSchema.index({ business: 1, billingStatus: 1 });
SubscriptionSchema.index({ user: 1, plan: 1 });

export const Subscription =
  (mongoose.models.Subscription as ISubscriptionModel) ||
  mongoose.model<ISubscription, ISubscriptionModel>('Subscription', SubscriptionSchema);
