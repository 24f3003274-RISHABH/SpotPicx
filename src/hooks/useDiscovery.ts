import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { discoveryService, BusinessQueryParams } from '../services/discoveryService';
import { Business } from '../types';

export const useCategories = (params?: { type?: string; parent?: string }) => {
  return useQuery({
    queryKey: ['categories', params],
    queryFn: () => discoveryService.getCategories(params),
  });
};

export const useCategory = (slug?: string) => {
  return useQuery({
    queryKey: ['category', slug],
    queryFn: () => discoveryService.getCategoryBySlug(slug!),
    enabled: Boolean(slug),
  });
};

export const useLocations = (params?: { type?: string; city?: string }) => {
  return useQuery({
    queryKey: ['locations', params],
    queryFn: () => discoveryService.getLocations(params),
  });
};

export const useLocationDetail = (slug?: string) => {
  return useQuery({
    queryKey: ['location', slug],
    queryFn: () => discoveryService.getLocationBySlug(slug!),
    enabled: Boolean(slug),
  });
};

export const useLocationBusinesses = (slug?: string, params?: { page?: number; limit?: number }) => {
  return useQuery({
    queryKey: ['location-businesses', slug, params],
    queryFn: () => discoveryService.getLocationBusinesses(slug!, params),
    enabled: Boolean(slug),
  });
};

export const useBusinesses = (params?: BusinessQueryParams) => {
  return useQuery({
    queryKey: ['businesses', params],
    queryFn: () => discoveryService.getBusinesses(params),
  });
};

export const useBusiness = (slug?: string) => {
  return useQuery({
    queryKey: ['business', slug],
    queryFn: () => discoveryService.getBusinessBySlug(slug!),
    enabled: Boolean(slug),
  });
};

export const useCreateBusiness = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<Business>) => discoveryService.createBusiness(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['businesses'] });
    },
  });
};
