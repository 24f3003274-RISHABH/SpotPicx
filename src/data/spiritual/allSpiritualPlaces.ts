import { SpiritualPlace, SpiritualTradition } from '../../types/spiritual.types';
import { SPIRITUAL_PLACES_PART1 } from './spiritualPlacesPart1';
import { SPIRITUAL_PLACES_PART2 } from './spiritualPlacesPart2';
import { SPIRITUAL_PLACES_PART3 } from './spiritualPlacesPart3';

export const ALL_SPIRITUAL_PLACES: SpiritualPlace[] = [
  ...SPIRITUAL_PLACES_PART1,
  ...SPIRITUAL_PLACES_PART2,
  ...SPIRITUAL_PLACES_PART3,
];

export const getSpiritualPlaceBySlug = (slug: string): SpiritualPlace | undefined => {
  return ALL_SPIRITUAL_PLACES.find((p) => p.slug === slug);
};

export const getSpiritualPlacesByState = (stateSlug: string): SpiritualPlace[] => {
  return ALL_SPIRITUAL_PLACES.filter((p) => p.stateSlug === stateSlug);
};

export const getSpiritualPlacesByTradition = (tradition: SpiritualTradition): SpiritualPlace[] => {
  return ALL_SPIRITUAL_PLACES.filter((p) => p.tradition === tradition);
};

export const getTopPilgrimagePlaces = (): SpiritualPlace[] => {
  return ALL_SPIRITUAL_PLACES.filter((p) => p.isTopPilgrimage);
};

export const getWeekendTripsFromDelhi = (): SpiritualPlace[] => {
  return ALL_SPIRITUAL_PLACES.filter((p) => p.weekendTripFromDelhi);
};

export const getFamousTempleTownPlaces = (): SpiritualPlace[] => {
  return ALL_SPIRITUAL_PLACES.filter((p) => p.isTempleTown);
};

export const getRelatedSpiritualPlaces = (currentPlace: SpiritualPlace, limit = 4): SpiritualPlace[] => {
  return ALL_SPIRITUAL_PLACES
    .filter(
      (p) =>
        p.id !== currentPlace.id &&
        (p.stateSlug === currentPlace.stateSlug || p.tradition === currentPlace.tradition)
    )
    .slice(0, limit);
};
