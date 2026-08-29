import { Top10Guide } from '../../types/guides.types';
import { delhiPlacesGuides } from './delhiPlacesGuides';
import { delhiLifestyleGuides } from './delhiLifestyleGuides';
import { regionalIndiaGuides1 } from './regionalIndiaGuides1';
import { regionalIndiaGuides2 } from './regionalIndiaGuides2';

export const allInitialGuides: Top10Guide[] = [
  ...delhiPlacesGuides,
  ...delhiLifestyleGuides,
  ...regionalIndiaGuides1,
  ...regionalIndiaGuides2,
];

export function getGuideBySlug(slug: string, guides: Top10Guide[] = allInitialGuides): Top10Guide | undefined {
  return guides.find(g => g.slug === slug || g.id === slug);
}

export function getFeaturedGuides(guides: Top10Guide[] = allInitialGuides): Top10Guide[] {
  return guides.filter(g => g.isPublished && g.isFeatured);
}

export function getGuidesByCategory(category: string, guides: Top10Guide[] = allInitialGuides): Top10Guide[] {
  if (!category || category === 'All') return guides.filter(g => g.isPublished);
  return guides.filter(g => g.isPublished && g.category.toLowerCase() === category.toLowerCase());
}

export function getGuidesByLocation(location: string, guides: Top10Guide[] = allInitialGuides): Top10Guide[] {
  if (!location || location === 'All') return guides.filter(g => g.isPublished);
  return guides.filter(g => g.isPublished && (g.location.toLowerCase().includes(location.toLowerCase()) || g.state.toLowerCase().includes(location.toLowerCase())));
}
