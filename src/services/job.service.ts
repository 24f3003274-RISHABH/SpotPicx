import { apiClient } from '../api/apiClient';
import { JobItem, JobType } from '../types';

export interface JobFilterParams {
  type?: JobType | 'all';
  skill?: string;
  location?: string;
  query?: string;
  tag?: string;
  status?: string;
  limit?: number;
  page?: number;
}

export const jobService = {
  async getJobs(params: JobFilterParams = {}): Promise<{
    jobs: JobItem[];
    total: number;
    page: number;
    limit: number;
  }> {
    const res: any = await apiClient.get('/jobs', { params });
    return res?.data || res || { jobs: [], total: 0, page: 1, limit: 20 };
  },

  async getJobBySlug(slug: string): Promise<JobItem> {
    const res: any = await apiClient.get(`/jobs/${slug}`);
    return res?.data?.job || res?.data || res?.job || res;
  },

  async createJob(data: Partial<JobItem>): Promise<JobItem> {
    const res: any = await apiClient.post('/jobs', data);
    return res?.data?.job || res?.data || res?.job || res;
  },
};
