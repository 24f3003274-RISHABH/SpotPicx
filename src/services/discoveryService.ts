import { apiClient } from '../api/apiClient';
import {
  Category,
  CategoryListResponse,
  LocationItem,
  LocationListResponse,
  Business,
  BusinessListResponse,
  SingleBusinessResponse,
} from '../types';

export interface BusinessQueryParams {
  page?: number;
  limit?: number;
  category?: string;
  locality?: string;
  city?: string;
  priceRange?: string;
  verified?: boolean;
  rating?: number;
  tags?: string;
  q?: string;
  sort?: 'rating' | 'reviews' | 'newest' | 'name';
}

export const discoveryService = {
  // Categories
  async getCategories(params?: { type?: string; parent?: string }): Promise<Category[]> {
    const res = await apiClient.get<CategoryListResponse>('/categories', { params });
    return res.data.data;
  },

  async getCategoryBySlug(slug: string): Promise<Category> {
    const res = await apiClient.get<{ success: boolean; data: Category }>(`/categories/${slug}`);
    return res.data.data;
  },

  // Locations
  async getLocations(params?: { type?: string; city?: string }): Promise<LocationItem[]> {
    const res = await apiClient.get<LocationListResponse>('/locations', { params });
    return res.data.data;
  },

  async getLocationBySlug(slug: string): Promise<LocationItem> {
    const res = await apiClient.get<{ success: boolean; data: LocationItem }>(`/locations/${slug}`);
    return res.data.data;
  },

  async getLocationBusinesses(slug: string, params?: { page?: number; limit?: number }): Promise<BusinessListResponse> {
    const res = await apiClient.get<BusinessListResponse>(`/locations/${slug}/businesses`, { params });
    return res.data;
  },

  // Businesses
  async getBusinesses(params?: BusinessQueryParams): Promise<BusinessListResponse> {
    const res = await apiClient.get<BusinessListResponse>('/businesses', { params });
    return res.data;
  },

  async getBusinessBySlug(slug: string): Promise<Business> {
    const res = await apiClient.get<SingleBusinessResponse>(`/businesses/${slug}`);
    return res.data.data;
  },

  async createBusiness(data: Partial<Business>): Promise<Business> {
    const res = await apiClient.post<SingleBusinessResponse>('/businesses', data);
    return res.data.data;
  },

  async updateBusiness(id: string, data: Partial<Business>): Promise<Business> {
    const res = await apiClient.put<SingleBusinessResponse>(`/businesses/${id}`, data);
    return res.data.data;
  },

  async deleteBusiness(id: string): Promise<boolean> {
    const res = await apiClient.delete<{ success: boolean }>(`/businesses/${id}`);
    return res.data.success;
  },

  // Seed trigger
  async triggerSeed(): Promise<any> {
    const res = await apiClient.post('/seed');
    return res.data;
  },
};
