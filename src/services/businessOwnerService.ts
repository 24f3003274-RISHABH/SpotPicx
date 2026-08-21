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
    const res = await apiClient.get<{ success: boolean; data: OwnerAnalyticsPayload }>(
      '/business-owner/analytics',
      { params: { businessId } }
    );
    return res.data.data;
  },

  // Get owner's listings
  async getMyBusinesses(): Promise<Business[]> {
    const res = await apiClient.get<{ success: boolean; data: Business[] }>(
      '/businesses',
      { params: { limit: 50 } }
    );
    return res.data.data || [];
  },

  // Create new listing
  async createListing(data: any): Promise<Business> {
    const res = await apiClient.post<{ success: boolean; data: { business: Business } }>(
      '/businesses',
      data
    );
    return res.data.data.business || (res.data.data as any);
  },

  // Update existing listing
  async updateListing(id: string, data: any): Promise<Business> {
    const res = await apiClient.put<{ success: boolean; data: { business: Business } }>(
      `/businesses/${id}`,
      data
    );
    return res.data.data.business || (res.data.data as any);
  },

  // Delete listing
  async deleteListing(id: string): Promise<void> {
    await apiClient.delete(`/businesses/${id}`);
  },

  // Track customer interaction (directions, calls, views)
  async trackInteraction(businessId: string, action: 'view' | 'search_appearance' | 'direction_click' | 'phone_click' | 'website_click') {
    try {
      await apiClient.post(`/businesses/${businessId}/track`, { action });
    } catch {
      // Non-blocking tracking
    }
  },
};
