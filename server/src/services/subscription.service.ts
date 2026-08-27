import mongoose from 'mongoose';
import { Subscription, ISubscription, PlanTier, BillingCycle } from '../models/Subscription';
import { Business } from '../models/Business';
import { User } from '../models/User';
import { dbConnection } from '../config/db';
import { BUSINESS_PLANS_CONFIG } from '../config/plans.config';
import { PaymentService } from './payment/payment.service';
import { CreateCheckoutParams, VerifyPaymentParams } from './payment/payment.interface';

export interface InMemorySubscription {
  _id: string;
  business: string;
  user: string;
  plan: PlanTier;
  billingStatus: 'ACTIVE' | 'TRIALING' | 'PAST_DUE' | 'CANCELLED' | 'EXPIRED';
  billingCycle: BillingCycle;
  amount: number;
  currency: string;
  startDate: Date;
  endDate: Date;
  nextBillingDate: Date;
  autoRenew: boolean;
  paymentProvider: 'RAZORPAY' | 'STRIPE' | 'OFFLINE' | 'MANUAL' | 'MOCK';
  invoiceHistory: any[];
  featuresSnapshot: any;
  createdAt: Date;
  updatedAt: Date;
}

// Initial seed subscriptions for in-memory mode
export const inMemorySubscriptions: Map<string, InMemorySubscription> = new Map([
  [
    'sub-spot-1',
    {
      _id: 'sub-spot-1',
      business: 'spot-1', // Blue Tokai Saket
      user: 'usr-aarav',
      plan: 'PREMIUM',
      billingStatus: 'ACTIVE',
      billingCycle: 'MONTHLY',
      amount: 2499,
      currency: 'INR',
      startDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
      endDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
      nextBillingDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
      autoRenew: true,
      paymentProvider: 'RAZORPAY',
      invoiceHistory: [
        {
          invoiceId: 'INV-2026-0801',
          amount: 2499,
          currency: 'INR',
          date: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
          status: 'PAID',
          pdfUrl: '#',
        },
      ],
      featuresSnapshot: BUSINESS_PLANS_CONFIG.PREMIUM.limits,
      createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(),
    },
  ],
  [
    'sub-spot-2',
    {
      _id: 'sub-spot-2',
      business: 'spot-2', // Social Hauz Khas
      user: 'usr-aarav',
      plan: 'ENTERPRISE',
      billingStatus: 'ACTIVE',
      billingCycle: 'ANNUAL',
      amount: 69990,
      currency: 'INR',
      startDate: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000),
      endDate: new Date(Date.now() + 320 * 24 * 60 * 60 * 1000),
      nextBillingDate: new Date(Date.now() + 320 * 24 * 60 * 60 * 1000),
      autoRenew: true,
      paymentProvider: 'STRIPE',
      invoiceHistory: [
        {
          invoiceId: 'INV-2026-0710',
          amount: 69990,
          currency: 'INR',
          date: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000),
          status: 'PAID',
          pdfUrl: '#',
        },
      ],
      featuresSnapshot: BUSINESS_PLANS_CONFIG.ENTERPRISE.limits,
      createdAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(),
    },
  ],
]);

export class SubscriptionService {
  /**
   * Get all public business plan definitions
   */
  public static getPlansConfig() {
    return BUSINESS_PLANS_CONFIG;
  }

