import { apiClient } from '../api/apiClient';
import { Business } from '../types';

export interface OwnerAnalyticsSummary {
  totalListings: number;
  profileViews: number;
  searchAppearances: number;
  directionClicks: number;
  phoneClicks: number;
  websiteClicks: number;
  totalReviews: number;
  averageRating: number;
}

export interface OwnerAnalyticsBusiness {
  _id: string;
  name: string;
  slug: string;
  locality: string;
  rating: number;
  reviewCount: number;
  metrics: {
    profileViews: number;
    searchAppearances: number;
    directionClicks: number;
    phoneClicks: number;
    websiteClicks: number;
  };
}

export interface OwnerAnalyticsTimelineItem {
  date: string;
  profileViews: number;
  searchAppearances: number;
  directionClicks: number;
  phoneClicks: number;
  websiteClicks: number;
}

export interface OwnerAnalyticsPayload {
  summary: OwnerAnalyticsSummary;
  businesses: OwnerAnalyticsBusiness[];
  timeline: OwnerAnalyticsTimelineItem[];
}

export const businessOwnerService = {
  // Get owner analytics
  async getAnalytics(businessId?: string): Promise<OwnerAnalyticsPayload> {
    const res: any = await apiClient.get('/business-owner/analytics', {
      params: { businessId },
    });
    return res?.data?.data || res?.data || res;
  },

  // Get owner's listings
  async getMyBusinesses(): Promise<Business[]> {
    const res: any = await apiClient.get('/businesses', { params: { limit: 50 } });
    return res?.data?.businesses || res?.data?.data || res?.data || (Array.isArray(res) ? res : []);
  },

  // Create new listing
  async createListing(data: any): Promise<Business> {
    const res: any = await apiClient.post('/businesses', data);
    // Safely extract business from standard response contract
    return res?.data?.business || res?.data?.data || res?.data || res?.business || res;
  },

  // Create batch of listings (e.g. 5 in one go)
  async createBatchListings(businesses: any[]): Promise<Business[]> {
    const res: any = await apiClient.post('/businesses/batch', { businesses });
    return res?.data?.data || res?.data?.businesses || res?.data || [];
  },

  // Update existing listing
  async updateListing(id: string, data: any): Promise<Business> {
    const res: any = await apiClient.put(`/businesses/${id}`, data);
    return res?.data?.business || res?.data || res?.business || res;
  },

  // Delete listing
  async deleteListing(id: string): Promise<void> {
    await apiClient.delete(`/businesses/${id}`);
  },

  // Track customer interaction (directions, calls, views)
  async trackInteraction(
    businessId: string,
    action: 'view' | 'search_appearance' | 'direction_click' | 'phone_click' | 'website_click'
  ) {
    try {
      await apiClient.post(`/businesses/${businessId}/track`, { action });
    } catch {
      // Non-blocking tracking
    }
  },
};
