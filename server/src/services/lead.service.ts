import mongoose from 'mongoose';
import { Lead, ILead, LeadType, LeadStatus } from '../models/Lead';
import { Business } from '../models/Business';
import { dbConnection } from '../config/db';
import { AnalyticsService } from './analytics.service';

export interface InMemoryLead {
  _id: string;
  business: string;
  user?: string;
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
  status: LeadStatus;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

// In-memory seed leads for Blue Tokai Saket & Social Hauz Khas
export const inMemoryLeads: Map<string, InMemoryLead> = new Map([
  [
    'lead-1',
    {
      _id: 'lead-1',
      business: 'spot-1',
      type: 'ENQUIRY',
      customerName: 'Pooja Verma',
      customerPhone: '+91 98112 45980',
      customerEmail: 'pooja.verma@example.com',
      message: 'Looking to book a quiet table for 6 people on Saturday 4 PM for a coffee tasting session.',
      partySize: 6,
      preferredDate: '2026-08-29',
      preferredTime: '16:00',
      sourceUrl: '/spots/blue-tokai-coffee-roasters-saket',
      device: 'mobile',
      status: 'NEW',
      createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - 3 * 60 * 60 * 1000),
    },
  ],
  [
    'lead-2',
    {
      _id: 'lead-2',
      business: 'spot-1',
      type: 'WHATSAPP',
      customerName: 'Karan Sharma',
      customerPhone: '+91 99710 33412',
      message: 'Inquired about whole bean coffee roast availability and home delivery.',
      sourceUrl: '/spots/blue-tokai-coffee-roasters-saket',
      device: 'mobile',
      status: 'CONTACTED',
      createdAt: new Date(Date.now() - 14 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - 12 * 60 * 60 * 1000),
    },
  ],
  [
    'lead-3',
    {
      _id: 'lead-3',
      business: 'spot-1',
      type: 'CALL',
      customerPhone: '+91 98731 22901',
      sourceUrl: '/spots/blue-tokai-coffee-roasters-saket',
      device: 'mobile',
      status: 'CONVERTED',
      createdAt: new Date(Date.now() - 26 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - 25 * 60 * 60 * 1000),
    },
  ],
  [
    'lead-4',
    {
      _id: 'lead-4',
      business: 'spot-1',
      type: 'DIRECTION',
      sourceUrl: '/explore',
      device: 'desktop',
      status: 'CONVERTED',
      createdAt: new Date(Date.now() - 32 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - 32 * 60 * 60 * 1000),
    },
  ],
  [
    'lead-5',
    {
      _id: 'lead-5',
      business: 'spot-2',
      type: 'ENQUIRY',
      customerName: 'Rohan Mehra',
      customerPhone: '+91 98100 77651',
      customerEmail: 'rohan.m@techcorp.in',
      message: 'Corporate team mixer for 20 pax with rooftop view and craft cocktail package.',
      partySize: 20,
      preferredDate: '2026-09-04',
      preferredTime: '19:30',
      sourceUrl: '/spots/social-offline-hauz-khas',
      device: 'desktop',
      status: 'NEW',
      createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - 5 * 60 * 60 * 1000),
    },
  ],
  [
    'lead-6',
    {
      _id: 'lead-6',
      business: 'spot-2',
      type: 'BOOKING',
      customerName: 'Simran Chadha',
      customerPhone: '+91 99991 23456',
      message: 'Sunset lake view table reserved for 2.',
      partySize: 2,
      preferredDate: '2026-08-28',
      preferredTime: '18:00',
      sourceUrl: '/spots/social-offline-hauz-khas',
      device: 'mobile',
      status: 'CONTACTED',
      createdAt: new Date(Date.now() - 20 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - 18 * 60 * 60 * 1000),
    },
  ],
]);

