import { apiClient } from '../api/apiClient';

export interface PlanPricing {
  amount: number;
  currency: 'INR' | 'USD';
  displayPrice: string;
  period: string;
  savingsPercent?: number;
}

export interface PlanFeature {
  name: string;
  included: boolean;
  limit?: string | number;
  highlight?: boolean;
}

export interface BusinessPlan {
  id: 'FREE' | 'BASIC' | 'PREMIUM' | 'ENTERPRISE';
  name: string;
  tagline: string;
  popular?: boolean;
  badgeText?: string;
  pricing: {
    monthly: PlanPricing;
    annual: PlanPricing;
  };
  features: PlanFeature[];
  limits: {
    activeOffers: number;
    photosUpload: number;
    leadTrackingHistoryDays: number;
    supportLevel: string;
    aiConciergeCitations: boolean;
    sponsoredRotationCredits: number;
    verifiedBadge: boolean;
    whatsappDirectLead: boolean;
    customerPhoneAccess: boolean;
  };
}

export interface PromotionPackage {
  id: string;
  type: string;
  name: string;
  price: number;
  currency: string;
  durationDays: number;
  description: string;
  placement: string;
}

export interface BusinessSubscription {
  _id: string;
  business: string;
  plan: 'FREE' | 'BASIC' | 'PREMIUM' | 'ENTERPRISE';
  billingStatus: 'ACTIVE' | 'TRIALING' | 'PAST_DUE' | 'CANCELLED' | 'EXPIRED';
  billingCycle: 'MONTHLY' | 'ANNUAL';
  amount: number;
  currency: string;
  startDate: string;
  endDate: string;
  nextBillingDate: string;
  autoRenew: boolean;
  paymentProvider: string;
  invoiceHistory?: Array<{
    invoiceId: string;
    amount: number;
    currency: string;
    date: string;
    status: string;
    pdfUrl?: string;
  }>;
  planDetails?: BusinessPlan;
}

export interface LeadItem {
  _id: string;
  business: string;
  type: 'CALL' | 'WEBSITE' | 'DIRECTION' | 'WHATSAPP' | 'BOOKING' | 'ENQUIRY';
  customerName?: string;
  customerPhone?: string;
  customerEmail?: string;
  message?: string;
  partySize?: number;
  preferredDate?: string;
  preferredTime?: string;
  sourceUrl?: string;
  device?: string;
  status: 'NEW' | 'CONTACTED' | 'CONVERTED' | 'ARCHIVED';
  notes?: string;
  createdAt: string;
}

export interface AdvertisementItem {
  _id: string;
  title: string;
  type: 'BANNER' | 'NATIVE_CARD' | 'SPONSORED_LISTING' | 'PROMOTED_CATEGORY' | 'PROMOTED_EVENT' | 'SPONSORED_COLLECTION';
  placement: string;
  business?: any;
  headline: string;
  description: string;
  callToAction: string;
  targetUrl: string;
  imageUrl?: string;
  badgeLabel: 'Sponsored' | 'Promoted' | 'Featured Partner' | 'Ad';
  targetCategories?: string[];
  targetLocalities?: string[];
  price?: number;
  impressions?: number;
  clicks?: number;
  ctr?: string;
  status?: string;
  sponsorName?: string;
}

