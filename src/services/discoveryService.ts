import { apiClient } from '../api/apiClient';
import { Business, SpecialDiscoveryData, OfferItem, JobItem } from '../types';

export interface BusinessQueryParams {
  category?: string;
  location?: string;
  locality?: string;
  city?: string;
  type?: string;
  limit?: number;
  page?: number;
  query?: string;
  q?: string;
  tags?: string[];
  sort?: string;
  priceRange?: string;
  isClaimed?: boolean;
  verified?: boolean;
  [key: string]: any;
}

export interface StudentDiscoveryResponse {
  type: 'businesses' | 'jobs';
  items: (Business | JobItem)[];
  total: number;
  studentOffers?: OfferItem[];
  featuredJobs?: JobItem[];
}

export interface HousingDiscoveryResponse {
  items: Business[];
  total: number;
}

export const discoveryService = {
  // Core Categories
  async getCategories(params?: { type?: string; parent?: string }) {
    const res = await apiClient.get('/categories', { params });
    return res.data;
  },

  async getCategoryBySlug(slug: string) {
    const res = await apiClient.get(`/categories/${slug}`);
    return res.data;
  },

  // Core Locations & India Expansion
  async getLocations(params?: { type?: string; city?: string; state?: string; status?: string }) {
    const res = await apiClient.get('/locations', { params });
    return res.data;
  },

  async getLocationBySlug(slug: string) {
    const res = await apiClient.get(`/locations/${slug}`);
    return res.data;
  },

  async getLocationBusinesses(slug: string, params?: { page?: number; limit?: number }) {
    const res = await apiClient.get(`/locations/${slug}/businesses`, { params });
    return res.data;
  },

  async getIndiaOverview() {
    const res = await apiClient.get('/locations/india');
    return res.data;
  },

  async getStateBySlug(stateSlug: string) {
    const res = await apiClient.get(`/locations/india/${stateSlug}`);
    return res.data;
  },

  async getCityBySlug(stateSlug: string, citySlug: string) {
    const res = await apiClient.get(`/locations/india/${stateSlug}/${citySlug}`);
    return res.data;
  },

  async updateLocationStatus(idOrSlug: string, status: 'ACTIVE' | 'COMING_SOON' | 'BETA' | 'INACTIVE') {
    const res = await apiClient.patch(`/locations/${idOrSlug}/status`, { status });
    return res.data;
  },

  async joinCityWaitlist(data: { citySlug: string; email: string; name?: string; role?: string }) {
    const res = await apiClient.post('/locations/waitlist', data);
    return res.data;
  },

  // Core Businesses
  async getBusinesses(params?: BusinessQueryParams) {
    const res = await apiClient.get('/businesses', { params });
    return res.data;
  },

  async getBusinessBySlug(slug: string) {
    const res = await apiClient.get(`/businesses/${slug}`);
    return res.data;
  },

  async askAboutPlace(idOrSlug: string, question: string) {
    const res = await apiClient.post(`/businesses/${idOrSlug}/ask-place`, { question });
    return res.data.data;
  },

  async generatePlaceSummary(idOrSlug: string) {
    const res = await apiClient.post(`/businesses/${idOrSlug}/generate-summary`);
    return res.data.data;
  },

  async createBusiness(data: Partial<Business>) {
    const res = await apiClient.post('/businesses', data);
    return res.data;
  },

  async triggerSeed() {
    const res = await apiClient.post('/seed');
    return res.data;
  },

  // Student Discovery
  async getStudentDiscovery(params: {
    category?: string;
    college?: string;
    studentFriendlyOnly?: boolean;
    budgetOnly?: boolean;
    nearMetroOnly?: boolean;
    query?: string;
  } = {}): Promise<StudentDiscoveryResponse> {
    const res = await apiClient.get('/discovery/students', { params });
    return res.data.data;
  },

  // Housing Discovery
  async getHousingDiscovery(params: {
    housingType?: string;
    gender?: string;
    acOnly?: boolean;
    foodIncluded?: boolean;
    furnishedOnly?: boolean;
    nearMetro?: boolean;
    collegeHub?: string;
    query?: string;
  } = {}): Promise<HousingDiscoveryResponse> {
    const res = await apiClient.get('/discovery/housing', { params });
    return res.data.data;
  },

  // Special Discovery by Intent
  async getSpecialDiscovery(params: {
    intent: string;
    locality?: string;
    query?: string;
  }): Promise<SpecialDiscoveryData> {
    const res = await apiClient.get('/discovery/special', { params });
    return res.data.data;
  },
};
