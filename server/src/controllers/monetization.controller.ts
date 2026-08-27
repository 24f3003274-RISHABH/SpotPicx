import { Request, Response } from 'express';
import { SubscriptionService } from '../services/subscription.service';
import { LeadService } from '../services/lead.service';
import { AdService } from '../services/ad.service';
import { RevenueAnalyticsService } from '../services/revenueAnalytics.service';
import { asyncHandler } from '../utils/asyncHandler';
import { sendSuccess, sendError } from '../utils/response';
import { AdPlacement } from '../models/Advertisement';
import { PlanTier, BillingCycle } from '../models/Subscription';

export class MonetizationController {
  /**
   * GET /api/v1/monetization/plans
   */
  public static getPlans = asyncHandler(async (_req: Request, res: Response) => {
    const plans = SubscriptionService.getPlansConfig();
    const promotionPackages = AdService.getPromotionPackages();
    return sendSuccess(res, { plans, promotionPackages }, 'Business plans and promotions loaded');
  });

  /**
   * GET /api/v1/monetization/subscription/:businessId
   */
  public static getSubscription = asyncHandler(async (req: Request, res: Response) => {
    const { businessId } = req.params;
    const sub = await SubscriptionService.getBusinessSubscription(businessId);
    return sendSuccess(res, sub, 'Business subscription loaded');
  });

  /**
   * POST /api/v1/monetization/checkout
   */
  public static initiateCheckout = asyncHandler(async (req: Request, res: Response) => {
    const userId = (req as any).user?._id || (req as any).user?.id || 'usr-guest';
    const customerEmail = (req as any).user?.email || req.body.customerEmail || 'owner@example.com';
    const { businessId, planId, billingCycle, provider } = req.body;

    if (!businessId || !planId) {
      return sendError(res, 'businessId and planId are required', 400);
    }

    const checkoutData = await SubscriptionService.initiateCheckout({
      businessId,
      userId,
      planId: planId as PlanTier,
      billingCycle: (billingCycle || 'MONTHLY') as BillingCycle,
      customerEmail,
      provider,
    });

    return sendSuccess(res, checkoutData, 'Checkout session initiated');
  });

  /**
   * POST /api/v1/monetization/verify
   */
  public static verifyPayment = asyncHandler(async (req: Request, res: Response) => {
    const userId = (req as any).user?._id || (req as any).user?.id || 'usr-guest';
    const { businessId, planId, billingCycle, provider, paymentId, orderId, signature, sessionId } = req.body;

    if (!businessId || !planId || !paymentId) {
      return sendError(res, 'Missing required payment verification details', 400);
    }

    const activation = await SubscriptionService.verifyAndActivate({
      businessId,
      userId,
      planId: planId as PlanTier,
      billingCycle: (billingCycle || 'MONTHLY') as BillingCycle,
      provider: provider || 'MOCK',
      paymentId,
      orderId,
      signature,
      sessionId,
    });

    return sendSuccess(res, activation, 'Payment verified and plan activated successfully');
  });

  /**
   * POST /api/v1/monetization/cancel
   */
  public static cancelSubscription = asyncHandler(async (req: Request, res: Response) => {
    const { businessId, reason } = req.body;
    if (!businessId) {
      return sendError(res, 'businessId is required', 400);
    }

    const result = await SubscriptionService.cancelSubscription(businessId, reason);
    return sendSuccess(res, result, 'Subscription cancelled');
  });

  /**
   * POST /api/v1/monetization/leads/track
   */
  public static trackLeadAction = asyncHandler(async (req: Request, res: Response) => {
    const { businessId, type, customerPhone, customerName, sourceUrl, device, metadata } = req.body;
    if (!businessId || !type) {
      return sendError(res, 'businessId and lead type are required', 400);
    }

    const userId = (req as any).user?._id || (req as any).user?.id;
    const lead = await LeadService.trackLead({
      businessId,
      userId,
      type,
      customerPhone,
      customerName,
      sourceUrl,
      device: device || 'web',
      metadata,
    });

    return sendSuccess(res, lead, 'Lead action recorded');
  });

