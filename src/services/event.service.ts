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
    const res: any = await apiClient.get('/events', { params });
    return res?.data || res || { events: [], total: 0, page: 1, limit: 20 };
  },

  async getEventBySlug(slug: string): Promise<EventItem> {
    const res: any = await apiClient.get(`/events/${slug}`);
    return res?.data?.event || res?.data || res?.event || res;
  },

  async createEvent(data: Partial<EventItem>): Promise<EventItem> {
    const res: any = await apiClient.post('/events', data);
    return res?.data?.event || res?.data || res?.event || res;
  },

  async deleteEvent(id: string): Promise<void> {
    await apiClient.delete(`/events/${id}`);
  },
};
