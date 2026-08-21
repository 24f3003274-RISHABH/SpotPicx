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
    const res = await apiClient.get<{ success: boolean; data: { offers: OfferItem[]; total: number } }>(
      '/offers',
      { params: filters }
    );
    return res.data.data.offers || [];
  },

  // Public - by business
  async getOffersByBusiness(businessIdOrSlug: string): Promise<OfferItem[]> {
    const res = await apiClient.get<{ success: boolean; data: { offers: OfferItem[] } }>(
      `/offers/business/${businessIdOrSlug}`
    );
    return res.data.data.offers || [];
  },

  // Owner offers
  async getOwnerOffers(): Promise<OfferItem[]> {
    const res = await apiClient.get<{ success: boolean; data: { offers: OfferItem[] } }>(
      '/offers/my-offers'
    );
    return res.data.data.offers || [];
  },

  // Admin all offers
  async getAllAdminOffers(): Promise<OfferItem[]> {
    const res = await apiClient.get<{ success: boolean; data: { offers: OfferItem[]; total: number } }>(
      '/offers'
    );
    return res.data.data.offers || [];
  },

  // Create offer
  async createOffer(payload: CreateOfferPayload): Promise<OfferItem> {
    const res = await apiClient.post<{ success: boolean; data: { offer: OfferItem }; message: string }>(
      '/offers',
      payload
    );
    return res.data.data.offer;
  },

  // Toggle status
  async toggleOffer(offerId: string): Promise<OfferItem> {
    const res = await apiClient.patch<{ success: boolean; data: { offer: OfferItem }; message: string }>(
      `/offers/${offerId}/toggle`
    );
    return res.data.data.offer;
  },

  // Delete offer
  async deleteOffer(offerId: string): Promise<void> {
    await apiClient.delete(`/offers/${offerId}`);
  },
};
