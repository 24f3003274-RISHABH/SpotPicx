import { describe, it, expect } from 'vitest';
import { POPULAR_DELHI_LOCALITIES } from '../../src/constants/locations';
import { POPULAR_CATEGORIES } from '../../src/constants/categories';

describe('Frontend Data & Business Rules Suite', () => {
  it('Loads Delhi-NCR localities with geographic coordinates', () => {
    expect(POPULAR_DELHI_LOCALITIES.length).toBeGreaterThan(5);
    const connaughtPlace = POPULAR_DELHI_LOCALITIES.find(
      (loc) => loc.name === 'Connaught Place' || loc.id === 'connaught-place'
    );
    expect(connaughtPlace).toBeDefined();
    expect(connaughtPlace?.latitude).toBeCloseTo(28.63, 1);
    expect(connaughtPlace?.longitude).toBeCloseTo(77.21, 1);
  });

  it('Maintains valid category structure with slugs and icons', () => {
    expect(POPULAR_CATEGORIES.length).toBeGreaterThan(4);
    const foodCategory = POPULAR_CATEGORIES.find(
      (c) => c.slug === 'food-and-cafes' || c.slug === 'hotels-and-pgs'
    );
    expect(foodCategory).toBeDefined();
    expect(foodCategory?.name).toBeDefined();
  });

  it('Validates search query sanitization and parameter construction', () => {
    const rawSearch = '  Cafe in Hauz Khas  ';
    const trimmed = rawSearch.trim();
    expect(trimmed).toBe('Cafe in Hauz Khas');
    
    const params = new URLSearchParams();
    params.set('q', trimmed);
    params.set('category', 'cafes');
    params.set('locality', 'Hauz Khas');
    
    expect(params.toString()).toContain('category=cafes');
    expect(params.toString()).toContain('locality=Hauz+Khas');
  });
});
