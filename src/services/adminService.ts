import { apiClient } from '../api/apiClient';
import { Business, Category, LocationItem } from '../types';

export interface AdminStats {
  totalUsers: number;
  totalBusinesses: number;
  totalReviews: number;
  totalSearches: number;
  pendingClaims: number;
  pendingReports: number;
  activeOffers: number;
}

export interface AdminDashboardData {
  stats: AdminStats;
  popularCategories: Category[];
  popularLocations: LocationItem[];
  trendingBusinesses: Business[];
}

export interface AdminEvent {
  _id: string;
  title: string;
  slug: string;
  description: string;
  venue: string;
  locality: string;
  city: string;
  date: string;
  time: string;
  price: string;
  category: string;
  image: string;
  organizer: string;
  featured: boolean;
  status: 'UPCOMING' | 'ONGOING' | 'COMPLETED' | 'CANCELLED';
}

export interface AdminArticle {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string;
  author: string;
  category: string;
  tags: string[];
  readingTimeMinutes: number;
  featured: boolean;
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  publishedAt?: string;
  createdAt: string;
}

export interface AdminSeoPage {
  _id: string;
  slug: string;
  title: string;
  metaDescription: string;
  keywords: string[];
  h1: string;
  locality?: string;
  category?: string;
  customFaqs?: Array<{ question: string; answer: string }>;
  isIndexed: boolean;
}

export const adminService = {
  // Stats
  async getDashboardStats(): Promise<AdminDashboardData> {
    const res = await apiClient.get<{ success: boolean; data: AdminDashboardData }>('/admin/stats');
    return res.data.data;
  },

  // Businesses Moderation
  async getBusinesses(params?: {
    status?: string;
    search?: string;
    verified?: string;
    page?: number;
    limit?: number;
  }): Promise<{ data: Business[]; total: number; page: number; totalPages: number }> {
    const res = await apiClient.get<{
      success: boolean;
      data: { data: Business[]; total: number; page: number; totalPages: number };
    }>('/admin/businesses', { params });
    return res.data.data;
  },

  async updateBusinessStatus(id: string, status: string): Promise<Business> {
    const res = await apiClient.patch<{ success: boolean; data: { business: Business } }>(
      `/admin/businesses/${id}/status`,
      { status }
    );
    return res.data.data.business;
  },

  async toggleBusinessVerified(id: string): Promise<Business> {
    const res = await apiClient.patch<{ success: boolean; data: { business: Business } }>(
      `/admin/businesses/${id}/verify`
    );
    return res.data.data.business;
  },

  async deleteBusiness(id: string): Promise<void> {
    await apiClient.delete(`/admin/businesses/${id}`);
  },

  // Review Moderation
  async getReviews(status?: string) {
    const res = await apiClient.get<{ success: boolean; data: { reviews: any[]; total: number } }>(
      '/admin/reviews',
      { params: { status } }
    );
    return res.data.data.reviews || [];
  },

  async updateReviewStatus(id: string, status: string) {
    const res = await apiClient.patch<{ success: boolean; data: { review: any } }>(
      `/admin/reviews/${id}/status`,
      { status }
    );
    return res.data.data.review;
  },

  async deleteReview(id: string) {
    await apiClient.delete(`/admin/reviews/${id}`);
  },

  // Events
  async getEvents(): Promise<AdminEvent[]> {
    const res = await apiClient.get<{ success: boolean; data: { events: AdminEvent[] } }>(
      '/admin/events'
    );
    return res.data.data.events || [];
  },

  async createEvent(data: Partial<AdminEvent>): Promise<AdminEvent> {
    const res = await apiClient.post<{ success: boolean; data: { event: AdminEvent } }>(
      '/admin/events',
      data
    );
    return res.data.data.event;
  },

  async deleteEvent(id: string): Promise<void> {
    await apiClient.delete(`/admin/events/${id}`);
  },

  // Articles
  async getArticles(): Promise<AdminArticle[]> {
    const res = await apiClient.get<{ success: boolean; data: { articles: AdminArticle[] } }>(
      '/admin/articles'
    );
    return res.data.data.articles || [];
  },

  async createArticle(data: Partial<AdminArticle>): Promise<AdminArticle> {
    const res = await apiClient.post<{ success: boolean; data: { article: AdminArticle } }>(
      '/admin/articles',
      data
    );
    return res.data.data.article;
  },

  async deleteArticle(id: string): Promise<void> {
    await apiClient.delete(`/admin/articles/${id}`);
  },

  // SEO Pages
  async getSeoPages(): Promise<AdminSeoPage[]> {
    const res = await apiClient.get<{ success: boolean; data: { seoPages: AdminSeoPage[] } }>(
      '/admin/seo-pages'
    );
    return res.data.data.seoPages || [];
  },

  async createSeoPage(data: Partial<AdminSeoPage>): Promise<AdminSeoPage> {
    const res = await apiClient.post<{ success: boolean; data: { page: AdminSeoPage } }>(
      '/admin/seo-pages',
      data
    );
    return res.data.data.page;
  },

  async deleteSeoPage(id: string): Promise<void> {
    await apiClient.delete(`/admin/seo-pages/${id}`);
  },
};
