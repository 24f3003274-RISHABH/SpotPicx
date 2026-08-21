import { apiClient } from '../api/apiClient';
import { Article } from '../types';

export const articleService = {
  /**
   * Get all published articles with optional filters
   */
  async getAllArticles(params: { category?: string; tag?: string; location?: string; search?: string } = {}): Promise<Article[]> {
    try {
      const response = await apiClient.get<{ success: boolean; data: Article[] }>('/articles', { params });
      return response.data.data || [];
    } catch (e) {
      console.warn('Failed to fetch articles from API:', e);
      return [];
    }
  },

  /**
   * Get single article by slug with JSON-LD schema
   */
  async getArticleBySlug(slug: string): Promise<{ article: Article; jsonLd?: any } | null> {
    try {
      const response = await apiClient.get<{ success: boolean; data: { article: Article; jsonLd?: any } }>(
        `/articles/${slug}`
      );
      return response.data.data;
    } catch (e) {
      console.warn(`Failed to fetch article /${slug}:`, e);
      return null;
    }
  },
};
