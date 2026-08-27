import { apiClient } from '../api/apiClient';
import { EventItem } from '../types';

export interface EventFilterParams {
  category?: string;
  timeframe?: 'today' | 'tonight' | 'tomorrow' | 'weekend' | 'month' | 'all';
  price?: 'free' | 'paid' | 'all';
  locality?: string;
  query?: string;
  tag?: string;
  status?: string;
  limit?: number;
  page?: number;
}

export const eventService = {
  async getEvents(params: EventFilterParams = {}): Promise<{
    events: EventItem[];
    total: number;
    page: number;
    limit: number;
  }> {
    const res = await apiClient.get('/events', { params });
    return res.data.data;
  },

  async getEventBySlug(slug: string): Promise<EventItem> {
    const res = await apiClient.get(`/events/${slug}`);
    return res.data.data.event;
  },

  async createEvent(data: Partial<EventItem>): Promise<EventItem> {
    const res = await apiClient.post('/events', data);
    return res.data.data.event;
  },

  async deleteEvent(id: string): Promise<void> {
    await apiClient.delete(`/events/${id}`);
  },
};
