import { apiClient } from './apiClient';
import { Business } from '../types';

export const favoriteApi = {
  getFavorites: async (): Promise<{ success: boolean; data: Business[] }> => {
    return apiClient.get('/favorites');
  },

  addFavorite: async (businessId: string): Promise<{ success: boolean; message: string }> => {
    return apiClient.post(`/favorites/${businessId}`);
  },

  removeFavorite: async (businessId: string): Promise<{ success: boolean; message: string }> => {
    return apiClient.delete(`/favorites/${businessId}`);
  },
};