  /**
   * Get current active subscription for a business
   */
  public static async getBusinessSubscription(businessId: string): Promise<any> {
    if (dbConnection.getStatus().isConnected) {
      try {
        const sub = await Subscription.findOne({ business: businessId, billingStatus: { $in: ['ACTIVE', 'TRIALING'] } })
          .sort({ createdAt: -1 })
          .lean();
        if (sub) {
          const planConfig = BUSINESS_PLANS_CONFIG[sub.plan as PlanTier] || BUSINESS_PLANS_CONFIG.FREE;
          return { ...sub, planDetails: planConfig };
        }
      } catch (err) {
        console.warn('Subscription DB lookup error, falling back to memory', err);
      }
    }

    // In-memory lookup
    for (const sub of inMemorySubscriptions.values()) {
      if (sub.business === businessId && (sub.billingStatus === 'ACTIVE' || sub.billingStatus === 'TRIALING')) {
        const planConfig = BUSINESS_PLANS_CONFIG[sub.plan] || BUSINESS_PLANS_CONFIG.FREE;
        return { ...sub, planDetails: planConfig };
      }
    }

    // Default FREE plan response
    return {
      _id: `sub-free-${businessId}`,
      business: businessId,
      plan: 'FREE',
      billingStatus: 'ACTIVE',
      billingCycle: 'MONTHLY',
      amount: 0,
      currency: 'INR',
      startDate: new Date(),
      endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
      autoRenew: true,
      paymentProvider: 'MOCK',
      invoiceHistory: [],
      planDetails: BUSINESS_PLANS_CONFIG.FREE,
    };
  }

  /**
   * Initiate subscription checkout session
   */
  public static async initiateCheckout(params: {
    businessId: string;
    userId: string;
    planId: PlanTier;
    billingCycle: BillingCycle;
    customerEmail: string;
    provider?: 'RAZORPAY' | 'STRIPE' | 'MOCK';
  }) {
    const planConfig = BUSINESS_PLANS_CONFIG[params.planId];
    if (!planConfig) {
      throw new Error(`Invalid plan tier: ${params.planId}`);
    }

    const priceObj = params.billingCycle === 'ANNUAL' ? planConfig.pricing.annual : planConfig.pricing.monthly;
    const amount = priceObj.amount;

    if (amount === 0) {
      // Direct activation for FREE plan
      return this.activateFreePlan(params.businessId, params.userId);
    }

    const checkoutParams: CreateCheckoutParams = {
      businessId: params.businessId,
      userId: params.userId,
      planId: params.planId,
      billingCycle: params.billingCycle,
      amount,
      currency: 'INR',
      customerEmail: params.customerEmail,
      metadata: {
        businessId: params.businessId,
        userId: params.userId,
        planId: params.planId,
        billingCycle: params.billingCycle,
      },
    };

    const session = await PaymentService.createCheckoutSession(checkoutParams, params.provider);
    return {
      session,
      plan: planConfig,
      amount,
      billingCycle: params.billingCycle,
    };
  }

