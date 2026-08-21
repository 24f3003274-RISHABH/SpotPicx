import mongoose from 'mongoose';
import { User } from '../models/User';
import { Business } from '../models/Business';
import { Review } from '../models/Review';
import { Category } from '../models/Category';
import { Location } from '../models/Location';
import { Report } from '../models/Report';
import { BusinessClaim } from '../models/BusinessClaim';
import { Event } from '../models/Event';
import { Article } from '../models/Article';
import { SeoPage } from '../models/SeoPage';
import { Offer } from '../models/Offer';
import { SearchQuery } from '../models/SearchQuery';
import { dbConnection } from '../config/db';
import { SeedService } from './seed.service';

// In-Memory Dev Stores for Events, Articles, and SEO Pages
const inMemoryEvents = [
  {
    _id: 'evt_1',
    title: 'Delhi Heritage Culinary Walk — Old Delhi',
    slug: 'delhi-heritage-culinary-walk-old-delhi',
    description: 'Explore 300-year-old culinary traditions through Chandni Chowk, paranthe wali gali, and historic sweet houses.',
    venue: 'Jama Masjid Gate 3',
    locality: 'Chandni Chowk',
    city: 'Delhi',
    date: '2026-09-12',
    time: '04:30 PM',
    price: '₹799 / person',
    category: 'Food Walk',
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800',
    organizer: 'Delhi Heritage Guild',
    featured: true,
    status: 'UPCOMING',
  },
  {
    _id: 'evt_2',
    title: 'Artisanal Coffee & Roasting Workshop',
    slug: 'artisanal-coffee-roasting-workshop-saket',
    description: 'Hands-on cupping, manual brew methods (V60, Aeropress), and latte art session with master baristas.',
    venue: 'Blue Tokai Roastery',
    locality: 'Saidulajab, Saket',
    city: 'Delhi',
    date: '2026-09-20',
    time: '11:00 AM',
    price: '₹1,200',
    category: 'Workshop',
    image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800',
    organizer: 'SpotPicks Special',
    featured: true,
    status: 'UPCOMING',
  },
];

const inMemoryArticles = [
  {
    _id: 'art_1',
    title: 'The Ultimate Guide to South Delhi Hidden Study & Work Cafes',
    slug: 'guide-south-delhi-study-work-cafes',
    excerpt: 'Quiet corners, superfast Wi-Fi, great pour-overs, and abundant power sockets across Saket, Green Park, and Hauz Khas.',
    content: `Delhi's cafe culture has evolved drastically from noisy quick-bites to sanctuary workspaces for creators, freelancers, and students. In this curated guide, we highlight spots that strike the perfect balance between quiet ambiance, artisanal coffees, and uninterrupted working desks.`,
    coverImage: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800',
    author: 'SpotPicks Editorial',
    category: 'Local Guides',
    tags: ['Work Cafes', 'South Delhi', 'Specialty Coffee'],
    readingTimeMinutes: 6,
    featured: true,
    status: 'PUBLISHED',
    publishedAt: new Date(),
  },
  {
    _id: 'art_2',
    title: 'Top 10 Late-Night Keventers, Momos & Kebabs in Delhi NCR',
    slug: 'top-late-night-momos-kebabs-delhi',
    excerpt: 'Where to head when midnight hunger strikes in North Campus, Amar Colony, and Connaught Place.',
    content: `Delhi never sleeps hungry. From sizzling tandoori rolls outside Pandara Road to butter-drenched steamed momos in Majnu Ka Tilla, here are the late-night hubs that locals swear by.`,
    coverImage: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800',
    author: 'Aarav Malhotra',
    category: 'Street Food',
    tags: ['Street Food', 'Midnight Cravings', 'Delhi Eats'],
    readingTimeMinutes: 5,
    featured: false,
    status: 'PUBLISHED',
    publishedAt: new Date(),
  },
];

