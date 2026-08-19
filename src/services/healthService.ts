import { apiClient } from '../api/apiClient';
import { HealthResponse } from '../types';

export const healthService = {
  getHealth: async (): Promise<HealthResponse> => {
    return (await apiClient.get<unknown, HealthResponse>('/health')) as HealthResponse;
  },
};
