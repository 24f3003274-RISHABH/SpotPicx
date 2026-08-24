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

export interface ComprehensiveAdminAnalyticsData {
  timeframe: {
    range: string;
    days: number;
    startDate: string;
    endDate: string;
  };
  overview: {
    totalVisitors: number;
    uniqueVisitors: number;
    pageViews: number;
    searches: number;
    businessClicks: number;
    mapClicks: number;
    phoneClicks: number;
    websiteClicks: number;
    directionsClicks: number;
    savedPlaces: number;
    reviews: number;
    registrations: number;
    growthRates: {
      visitors: string;
      searches: string;
      clicks: string;
      reviews: string;
      registrations: string;
    };
  };
  timeline: Array<{
    date: string;
    visitors: number;
    pageViews: number;
    searches: number;
    interactions: number;
    aiQueries: number;
  }>;
  userAnalytics: {
    dau: number;
    wau: number;
    mau: number;
    newUsers: number;
    returningUsers: number;
    guestUsers: number;
    retention: Array<{ cohort: string; retention: number }>;
  };
  traffic: {
    sessions: number;
    topPages: Array<{ path: string; title: string; views: number; avgTime: string; bounceRate: string }>;
    trafficSources: Array<{ name: string; value: number; color: string }>;
    referrers: Array<{ source: string; visits: number; percentage: string }>;
    deviceBreakdown: Array<{ device: string; share: number; color: string }>;
    browserBreakdown: Array<{ browser: string; share: number }>;
    geoDistribution: Array<{ city: string; state: string; country: string; visitors: number; share: string }>;
  };
  searchAnalytics: {
    topSearches: Array<{ query: string; count: number; ctr: string; avgResults: number }>;
    trendingSearches: Array<{ query: string; growth: string; category: string }>;
    zeroResultSearches: Array<{ query: string; count: number; suggestedAction: string }>;
    searchConversionRate: string;
    popularCategories: Array<{ name: string; slug: string; searches: number; spotsCount: number }>;
    popularLocations: Array<{ name: string; slug: string; type: string; searchVolume: number }>;
  };
  businessAnalytics: {
    mostViewedBusinesses: Array<{
      _id: string;
      name: string;
      slug: string;
      locality: string;
      category: string;
      views: number;
      clicks: number;
      rating: number;
      reviews: number;
    }>;
    mostSavedBusinesses: Array<{ _id: string; name: string; locality: string; saves: number; rating: number }>;
    topActions: {
      mostCalled: Array<{ name: string; calls: number; locality: string }>;
      mostDirections: Array<{ name: string; directions: number; locality: string }>;
      mostWebsites: Array<{ name: string; visits: number; locality: string }>;
    };
    highestRated: Array<{ name: string; locality: string; rating: number; reviewCount: number }>;
  };
  contentAnalytics: {
    topSeoPages: Array<{ slug: string; title: string; impressions: number; clicks: number; ctr: string; avgPosition: number }>;
    topArticles: Array<{ title: string; views: number; shares: number; readTime: string }>;
  };
  aiAnalytics: {
    totalRequests: number;
    successRate: number;
    fallbackRate: number;
    avgLatencyMs: number;
    estimatedTokens: number;
    estimatedCostUsd: string;
    popularQueries: Array<{ question: string; count: number; sentiment: string }>;
  };
  dataFreshness: {
    totalSources: number;
    healthySources: number;
    lastGlobalSync: string;
    syncSuccessRate: string;
    freshRecords: number;
    staleRecords: number;
    expiredOffers: number;
    sourcesList: Array<{
      name: string;
      status: string;
      lastSync: string;
      recordsIngested: number;
      errorCount: number;
    }>;
  };
  systemHealth: {
    apiServerStatus: string;
    apiUptime: string;
    avgResponseTimeMs: number;
    activeConnections: number;
    errorRate: string;
    databaseStatus: string;
    databaseLatencyMs: number;
    jobQueueStatus: string;
    activeJobs: number;
    completedJobsToday: number;
    failedJobs: number;
    memoryHeapUsedMb: number;
    memoryHeapTotalMb: number;
    nodeVersion: string;
  };
}

export const adminService = {
  // Comprehensive Admin Analytics
  async getComprehensiveAnalytics(params?: {
    range?: string;
    startDate?: string;
    endDate?: string;
  }): Promise<ComprehensiveAdminAnalyticsData> {
    const res = await apiClient.get<{ success: boolean; data: ComprehensiveAdminAnalyticsData }>(
      '/admin/analytics',
      { params }
    );
    return res.data.data;
  },

  async downloadAnalyticsCSV(type: 'overview' | 'searches' | 'businesses' | 'traffic' | 'ai', range = '30d'): Promise<void> {
    const res = await apiClient.get(`/admin/analytics/export`, {
      params: { type, range },
      responseType: 'blob',
    });
    const blob = new Blob([res.data], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `spotpicks-${type}-analytics-${range}.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  },

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

  // Data Sources & Ingestion (Phase 15)
  async getDataSources(): Promise<any[]> {
    const res = await apiClient.get<{ success: boolean; data: { sources: any[] } }>(
      '/admin/sources'
    );
    return res.data.data.sources || [];
  },

  async getDataSourcesStats(): Promise<any> {
    const res = await apiClient.get<{ success: boolean; data: any }>(
      '/admin/sources/stats'
    );
    return res.data.data;
  },

  async runSourceIngestion(id: string): Promise<any> {
    const res = await apiClient.post<{ success: boolean; data: { result: any } }>(
      `/admin/sources/${id}/run`
    );
    return res.data.data.result;
  },

  async runAllSourcesIngestion(): Promise<any[]> {
    const res = await apiClient.post<{ success: boolean; data: { results: any[] } }>(
      '/admin/sources/run-all'
    );
    return res.data.data.results || [];
  },

  async createDataSource(data: any): Promise<any> {
    const res = await apiClient.post<{ success: boolean; data: { source: any } }>(
      '/admin/sources',
      data
    );
    return res.data.data.source;
  },

  async updateDataSource(id: string, data: any): Promise<any> {
    const res = await apiClient.put<{ success: boolean; data: { source: any } }>(
      `/admin/sources/${id}`,
      data
    );
    return res.data.data.source;
  },

  async deleteDataSource(id: string): Promise<void> {
    await apiClient.delete(`/admin/sources/${id}`);
  },

  async recalculateFreshness(): Promise<any> {
    const res = await apiClient.post<{ success: boolean; data: any }>(
      '/admin/freshness/recalculate'
    );
    return res.data.data;
  },
};
