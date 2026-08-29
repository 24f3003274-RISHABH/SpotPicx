import { DelhiHeritagePlace, HeritageCategory } from '../../types/delhiHeritage.types';
import { DELHI_HERITAGE_PLACES_PART1 } from './heritagePlacesPart1';
import { DELHI_HERITAGE_PLACES_PART2 } from './heritagePlacesPart2';
import { DELHI_HERITAGE_PLACES_PART3 } from './heritagePlacesPart3';

export const ALL_DELHI_HERITAGE_PLACES: DelhiHeritagePlace[] = [
  ...DELHI_HERITAGE_PLACES_PART1,
  ...DELHI_HERITAGE_PLACES_PART2,
  ...DELHI_HERITAGE_PLACES_PART3,
];

export const getDelhiHeritagePlaceBySlug = (slug: string): DelhiHeritagePlace | undefined => {
  return ALL_DELHI_HERITAGE_PLACES.find((p) => p.slug === slug);
};

export const getPlacesByCategory = (category: HeritageCategory | string): DelhiHeritagePlace[] => {
  return ALL_DELHI_HERITAGE_PLACES.filter(
    (p) =>
      p.category.toLowerCase() === category.toLowerCase() ||
      p.additionalCategories?.some((c) => c.toLowerCase() === category.toLowerCase())
  );
};

export const getTop10HeritagePlaces = (): DelhiHeritagePlace[] => {
  return ALL_DELHI_HERITAGE_PLACES.filter((p) => p.isTop10);
};

export const get15MustVisitPlaces = (): DelhiHeritagePlace[] => {
  return ALL_DELHI_HERITAGE_PLACES.filter((p) => p.is15MustVisit);
};

export const getUNESCOPlaces = (): DelhiHeritagePlace[] => {
  return ALL_DELHI_HERITAGE_PLACES.filter((p) => p.isUNESCO);
};

export const getMughalPlaces = (): DelhiHeritagePlace[] => {
  return ALL_DELHI_HERITAGE_PLACES.filter((p) => p.isMughalMasterpiece || p.category === 'Mughal Heritage');
};

export const getSultanatePlaces = (): DelhiHeritagePlace[] => {
  return ALL_DELHI_HERITAGE_PLACES.filter((p) => p.isSultanateHighlight || p.category === 'Sultanate Architecture');
};

export const getMuseumPlaces = (): DelhiHeritagePlace[] => {
  return ALL_DELHI_HERITAGE_PLACES.filter((p) => p.isMuseum || p.category === 'Museums');
};

export const getHiddenGems = (): DelhiHeritagePlace[] => {
  return ALL_DELHI_HERITAGE_PLACES.filter((p) => p.isHiddenGem || p.category === 'Hidden Historical Places');
};

export const searchHeritagePlaces = (query: string): DelhiHeritagePlace[] => {
  const q = query.toLowerCase().trim();
  if (!q) return ALL_DELHI_HERITAGE_PLACES;
  return ALL_DELHI_HERITAGE_PLACES.filter(
    (p) =>
      p.name.toLowerCase().includes(q) ||
      p.tagline.toLowerCase().includes(q) ||
      p.location.locality.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      p.tags.some((t) => t.toLowerCase().includes(q)) ||
      p.builtBy.toLowerCase().includes(q) ||
      p.historicalPeriod.toLowerCase().includes(q)
  );
};
