import { SeedService } from './seed.service';
import { dbConnection } from '../config/db';
import { Business } from '../models/Business';
import { JobService } from './job.service';
import { OfferService } from './offer.service';
import { EventService } from './event.service';
import { TrendingService } from './trending.service';

export interface StudentDiscoveryParams {
  category?: string; // 'all' | 'pgs' | 'hostels' | 'libraries' | 'study-cafes' | 'cheap-food' | 'coaching' | 'courses' | 'internships' | 'jobs'
  college?: string; // 'north-campus' | 'south-campus' | 'iit-delhi' | 'jamia' | 'jnu' | 'ipu' | 'all'
  studentFriendlyOnly?: boolean;
  budgetOnly?: boolean;
  nearMetroOnly?: boolean;
  query?: string;
}

export interface HousingDiscoveryParams {
  housingType?: 'all' | 'pg' | 'hostel' | 'room' | 'flat' | 'coliving';
  priceMax?: number;
  gender?: 'all' | 'boys' | 'girls' | 'unisex';
  acOnly?: boolean;
  foodIncluded?: boolean;
  furnishedOnly?: boolean;
  nearMetro?: boolean;
  collegeHub?: string;
  query?: string;
}

export interface SpecialDiscoveryParams {
  intent: 'couples' | 'families' | 'friends' | 'solo' | 'students' | 'budget' | 'luxury' | 'hidden-gems';
  locality?: string;
  query?: string;
}

export class DiscoveryService {
  /**
   * Helper to ensure in-memory businesses are seeded
   */
  private static getBusinesses() {
    SeedService.initializeInMemoryStore();
    return Array.from(SeedService.inMemoryBusinesses.values());
  }

  /**
   * Homepage Live Feed:
   * Aggregates real dynamic live sections:
   * 1. Trending Today (multi-factor deterministic score)
   * 2. Popular Tonight (evening vibe, rooftop, cocktails, live gigs)
   * 3. Newly Added (freshly onboarded establishments)
   * 4. Recently Updated (recent menu/photos/timing changes)
   * 5. Events This Weekend (dynamic weekend agenda)
   * 6. Deals Near You (verified active offers & coupons)
   */
  public static async getHomepageLiveFeed() {
    const allBusinesses = this.getBusinesses();

    // 1. Trending Today
    const trendingToday = await TrendingService.getTrendingBusinesses(8);

    // 2. Popular Tonight (Nightlife, Rooftops, Late Night Cafes, Evening Experiences)
    const popularTonight = allBusinesses
      .filter((b: any) => {
        if (b.status && b.status !== 'ACTIVE') return false;
        const tags = (b.tags || []).join(' ').toLowerCase();
        const cat = (b.categorySlug || '').toLowerCase();
        const desc = (b.description || '').toLowerCase();
        const name = b.name.toLowerCase();

        return (
          tags.includes('nightlife') ||
          tags.includes('rooftop') ||
          tags.includes('live-music') ||
          tags.includes('cocktails') ||
          cat.includes('bar') ||
          cat.includes('pub') ||
          cat.includes('cafe') ||
          desc.includes('evening') ||
          desc.includes('sunset') ||
          desc.includes('rooftop') ||
          desc.includes('night') ||
          name.includes('social') ||
          name.includes('brewery')
        );
      })
      .slice(0, 8);

    // 3. Newly Added (Sorted by creation or freshly discovered spots)
    const newlyAdded = [...allBusinesses]
      .filter((b: any) => b.status === 'ACTIVE' || !b.status)
      .reverse()
      .slice(0, 8);

    // 4. Recently Updated (Spots with active updates, high engagement, or verified status)
    const recentlyUpdated = [...allBusinesses]
      .filter((b: any) => (b.status === 'ACTIVE' || !b.status) && (b.isVerified || b.rating >= 4.7))
      .slice(0, 8);

    // 5. Events This Weekend
    const weekendEventsResult = await EventService.getEvents({ timeframe: 'weekend', limit: 6 });
    const tonightEventsResult = await EventService.getEvents({ timeframe: 'tonight', limit: 4 });

    // 6. Deals Near You
    const dealsNearYou = await OfferService.getPublicOffers({});

    return {
      trendingToday,
      popularTonight,
      newlyAdded,
      recentlyUpdated,
      eventsThisWeekend: weekendEventsResult.events,
      eventsTonight: tonightEventsResult.events,
      dealsNearYou: dealsNearYou.slice(0, 6),
      updatedAt: new Date().toISOString(),
    };
  }