export const monetizationService = {
  /**
   * Get public plans and promotion packages
   */
  async getPlans(): Promise<{ plans: Record<string, BusinessPlan>; promotionPackages: PromotionPackage[] }> {
    const res = await apiClient.get('/monetization/plans');
    return res.data.data;
  },

  /**
   * Get subscription for a business
   */
  async getSubscription(businessId: string): Promise<BusinessSubscription> {
    const res = await apiClient.get(`/monetization/subscription/${businessId}`);
    return res.data.data;
  },

  /**
   * Initiate plan upgrade checkout
   */
  async initiateCheckout(params: {
    businessId: string;
    planId: 'FREE' | 'BASIC' | 'PREMIUM' | 'ENTERPRISE';
    billingCycle: 'MONTHLY' | 'ANNUAL';
    customerEmail?: string;
    provider?: 'RAZORPAY' | 'STRIPE' | 'MOCK';
  }) {
    const res = await apiClient.post('/monetization/checkout', params);
    return res.data.data;
  },

  /**
   * Verify and activate checkout payment
   */
  async verifyPayment(params: {
    businessId: string;
    planId: string;
    billingCycle: string;
    provider: string;
    paymentId: string;
    orderId?: string;
    signature?: string;
    sessionId?: string;
  }) {
    const res = await apiClient.post('/monetization/verify', params);
    return res.data.data;
  },

  /**
   * Cancel subscription auto-renewal
   */
  async cancelSubscription(businessId: string, reason?: string) {
    const res = await apiClient.post('/monetization/cancel', { businessId, reason });
    return res.data.data;
  },

  /**
   * Track high-intent lead actions (Call, Directions, Website, WhatsApp, Booking)
   */
  async trackLead(data: {
    businessId: string;
    type: 'CALL' | 'WEBSITE' | 'DIRECTION' | 'WHATSAPP' | 'BOOKING';
    customerPhone?: string;
    customerName?: string;
    sourceUrl?: string;
  }) {
    try {
      const res = await apiClient.post('/monetization/leads/track', {
        ...data,
        device: typeof window !== 'undefined' && window.innerWidth < 768 ? 'mobile' : 'desktop',
      });
      return res.data.data;
    } catch (err) {
      console.warn('Lead tracking non-critical error', err);
      return null;
    }
  },

  /**
   * Send customer direct booking / lead enquiry
   */
  async submitEnquiry(data: {
    businessId: string;
    customerName: string;
    customerPhone: string;
    customerEmail?: string;
    message?: string;
    partySize?: number;
    preferredDate?: string;
    preferredTime?: string;
    sourceUrl?: string;
  }) {
    const res = await apiClient.post('/monetization/leads/enquiry', data);
    return res.data.data;
  },

  /**
   * Business owner: get all received leads
   */
  async getBusinessLeads(
    businessId: string,
    options?: { type?: string; status?: string }
  ): Promise<{
    leads: LeadItem[];
    summary: {
      totalLeads: number;
      calls: number;
      whatsApp: number;
      directions: number;
      websites: number;
      bookings: number;
      enquiries: number;
      newLeads: number;
      contacted: number;
      converted: number;
      conversionRate: string;
    };
  }> {
    const res = await apiClient.get(`/monetization/leads/${businessId}`, { params: options });
    return res.data.data;
  },

  /**
   * Business owner: update lead CRM status
   */
  async updateLeadStatus(leadId: string, status: string, notes?: string) {
    const res = await apiClient.patch(`/monetization/leads/${leadId}/status`, { status, notes });
    return res.data.data;
  },

  /**
   * Public: Get ads by placement
   */
  async getAdsByPlacement(
    placement: string,
    options?: { category?: string; locality?: string; limit?: number }
  ): Promise<AdvertisementItem[]> {
    try {
      const res = await apiClient.get(`/monetization/ads/placement/${placement}`, { params: options });
      return res.data.data;
    } catch {
      return [];
    }
  },

  /**
   * Track ad impression
   */
  async trackAdImpression(adId: string) {
    try {
      await apiClient.post(`/monetization/ads/${adId}/impression`);
    } catch {
      // Non-critical
    }
  },

  /**
   * Track ad click
   */
  async trackAdClick(adId: string) {
    try {
      await apiClient.post(`/monetization/ads/${adId}/click`);
    } catch {
      // Non-critical
    }
  },

  /**
   * Admin: Get monetization intelligence
   */
  async getAdminMonetizationAnalytics(range = '30d') {
    const res = await apiClient.get('/monetization/admin/analytics', { params: { range } });
    return res.data.data;
  },

  /**
   * Admin: Get all ads
   */
  async getAdminAds(): Promise<AdvertisementItem[]> {
    const res = await apiClient.get('/monetization/admin/ads');
    return res.data.data;
  },

  /**
   * Admin: Create Ad
   */
  async createAdminAd(data: any) {
    const res = await apiClient.post('/monetization/admin/ads', data);
    return res.data.data;
  },

  /**
   * Admin: Update Ad
   */
  async updateAdminAd(id: string, data: any) {
    const res = await apiClient.put(`/monetization/admin/ads/${id}`, data);
    return res.data.data;
  },

  /**
   * Admin: Delete Ad
   */
  async deleteAdminAd(id: string) {
    const res = await apiClient.delete(`/monetization/admin/ads/${id}`);
    return res.data.data;
  },

  /**
   * Admin: Get all subscriptions
   */
  async getAdminSubscriptions() {
    const res = await apiClient.get('/monetization/admin/subscriptions');
    return res.data.data;
  },
};
