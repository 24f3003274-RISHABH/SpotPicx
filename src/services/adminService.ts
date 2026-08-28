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
    const res: any = await apiClient.get('/admin/analytics', { params });
    return res?.data || res;
  },

  async downloadAnalyticsCSV(type: 'overview' | 'searches' | 'businesses' | 'traffic' | 'ai', range = '30d'): Promise<void> {
    const res: any = await apiClient.get(`/admin/analytics/export`, {
      params: { type, range },
      responseType: 'blob',
    });
    const blob = new Blob([res?.data || res], { type: 'text/csv;charset=utf-8;' });
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
    const res: any = await apiClient.get('/admin/stats');
    return res?.data || res;
  },

  // Businesses Moderation
  async getBusinesses(params?: {
    status?: string;
    search?: string;
    verified?: string;
    page?: number;
    limit?: number;
  }): Promise<{ data: Business[]; total: number; page: number; totalPages: number }> {
    const res: any = await apiClient.get('/admin/businesses', { params });
    return res?.data || res || { data: [], total: 0, page: 1, totalPages: 1 };
  },

  async createBusiness(data: any): Promise<Business> {
    const res: any = await apiClient.post('/businesses', data);
    return res?.data || res;
  },

  async updateBusiness(id: string, data: any): Promise<Business> {
    const res: any = await apiClient.patch(`/businesses/${id}`, data);
    return res?.data || res;
  },

  async updateBusinessStatus(id: string, status: string): Promise<Business> {
    const res: any = await apiClient.patch(`/admin/businesses/${id}/status`, { status });
    return res?.data?.business || res?.data || res?.business || res;
  },

  async toggleBusinessVerified(id: string): Promise<Business> {
    const res: any = await apiClient.patch(`/admin/businesses/${id}/verify`);
    return res?.data?.business || res?.data || res?.business || res;
  },

  async deleteBusiness(id: string): Promise<void> {
    await apiClient.delete(`/admin/businesses/${id}`);
  },

  // Review Moderation
  async getReviews(status?: string) {
    const res: any = await apiClient.get('/admin/reviews', { params: { status } });
    return res?.data?.reviews || res?.data || res?.reviews || (Array.isArray(res) ? res : []);
  },

  async updateReviewStatus(id: string, status: string) {
    const res: any = await apiClient.patch(`/admin/reviews/${id}/status`, { status });
    return res?.data?.review || res?.data || res?.review || res;
  },

  async deleteReview(id: string) {
    await apiClient.delete(`/admin/reviews/${id}`);
  },

  // Events
  async getEvents(): Promise<AdminEvent[]> {
    const res: any = await apiClient.get('/admin/events');
    return res?.data?.events || res?.data || res?.events || (Array.isArray(res) ? res : []);
  },

  async createEvent(data: Partial<AdminEvent>): Promise<AdminEvent> {
    const res: any = await apiClient.post('/admin/events', data);
    return res?.data?.event || res?.data || res?.event || res;
  },

  async deleteEvent(id: string): Promise<void> {
    await apiClient.delete(`/admin/events/${id}`);
  },

  // Articles
  async getArticles(): Promise<AdminArticle[]> {
    const res: any = await apiClient.get('/admin/articles');
    return res?.data?.articles || res?.data || res?.articles || (Array.isArray(res) ? res : []);
  },

  async createArticle(data: Partial<AdminArticle>): Promise<AdminArticle> {
    const res: any = await apiClient.post('/admin/articles', data);
    return res?.data?.article || res?.data || res?.article || res;
  },

  async deleteArticle(id: string): Promise<void> {
    await apiClient.delete(`/admin/articles/${id}`);
  },

  // SEO Pages
  async getSeoPages(): Promise<AdminSeoPage[]> {
    const res: any = await apiClient.get('/admin/seo-pages');
    return res?.data?.seoPages || res?.data || res?.seoPages || (Array.isArray(res) ? res : []);
  },

  async createSeoPage(data: Partial<AdminSeoPage>): Promise<AdminSeoPage> {
    const res: any = await apiClient.post('/admin/seo-pages', data);
    return res?.data?.page || res?.data || res?.page || res;
  },

  async deleteSeoPage(id: string): Promise<void> {
    await apiClient.delete(`/admin/seo-pages/${id}`);
  },

  // Data Sources & Ingestion (Phase 15)
  async getDataSources(): Promise<any[]> {
    const res: any = await apiClient.get('/admin/sources');
    return res?.data?.sources || res?.data || res?.sources || (Array.isArray(res) ? res : []);
  },

  async getDataSourcesStats(): Promise<any> {
    const res: any = await apiClient.get('/admin/sources/stats');
    return res?.data || res;
  },

  async runSourceIngestion(id: string): Promise<any> {
    const res: any = await apiClient.post(`/admin/sources/${id}/run`);
    return res?.data?.result || res?.data || res;
  },

  async runAllSourcesIngestion(): Promise<any[]> {
    const res: any = await apiClient.post('/admin/sources/run-all');
    return res?.data?.results || res?.data || res || [];
  },

  async createDataSource(data: any): Promise<any> {
    const res: any = await apiClient.post('/admin/sources', data);
    return res?.data?.source || res?.data || res?.source || res;
  },

  async updateDataSource(id: string, data: any): Promise<any> {
    const res: any = await apiClient.put(`/admin/sources/${id}`, data);
    return res?.data?.source || res?.data || res?.source || res;
  },

  async deleteDataSource(id: string): Promise<void> {
    await apiClient.delete(`/admin/sources/${id}`);
  },

  async recalculateFreshness(): Promise<any> {
    const res: any = await apiClient.post('/admin/freshness/recalculate');
    return res?.data || res;
  },

  // Production System Logs & Diagnostic Telemetry (Phase 22)
  async getSystemLogs(params?: {
    category?: string;
    level?: string;
    limit?: number;
    search?: string;
  }): Promise<any[]> {
    const res: any = await apiClient.get('/admin/logs', { params });
    return res?.data?.logs || res?.data || res?.logs || (Array.isArray(res) ? res : []);
  },

  async getLogStats(): Promise<any> {
    const res: any = await apiClient.get('/admin/logs/stats');
    return res?.data || res;
  },
};
