import { create } from 'zustand';
import { Business } from '../types';

interface SavedState {
  savedSpotIds: string[];
  savedSpots: Business[];
  toggleSaveSpot: (business: Business) => boolean; // returns true if saved, false if removed
  isSpotSaved: (id: string) => boolean;
  clearSaved: () => void;
}

const STORAGE_KEY = 'spotpicks_saved_spots';

const loadInitial = (): { ids: string[]; spots: Business[] } => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ids: [], spots: [] };
    const parsed = JSON.parse(raw);
    return {
      ids: parsed.map((b: Business) => b._id || b.slug),
      spots: parsed,
    };
  } catch {
    return { ids: [], spots: [] };
  }
};

export const useSavedStore = create<SavedState>((set, get) => {
  const initial = loadInitial();

  return {
    savedSpotIds: initial.ids,
    savedSpots: initial.spots,

    toggleSaveSpot: (business: Business) => {
      const id = business._id || business.slug;
      const current = get().savedSpots;
      const exists = current.some((b) => (b._id || b.slug) === id);

      let updated: Business[];
      let isSavedNow: boolean;

      if (exists) {
        updated = current.filter((b) => (b._id || b.slug) !== id);
        isSavedNow = false;
      } else {
        updated = [business, ...current];
        isSavedNow = true;
      }

      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch (e) {
        console.error('Failed to sync saved spots to storage', e);
      }

      set({
        savedSpots: updated,
        savedSpotIds: updated.map((b) => b._id || b.slug),
      });

      return isSavedNow;
    },

    isSpotSaved: (id: string) => {
      return get().savedSpotIds.includes(id);
    },

    clearSaved: () => {
      try {
        localStorage.removeItem(STORAGE_KEY);
      } catch {}
      set({ savedSpotIds: [], savedSpots: [] });
    },
  };
});
