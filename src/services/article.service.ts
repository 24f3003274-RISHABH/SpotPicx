import { apiClient } from '../api/apiClient';
import { Article } from '../types';

export const articleService = {
  /**
   * Get all published articles with optional filters
   */
  async getAllArticles(params: { category?: string; tag?: string; location?: string; search?: string } = {}): Promise<Article[]> {
    try {
      const response: any = await apiClient.get('/articles', { params });
      return response?.data?.articles || response?.data || (Array.isArray(response) ? response : []);
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
      const response: any = await apiClient.get(`/articles/${slug}`);
      if (response?.data?.article) return response.data;
      if (response?.article) return response;
      if (response?.data) return { article: response.data };
      return null;
    } catch (e) {
      console.warn(`Failed to fetch article /${slug}:`, e);
      return null;
    }
  },
};
