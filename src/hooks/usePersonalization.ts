import { useState, useEffect, useCallback } from 'react';
import { UserPreferencesProfile, Business } from '../types';

const STORAGE_KEY = 'spotpicks_user_profile';

/**
 * Custom Hook for Local User Personalization State
 * 
 * SPOTPICKS SAFE CLIENT PERSONALIZATION:
 * Tracks user browsing signals locally in browser storage:
 * - Recently viewed spots with category & locality tags
 * - Frequently browsed categories
 * - Frequently browsed localities
 * - Price preferences
 * 
 * Protects privacy by storing behavioral preferences locally and sending aggregate signals
 * only when requesting recommendations.
 */
export function usePersonalization() {
  const [profile, setProfile] = useState<UserPreferencesProfile>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // Ignore storage errors
    }
    return {
      recentlyViewed: [],
      savedCategories: [],
      favoriteLocations: [],
      preferredPriceRanges: [],
      searchHistory: [],
    };
  });

  // Persist changes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
    } catch {
      // Ignore storage quota errors
    }
  }, [profile]);

  /**
   * Log a business profile view to update affinity scores
   */
  const recordView = useCallback((business: Business) => {
    if (!business || !business.id && !business._id && !business.slug) return;

    const bId = String(business._id || business.id || business.slug);
    const catSlug = typeof business.category === 'object' ? business.category?.slug : business.category;
    const locality = business.locality;
    const priceRange = business.priceRange;

    setProfile((prev) => {
      // Filter out existing view of the same spot and prepend latest
      const filteredViews = (prev.recentlyViewed || []).filter((v) => v.id !== bId);
      const updatedViews = [
        {
          id: bId,
          category: catSlug,
          locality,
          priceRange,
          timestamp: Date.now(),
        },
        ...filteredViews,
      ].slice(0, 20); // Keep last 20

      // Update favorite locations if locality exists
      const locations = prev.favoriteLocations || [];
      const updatedLocations = locality && !locations.includes(locality)
        ? [locality, ...locations].slice(0, 8)
        : locations;

      // Update price range preferences
      const priceRanges = prev.preferredPriceRanges || [];
      const updatedPrices = priceRange && !priceRanges.includes(priceRange)
        ? [priceRange, ...priceRanges].slice(0, 3)
        : priceRanges;

      return {
        ...prev,
        recentlyViewed: updatedViews,
        favoriteLocations: updatedLocations,
        preferredPriceRanges: updatedPrices,
      };
    });
  }, []);

  /**
   * Record a search query into local history
   */
  const recordSearch = useCallback((query: string) => {
    if (!query || query.trim().length < 2) return;
    const clean = query.trim();

    setProfile((prev) => {
      const history = (prev.searchHistory || []).filter((q) => q.toLowerCase() !== clean.toLowerCase());
      return {
        ...prev,
        searchHistory: [clean, ...history].slice(0, 10),
      };
    });
  }, []);

  /**
   * Toggle a category as a saved/favorite category
   */
  const toggleFavoriteCategory = useCallback((categorySlug: string) => {
    setProfile((prev) => {
      const current = prev.savedCategories || [];
      const exists = current.includes(categorySlug);
      const updated = exists ? current.filter((c) => c !== categorySlug) : [...current, categorySlug];
      return {
        ...prev,
        savedCategories: updated,
      };
    });
  }, []);

  /**
   * Clear all personalized browsing history
   */
  const clearHistory = useCallback(() => {
    const empty: UserPreferencesProfile = {
      recentlyViewed: [],
      savedCategories: [],
      favoriteLocations: [],
      preferredPriceRanges: [],
      searchHistory: [],
    };
    setProfile(empty);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // Ignore
    }
  }, []);

  return {
    profile,
    recordView,
    recordSearch,
    toggleFavoriteCategory,
    clearHistory,
    totalInteractions:
      (profile.recentlyViewed?.length || 0) +
      (profile.savedCategories?.length || 0) +
      (profile.favoriteLocations?.length || 0),
  };
}
