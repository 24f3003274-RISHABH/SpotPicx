import mongoose from 'mongoose';
import { Offer, IOffer } from '../models/Offer';
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
  status: 'ACTIVE' | 'EXPIRED' | 'DRAFT';
  isActive: boolean;
  terms: string[];
  claimedCount: number;
  featured?: boolean;
  category?: string;
  tags?: string[];
  createdAt: string;
  updatedAt: string;
}

const inMemoryOffers: Map<string, InMemoryOffer> = new Map();

// Seed comprehensive high-value demo offers across Delhi NCR
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
    category: 'Cafes & Bakeries',
    tags: ['coffee', 'student-friendly', 'bakery', 'wifi-enabled'],
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
    category: 'Food & Dining',
    tags: ['nightlife', 'couples', 'friends', 'rooftop'],
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
    category: 'PGs & Hostels',
    tags: ['student-friendly', 'housing', 'pg', 'near-college', 'near-metro'],
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
    category: 'Education & Coaching',
    tags: ['student-friendly', 'coaching', 'library', 'courses'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: 'offer_5',
    business: {
      _id: 'biz_13',
      name: 'CyberLogic Apple & MacBook Repair',
      slug: 'cyberlogic-apple-macbook-repair',
      locality: 'Nehru Place',
      image: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=600',
      rating: 4.9,
    },
    title: 'Free Diagnostic Checkup + Flat 25% Off Battery Replacement',
    description: 'Genuine OEM battery swap with 1-year warranty and same-day express service on all MacBooks and iPads.',
    discount: '25% OFF',
    couponCode: 'MACCARE25',
    validFrom: new Date().toISOString(),
    validUntil: new Date(Date.now() + 40 * 86400000).toISOString(),
    status: 'ACTIVE',
    isActive: true,
    terms: ['Free thermal repasting included', 'Same day service on appointments', 'Carry valid student ID for bonus 5%'],
    claimedCount: 96,
    featured: false,
    category: 'Services & Repairs',
    tags: ['laptop-repair', 'student-friendly', 'apple-certified'],
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
    category: 'Food & Dining',
    tags: ['family-dining', 'authentic-taste', 'heritage'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

SEED_OFFERS.forEach((o) => inMemoryOffers.set(o._id, o));

export class OfferService {
  /**
   * Get all active public offers with rich filters
   */
  public static async getPublicOffers(filters: {
    category?: string;
    locality?: string;
    query?: string;
    tag?: string;
  } = {}) {
    const { category, locality, query, tag } = filters;

    if (dbConnection.getStatus().isConnected) {
      try {
        const mongoQuery: any = { isActive: true, status: 'ACTIVE' };
        if (tag) mongoQuery.terms = new RegExp(tag, 'i');

        const offers = await Offer.find(mongoQuery)
          .populate('business', 'name slug locality city rating images address')
          .sort({ createdAt: -1 })
          .lean();

        if (offers && offers.length > 0) {
          return offers.filter((o: any) => {
            if (category && category !== 'all') {
              const bCat = o.business?.categorySlug || '';
              if (!bCat.toLowerCase().includes(category.toLowerCase())) return false;
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
        const catMatch =
          (o.category && o.category.toLowerCase().includes(category.toLowerCase())) ||
          (o.tags && o.tags.some((t) => t.toLowerCase().includes(category.toLowerCase())));
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
    if (dbConnection.getStatus().isConnected) {
      try {
        let bizId = businessIdOrSlug;
        if (!mongoose.Types.ObjectId.isValid(businessIdOrSlug)) {
          const b = await Business.findOne({ slug: businessIdOrSlug });
          if (b) bizId = b._id.toString();
        }

        const offers = await Offer.find({ business: bizId, isActive: true })
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
        (b._id === businessIdOrSlug || b.id === businessIdOrSlug || b.slug === businessIdOrSlug)
      );
    });
  }

  /**
   * Get all offers for a business owner
   */
  public static async getOwnerOffers(userId: string) {
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
      category: data.category || 'Food & Dining',
      tags: data.tags || ['verified-offer'],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    inMemoryOffers.set(newId, newOffer);
    return newOffer;
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