  /**
   * Student Hub Discovery
   */
  public static async getStudentDiscovery(params: StudentDiscoveryParams) {
    const {
      category = 'all',
      college = 'all',
      studentFriendlyOnly = false,
      budgetOnly = false,
      nearMetroOnly = false,
      query = '',
    } = params;

    // If requesting internships or jobs exclusively
    if (category === 'internships' || category === 'jobs') {
      const jobsResult = await JobService.getJobs({
        type: category === 'internships' ? 'Internship' : 'all',
        tag: 'student-friendly',
        query,
      });
      return {
        type: 'jobs',
        items: jobsResult.jobs,
        total: jobsResult.total,
      };
    }

    const allBusinesses = this.getBusinesses();

    const filtered = allBusinesses.filter((b: any) => {
      // Must be active
      if (b.status && b.status !== 'ACTIVE') return false;

      // Category matching
      if (category && category !== 'all') {
        const cat = category.toLowerCase();
        const bCat = (b.categorySlug || '').toLowerCase();
        const bCats = (b.categorySlugs || []).map((c: string) => c.toLowerCase());
        const bName = b.name.toLowerCase();
        const bDesc = (b.description || '').toLowerCase();

        let matchesCat = false;
        if (cat === 'pgs' || cat === 'hostels') {
          matchesCat = bCat.includes('pg') || bCat.includes('hostel') || bCats.some((c: string) => c.includes('pg') || c.includes('hostel')) || bName.includes('pg') || bName.includes('hostel');
        } else if (cat === 'libraries' || cat === 'study-cafes') {
          matchesCat = bCat.includes('cafe') || bCat.includes('librar') || bDesc.includes('study') || bDesc.includes('wifi') || bName.includes('library');
        } else if (cat === 'cheap-food') {
          matchesCat = (bCat.includes('street') || bCat.includes('food') || bCat.includes('cafe')) && (b.priceRange === 'BUDGET' || b.tags?.includes('budget-friendly'));
        } else if (cat === 'coaching' || cat === 'courses') {
          matchesCat = bCat.includes('coaching') || bCat.includes('education') || bName.includes('ias') || bName.includes('coaching') || bName.includes('academy');
        } else {
          matchesCat = bCat.includes(cat) || bCats.some((c: string) => c.includes(cat)) || bName.includes(cat);
        }

        if (!matchesCat) return false;
      }

      // College Hub matching
      if (college && college !== 'all') {
        const c = college.toLowerCase();
        const loc = (b.locality || '').toLowerCase();
        const addr = (b.address || '').toLowerCase();
        const desc = (b.description || '').toLowerCase();

        if (c.includes('north-campus')) {
          const match = loc.includes('gtb nagar') || loc.includes('kamla nagar') || loc.includes('north campus') || addr.includes('north campus') || loc.includes('hudson lane') || loc.includes('malka ganj');
          if (!match) return false;
        } else if (c.includes('south-campus')) {
          const match = loc.includes('satya niketan') || loc.includes('south campus') || loc.includes('south extension') || loc.includes('anand niketan') || loc.includes('rk puram');
          if (!match) return false;
        } else if (c.includes('iit-delhi')) {
          const match = loc.includes('hauz khas') || loc.includes('saket') || loc.includes('ber sarai') || loc.includes('jia sarai');
          if (!match) return false;
        }
      }

      // Tag & Boolean Filters
      if (studentFriendlyOnly) {
        const isFriendly =
          (b.tags && b.tags.includes('student-friendly')) ||
          b.priceRange === 'BUDGET' ||
          (b.description || '').toLowerCase().includes('student');
        if (!isFriendly) return false;
      }

      if (budgetOnly) {
        if (b.priceRange !== 'BUDGET' && (!b.tags || !b.tags.includes('budget-friendly'))) {
          return false;
        }
      }

      if (nearMetroOnly) {
        const nearMetro =
          (b.tags && (b.tags.includes('near-metro') || b.tags.includes('metro-accessible'))) ||
          (b.address && b.address.toLowerCase().includes('metro'));
        if (!nearMetro) return false;
      }

      if (query) {
        const q = query.toLowerCase();
        const textMatch =
          b.name.toLowerCase().includes(q) ||
          b.description.toLowerCase().includes(q) ||
          b.locality.toLowerCase().includes(q);
        if (!textMatch) return false;
      }

      return true;
    });

    // Also fetch relevant student offers & internships
    const studentOffers = await OfferService.getPublicOffers({ tag: 'student-friendly' });
    const studentJobs = await JobService.getJobs({ tag: 'student-friendly', limit: 6 });

    return {
      type: 'businesses',
      items: filtered,
      total: filtered.length,
      studentOffers: studentOffers.slice(0, 4),
      featuredJobs: studentJobs.jobs,
    };
  }