  /**
   * Verify checkout & activate subscription
   */
  public static async verifyAndActivate(params: {
    businessId: string;
    userId: string;
    planId: PlanTier;
    billingCycle: BillingCycle;
    provider: 'RAZORPAY' | 'STRIPE' | 'MOCK';
    paymentId: string;
    orderId?: string;
    signature?: string;
    sessionId?: string;
  }) {
    const planConfig = BUSINESS_PLANS_CONFIG[params.planId];
    const amount = params.billingCycle === 'ANNUAL' ? planConfig.pricing.annual.amount : planConfig.pricing.monthly.amount;

    const verifyParams: VerifyPaymentParams = {
      provider: params.provider,
      paymentId: params.paymentId,
      orderId: params.orderId,
      signature: params.signature,
      sessionId: params.sessionId,
      businessId: params.businessId,
      planId: params.planId,
      billingCycle: params.billingCycle,
      amount,
    };

    const verification = await PaymentService.verifyPayment(verifyParams);
    if (!verification.success) {
      throw new Error('Payment verification failed');
    }

    const durationDays = params.billingCycle === 'ANNUAL' ? 365 : 30;
    const startDate = new Date();
    const endDate = new Date(Date.now() + durationDays * 24 * 60 * 60 * 1000);

    const invoice = {
      invoiceId: `INV-${Date.now().toString().slice(-6)}`,
      amount,
      currency: 'INR',
      date: startDate,
      status: 'PAID' as const,
      pdfUrl: '#',
    };

    if (dbConnection.getStatus().isConnected) {
      try {
        // Cancel existing active subscription
        await Subscription.updateMany(
          { business: params.businessId, billingStatus: 'ACTIVE' },
          { billingStatus: 'CANCELLED', cancelledAt: new Date() }
        );

        const sub = await Subscription.create({
          business: new mongoose.Types.ObjectId(params.businessId),
          user: new mongoose.Types.ObjectId(params.userId),
          plan: params.planId,
          billingStatus: 'ACTIVE',
          billingCycle: params.billingCycle,
          amount,
          currency: 'INR',
          startDate,
          endDate,
          nextBillingDate: endDate,
          autoRenew: true,
          paymentProvider: params.provider,
          lastPaymentId: params.paymentId,
          invoiceHistory: [invoice],
          featuresSnapshot: planConfig.limits,
        });

        // Also update Business verification & featured flags
        await Business.findByIdAndUpdate(params.businessId, {
          verified: planConfig.limits.verifiedBadge,
        });

        return {
          success: true,
          subscription: sub.toObject(),
          plan: planConfig,
          receiptNumber: verification.receiptNumber,
        };
      } catch (err) {
        console.warn('DB Subscription save failed, writing to memory', err);
      }
    }

    // In-memory activation
    const subId = `sub-${Date.now()}`;
    const inMemSub: InMemorySubscription = {
      _id: subId,
      business: params.businessId,
      user: params.userId,
      plan: params.planId,
      billingStatus: 'ACTIVE',
      billingCycle: params.billingCycle,
      amount,
      currency: 'INR',
      startDate,
      endDate,
      nextBillingDate: endDate,
      autoRenew: true,
      paymentProvider: params.provider,
      invoiceHistory: [invoice],
      featuresSnapshot: planConfig.limits,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    inMemorySubscriptions.set(subId, inMemSub);

    return {
      success: true,
      subscription: inMemSub,
      plan: planConfig,
      receiptNumber: verification.receiptNumber,
    };
  }

  /**
   * Activate Free Plan directly
   */
  private static async activateFreePlan(businessId: string, userId: string) {
    const freePlan = BUSINESS_PLANS_CONFIG.FREE;
    const subData = {
      _id: `sub-free-${Date.now()}`,
      business: businessId,
      user: userId,
      plan: 'FREE' as PlanTier,
      billingStatus: 'ACTIVE' as const,
      billingCycle: 'MONTHLY' as BillingCycle,
      amount: 0,
      currency: 'INR',
      startDate: new Date(),
      endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
      nextBillingDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
      autoRenew: true,
      paymentProvider: 'MOCK' as const,
      invoiceHistory: [],
      featuresSnapshot: freePlan.limits,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    inMemorySubscriptions.set(subData._id, subData);

    return {
      success: true,
      subscription: subData,
      plan: freePlan,
    };
  }

  /**
   * Cancel subscription
   */
  public static async cancelSubscription(businessId: string, reason?: string) {
    if (dbConnection.getStatus().isConnected) {
      try {
        await Subscription.updateMany(
          { business: businessId, billingStatus: 'ACTIVE' },
          { billingStatus: 'CANCELLED', autoRenew: false, cancelledAt: new Date(), cancellationReason: reason || 'User requested' }
        );
      } catch (err) {
        console.warn('DB cancel subscription failed', err);
      }
    }

    for (const sub of inMemorySubscriptions.values()) {
      if (sub.business === businessId && sub.billingStatus === 'ACTIVE') {
        sub.billingStatus = 'CANCELLED';
        sub.autoRenew = false;
      }
    }

    return { success: true, message: 'Subscription auto-renew cancelled' };
  }

  /**
   * Admin: List all platform subscriptions
   */
  public static async getAllSubscriptions() {
    if (dbConnection.getStatus().isConnected) {
      try {
        return await Subscription.find().populate('business', 'name slug locality').populate('user', 'name email').sort({ createdAt: -1 }).lean();
      } catch {
        // Fallback
      }
    }

    return Array.from(inMemorySubscriptions.values());
  }
}
