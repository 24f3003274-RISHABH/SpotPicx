import { apiClient } from './apiClient';
import { UserNotification } from '../types';

export const notificationApi = {
  getNotifications: async (): Promise<{ success: boolean; data: UserNotification[]; unreadCount: number }> => {
    return apiClient.get('/notifications');
  },

  markAsRead: async (id: string): Promise<{ success: boolean }> => {
    return apiClient.patch(`/notifications/${id}/read`);
  },

  markAllAsRead: async (): Promise<{ success: boolean }> => {
    return apiClient.post('/notifications/read-all');
  },
};