  /**
   * Housing & PGs / Hostels Hub
   */
  public static async getHousingDiscovery(params: HousingDiscoveryParams) {
    const {
      housingType = 'all',
      gender = 'all',
      acOnly = false,
      foodIncluded = false,
      furnishedOnly = false,
      nearMetro = false,
      collegeHub = 'all',
      query = '',
    } = params;

    const allBusinesses = this.getBusinesses();

    // Find housing spots or augment with realistic PG entries
    const housingSpots = allBusinesses.filter((b: any) => {
      const cat = (b.categorySlug || '').toLowerCase();
      const name = b.name.toLowerCase();
      const desc = (b.description || '').toLowerCase();
      const tags = (b.tags || []).join(' ').toLowerCase();

      // Is it a housing / PG / hostel / stay?
      const isHousing =
        cat.includes('pg') ||
        cat.includes('hostel') ||
        name.includes('pg') ||
        name.includes('hostel') ||
        name.includes('residency') ||
        name.includes('living') ||
        desc.includes('paying guest') ||
        tags.includes('ac-rooms') ||
        tags.includes('hygienic-mess');

      if (!isHousing) return false;

      // Housing Type
      if (housingType && housingType !== 'all') {
        const t = housingType.toLowerCase();
        if (t === 'pg' && !name.includes('pg') && !desc.includes('pg')) return false;
        if (t === 'hostel' && !name.includes('hostel') && !desc.includes('hostel')) return false;
        if (t === 'coliving' && !name.includes('living') && !desc.includes('co-living')) return false;
      }

      // Gender
      if (gender && gender !== 'all') {
        const g = gender.toLowerCase();
        if (g === 'girls' && (name.includes('boys') || desc.includes('boys only'))) return false;
        if (g === 'boys' && (name.includes('girls') || desc.includes('girls only'))) return false;
      }

      // AC
      if (acOnly) {
        const hasAc = tags.includes('ac-rooms') || desc.includes('ac') || (b.amenities || []).some((a: string) => a.toLowerCase().includes('ac') || a.toLowerCase().includes('air condition'));
        if (!hasAc) return false;
      }

      // Food
      if (foodIncluded) {
        const hasFood = tags.includes('hygienic-mess') || desc.includes('food') || desc.includes('meals') || (b.amenities || []).some((a: string) => a.toLowerCase().includes('mess') || a.toLowerCase().includes('food'));
        if (!hasFood) return false;
      }

      // Furnished
      if (furnishedOnly) {
        const isFurnished = desc.includes('furnished') || tags.includes('furnished') || (b.amenities || []).some((a: string) => a.toLowerCase().includes('furnished') || a.toLowerCase().includes('bed'));
        if (!isFurnished) return false;
      }

      // Near Metro
      if (nearMetro) {
        const closeMetro = tags.includes('metro-accessible') || tags.includes('near-metro') || (b.address && b.address.toLowerCase().includes('metro'));
        if (!closeMetro) return false;
      }

      // College Hub
      if (collegeHub && collegeHub !== 'all') {
        const ch = collegeHub.toLowerCase();
        const loc = b.locality.toLowerCase();
        if (ch.includes('north') && !loc.includes('gtb') && !loc.includes('kamla') && !loc.includes('north')) return false;
        if (ch.includes('south') && !loc.includes('satya') && !loc.includes('south')) return false;
      }

      // Text query
      if (query) {
        const q = query.toLowerCase();
        if (!name.includes(q) && !desc.includes(q) && !b.locality.toLowerCase().includes(q)) return false;
      }

      return true;
    });

    return {
      items: housingSpots,
      total: housingSpots.length,
    };
  }

