import { useQuery } from '@tanstack/react-query';
import { searchService, SearchQueryOptions } from '../services/searchService';
import { SearchApiResponse, SearchSuggestions } from '../types';

export const useSearch = (options: SearchQueryOptions) => {
  return useQuery<SearchApiResponse>({
    queryKey: ['search', options],
    queryFn: () => searchService.search(options),
    placeholderData: (previousData) => previousData,
    staleTime: 1000 * 60, // 1 minute
  });
};

export const useSearchSuggestions = (query: string, enabled: boolean = true) => {
  return useQuery<SearchSuggestions>({
    queryKey: ['search-suggestions', query],
    queryFn: () => searchService.getSuggestions(query),
    enabled: enabled,
    staleTime: 1000 * 30,
  });
};

export const useParseQuery = (query: string, enabled: boolean = false) => {
  return useQuery({
    queryKey: ['parse-query', query],
    queryFn: () => searchService.parseQuery(query),
    enabled: enabled && query.length > 2,
  });
};
