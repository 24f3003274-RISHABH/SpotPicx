import { apiClient } from './apiClient';
import { SpotCollection, CollectionVisibility } from '../types';

export interface CreateCollectionParams {
  name: string;
  description?: string;
  coverImage?: string;
  visibility?: CollectionVisibility;
  items?: string[];
  category?: string;
}

export const collectionApi = {
  getCollections: async (params?: {
    visibility?: CollectionVisibility;
    curatedOnly?: boolean;
    page?: number;
    limit?: number;
    ownerId?: string;
  }): Promise<{ success: boolean; data: SpotCollection[]; total: number; page: number; totalPages: number }> => {
    return apiClient.get('/collections', { params });
  },

  getMyCollections: async (): Promise<{ success: boolean; data: SpotCollection[]; total: number }> => {
    return apiClient.get('/collections/me');
  },

  getCollectionById: async (id: string): Promise<{ success: boolean; data: SpotCollection }> => {
    return apiClient.get(`/collections/${id}`);
  },

  createCollection: async (params: CreateCollectionParams): Promise<{ success: boolean; data: SpotCollection }> => {
    return apiClient.post('/collections', params);
  },

  toggleItem: async (
    collectionId: string,
    businessId: string
  ): Promise<{ success: boolean; data: { isPresent: boolean; itemCount: number } }> => {
    return apiClient.post(`/collections/${collectionId}/items`, { businessId });
  },

  deleteCollection: async (id: string): Promise<{ success: boolean; message: string }> => {
    return apiClient.delete(`/collections/${id}`);
  },
};