  /**
   * Special Discovery Hub (Couples, Families, Friends, Solo, Students, Budget, Luxury, Hidden Gems)
   */
  public static async getSpecialDiscovery(params: SpecialDiscoveryParams) {
    const { intent, locality = 'all', query = '' } = params;
    const allBusinesses = this.getBusinesses();

    const intentCriteriaMap: Record<
      string,
      {
        title: string;
        tagline: string;
        curatorNote: string;
        filter: (b: any) => boolean;
        recommendedTags: string[];
      }
    > = {
      couples: {
        title: 'Romantic & Date Night Spots',
        tagline: 'Scenic lake views, candle-lit haveli rooftops & intimate European bistros.',
        curatorNote: 'Evaluated for ambient acoustic levels, aesthetic lighting, cozy seating, and romantic vibe.',
        recommendedTags: ['couple-friendly', 'rooftop', 'fine-dining', 'outdoor-seating', 'aesthetic'],
        filter: (b: any) => {
          const tags = b.tags || [];
          const name = b.name.toLowerCase();
          const desc = (b.description || '').toLowerCase();
          return (
            tags.includes('couple-friendly') ||
            tags.includes('rooftop') ||
            tags.includes('outdoor-seating') ||
            name.includes('cafe') ||
            name.includes('rooftop') ||
            desc.includes('romantic') ||
            desc.includes('candle') ||
            desc.includes('lake') ||
            b.categorySlug === 'cafes-bakeries' ||
            b.categorySlug === 'restaurants'
          );
        },
      },
      families: {
        title: 'Family-Friendly Spots & Dining',
        tagline: 'Spacious seating, pure hygienic kitchens, lush heritage parks & kids activities.',
        curatorNote: 'Filtered for family banquet arrangements, kid-safe park environments, and multi-generational menus.',
        recommendedTags: ['family-dining', 'organic', 'authentic-taste', 'heritage', 'clean-restrooms'],
        filter: (b: any) => {
          const tags = b.tags || [];
          const desc = (b.description || '').toLowerCase();
          return (
            tags.includes('family-dining') ||
            tags.includes('heritage') ||
            b.categorySlug === 'parks-gardens' ||
            b.categorySlug === 'historical-monuments' ||
            desc.includes('family') ||
            desc.includes('spacious') ||
            b.name.includes('Gulati') ||
            b.name.includes('Haveli') ||
            b.name.includes('Sunder Nursery')
          );
        },
      },
      friends: {
        title: 'Group Hangouts & Nightlife',
        tagline: 'Vibrant live music hubs, board game cafes, rooftop bars & sports arenas.',
        curatorNote: 'Curated for group energy, sharing platters, craft beverages, and lively social spaces.',
        recommendedTags: ['live-music', 'nightlife', 'sports', 'wifi-enabled', 'craft-beer'],
        filter: (b: any) => {
          const tags = b.tags || [];
          const name = b.name.toLowerCase();
          const desc = (b.description || '').toLowerCase();
          return (
            tags.includes('live-music') ||
            tags.includes('24x7-access') ||
            b.categorySlug === 'gyms-fitness' ||
            name.includes('social') ||
            name.includes('sports') ||
            name.includes('arena') ||
            desc.includes('cocktail') ||
            desc.includes('games') ||
            desc.includes('nightlife')
          );
        },
      },
      solo: {
        title: 'Solo Explorer & Work-Friendly Spots',
        tagline: 'High-speed Wi-Fi coffee bars, tranquil libraries, reading nooks & art murals.',
        curatorNote: 'Chosen for ergonomic charging ports, quiet acoustics, single-origin roasts, and peaceful surroundings.',
        recommendedTags: ['wifi-enabled', 'solo-friendly', 'coffee', 'peaceful', 'books'],
        filter: (b: any) => {
          const tags = b.tags || [];
          const name = b.name.toLowerCase();
          const desc = (b.description || '').toLowerCase();
          return (
            tags.includes('wifi-enabled') ||
            tags.includes('solo') ||
            b.categorySlug === 'cafes-bakeries' ||
            b.categorySlug === 'books-stationery' ||
            b.categorySlug === 'parks-gardens' ||
            name.includes('tokai') ||
            name.includes('lodhi') ||
            desc.includes('work') ||
            desc.includes('laptop') ||
            desc.includes('tranquil')
          );
        },
      },
      students: {
        title: 'Student Hub & Campus Hangouts',
        tagline: 'Late night Maggi joints, ₹200 buffet thalis, book markets & vibrant campus hubs.',
        curatorNote: 'Verified for pocket friendliness, student discount policies, and proximity to DU / IIT / JNU.',
        recommendedTags: ['student-friendly', 'budget-friendly', 'near-metro', 'quick-service'],
        filter: (b: any) => {
          const tags = b.tags || [];
          const desc = (b.description || '').toLowerCase();
          return (
            tags.includes('student-friendly') ||
            b.priceRange === 'BUDGET' ||
            b.locality === 'GTB Nagar' ||
            b.locality === 'Majnu Ka Tilla' ||
            desc.includes('student') ||
            desc.includes('budget')
          );
        },
      },
      budget: {
        title: 'Best Pocket-Friendly & Street Spots',
        tagline: 'Sensational meals & experiences under ₹300 with unmatched flavor and heritage.',
        curatorNote: 'Zero compromise on hygiene and taste while keeping wallets full.',
        recommendedTags: ['budget-friendly', 'street-food', 'quick-service', 'authentic-taste'],
        filter: (b: any) => {
          const tags = b.tags || [];
          return (
            b.priceRange === 'BUDGET' ||
            tags.includes('budget-friendly') ||
            b.categorySlug === 'street-food' ||
            tags.includes('street-food')
          );
        },
      },
      luxury: {
        title: 'Luxury & Fine Dining Experiences',
        tagline: 'Michelin-grade culinary artistry, 5-star hotel lounges & bespoke rejuvenation.',
        curatorNote: 'Hand-inspected for five-star service, master sommelier pairings, and opulent decor.',
        recommendedTags: ['fine-dining', 'luxury', 'premium', 'valet-parking', 'organic'],
        filter: (b: any) => {
          return (
            b.priceRange === 'PREMIUM' ||
            b.priceRange === 'LUXURY' ||
            (b.tags && b.tags.includes('fine-dining')) ||
            (b.description || '').toLowerCase().includes('luxury') ||
            b.rating >= 4.8
          );
        },
      },
      'hidden-gems': {
        title: 'Secret Alleys & Hidden Gems of Delhi',
        tagline: 'Undiscovered haveli cafes, secluded lake corners & offbeat Tibetan culinary spots.',
        curatorNote: 'Treasured local insider discoveries kept away from standard tourist footfall.',
        recommendedTags: ['hidden-gem', 'secret-spot', 'authentic-taste', 'heritage', 'artisanal'],
        filter: (b: any) => {
          const name = b.name.toLowerCase();
          const desc = (b.description || '').toLowerCase();
          return (
            b.locality === 'Majnu Ka Tilla' ||
            b.locality === 'Chawri Bazar' ||
            name.includes('haveli') ||
            name.includes('tenzin') ||
            name.includes('sunder nursery') ||
            name.includes('lodhi art') ||
            desc.includes('hidden') ||
            desc.includes('secret') ||
            desc.includes('secluded')
          );
        },
      },
    };

    const criteria = intentCriteriaMap[intent] || intentCriteriaMap['hidden-gems'];

    const filtered = allBusinesses.filter((b: any) => {
      if (b.status && b.status !== 'ACTIVE') return false;

      if (locality && locality !== 'all') {
        if (!b.locality.toLowerCase().includes(locality.toLowerCase())) return false;
      }

      if (query) {
        const q = query.toLowerCase();
        if (!b.name.toLowerCase().includes(q) && !b.description.toLowerCase().includes(q)) {
          return false;
        }
      }

      return criteria.filter(b);
    });

    return {
      intent,
      meta: {
        title: criteria.title,
        tagline: criteria.tagline,
        curatorNote: criteria.curatorNote,
        recommendedTags: criteria.recommendedTags,
      },
      items: filtered,
      total: filtered.length,
    };
  }
}
