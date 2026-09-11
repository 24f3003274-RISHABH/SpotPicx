import { apiClient } from './apiClient';
import { BricsHubPayload, BricsMember, BricsSummit, BricsFact, BricsFaq, BricsInstitution, BricsSource } from '../types/brics.types';

export const bricsApi = {
  getHubData: async (): Promise<BricsHubPayload> => {
    const res: any = await apiClient.get('/brics');
    return res.data || res;
  },

  getMembers: async (status?: string): Promise<BricsMember[]> => {
    const res: any = await apiClient.get('/brics/members', { params: { status } });
    return res.data || res;
  },

  getMemberBySlug: async (slug: string): Promise<BricsMember> => {
    const res: any = await apiClient.get(`/brics/members/${slug}`);
    return res.data || res;
  },

  getSummits: async (): Promise<BricsSummit[]> => {
    const res: any = await apiClient.get('/brics/summits');
    return res.data || res;
  },

  getFacts: async (category?: string): Promise<BricsFact[]> => {
    const res: any = await apiClient.get('/brics/facts', { params: { category } });
    return res.data || res;
  },

  getInstitutions: async (): Promise<BricsInstitution[]> => {
    const res: any = await apiClient.get('/brics/institutions');
    return res.data || res;
  },

  getFaqs: async (category?: string): Promise<BricsFaq[]> => {
    const res: any = await apiClient.get('/brics/faqs', { params: { category } });
    return res.data || res;
  },

  getSources: async (): Promise<BricsSource[]> => {
    const res: any = await apiClient.get('/brics/sources');
    return res.data || res;
  },

  getAdminStats: async (): Promise<any> => {
    const res: any = await apiClient.get('/brics/admin/stats');
    return res.data || res;
  },

  upsertFact: async (factData: Partial<BricsFact>): Promise<any> => {
    const res: any = await apiClient.post('/brics/admin/facts', factData);
    return res.data || res;
  },

  upsertFaq: async (faqData: Partial<BricsFaq>): Promise<any> => {
    const res: any = await apiClient.post('/brics/admin/faqs', faqData);
    return res.data || res;
  },

  seedCollections: async (): Promise<any> => {
    const res: any = await apiClient.post('/brics/seed');
    return res.data || res;
  },
};
