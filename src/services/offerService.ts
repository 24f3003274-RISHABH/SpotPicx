import { apiClient } from '../api/apiClient';
import { OfferItem } from '../types';

export type { OfferItem };

export interface CreateOfferPayload {
  businessId: string;
  title: string;
  description?: string;
  discount: string;
  couponCode?: string;
  validFrom?: string;
  validUntil?: string;
  terms?: string[];
  category?: string;
  tags?: string[];
}

export const offerService = {
  // Public - all offers with filters
  async getPublicOffers(filters: {
    category?: string;
    locality?: string;
    query?: string;
    tag?: string;
  } = {}): Promise<OfferItem[]> {
    const res: any = await apiClient.get('/offers', { params: filters });
    return res?.data?.offers || res?.data || res?.offers || (Array.isArray(res) ? res : []);
  },

  // Public - by business
  async getOffersByBusiness(businessIdOrSlug: string): Promise<OfferItem[]> {
    const res: any = await apiClient.get(`/offers/business/${businessIdOrSlug}`);
    return res?.data?.offers || res?.data || res?.offers || (Array.isArray(res) ? res : []);
  },

  // Owner offers
  async getOwnerOffers(): Promise<OfferItem[]> {
    const res: any = await apiClient.get('/offers/my-offers');
    return res?.data?.offers || res?.data || res?.offers || (Array.isArray(res) ? res : []);
  },

  // Admin all offers
  async getAllAdminOffers(): Promise<OfferItem[]> {
    const res: any = await apiClient.get('/offers');
    return res?.data?.offers || res?.data || res?.offers || (Array.isArray(res) ? res : []);
  },

  // Create offer
  async createOffer(payload: CreateOfferPayload): Promise<OfferItem> {
    const res: any = await apiClient.post('/offers', payload);
    return res?.data?.offer || res?.data || res?.offer || res;
  },

  // Toggle status
  async toggleOffer(offerId: string): Promise<OfferItem> {
    const res: any = await apiClient.patch(`/offers/${offerId}/toggle`);
    return res?.data?.offer || res?.data || res?.offer || res;
  },

  // Delete offer
  async deleteOffer(offerId: string): Promise<void> {
    await apiClient.delete(`/offers/${offerId}`);
  },
};