export class LeadService {
  /**
   * Track high-intent lead action (Call, Direction, Website, WhatsApp, Booking)
   */
  public static async trackLead(data: {
    businessId: string;
    userId?: string;
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
    metadata?: Record<string, any>;
  }) {
    // Increment specific action counter in analytics service
    if (data.type === 'CALL') AnalyticsService.trackAction(data.businessId, 'phone_click');
    else if (data.type === 'DIRECTION') AnalyticsService.trackAction(data.businessId, 'direction_click');
    else if (data.type === 'WEBSITE') AnalyticsService.trackAction(data.businessId, 'website_click');

    const leadId = `lead-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    if (dbConnection.getStatus().isConnected) {
      try {
        const lead = await Lead.create({
          business: new mongoose.Types.ObjectId(data.businessId),
          user: data.userId ? new mongoose.Types.ObjectId(data.userId) : undefined,
          type: data.type,
          customerName: data.customerName || '',
          customerPhone: data.customerPhone || '',
          customerEmail: data.customerEmail || '',
          message: data.message || '',
          partySize: data.partySize,
          preferredDate: data.preferredDate,
          preferredTime: data.preferredTime,
          sourceUrl: data.sourceUrl || '',
          device: data.device || 'web',
          status: 'NEW',
          metadata: data.metadata || {},
        });
        return lead.toObject();
      } catch (err) {
        console.warn('DB Lead create failed, storing in memory', err);
      }
    }

    const inMemLead: InMemoryLead = {
      _id: leadId,
      business: data.businessId,
      user: data.userId,
      type: data.type,
      customerName: data.customerName,
      customerPhone: data.customerPhone,
      customerEmail: data.customerEmail,
      message: data.message,
      partySize: data.partySize,
      preferredDate: data.preferredDate,
      preferredTime: data.preferredTime,
      sourceUrl: data.sourceUrl,
      device: data.device || 'web',
      status: 'NEW',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    inMemoryLeads.set(leadId, inMemLead);
    return inMemLead;
  }

  /**
   * Get all leads for a specific business or owned businesses
   */
  public static async getBusinessLeads(businessId: string, options?: { type?: LeadType; status?: LeadStatus; limit?: number }) {
    let leadsList: any[] = [];

    if (dbConnection.getStatus().isConnected) {
      try {
        const query: any = { business: businessId };
        if (options?.type) query.type = options.type;
        if (options?.status) query.status = options.status;

        leadsList = await Lead.find(query)
          .sort({ createdAt: -1 })
          .limit(options?.limit || 50)
          .lean();
      } catch {
        // Fallback
      }
    }

    if (leadsList.length === 0) {
      leadsList = Array.from(inMemoryLeads.values()).filter((l) => {
        const matchBiz = l.business === businessId || businessId === 'all';
        const matchType = options?.type ? l.type === options.type : true;
        const matchStatus = options?.status ? l.status === options.status : true;
        return matchBiz && matchType && matchStatus;
      });
    }

    // Lead metrics breakdown
    const totalLeads = leadsList.length;
    const calls = leadsList.filter((l) => l.type === 'CALL').length;
    const whatsApp = leadsList.filter((l) => l.type === 'WHATSAPP').length;
    const directions = leadsList.filter((l) => l.type === 'DIRECTION').length;
    const websites = leadsList.filter((l) => l.type === 'WEBSITE').length;
    const bookings = leadsList.filter((l) => l.type === 'BOOKING').length;
    const enquiries = leadsList.filter((l) => l.type === 'ENQUIRY').length;

    const newLeads = leadsList.filter((l) => l.status === 'NEW').length;
    const contacted = leadsList.filter((l) => l.status === 'CONTACTED').length;
    const converted = leadsList.filter((l) => l.status === 'CONVERTED').length;

    const conversionRate = totalLeads > 0 ? ((converted / totalLeads) * 100).toFixed(1) : '0';

    return {
      leads: leadsList,
      summary: {
        totalLeads,
        calls,
        whatsApp,
        directions,
        websites,
        bookings,
        enquiries,
        newLeads,
        contacted,
        converted,
        conversionRate: `${conversionRate}%`,
      },
    };
  }

  /**
   * Update lead CRM status (e.g. mark as Contacted or Converted)
   */
  public static async updateLeadStatus(leadId: string, status: LeadStatus, notes?: string) {
    if (dbConnection.getStatus().isConnected) {
      try {
        const updated = await Lead.findByIdAndUpdate(
          leadId,
          { status, ...(notes ? { notes } : {}), updatedAt: new Date() },
          { new: true }
        ).lean();
        if (updated) return updated;
      } catch {
        // Fallback
      }
    }

    const lead = inMemoryLeads.get(leadId);
    if (lead) {
      lead.status = status;
      if (notes) lead.notes = notes;
      lead.updatedAt = new Date();
      return lead;
    }

    return null;
  }
}
