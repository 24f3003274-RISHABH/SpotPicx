import { create } from 'zustand';

interface FilterState {
  city: string;
  locality: string;
  category: string;
  searchQuery: string;
  priceFilter: string | null;
  sortBy: 'popular' | 'rating' | 'cost_low_high' | 'cost_high_low';
  setCity: (city: string) => void;
  setLocality: (locality: string) => void;
  setCategory: (category: string) => void;
  setSearchQuery: (query: string) => void;
  setPriceFilter: (price: string | null) => void;
  setSortBy: (sort: 'popular' | 'rating' | 'cost_low_high' | 'cost_high_low') => void;
  resetFilters: () => void;
}

export const useFilterStore = create<FilterState>((set) => ({
  city: 'delhi',
  locality: '',
  category: '',
  searchQuery: '',
  priceFilter: null,
  sortBy: 'popular',
  setCity: (city) => set({ city, locality: '' }),
  setLocality: (locality) => set({ locality }),
  setCategory: (category) => set({ category }),
  setSearchQuery: (searchQuery) => set({ searchQuery }),
  setPriceFilter: (priceFilter) => set({ priceFilter }),
  setSortBy: (sortBy) => set({ sortBy }),
  resetFilters: () =>
    set({
      locality: '',
      category: '',
      searchQuery: '',
      priceFilter: null,
      sortBy: 'popular',
    }),
}));