  /**
   * POST /api/v1/monetization/leads/enquiry
   */
  public static submitEnquiry = asyncHandler(async (req: Request, res: Response) => {
    const { businessId, customerName, customerPhone, customerEmail, message, partySize, preferredDate, preferredTime, sourceUrl } = req.body;

    if (!businessId || !customerName || !customerPhone) {
      return sendError(res, 'Business, Name and Phone are required for enquiry', 400);
    }

    const userId = (req as any).user?._id || (req as any).user?.id;
    const enquiry = await LeadService.trackLead({
      businessId,
      userId,
      type: 'ENQUIRY',
      customerName,
      customerPhone,
      customerEmail,
      message,
      partySize: partySize ? Number(partySize) : undefined,
      preferredDate,
      preferredTime,
      sourceUrl,
    });

    return sendSuccess(res, enquiry, 'Enquiry submitted successfully to business owner');
  });

  /**
   * GET /api/v1/monetization/leads/:businessId
   */
  public static getBusinessLeads = asyncHandler(async (req: Request, res: Response) => {
    const { businessId } = req.params;
    const { type, status, limit } = req.query;

    const data = await LeadService.getBusinessLeads(businessId, {
      type: type as any,
      status: status as any,
      limit: limit ? Number(limit) : 50,
    });

    return sendSuccess(res, data, 'Business leads retrieved');
  });

  /**
   * PATCH /api/v1/monetization/leads/:leadId/status
   */
  public static updateLeadStatus = asyncHandler(async (req: Request, res: Response) => {
    const { leadId } = req.params;
    const { status, notes } = req.body;

    if (!status) {
      return sendError(res, 'Status is required', 400);
    }

    const updated = await LeadService.updateLeadStatus(leadId, status, notes);
    return sendSuccess(res, updated, 'Lead status updated');
  });

  /**
   * GET /api/v1/monetization/ads/placement/:placement
   */
  public static getAdsForPlacement = asyncHandler(async (req: Request, res: Response) => {
    const { placement } = req.params;
    const { category, locality, limit } = req.query;

    const ads = await AdService.getAdsByPlacement(placement as AdPlacement, {
      category: category as string,
      locality: locality as string,
      limit: limit ? Number(limit) : 4,
    });

    return sendSuccess(res, ads, 'Ads loaded for placement');
  });

  /**
   * POST /api/v1/monetization/ads/:adId/impression
   */
  public static trackAdImpression = asyncHandler(async (req: Request, res: Response) => {
    const { adId } = req.params;
    await AdService.trackImpression(adId);
    return sendSuccess(res, { success: true }, 'Ad impression recorded');
  });

  /**
   * POST /api/v1/monetization/ads/:adId/click
   */
  public static trackAdClick = asyncHandler(async (req: Request, res: Response) => {
    const { adId } = req.params;
    await AdService.trackClick(adId);
    return sendSuccess(res, { success: true }, 'Ad click recorded');
  });

  /**
   * GET /api/v1/monetization/admin/analytics
   */
  public static getAdminMonetizationAnalytics = asyncHandler(async (req: Request, res: Response) => {
    const { range } = req.query;
    const data = await RevenueAnalyticsService.getMonetizationAnalytics({ range: range as string });
    return sendSuccess(res, data, 'Revenue & Monetization intelligence loaded');
  });

  /**
   * GET /api/v1/monetization/admin/ads
   */
  public static getAdminAds = asyncHandler(async (_req: Request, res: Response) => {
    const ads = await AdService.getAllAds();
    return sendSuccess(res, ads, 'All advertisements loaded');
  });

  /**
   * POST /api/v1/monetization/admin/ads
   */
  public static createAdminAd = asyncHandler(async (req: Request, res: Response) => {
    const userId = (req as any).user?._id || (req as any).user?.id;
    const ad = await AdService.createAd(req.body, userId);
    return sendSuccess(res, ad, 'Advertisement created', 201);
  });

  /**
   * PUT /api/v1/monetization/admin/ads/:id
   */
  public static updateAdminAd = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const updated = await AdService.updateAd(id, req.body);
    return sendSuccess(res, updated, 'Advertisement updated');
  });

  /**
   * DELETE /api/v1/monetization/admin/ads/:id
   */
  public static deleteAdminAd = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    await AdService.deleteAd(id);
    return sendSuccess(res, { deleted: true }, 'Advertisement deleted');
  });

  /**
   * GET /api/v1/monetization/admin/subscriptions
   */
  public static getAdminSubscriptions = asyncHandler(async (_req: Request, res: Response) => {
    const subs = await SubscriptionService.getAllSubscriptions();
    return sendSuccess(res, subs, 'All subscriptions loaded');
  });
}
