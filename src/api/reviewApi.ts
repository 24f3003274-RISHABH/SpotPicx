import { apiClient } from './apiClient';
import { Review, ReviewStats, PaginationMeta } from '../types';

export interface CreateReviewParams {
  businessId: string;
  rating: number;
  title: string;
  comment: string;
  images?: string[];
  visitDate?: string;
}

export interface UpdateReviewParams {
  rating?: number;
  title?: string;
  comment?: string;
  images?: string[];
  visitDate?: string;
}

export interface GetBusinessReviewsResponse {
  success: boolean;
  data: Review[];
  stats: ReviewStats;
  pagination: PaginationMeta;
}

export const reviewApi = {
  getBusinessReviews: async (
    businessId: string,
    params?: { page?: number; limit?: number; sort?: string }
  ): Promise<GetBusinessReviewsResponse> => {
    return apiClient.get(`/reviews/business/${businessId}`, { params });
  },

  getMyReviews: async (): Promise<{ success: boolean; data: Review[] }> => {
    return apiClient.get('/reviews/me');
  },

  createReview: async (params: CreateReviewParams): Promise<{ success: boolean; data: Review }> => {
    return apiClient.post('/reviews', params);
  },

  updateReview: async (id: string, params: UpdateReviewParams): Promise<{ success: boolean; data: Review }> => {
    return apiClient.put(`/reviews/${id}`, params);
  },

  deleteReview: async (id: string): Promise<{ success: boolean; message: string }> => {
    return apiClient.delete(`/reviews/${id}`);
  },

  toggleLike: async (id: string): Promise<{ success: boolean; data: { likeCount: number; isLiked: boolean } }> => {
    return apiClient.post(`/reviews/${id}/like`);
  },

  respondToReview: async (
    id: string,
    params: { comment: string; respondedBy?: string }
  ): Promise<{ success: boolean; data: Review }> => {
    return apiClient.post(`/reviews/${id}/response`, params);
  },
};
