import { apiClient } from '../api/apiClient';
import { SEOPage } from '../types';

export const seoService = {
  /**
   * Get all published SEO landing pages
   */
  async getAllPages(): Promise<SEOPage[]> {
    try {
      const response = await apiClient.get<{ success: boolean; data: SEOPage[] }>('/seo-pages');
      return response.data.data || [];
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
      const response = await apiClient.get<{ success: boolean; data: { page: SEOPage; jsonLd?: any } }>(
        `/seo-pages/${slug}`
      );
      return response.data.data;
    } catch (e) {
      console.warn(`Failed to fetch SEO page /${slug}:`, e);
      return null;
    }
  },

  /**
   * Generic Top 10 endpoint
   */
  async getTop10(params: Record<string, any>): Promise<any> {
    try {
      const response = await apiClient.get('/top10', { params });
      return response.data.data;
    } catch (e) {
      console.warn('Failed to fetch Top 10 rankings:', e);
      return null;
    }
  },
};
