import mongoose from 'mongoose';
import { Advertisement, IAdvertisement, AdPlacement, AdType, AdStatus } from '../models/Advertisement';
import { Business } from '../models/Business';
import { dbConnection } from '../config/db';
import { PROMOTION_PACKAGES_CONFIG } from '../config/plans.config';

export interface InMemoryAd {
  _id: string;
  title: string;
  type: AdType;
  placement: AdPlacement;
  business?: string;
  headline: string;
  description: string;
  callToAction: string;
  targetUrl: string;
  imageUrl?: string;
  badgeLabel: 'Sponsored' | 'Promoted' | 'Featured Partner' | 'Ad';
  targetCategories?: string[];
  targetLocalities?: string[];
  targetTags?: string[];
  startDate: Date;
  endDate: Date;
  status: AdStatus;
  pricingModel: 'FLAT_RATE' | 'CPM' | 'CPC';
  price: number;
  currency: string;
  impressions: number;
  clicks: number;
  spent: number;
  priorityScore: number;
  sponsorName?: string;
  sponsorLogo?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Initial high-quality non-intrusive seed advertisements for Delhi NCR
export const inMemoryAds: Map<string, InMemoryAd> = new Map([
  [
    'ad-1',
    {
      _id: 'ad-1',
      title: 'Blue Tokai Roasters Specialty Beans Spotlight',
      type: 'SPONSORED_LISTING',
      placement: 'SEARCH_TOP',
      business: 'spot-1',
      headline: 'Blue Tokai Coffee Roasters — Single Origin Pourovers',
      description: 'Artisanal micro-lot Arabica roasts & fresh sourdough bakery items in Saket.',
      callToAction: 'View Cafe Menu',
      targetUrl: '/spots/blue-tokai-coffee-roasters-saket',
      imageUrl: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=600',
      badgeLabel: 'Sponsored',
      targetCategories: ['cafes-and-coffee-shops', 'food-and-dining'],
      targetLocalities: ['Saket', 'South Delhi'],
      startDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
      endDate: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
      status: 'ACTIVE',
      pricingModel: 'CPM',
      price: 1499,
      currency: 'INR',
      impressions: 4820,
      clicks: 342,
      spent: 1499,
      priorityScore: 90,
      sponsorName: 'Blue Tokai Coffee Roasters',
      createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(),
    },
  ],
  [
    'ad-2',
    {
      _id: 'ad-2',
      title: 'Hauz Khas Social Sunset Lake View Promo',
      type: 'NATIVE_CARD',
      placement: 'HOME_FEED',
      business: 'spot-2',
      headline: 'Hauz Khas Social — Iconic Sunset Balcony Experience',
      description: 'Work-from-cafe by day, high energy acoustic sets and craft cocktails by night.',
      callToAction: 'Explore Social',
      targetUrl: '/spots/social-offline-hauz-khas',
      imageUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600',
      badgeLabel: 'Featured Partner',
      targetCategories: ['nightlife-and-clubs', 'cafes-and-coffee-shops'],
      targetLocalities: ['Hauz Khas', 'South Delhi'],
      startDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
      endDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
      status: 'ACTIVE',
      pricingModel: 'FLAT_RATE',
      price: 2499,
      currency: 'INR',
      impressions: 8940,
      clicks: 612,
      spent: 2499,
      priorityScore: 85,
      sponsorName: 'Social Offline HKV',
      createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(),
    },
  ],
  [
    'ad-3',
    {
      _id: 'ad-3',
      title: 'Delhi Craft Beer & Rooftops Curated Collection',
      type: 'SPONSORED_COLLECTION',
      placement: 'COLLECTION_SPONSOR',
      headline: 'Best Rooftops & Microbreweries in Delhi NCR',
      description: 'Hand-picked spots with skyline panoramas, craft brews, and vibrant weekend vibes.',
      callToAction: 'View Collection',
      targetUrl: '/collections/aesthetic-rooftops-south-delhi',
      imageUrl: 'https://images.unsplash.com/photo-1572116469696-31de0f17cc34?w=600',
      badgeLabel: 'Sponsored',
      targetCategories: ['nightlife-and-clubs'],
      startDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      endDate: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000),
      status: 'ACTIVE',
      pricingModel: 'FLAT_RATE',
      price: 3999,
      currency: 'INR',
      impressions: 3410,
      clicks: 280,
      spent: 3999,
      priorityScore: 80,
      sponsorName: 'SpotPicks Curated Selection',
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(),
    },
  ],
]);

export class AdService {
  public static getPromotionPackages() {
    return PROMOTION_PACKAGES_CONFIG;
  }

