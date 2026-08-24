import mongoose from 'mongoose';
import { Offer, IOffer, OfferCategoryType, OfferStatus } from '../models/Offer';
import { Business } from '../models/Business';
import { dbConnection } from '../config/db';
import { SeedService } from './seed.service';

export interface InMemoryOffer {
  _id: string;
  business: any;
  title: string;
  description: string;
  discount: string;
  couponCode: string;
  validFrom: string;
  validUntil: string;
  status: OfferStatus;
  isActive: boolean;
  terms: string[];
  claimedCount: number;
  featured?: boolean;
  category?: OfferCategoryType | string;
  tags?: string[];
  createdAt: string;
  updatedAt: string;
}

const inMemoryOffers: Map<string, InMemoryOffer> = new Map();

// Seed comprehensive high-value demo offers across Delhi NCR covering all 6 requested categories
const SEED_OFFERS: InMemoryOffer[] = [
  {
    _id: 'offer_1',
    business: {
      _id: 'spot-1',
      name: 'Blue Tokai Coffee Roasters',
      slug: 'blue-tokai-coffee-roasters-saket',
      locality: 'Saidulajab, Saket',
      image: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=600',
      rating: 4.8,
    },
    title: 'Flat 20% Off Pour-Overs & Fresh Bakery Baskets',
    description: 'Valid on all single-origin specialty pour-overs, cold brews, and butter croissants on weekdays.',
    discount: '20% OFF',
    couponCode: 'SPOTTOKAI20',
    validFrom: new Date().toISOString(),
    validUntil: new Date(Date.now() + 25 * 86400000).toISOString(),
    status: 'ACTIVE',
    isActive: true,
    terms: ['Valid Monday to Thursday', 'One coupon per bill', 'Dine-in only', 'Valid on orders over ₹400'],
    claimedCount: 142,
    featured: true,
    category: 'Cafe Offers',
    tags: ['cafe', 'coffee', 'student-friendly', 'bakery', 'wifi-enabled', 'cafe-offers'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: 'offer_2',
    business: {
      _id: 'spot-2',
      name: 'Social Offline Hauz Khas',
      slug: 'social-offline-hauz-khas',
      locality: 'Hauz Khas Village',
      image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600',
      rating: 4.7,
    },
    title: 'Complimentary Mocktail / Craft Beverage with Any Platter',
    description: 'Enjoy panoramic lake-view dining with our signature LIITs, tropical spritzers, or craft lemonades.',
    discount: 'Free Drink',
    couponCode: 'HKVSOCIAL',
    validFrom: new Date().toISOString(),
    validUntil: new Date(Date.now() + 18 * 86400000).toISOString(),
    status: 'ACTIVE',
    isActive: true,
    terms: ['Applicable on food bills above ₹1200', 'Valid until 8:00 PM daily', 'Not combinable with happy hours'],
    claimedCount: 289,
    featured: true,
    category: 'Restaurant Offers',
    tags: ['restaurant', 'nightlife', 'couples', 'friends', 'rooftop', 'restaurant-offers'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: 'offer_3',
    business: {
      _id: 'biz_11',
      name: 'North Campus Elite Residency PG',
      slug: 'north-campus-elite-residency-pg',
      locality: 'GTB Nagar',
      image: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=600',
      rating: 4.8,
    },
    title: '₹2,000 Off First Month Rent + Zero Brokerage',
    description: 'Exclusive SpotPicks student subsidy for DU North Campus freshmen & interns booking 3+ month tenures.',
    discount: '₹2,000 OFF',
    couponCode: 'CAMPUSSTAY2K',
    validFrom: new Date().toISOString(),
    validUntil: new Date(Date.now() + 45 * 86400000).toISOString(),
    status: 'ACTIVE',
    isActive: true,
    terms: ['Valid with valid College/Internship ID card', 'Minimum 3 months contract', 'Includes 3 times meals & Wi-Fi'],
    claimedCount: 84,
    featured: true,
    category: 'Student Offers',
    tags: ['student-friendly', 'housing', 'pg', 'near-college', 'near-metro', 'student-offers'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: 'offer_4',
    business: {
      _id: 'biz_15',
      name: 'Drishti IAS & UPSC Study Circle',
      slug: 'drishti-ias-upsc-study-circle',
      locality: 'Karol Bagh',
      image: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=600',
      rating: 4.9,
    },
    title: '15% Concession on 2026 Prelims Test Series & Study Library',
    description: 'Comprehensive 35-test mock simulator with all-India ranking, detailed analytics, and air-conditioned library access.',
    discount: '15% OFF',
    couponCode: 'DRISHTIPRE15',
    validFrom: new Date().toISOString(),
    validUntil: new Date(Date.now() + 30 * 86400000).toISOString(),
    status: 'ACTIVE',
    isActive: true,
    terms: ['Valid for new registrations', 'Digital answer evaluation included', 'Includes library token'],
    claimedCount: 312,
    featured: false,
    category: 'Student Offers',
    tags: ['student-friendly', 'coaching', 'library', 'courses', 'student-offers'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: 'offer_5',
    business: {
      _id: 'biz_cinema',
      name: 'PVR Director Cut & Inox Luxe',
      slug: 'pvr-directors-cut-ambience-vasant-kunj',
      locality: 'Vasant Kunj',
      image: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=600',
      rating: 4.9,
    },
    title: 'Buy 1 Get 1 Free on Luxe Recliner Movie Tickets',
    description: 'Enjoy 4K Laser IMAX and luxury recliners with free gourmet popcorn tub on Monday-Thursday afternoon shows.',
    discount: 'BOGO Movie Pass',
    couponCode: 'SPOTLUXEBOGO',
    validFrom: new Date().toISOString(),
    validUntil: new Date(Date.now() + 35 * 86400000).toISOString(),
    status: 'ACTIVE',
    isActive: true,
    terms: ['Valid Mon-Thu shows before 5 PM', 'Applicable on bookings via SpotPicks partner portal', 'Excludes premiere nights'],
    claimedCount: 420,
    featured: true,
    category: 'Movie Offers',
    tags: ['cinema', 'movie-offers', 'entertainment', 'luxury', 'couples'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: 'offer_6',
    business: {
      _id: 'spot-3',
      name: 'Gulati Restaurant Pandara Road',
      slug: 'gulati-restaurant-pandara-road',
      locality: 'Pandara Road',
      image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=600',
      rating: 4.9,
    },
    title: 'Free Authentic Kulfi Falooda with Family Dining',
    description: 'Complimentary dessert platter with any table billing exceeding ₹2,500.',
    discount: 'Free Dessert',
    couponCode: 'PANDARAGULATI',
    validFrom: new Date().toISOString(),
    validUntil: new Date(Date.now() + 20 * 86400000).toISOString(),
    status: 'ACTIVE',
    isActive: true,
    terms: ['Valid for dinner & lunch', 'Dine-in only', 'One dessert platter per table'],
    claimedCount: 215,
    featured: true,
    category: 'Restaurant Offers',
    tags: ['restaurant', 'family-dining', 'authentic-taste', 'heritage', 'restaurant-offers'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: 'offer_7',
    business: {
      _id: 'biz_shopping',
      name: 'Dilli Haat & Handloom Collective',
      slug: 'dilli-haat-crafts-ina',
      locality: 'INA / South Extension',
      image: 'https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?w=600',
      rating: 4.8,
    },
    title: 'Flat ₹500 Instant Voucher on Handloom & Pottery Buys',
    description: 'Special artisan festival promotion for verified hand-woven shawls, blue pottery, and brass handicrafts over ₹2000.',
    discount: '₹500 OFF',
    couponCode: 'HAATCRAFT500',
    validFrom: new Date().toISOString(),
    validUntil: new Date(Date.now() + 28 * 86400000).toISOString(),
    status: 'ACTIVE',
    isActive: true,
    terms: ['Valid across participating artisan stalls', 'Present digital coupon at master billing counter'],
    claimedCount: 178,
    featured: true,
    category: 'Shopping Offers',
    tags: ['shopping', 'handicrafts', 'cultural', 'shopping-offers'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: 'offer_8',
    business: {
      _id: 'biz_events_hub',
      name: 'Delhi Live Arts & Concert Guild',
      slug: 'delhi-live-arts-guild',
      locality: 'Pragati Vihar / JLN',
      image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600',
      rating: 4.9,
    },
    title: '25% Early Bird Discount on Indie & Sufi Fusion Fest',
    description: 'Exclusive SpotPicks VIP phase 1 ticket discount for Delhi Indie Music and Sufi Fusion festival.',
    discount: '25% OFF',
    couponCode: 'EARLYSUFI25',
    validFrom: new Date().toISOString(),
    validUntil: new Date(Date.now() + 14 * 86400000).toISOString(),
    status: 'ACTIVE',
    isActive: true,
    terms: ['Limited to first 200 redemptions', 'Valid for single & couples passes', 'Non-refundable'],
    claimedCount: 165,
    featured: true,
    category: 'Events Offers',
    tags: ['events', 'concerts', 'live-music', 'events-offers'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

SEED_OFFERS.forEach((o) => inMemoryOffers.set(o._id, o));

export class OfferService {
  /**
   * Helper to normalize category name / aliases
   */
  public static normalizeCategory(cat: string): string {
    const c = cat.toLowerCase().trim();
    if (c.includes('restaurant')) return 'Restaurant Offers';
    if (c.includes('cafe')) return 'Cafe Offers';
    if (c.includes('shopping')) return 'Shopping Offers';
    if (c.includes('student')) return 'Student Offers';
    if (c.includes('movie') || c.includes('cinema')) return 'Movie Offers';
    if (c.includes('event')) return 'Events Offers';
    return cat;
  }

  /**
   * Automatically sweep and expire old offers whose validUntil has passed
   */
  public static async autoExpireOldOffers(): Promise<void> {
    const rightNow = new Date();

    // Expire in-memory
    inMemoryOffers.forEach((o) => {
      if (new Date(o.validUntil) < rightNow && o.status === 'ACTIVE') {
        o.status = 'EXPIRED';
        o.isActive = false;
        o.updatedAt = rightNow.toISOString();
      }
    });

    // Expire in MongoDB if connected
    if (dbConnection.getStatus().isConnected) {
      try {
        await Offer.updateMany(
          { validUntil: { $lt: rightNow }, status: 'ACTIVE' },
          { $set: { status: 'EXPIRED', isActive: false } }
        );
      } catch (err) {
        console.warn('MongoDB autoExpireOldOffers error:', err);
      }
    }
  }

  /**
   * Get all active public offers with rich filters
   */
  public static async getPublicOffers(filters: {
    category?: string;
    locality?: string;
    query?: string;
    tag?: string;
  } = {}) {
    await this.autoExpireOldOffers();

    const { category, locality, query, tag } = filters;

    if (dbConnection.getStatus().isConnected) {
      try {
        const mongoQuery: any = { isActive: true, status: 'ACTIVE' };
        if (tag) mongoQuery.terms = new RegExp(tag, 'i');

        const offers = await Offer.find(mongoQuery)
          .populate('business', 'name slug locality city rating images address categorySlug')
          .sort({ createdAt: -1 })
          .lean();

        if (offers && offers.length > 0) {
          return offers.filter((o: any) => {
            if (category && category !== 'all') {
              const normCat = this.normalizeCategory(category).toLowerCase();
              const oCat = (o.category || '').toLowerCase();
              const bCat = (o.business?.categorySlug || '').toLowerCase();
              if (!oCat.includes(normCat) && !bCat.includes(normCat) && !oCat.includes(category.toLowerCase())) {
                return false;
              }
            }
            if (locality && locality !== 'all') {
              const bLoc = o.business?.locality || '';
              if (!bLoc.toLowerCase().includes(locality.toLowerCase())) return false;
            }
            if (query) {
              const q = query.toLowerCase();
              const match =
                o.title.toLowerCase().includes(q) ||
                o.description.toLowerCase().includes(q) ||
                o.discount.toLowerCase().includes(q) ||
                o.couponCode.toLowerCase().includes(q) ||
                (o.business?.name && o.business.name.toLowerCase().includes(q));
              if (!match) return false;
            }
            return true;
          });
        }
      } catch (err) {
        console.warn('MongoDB Public Offers query fallback:', err);
      }
    }

    // In-memory fallback
    return Array.from(inMemoryOffers.values()).filter((o) => {
      if (!o.isActive || o.status !== 'ACTIVE') return false;

      if (category && category !== 'all') {
        const normCat = this.normalizeCategory(category).toLowerCase();
        const catMatch =
          (o.category && o.category.toLowerCase().includes(normCat)) ||
          (o.tags && o.tags.some((t) => t.toLowerCase().includes(normCat) || t.toLowerCase().includes(category.toLowerCase())));
        if (!catMatch) return false;
      }

      if (locality && locality !== 'all') {
        const loc = o.business?.locality || '';
        if (!loc.toLowerCase().includes(locality.toLowerCase())) return false;
      }

      if (tag) {
        if (!o.tags || !o.tags.some((t) => t.toLowerCase() === tag.toLowerCase())) return false;
      }

      if (query) {
        const q = query.toLowerCase();
        const match =
          o.title.toLowerCase().includes(q) ||
          o.description.toLowerCase().includes(q) ||
          o.discount.toLowerCase().includes(q) ||
          o.couponCode.toLowerCase().includes(q) ||
          (o.business?.name && o.business.name.toLowerCase().includes(q));
        if (!match) return false;
      }

      return true;
    });
  }

  /**
   * Get offers for a specific business (Public / Detail page)
   */
  public static async getOffersByBusiness(businessIdOrSlug: string) {
    await this.autoExpireOldOffers();

    if (dbConnection.getStatus().isConnected) {
      try {
        let bizId = businessIdOrSlug;
        if (!mongoose.Types.ObjectId.isValid(businessIdOrSlug)) {
          const b = await Business.findOne({ slug: businessIdOrSlug });
          if (b) bizId = b._id.toString();
        }

        const offers = await Offer.find({ business: bizId, isActive: true, status: 'ACTIVE' })
          .sort({ createdAt: -1 })
          .lean();

        if (offers && offers.length > 0) return offers;
      } catch (err) {
        console.warn('MongoDB getOffersByBusiness fallback:', err);
      }
    }

    return Array.from(inMemoryOffers.values()).filter((o) => {
      const b = o.business;
      return (
        o.isActive &&
        o.status === 'ACTIVE' &&
        (b._id === businessIdOrSlug || b.id === businessIdOrSlug || b.slug === businessIdOrSlug)
      );
    });
  }

  /**
   * Get all offers for a business owner
   */
  public static async getOwnerOffers(userId: string) {
    await this.autoExpireOldOffers();

    if (dbConnection.getStatus().isConnected) {
      const ownedBusinesses = await Business.find({ owner: userId }).select('_id');
      const ownedIds = ownedBusinesses.map((b) => b._id);

      return Offer.find({ business: { $in: ownedIds } })
        .populate('business', 'name slug locality city')
        .sort({ createdAt: -1 })
        .lean();
    }

    return Array.from(inMemoryOffers.values());
  }

  /**
   * Get all active & inactive offers across platform (Admin)
   */
  public static async getAllOffers() {
    await this.autoExpireOldOffers();

    if (dbConnection.getStatus().isConnected) {
      return Offer.find()
        .populate('business', 'name slug locality city rating')
        .sort({ createdAt: -1 })
        .lean();
    }

    return Array.from(inMemoryOffers.values());
  }

  /**
   * Create an offer
   */
  public static async createOffer(
    userId: string,
    data: {
      businessId: string;
      title: string;
      description?: string;
      discount: string;
      couponCode?: string;
      validFrom?: string;
      validUntil?: string;
      terms?: string[];
      category?: string;
      tags?: string[];
    }
  ) {
    const normCategory = this.normalizeCategory(data.category || 'Restaurant Offers');

    if (dbConnection.getStatus().isConnected) {
      const biz = await Business.findById(data.businessId);
      if (!biz) throw new Error('Establishment not found');

      const offer = await Offer.create({
        business: data.businessId,
        title: data.title,
        description: data.description || '',
        discount: data.discount,
        couponCode: (data.couponCode || 'SPOT10').toUpperCase(),
        validFrom: data.validFrom ? new Date(data.validFrom) : new Date(),
        validUntil: data.validUntil
          ? new Date(data.validUntil)
          : new Date(Date.now() + 30 * 86400000),
        terms: data.terms || ['Standard terms apply'],
        category: normCategory,
        status: 'ACTIVE',
        isActive: true,
      });

      return offer.toObject();
    }

    // In-Memory
    SeedService.initializeInMemoryStore();
    const biz = Array.from(SeedService.inMemoryBusinesses.values()).find(
      (b) => b._id === data.businessId || b.slug === data.businessId
    ) || {
      _id: data.businessId,
      name: 'Delhi Establishment',
      slug: 'delhi-spot',
      locality: 'Delhi',
    };

    const newId = `offer_${Date.now()}`;
    const newOffer: InMemoryOffer = {
      _id: newId,
      business: {
        _id: biz._id,
        name: biz.name,
        slug: biz.slug,
        locality: biz.locality,
        rating: 4.8,
      },
      title: data.title,
      description: data.description || '',
      discount: data.discount,
      couponCode: (data.couponCode || 'SPOT10').toUpperCase(),
      validFrom: data.validFrom || new Date().toISOString(),
      validUntil: data.validUntil || new Date(Date.now() + 30 * 86400000).toISOString(),
      status: 'ACTIVE',
      isActive: true,
      terms: data.terms || ['Standard verification on bill applies'],
      claimedCount: 0,
      featured: false,
      category: normCategory,
      tags: data.tags || ['verified-offer'],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    inMemoryOffers.set(newId, newOffer);
    return newOffer;
  }

  /**
   * Update Offer (Admin / Owner)
   */
  public static async updateOffer(offerId: string, data: Partial<InMemoryOffer>) {
    if (dbConnection.getStatus().isConnected) {
      const offer = await Offer.findByIdAndUpdate(offerId, { $set: data }, { new: true });
      if (!offer) throw new Error('Offer not found');
      return offer.toObject();
    }

    const offer = inMemoryOffers.get(offerId);
    if (!offer) throw new Error('Offer not found');

    const updated: InMemoryOffer = {
      ...offer,
      ...data,
      updatedAt: new Date().toISOString(),
    };
    inMemoryOffers.set(offerId, updated);
    return updated;
  }

  /**
   * Approve Offer (Admin)
   */
  public static async approveOffer(offerId: string) {
    return this.updateOffer(offerId, { status: 'ACTIVE', isActive: true });
  }

  /**
   * Toggle Featured status (Admin)
   */
  public static async toggleFeatured(offerId: string) {
    const existing = inMemoryOffers.get(offerId);
    if (dbConnection.getStatus().isConnected) {
      const offer = await Offer.findById(offerId);
      if (!offer) throw new Error('Offer not found');
      offer.featured = !offer.featured;
      await offer.save();
      return offer.toObject();
    }

    if (!existing) throw new Error('Offer not found');
    return this.updateOffer(offerId, { featured: !existing.featured });
  }

  /**
   * Expire Offer (Admin)
   */
  public static async expireOffer(offerId: string) {
    return this.updateOffer(offerId, { status: 'EXPIRED', isActive: false });
  }

  /**
   * Toggle offer status (Active / Inactive)
   */
  public static async toggleOffer(offerId: string) {
    if (dbConnection.getStatus().isConnected) {
      const offer = await Offer.findById(offerId);
      if (!offer) throw new Error('Offer not found');
      offer.isActive = !offer.isActive;
      offer.status = offer.isActive ? 'ACTIVE' : 'EXPIRED';
      await offer.save();
      return offer.toObject();
    }

    const offer = inMemoryOffers.get(offerId);
    if (!offer) throw new Error('Offer not found');
    offer.isActive = !offer.isActive;
    offer.status = offer.isActive ? 'ACTIVE' : 'EXPIRED';
    offer.updatedAt = new Date().toISOString();
    return offer;
  }

  /**
   * Delete an offer
   */
  public static async deleteOffer(offerId: string) {
    if (dbConnection.getStatus().isConnected) {
      await Offer.findByIdAndDelete(offerId);
      return true;
    }

    inMemoryOffers.delete(offerId);
    return true;
  }
}
