import mongoose from 'mongoose';
import { User } from '../models/User';
import { Business } from '../models/Business';
import { dbConnection } from '../config/db';
import { SeedService } from './seed.service';

// In-Memory user favorites store (userId -> Set of businessIds/slugs)
const inMemoryFavorites = new Map<string, Set<string>>();

export class FavoriteService {
  public static async addFavorite(userId: string, businessId: string) {
    if (dbConnection.getStatus().isConnected) {
      try {
        const isObjId = mongoose.Types.ObjectId.isValid(businessId);
        let bizId = businessId;

        if (!isObjId) {
          const biz = await Business.findOne({ slug: businessId });
          if (biz) bizId = biz._id.toString();
        }

        const user = await User.findById(userId);
        if (!user) throw new Error('User not found');

        const bObjId = new mongoose.Types.ObjectId(bizId);
        const exists = user.savedSpots.some((id) => id.toString() === bizId);

        if (!exists) {
          user.savedSpots.push(bObjId);
          await user.save();
        }

        return { success: true, isSaved: true };
      } catch (e) {
        console.warn('[FavoriteService] DB addFavorite error', e);
      }
    }

    // In-memory fallback
    if (!inMemoryFavorites.has(userId)) {
      inMemoryFavorites.set(userId, new Set());
    }
    inMemoryFavorites.get(userId)!.add(businessId);
    return { success: true, isSaved: true };
  }

  public static async removeFavorite(userId: string, businessId: string) {
    if (dbConnection.getStatus().isConnected) {
      try {
        const isObjId = mongoose.Types.ObjectId.isValid(businessId);
        let bizId = businessId;

        if (!isObjId) {
          const biz = await Business.findOne({ slug: businessId });
          if (biz) bizId = biz._id.toString();
        }

        const user = await User.findById(userId);
        if (!user) throw new Error('User not found');

        user.savedSpots = user.savedSpots.filter((id) => id.toString() !== bizId);
        await user.save();
        return { success: true, isSaved: false };
      } catch (e) {
        console.warn('[FavoriteService] DB removeFavorite error', e);
      }
    }

    if (inMemoryFavorites.has(userId)) {
      inMemoryFavorites.get(userId)!.delete(businessId);
    }
    return { success: true, isSaved: false };
  }

  public static async getUserFavorites(userId: string) {
    if (dbConnection.getStatus().isConnected) {
      try {
        const user = await User.findById(userId).populate({
          path: 'savedSpots',
          populate: { path: 'category' },
        });

        if (user && user.savedSpots) {
          return user.savedSpots;
        }
      } catch (e) {
        console.warn('[FavoriteService] DB getUserFavorites error', e);
      }
    }

    // In-memory fallback
    const ids = inMemoryFavorites.get(userId) || new Set();
    const allBusinesses = Array.from(SeedService.inMemoryBusinesses.values());
    const matched = allBusinesses.filter(
      (b) => ids.has(b._id) || ids.has(b.slug)
    );

    return matched;
  }
}