  /**
   * Get active ads for a given placement context
   */
  public static async getAdsByPlacement(
    placement: AdPlacement,
    options?: { category?: string; locality?: string; limit?: number }
  ) {
    const now = new Date();
    const limit = options?.limit || 4;

    if (dbConnection.getStatus().isConnected) {
      try {
        const query: any = {
          placement,
          status: 'ACTIVE',
          startDate: { $lte: now },
          endDate: { $gte: now },
        };

        if (options?.category) {
          query.$or = [{ targetCategories: options.category }, { targetCategories: { $size: 0 } }];
        }

        const ads = await Advertisement.find(query)
          .sort({ priorityScore: -1, createdAt: -1 })
          .limit(limit)
          .populate('business', 'name slug locality rating coverImage address')
          .lean();

        if (ads.length > 0) return ads;
      } catch (err) {
        console.warn('DB Ad search error, falling back to memory', err);
      }
    }

    // In-memory fallback
    return Array.from(inMemoryAds.values())
      .filter((ad) => {
        const matchPlacement = ad.placement === placement;
        const matchActive = ad.status === 'ACTIVE' && new Date(ad.startDate) <= now && new Date(ad.endDate) >= now;
        const matchCat = options?.category
          ? (ad.targetCategories || []).length === 0 || (ad.targetCategories || []).includes(options.category)
          : true;
        return matchPlacement && matchActive && matchCat;
      })
      .sort((a, b) => b.priorityScore - a.priorityScore)
      .slice(0, limit);
  }

  /**
   * Track ad impression
   */
  public static async trackImpression(adId: string) {
    if (dbConnection.getStatus().isConnected) {
      try {
        await Advertisement.findByIdAndUpdate(adId, { $inc: { impressions: 1 } });
      } catch {
        // Fallback
      }
    }

    const ad = inMemoryAds.get(adId);
    if (ad) {
      ad.impressions += 1;
    }

    return { success: true };
  }

  /**
   * Track ad click
   */
  public static async trackClick(adId: string) {
    if (dbConnection.getStatus().isConnected) {
      try {
        await Advertisement.findByIdAndUpdate(adId, { $inc: { clicks: 1 } });
      } catch {
        // Fallback
      }
    }

    const ad = inMemoryAds.get(adId);
    if (ad) {
      ad.clicks += 1;
    }

    return { success: true };
  }

  /**
   * Admin: Get all advertisements & campaigns with performance
   */
  public static async getAllAds() {
    let adsList: any[] = [];
    if (dbConnection.getStatus().isConnected) {
      try {
        adsList = await Advertisement.find()
          .sort({ createdAt: -1 })
          .populate('business', 'name slug locality')
          .lean();
      } catch {
        // Fallback
      }
    }

    if (adsList.length === 0) {
      adsList = Array.from(inMemoryAds.values());
    }

    // Calculate CTR per ad
    return adsList.map((ad) => {
      const imp = ad.impressions || 0;
      const clk = ad.clicks || 0;
      const ctr = imp > 0 ? ((clk / imp) * 100).toFixed(2) + '%' : '0.00%';
      return { ...ad, ctr };
    });
  }

  /**
   * Admin: Create Advertisement
   */
  public static async createAd(data: any, userId?: string) {
    const adId = `ad-${Date.now()}`;
    const newAd: InMemoryAd = {
      _id: adId,
      title: data.title,
      type: data.type || 'SPONSORED_LISTING',
      placement: data.placement || 'SEARCH_TOP',
      business: data.business || data.businessId,
      headline: data.headline || data.title,
      description: data.description || '',
      callToAction: data.callToAction || 'View Spot',
      targetUrl: data.targetUrl || '/search',
      imageUrl: data.imageUrl,
      badgeLabel: data.badgeLabel || 'Sponsored',
      targetCategories: data.targetCategories || [],
      targetLocalities: data.targetLocalities || [],
      targetTags: data.targetTags || [],
      startDate: data.startDate ? new Date(data.startDate) : new Date(),
      endDate: data.endDate ? new Date(data.endDate) : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      status: data.status || 'ACTIVE',
      pricingModel: data.pricingModel || 'FLAT_RATE',
      price: Number(data.price) || 1499,
      currency: 'INR',
      impressions: 0,
      clicks: 0,
      spent: 0,
      priorityScore: Number(data.priorityScore) || 50,
      sponsorName: data.sponsorName,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    if (dbConnection.getStatus().isConnected) {
      try {
        const created = await Advertisement.create({
          ...newAd,
          business: data.business ? new mongoose.Types.ObjectId(data.business) : undefined,
          createdBy: userId ? new mongoose.Types.ObjectId(userId) : undefined,
        });
        return created.toObject();
      } catch (err) {
        console.warn('DB Ad creation failed, storing in memory', err);
      }
    }

    inMemoryAds.set(adId, newAd);
    return newAd;
  }

  /**
   * Admin: Update Advertisement
   */
  public static async updateAd(adId: string, data: any) {
    if (dbConnection.getStatus().isConnected) {
      try {
        const updated = await Advertisement.findByIdAndUpdate(adId, data, { new: true }).lean();
        if (updated) return updated;
      } catch {
        // Fallback
      }
    }

    const ad = inMemoryAds.get(adId);
    if (ad) {
      Object.assign(ad, data, { updatedAt: new Date() });
      return ad;
    }
    return null;
  }

  /**
   * Admin: Delete Advertisement
   */
  public static async deleteAd(adId: string) {
    if (dbConnection.getStatus().isConnected) {
      try {
        await Advertisement.findByIdAndDelete(adId);
        return true;
      } catch {
        // Fallback
      }
    }
    return inMemoryAds.delete(adId);
  }
}
