import { apiClient } from '../api/apiClient';
import { SEOPage } from '../types';

export const seoService = {
  /**
   * Get all published SEO landing pages
   */
  async getAllPages(): Promise<SEOPage[]> {
    try {
      const response: any = await apiClient.get('/seo-pages');
      return response?.data?.seoPages || response?.data || (Array.isArray(response) ? response : []);
    } catch (e) {
      console.warn('Failed to fetch SEO pages from API:', e);
      return [];
    }
  },

  /**
   * Get single SEO page by slug with calculated Top 10 rankings and JSON-LD schema
   */
  async getPageBySlug(slug: string): Promise<{ page: SEOPage; jsonLd?: any } | null> {
    try {
      const response: any = await apiClient.get(`/seo-pages/${slug}`);
      if (response?.data?.page) return response.data;
      if (response?.page) return response;
      if (response?.data) return { page: response.data };
      return null;
    } catch (e) {
      console.warn(`Failed to fetch SEO page /${slug}:`, e);
      return null;
    }
  },

  /**
   * Save or update an SEO page configuration
   */
  async createOrUpdatePage(pageData: Partial<SEOPage>): Promise<SEOPage | null> {
    try {
      const response: any = await apiClient.post('/seo-pages', pageData);
      return response?.data?.page || response?.data || response?.page || response || null;
    } catch (e) {
      console.error('Failed to save SEO page:', e);
      return null;
    }
  },

  /**
   * Generates AI-grounded draft for an SEO landing page based on SpotPicks structured database
   */
  async generateAiDraft(params: {
    slug: string;
    category?: string;
    location?: string;
    intent?: string;
  }): Promise<Partial<SEOPage> | null> {
    try {
      const response: any = await apiClient.post('/seo-pages/ai-draft', params);
      return response?.data?.draft || response?.data || response || null;
    } catch (e) {
      console.error('Failed to generate AI SEO draft:', e);
      return null;
    }
  },

  /**
   * Track organic search landing page visit
   */
  async trackLandingPage(slug: string, query?: string, referrer?: string): Promise<void> {
    try {
      await apiClient.post('/seo-pages/analytics/track-landing', {
        slug,
        query,
        referrer: referrer || document.referrer,
        device: window.innerWidth < 768 ? 'mobile' : 'desktop',
      });
    } catch (e) {
      // Non-blocking telemetry
    }
  },

  /**
   * Track organic search conversion (directions, calls, websites)
   */
  async trackConversion(slug: string, action: string, businessId?: string): Promise<void> {
    try {
      await apiClient.post('/seo-pages/analytics/track-conversion', {
        slug,
        action,
        businessId,
      });
    } catch (e) {
      // Non-blocking telemetry
    }
  },

  /**
   * Get SEO organic traffic overview
   */
  async getSeoAnalyticsOverview(): Promise<any> {
    try {
      const response: any = await apiClient.get('/seo-pages/analytics/overview');
      return response?.data || response || null;
    } catch (e) {
      console.warn('Failed to fetch SEO analytics overview:', e);
      return null;
    }
  },

  /**
   * Generic Top 10 endpoint
   */
  async getTop10(params: Record<string, any>): Promise<any> {
    try {
      const response: any = await apiClient.get('/top10', { params });
      return response?.data || response || null;
    } catch (e) {
      console.warn('Failed to fetch Top 10 rankings:', e);
      return null;
    }
  },
};