const inMemorySeoPages = [
  {
    _id: 'seo_1',
    slug: 'best-cafes-in-saket-delhi',
    title: 'Top 10 Best Cafes in Saket Delhi (2026 Updated Guide) | SpotPicks',
    metaDescription: 'Discover top-rated artisanal cafes, study spots, and aesthetic brunch destinations in Saket, Saidulajab & Champa Gali with reviews & menus.',
    keywords: ['best cafes in saket', 'champa gali cafes', 'coffee shops saket delhi', 'aesthetic brunch south delhi'],
    h1: 'Best Cafes & Coffee Roasters in Saket, Delhi',
    locality: 'Saket',
    category: 'Cafes',
    customFaqs: [
      { question: 'What is the most popular cafe in Saket?', answer: 'Blue Tokai in Saidulajab and Rose Cafe near Saidulajab are highly rated.' },
      { question: 'Are there good work-friendly cafes in Saket?', answer: 'Yes, most Champa Gali & Saidulajab coffee shops offer high-speed Wi-Fi and power outlets.' },
    ],
    isIndexed: true,
  },
  {
    _id: 'seo_2',
    slug: 'top-street-food-in-chandni-chowk',
    title: 'Legendary Street Food in Chandni Chowk Old Delhi | SpotPicks',
    metaDescription: 'Complete food trail of Chandni Chowk: Paranthe Wali Gali, Natraj Dahi Bhalla, Old Famous Jalebi Wala, and Karim’s.',
    keywords: ['chandni chowk food trail', 'old delhi street food', 'paranthe wali gali timings', 'famous sweets chandni chowk'],
    h1: 'Legendary Street Food & Iconic Eateries in Chandni Chowk',
    locality: 'Chandni Chowk',
    category: 'Street Food',
    customFaqs: [
      { question: 'What is the best time to visit Chandni Chowk for food?', answer: 'Late afternoons between 3 PM and 8 PM for snacks, and mornings around 9 AM for Bedmi Puri.' },
    ],
    isIndexed: true,
  },
];

export class AdminService {
  /**
   * Get Platform Overview Statistics
   */
  public static async getDashboardStats() {
    if (dbConnection.getStatus().isConnected) {
      try {
        const [
          totalUsers,
          totalBusinesses,
          totalReviews,
          pendingClaims,
          pendingReports,
          activeOffers,
        ] = await Promise.all([
          User.countDocuments(),
          Business.countDocuments(),
          Review.countDocuments(),
          BusinessClaim.countDocuments({ status: 'PENDING' }),
          Report.countDocuments({ status: 'PENDING' }),
          Offer.countDocuments({ isActive: true }),
        ]);

        const popularCategories = await Category.find().limit(6).lean();
        const popularLocations = await Location.find().limit(6).lean();
        const trendingBusinesses = await Business.find({ status: 'ACTIVE' })
          .sort({ rating: -1, reviewCount: -1 })
          .limit(5)
          .lean();

        return {
          stats: {
            totalUsers,
            totalBusinesses,
            totalReviews,
            totalSearches: 18420,
            pendingClaims,
            pendingReports,
            activeOffers,
          },
          popularCategories,
          popularLocations,
          trendingBusinesses,
        };
      } catch (e: any) {
        console.warn('Admin stats query error:', e.message);
      }
    }

    // In-Memory Fallback
    SeedService.initializeInMemoryStore();
    const businesses = Array.from(SeedService.inMemoryBusinesses.values());
    const categories = Array.from(SeedService.inMemoryCategories.values());
    const locations = Array.from(SeedService.inMemoryLocations.values());

    return {
      stats: {
        totalUsers: 248,
        totalBusinesses: businesses.length,
        totalReviews: 1390,
        totalSearches: 24500,
        pendingClaims: 1,
        pendingReports: 2,
        activeOffers: 6,
      },
      popularCategories: categories.slice(0, 6),
      popularLocations: locations.slice(0, 6),
      trendingBusinesses: businesses
        .sort((a, b) => b.rating - a.rating || b.reviewCount - a.reviewCount)
        .slice(0, 5),
    };
  }

  /**
   * Get All Businesses with Admin Filters
   */
  public static async getAdminBusinesses(params: {
    status?: string;
    search?: string;
    category?: string;
    verified?: string;
    page?: number;
    limit?: number;
  }) {
    const page = Math.max(1, Number(params.page) || 1);
    const limit = Math.min(100, Math.max(1, Number(params.limit) || 25));
    const skip = (page - 1) * limit;

    if (dbConnection.getStatus().isConnected) {
      const filter: any = {};
      if (params.status && params.status !== 'ALL') {
        filter.status = params.status;
      }
      if (params.verified && params.verified !== 'ALL') {
        filter.verified = params.verified === 'true';
      }
      if (params.search) {
        filter.$or = [
          { name: { $regex: params.search, $options: 'i' } },
          { locality: { $regex: params.search, $options: 'i' } },
          { city: { $regex: params.search, $options: 'i' } },
        ];
      }

      const [data, total] = await Promise.all([
        Business.find(filter)
          .populate('category', 'name slug')
          .populate('owner', 'name email username')
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limit)
          .lean(),
        Business.countDocuments(filter),
      ]);

      return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
    }

    SeedService.initializeInMemoryStore();
    let list = Array.from(SeedService.inMemoryBusinesses.values());

