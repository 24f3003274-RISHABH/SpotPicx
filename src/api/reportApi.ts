import { apiClient } from './apiClient';
import { ReportItem, ReportReason, ReportTargetType } from '../types';

export interface CreateReportParams {
  targetType: ReportTargetType;
  targetId: string;
  targetName?: string;
  reason: ReportReason;
  details: string;
  reporterEmail?: string;
}

export const reportApi = {
  createReport: async (params: CreateReportParams): Promise<{ success: boolean; message: string; data: ReportItem }> => {
    return apiClient.post('/reports', params);
  },

  getReports: async (params?: {
    status?: string;
    page?: number;
    limit?: number;
  }): Promise<{ success: boolean; data: ReportItem[]; total: number }> => {
    return apiClient.get('/reports', { params });
  },

  updateStatus: async (
    id: string,
    params: { status: string; adminNotes?: string }
  ): Promise<{ success: boolean; data: ReportItem }> => {
    return apiClient.patch(`/reports/${id}/status`, params);
  },
};
