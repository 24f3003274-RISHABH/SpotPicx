import { useQuery } from '@tanstack/react-query';
import { healthService } from '../services/healthService';

export const useHealth = () => {
  return useQuery({
    queryKey: ['system-health'],
    queryFn: healthService.getHealth,
    refetchInterval: 10000, // periodically poll health every 10s
    retry: 2,
  });
};