    if (params.status && params.status !== 'ALL') {
      list = list.filter((b) => b.status === params.status);
    }
    if (params.verified && params.verified !== 'ALL') {
      const isV = params.verified === 'true';
      list = list.filter((b) => b.verified === isV);
    }
    if (params.search) {
      const q = params.search.toLowerCase();
      list = list.filter(
        (b) =>
          b.name.toLowerCase().includes(q) ||
          b.locality.toLowerCase().includes(q) ||
          b.city.toLowerCase().includes(q)
      );
    }

    const total = list.length;
    const paginated = list.slice(skip, skip + limit);
    return { data: paginated, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  /**
   * Update Business Moderation Status (ACTIVE, PENDING, REJECTED, ARCHIVED)
   */
  public static async updateBusinessStatus(id: string, status: string) {
    if (dbConnection.getStatus().isConnected) {
      const b = await Business.findByIdAndUpdate(id, { status }, { new: true });
      if (!b) throw new Error('Business not found');
      return b.toObject();
    }

    SeedService.initializeInMemoryStore();
    const b = Array.from(SeedService.inMemoryBusinesses.values()).find(
      (item) => item._id === id || item.slug === id
    );
    if (!b) throw new Error('Business not found');
    b.status = status;
    b.updatedAt = new Date();
    SeedService.inMemoryBusinesses.set(b.slug, b);
    return b;
  }

  /**
   * Toggle Business Verified Status
   */
  public static async toggleBusinessVerified(id: string) {
    if (dbConnection.getStatus().isConnected) {
      const b = await Business.findById(id);
      if (!b) throw new Error('Business not found');
      b.verified = !b.verified;
      await b.save();
      return b.toObject();
    }

    SeedService.initializeInMemoryStore();
    const b = Array.from(SeedService.inMemoryBusinesses.values()).find(
      (item) => item._id === id || item.slug === id
    );
    if (!b) throw new Error('Business not found');
    b.verified = !b.verified;
    b.updatedAt = new Date();
    SeedService.inMemoryBusinesses.set(b.slug, b);
    return b;
  }

  /**
   * Events CRUD
   */
  public static async getEvents() {
    if (dbConnection.getStatus().isConnected) {
      return Event.find().sort({ date: 1 }).lean();
    }
    return inMemoryEvents;
  }

  public static async createEvent(data: any) {
    const slug = data.slug || data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Math.floor(Math.random() * 1000);
    if (dbConnection.getStatus().isConnected) {
      return (await Event.create({ ...data, slug })).toObject();
    }
    const newEvt = { _id: `evt_${Date.now()}`, ...data, slug };
    inMemoryEvents.push(newEvt);
    return newEvt;
  }

  public static async deleteEvent(id: string) {
    if (dbConnection.getStatus().isConnected) {
      await Event.findByIdAndDelete(id);
      return true;
    }
    const idx = inMemoryEvents.findIndex((e) => e._id === id);
    if (idx !== -1) inMemoryEvents.splice(idx, 1);
    return true;
  }

  /**
   * Articles CRUD
   */
  public static async getArticles() {
    if (dbConnection.getStatus().isConnected) {
      return Article.find().sort({ createdAt: -1 }).lean();
    }
    return inMemoryArticles;
  }

  public static async createArticle(data: any) {
    const slug = data.slug || data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Math.floor(Math.random() * 1000);
    if (dbConnection.getStatus().isConnected) {
      return (await Article.create({ ...data, slug })).toObject();
    }
    const newArt = { _id: `art_${Date.now()}`, ...data, slug, createdAt: new Date() };
    inMemoryArticles.unshift(newArt);
    return newArt;
  }

  public static async deleteArticle(id: string) {
    if (dbConnection.getStatus().isConnected) {
      await Article.findByIdAndDelete(id);
      return true;
    }
    const idx = inMemoryArticles.findIndex((a) => a._id === id);
    if (idx !== -1) inMemoryArticles.splice(idx, 1);
    return true;
  }

  /**
   * SEO Pages CRUD
   */
  public static async getSeoPages() {
    if (dbConnection.getStatus().isConnected) {
      return SeoPage.find().sort({ updatedAt: -1 }).lean();
    }
    return inMemorySeoPages;
  }

  public static async createSeoPage(data: any) {
    if (dbConnection.getStatus().isConnected) {
      return (await SeoPage.create(data)).toObject();
    }
    const newPage = { _id: `seo_${Date.now()}`, ...data, createdAt: new Date(), updatedAt: new Date() };
    inMemorySeoPages.unshift(newPage);
    return newPage;
  }

  public static async deleteSeoPage(id: string) {
    if (dbConnection.getStatus().isConnected) {
      await SeoPage.findByIdAndDelete(id);
      return true;
    }
    const idx = inMemorySeoPages.findIndex((p) => p._id === id);
    if (idx !== -1) inMemorySeoPages.splice(idx, 1);
    return true;
  }
}
