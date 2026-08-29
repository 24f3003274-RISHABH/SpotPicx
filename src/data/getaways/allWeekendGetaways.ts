import { NEAR_GETAWAYS } from './nearGetaways';
import { MID_GETAWAYS } from './midGetaways';
import { FAR_GETAWAYS } from './farGetaways';
import {
  WeekendGetawayPlace,
  DistanceBracket,
  TripDuration,
  BudgetLevel,
  DestinationCategory,
  TravellerType,
  StateRegion,
} from '../../types/weekendGetaways.types';

export const ALL_WEEKEND_GETAWAYS: WeekendGetawayPlace[] = [
  ...NEAR_GETAWAYS,
  ...MID_GETAWAYS,
  ...FAR_GETAWAYS,
];

export const GETAWAY_CATEGORIES: { id: DestinationCategory; name: string; icon: string; count: number }[] = [
  { id: 'Hill Station', name: 'Hill Stations', icon: 'Mountain', count: ALL_WEEKEND_GETAWAYS.filter((p) => p.categories.includes('Hill Station')).length },
  { id: 'Heritage & Forts', name: 'Heritage & Forts', icon: 'Landmark', count: ALL_WEEKEND_GETAWAYS.filter((p) => p.categories.includes('Heritage & Forts')).length },
  { id: 'Wildlife & Nature', name: 'Wildlife & Nature', icon: 'Trees', count: ALL_WEEKEND_GETAWAYS.filter((p) => p.categories.includes('Wildlife & Nature')).length },
  { id: 'Spiritual & Pilgrimage', name: 'Spiritual & Pilgrimage', icon: 'Sparkles', count: ALL_WEEKEND_GETAWAYS.filter((p) => p.categories.includes('Spiritual & Pilgrimage')).length },
  { id: 'Adventure & Camping', name: 'Adventure & Camping', icon: 'Compass', count: ALL_WEEKEND_GETAWAYS.filter((p) => p.categories.includes('Adventure & Camping')).length },
  { id: 'Lakeside & Leisure', name: 'Lakeside & Leisure', icon: 'Waves', count: ALL_WEEKEND_GETAWAYS.filter((p) => p.categories.includes('Lakeside & Leisure')).length },
  { id: 'Rural & Cultural', name: 'Rural & Cultural', icon: 'MapPin', count: ALL_WEEKEND_GETAWAYS.filter((p) => p.categories.includes('Rural & Cultural')).length },
  { id: 'Wellness & Spa', name: 'Wellness & Resorts', icon: 'HeartHandshake', count: ALL_WEEKEND_GETAWAYS.filter((p) => p.categories.includes('Wellness & Spa')).length },
];

export const DISTANCE_BRACKETS: { id: DistanceBracket; label: string; range: string }[] = [
  { id: 'under-100km', label: 'Under 100 km', range: '< 100 km (Quick Day Trips)' },
  { id: '100-200km', label: '100–200 km', range: '100–200 km (Easy Overnights)' },
  { id: '200-300km', label: '200–300 km', range: '200–300 km (Classic 2-Day Breaks)' },
  { id: '300-500km', label: '300–500 km', range: '300–500 km (Long Weekend Escapes)' },
];

export const STATES_LIST: StateRegion[] = [
  'Delhi / NCR',
  'Haryana',
  'Uttar Pradesh',
  'Uttarakhand',
  'Rajasthan',
  'Himachal Pradesh',
  'Punjab',
  'Madhya Pradesh',
];

export const getGetawayBySlug = (slug: string): WeekendGetawayPlace | undefined => {
  const normalized = slug.toLowerCase();
  return ALL_WEEKEND_GETAWAYS.find((p) => p.slug.toLowerCase() === normalized);
};

export const getGetawaysByDistance = (bracket: DistanceBracket): WeekendGetawayPlace[] => {
  return ALL_WEEKEND_GETAWAYS.filter((p) => p.distanceBracket === bracket);
};

export const getGetawaysByCategory = (category: DestinationCategory): WeekendGetawayPlace[] => {
  return ALL_WEEKEND_GETAWAYS.filter((p) => p.categories.includes(category));
};

export const getGetawaysByState = (state: StateRegion): WeekendGetawayPlace[] => {
  return ALL_WEEKEND_GETAWAYS.filter((p) => p.state === state);
};

export const getRelatedGetaways = (place: WeekendGetawayPlace, limit: number = 3): WeekendGetawayPlace[] => {
  return ALL_WEEKEND_GETAWAYS.filter(
    (p) =>
      p.id !== place.id &&
      (p.state === place.state ||
        p.distanceBracket === place.distanceBracket ||
        p.categories.some((c) => place.categories.includes(c)))
  ).slice(0, limit);
};

export const searchWeekendGetaways = (
  query: string,
  filters?: {
    distance?: DistanceBracket | 'all';
    category?: DestinationCategory | 'all';
    duration?: TripDuration | 'all';
    budget?: BudgetLevel | 'all';
    travellerType?: TravellerType | 'all';
    state?: StateRegion | 'all';
    seasonSpecial?: 'monsoon' | 'winter' | 'summer' | 'all';
    transitType?: 'train' | 'road' | 'all';
  }
): WeekendGetawayPlace[] => {
  return ALL_WEEKEND_GETAWAYS.filter((place) => {
    // Text search matching
    if (query) {
      const q = query.toLowerCase();
      const matchesText =
        place.name.toLowerCase().includes(q) ||
        place.tagline.toLowerCase().includes(q) ||
        place.districtOrRegion.toLowerCase().includes(q) ||
        place.state.toLowerCase().includes(q) ||
        place.topThingsToDo.some((t) => t.toLowerCase().includes(q)) ||
        place.keyHighlights.some((k) => k.toLowerCase().includes(q));
      if (!matchesText) return false;
    }

    if (!filters) return true;

    // Distance filter
    if (filters.distance && filters.distance !== 'all' && place.distanceBracket !== filters.distance) {
      return false;
    }

    // Category filter
    if (filters.category && filters.category !== 'all' && !place.categories.includes(filters.category)) {
      return false;
    }

    // Duration filter
    if (filters.duration && filters.duration !== 'all' && place.idealDuration !== filters.duration) {
      return false;
    }

    // Budget filter
    if (filters.budget && filters.budget !== 'all' && place.budgetLevel !== filters.budget) {
      return false;
    }

    // Traveller companion filter
    if (
      filters.travellerType &&
      filters.travellerType !== 'all' &&
      !place.travellerTypes.includes(filters.travellerType)
    ) {
      return false;
    }

    // State filter
    if (filters.state && filters.state !== 'all' && place.state !== filters.state) {
      return false;
    }

    // Seasonal special filter
    if (filters.seasonSpecial === 'monsoon' && !place.monsoonFriendly) return false;
    if (filters.seasonSpecial === 'winter' && !place.winterFavorite) return false;
    if (filters.seasonSpecial === 'summer' && !place.summerEscape) return false;

    // Transit type filter
    if (filters.transitType === 'train') {
      const hasTrain = place.bestTransportOptions.some((t) =>
        t.mode.includes('Train')
      );
      if (!hasTrain) return false;
    }

    return true;
  });
};
