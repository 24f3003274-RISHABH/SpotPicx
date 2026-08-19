import { Location, ILocation } from '../models/Location';
import { Business } from '../models/Business';
import { dbConnection } from '../config/db';
import { SeedService } from './seed.service';

export class LocationService {
  public static async getAllLocations(query: { type?: string; city?: string } = {}) {
    if (dbConnection.getStatus().isConnected) {
      try {
        const filter: Record<string, any> = { isActive: true };
        if (query.type) filter.type = query.type;
        if (query.city) filter.city = new RegExp(`^${query.city}$`, 'i');

        const locations = await Location.find(filter)
          .populate('parent', 'name slug type')
          .sort({ type: 1, name: 1 })
          .lean();

        return locations;
      } catch (err: any) {
        console.warn('[LocationService] Falling back to in-memory locations:', err.message);
      }
    }

    // In-memory fallback
    SeedService.initializeInMemoryStore();
    let all = Array.from(SeedService.inMemoryLocations.values());

    if (query.type) {
      all = all.filter((l) => l.type === query.type);
    }
    if (query.city) {
      all = all.filter((l) => l.city.toLowerCase() === query.city?.toLowerCase());
    }

    return all.sort((a, b) => a.name.localeCompare(b.name));
  }

  public static async getLocationBySlug(slug: string) {
    if (dbConnection.getStatus().isConnected) {
      try {
        const location = await Location.findOne({ slug, isActive: true })
          .populate('parent', 'name slug type')
          .lean();

        if (location) {
          const businessCount = await Business.countDocuments({
            locality: new RegExp(location.name, 'i'),
            status: 'ACTIVE',
          });

          return {
            ...location,
            businessCount,
          };
        }
      } catch (err: any) {
        console.warn('[LocationService] Falling back to in-memory location lookup:', err.message);
      }
    }

    // In-memory fallback
    SeedService.initializeInMemoryStore();
    const loc = SeedService.inMemoryLocations.get(slug);
    if (!loc) return null;

    const businessCount = Array.from(SeedService.inMemoryBusinesses.values()).filter(
      (b) => b.locality.toLowerCase().includes(loc.name.toLowerCase()) || b.locality.toLowerCase().includes(loc.slug.toLowerCase())
    ).length;

    return {
      ...loc,
      businessCount,
    };
  }
}
