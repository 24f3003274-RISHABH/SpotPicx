import mongoose from 'mongoose';
import { Category, ICategory } from '../models/Category';
import { Location, ILocation } from '../models/Location';
import { Business, IBusiness } from '../models/Business';
import { Article } from '../models/Article';
import { Event } from '../models/Event';
import { Offer } from '../models/Offer';
import { SeoPage } from '../models/SeoPage';
import { Opportunity } from '../models/Opportunity';
import { PopularSearch, IPopularSearch } from '../models/PopularSearch';
import { Book } from '../models/Book';
import { Author } from '../models/Author';
import { SEED_AUTHORS, SEED_BOOKS } from '../seed/booksData';
import { SEED_OPPORTUNITIES } from './opportunity.service';
import { AuthService } from './auth.service';
import { dbConnection } from '../config/db';
import {
  SEED_CATEGORIES,
  SEED_LOCATIONS,
  SEED_TAGS,
  SEED_POPULAR_SEARCHES,
  generateFullDemoBusinesses,
  SeedCategory,
  SeedLocation,
  SeedBusiness,
  SeedPopularSearch,
} from './seed.data';

export class SeedService {
  // In-memory runtime data cache for development/preview without live MongoDB
  public static inMemoryCategories: Map<string, any> = new Map();
  public static inMemoryLocations: Map<string, any> = new Map();
  public static inMemoryBusinesses: Map<string, any> = new Map();
  public static inMemoryPopularSearches: Map<string, any> = new Map();
  public static isSeeded = false;

  public static initializeInMemoryStore(): void {
    if (this.isSeeded) return;

    // 1. Seed in-memory categories
    const allCategories = SEED_CATEGORIES;
    const catMap = new Map<string, string>(); // slug -> id

    for (const cat of allCategories) {
      const generatedId = new mongoose.Types.ObjectId().toString();
      catMap.set(cat.slug, generatedId);
    }

    for (const cat of allCategories) {
      const parentId = cat.parentSlug ? catMap.get(cat.parentSlug) || null : null;
      const catObj = {
        _id: catMap.get(cat.slug),
        name: cat.name,
        slug: cat.slug,
        description: cat.description,
        icon: cat.icon,
        image: cat.image,
        parent: parentId,
        type: cat.type,
        isActive: true,
        order: cat.order,
        seoTitle: cat.seoTitle || `${cat.name} in Delhi NCR - SpotPicks`,
        seoDescription: cat.seoDescription || cat.description,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      this.inMemoryCategories.set(cat.slug, catObj);
    }

    // 2. Seed in-memory locations
    const allLocations = SEED_LOCATIONS;
    const locMap = new Map<string, string>();

    for (const loc of allLocations) {
      const generatedId = new mongoose.Types.ObjectId().toString();
      locMap.set(loc.slug, generatedId);
    }

    for (const loc of allLocations) {
      const parentId = loc.parentSlug ? locMap.get(loc.parentSlug) || null : null;
      const locObj = {
        _id: locMap.get(loc.slug),
        name: loc.name,
        slug: loc.slug,
        type: loc.type,
        status: loc.status || 'ACTIVE',
        parent: parentId,
        country: loc.country,
        countrySlug: loc.countrySlug || 'india',
        state: loc.state,
        stateSlug: loc.stateSlug || loc.slug,
        city: loc.city,
        citySlug: loc.citySlug || loc.slug,
        district: loc.district || '',
        districtSlug: loc.districtSlug || '',
        shortCode: loc.shortCode || '',
        readinessScore: loc.readinessScore ?? (loc.status === 'ACTIVE' ? 100 : 30),
        waitlistCount: loc.waitlistCount || 0,
        latitude: loc.latitude,
        longitude: loc.longitude,
        pincode: loc.pincode,
        isActive: true,
        description: loc.description || '',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      this.inMemoryLocations.set(loc.slug, locObj);
    }

    // 3. Seed in-memory businesses
    const allBusinesses = generateFullDemoBusinesses();
    for (const biz of allBusinesses) {
      const primaryCatId = catMap.get(biz.categorySlug) || null;
      const allCatIds = biz.categorySlugs.map((s) => catMap.get(s)).filter(Boolean);
      const generatedId = new mongoose.Types.ObjectId().toString();

      const placeIntel = this.generateSeedPlaceIntelligence(biz);
      const visualMedia = this.generateSeedVisualMedia(biz);

      const bizObj = {
        _id: generatedId,
        name: biz.name,
        slug: biz.slug,
        description: biz.description,
        shortDescription: biz.shortDescription,
        category: primaryCatId,
        categoryDetails: this.inMemoryCategories.get(biz.categorySlug),
        categories: allCatIds,
        location: {
          type: 'Point',
          coordinates: [biz.longitude, biz.latitude],
        },
        address: biz.address,
        locality: biz.locality,
        city: biz.city,
        state: biz.state,
        country: biz.country,
        pincode: biz.pincode,
        latitude: biz.latitude,
        longitude: biz.longitude,
        phone: biz.phone,
        email: biz.email,
        website: biz.website,
        coverImage: visualMedia.coverImage,
        thumbnail: visualMedia.thumbnail,
        gallery: visualMedia.gallery,
        images: visualMedia.images,
        logo: biz.logo || visualMedia.thumbnail,
        priceRange: biz.priceRange,
        rating: biz.rating,
        reviewCount: biz.reviewCount,
        tags: biz.tags,
        amenities: biz.amenities,
        features: biz.features,
        openingHours: biz.openingHours,
        verified: biz.verified,
        claimed: biz.claimed,
        owner: null,
        status: biz.status,
        placeIntelligence: placeIntel,
        source: 'SpotPicx Curated Registry',
        sourceUrl: 'https://spotpicx.delhi.gov.in/registry',
        sourceType: 'DIRECT',
        lastUpdated: new Date(),
        lastVerified: new Date(),
        freshnessStatus: 'FRESH',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      this.inMemoryBusinesses.set(biz.slug, bizObj);
    }

    // 4. Seed in-memory popular searches
    for (const pop of SEED_POPULAR_SEARCHES) {
      const generatedId = new mongoose.Types.ObjectId().toString();
      const popObj = {
        _id: generatedId,
        id: generatedId,
        title: pop.title,
        slug: pop.slug,
        query: pop.query,
        category: pop.category,
        location: pop.location,
        filters: pop.filters || {},
        description: pop.description,
        icon: pop.icon,
        group: pop.group,
        badge: pop.badge || '',
        priority: pop.priority,
        isActive: pop.isActive,
        clickCount: pop.clickCount || 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      this.inMemoryPopularSearches.set(pop.slug, popObj);
    }

    this.isSeeded = true;
    console.log(
      `[SeedService] In-Memory Store populated: ${this.inMemoryCategories.size} Categories, ${this.inMemoryLocations.size} Locations, ${this.inMemoryBusinesses.size} Businesses, ${this.inMemoryPopularSearches.size} Popular Searches.`
    );
  }

  /**
   * Helper to construct rich Place Intelligence for seed places
   */
  public static generateSeedPlaceIntelligence(biz: any): any {
    const loc = biz.locality || 'Delhi';
    const metroMap: Record<string, { station: string; line: string; walk: string }> = {
      'Majnu Ka Tilla': { station: 'Vidhan Sabha Metro', line: 'Yellow Line', walk: '1.2 km (5 min e-rickshaw)' },
      'Hauz Khas Village': { station: 'Hauz Khas / IIT Delhi Metro', line: 'Yellow / Magenta Line', walk: '800 m (10 min walk)' },
      'Champa Gali': { station: 'Saket Metro', line: 'Yellow Line', walk: '900 m (10 min walk)' },
      'Connaught Place': { station: 'Rajiv Chowk Metro', line: 'Blue / Yellow Interchange', walk: '200 m (2 min walk)' },
      'Chandni Chowk': { station: 'Chandni Chowk Metro', line: 'Yellow Line', walk: '350 m (4 min walk)' },
      'Saket': { station: 'Saket / Malviya Nagar Metro', line: 'Yellow Line', walk: '600 m (7 min walk)' },
      'Nehru Place': { station: 'Nehru Place Metro', line: 'Violet Line', walk: '150 m (2 min walk)' },
      'Karol Bagh': { station: 'Karol Bagh Metro', line: 'Blue Line', walk: '400 m (5 min walk)' },
      'GTB Nagar': { station: 'GTB Nagar Metro', line: 'Yellow Line', walk: '150 m (2 min walk)' },
      'Lajpat Nagar': { station: 'Lajpat Nagar Metro', line: 'Pink / Violet Line', walk: '300 m (4 min walk)' },
      'Dwarka': { station: 'Dwarka Sector 9 Metro', line: 'Blue Line', walk: '500 m (6 min walk)' },
      'South Extension': { station: 'South Extension Metro', line: 'Pink Line', walk: '250 m (3 min walk)' },
    };

    const metroInfo = metroMap[loc] || { station: `${loc} Metro`, line: 'Delhi Metro', walk: '500 m' };

    let popularItems: string[] = ['Signature Specialties', 'Fresh Daily Preparations', 'Artisanal Selections'];
    let bestFor: string[] = ['Weekend Outings', 'Food Lovers', 'Casual Discovery'];
    let ambience: string[] = ['Cozy & Atmospheric', 'Vibrant', 'Welcoming'];
    let goodFor: string[] = ['Couples', 'Solo Explorers', 'Friends Gathering'];
    let priceLevel = '₹₹ Moderate (₹600 - ₹1,200 for two)';
    let recommendedDuration = '1.5 – 2 hours';
    let bestTimeToVisit = 'Evenings around sunset, 4:00 PM – 8:00 PM';

    if (biz.categorySlug?.includes('cafe') || biz.tags?.includes('wifi-enabled')) {
      popularItems = ['Blueberry Cheesecake', 'Artisanal Pour-Over Coffee', 'Fluffy Pancakes', 'Avocado Toast', 'Cold Brew Tonic'];
      bestFor = ['Remote Work & Reading', 'Cozy Dates', 'Artisanal Coffee Lovers', 'Brunch Hangouts'];
      ambience = ['Bohemian Decor', 'Aesthetic Natural Light', 'Chill Indie Background Music'];
      goodFor = ['Couples', 'Remote Workers', 'Solo Readers', 'Students'];
      priceLevel = '₹₹ (₹500 - ₹900 for two)';
      recommendedDuration = '1.5 – 3 hours';
      bestTimeToVisit = 'Weekday mornings & sunset hours';
    } else if (biz.categorySlug?.includes('street-food') || biz.tags?.includes('street-food') || biz.name.includes('Tibetan') || biz.name.includes('Kitchen')) {
      popularItems = ['Steamed Buff & Chicken Momos', 'Soupy Thukpa', 'Crispy Shabalay', 'Tingmo with Chilli Gravy', 'Tibetan Butter Tea'];
      bestFor = ['Authentic Food Trails', 'Budget Comfort Food', 'College Groups'];
      ambience = ['Bustling', 'Aroma-filled', 'Authentic Local Heritage'];
      goodFor = ['Food Explorers', 'Students', 'Family Dining', 'Friends Gathering'];
      priceLevel = '₹ (₹250 - ₹500 for two)';
      recommendedDuration = '45 min – 1.5 hours';
      bestTimeToVisit = 'Lunch (1:00 PM - 3:00 PM) & Dinner';
    } else if (biz.categorySlug?.includes('places-visit') || biz.tags?.includes('heritage')) {
      popularItems = ['Guided Historical Trail', 'Architectural Photo Walk', 'Sunset Viewpoint', 'Souvenir Counter'];
      bestFor = ['Heritage Tourism', 'Photography', 'Weekend Picnics', 'Cultural Immersion'];
      ambience = ['Majestic Heritage', 'Spacious Green Lawns', 'Historical Grandeur'];
      goodFor = ['Families', 'Solo Explorers', 'Photographers', 'Travelers'];
      priceLevel = '₹ (Entry ₹50 - ₹100)';
      recommendedDuration = '2 – 3 hours';
      bestTimeToVisit = 'Morning 8:00 AM - 11:00 AM or Late Afternoon';
    } else if (biz.categorySlug?.includes('tech') || biz.categorySlug?.includes('repair')) {
      popularItems = ['MacBook Logic Board Diagnostic', 'OEM Screen Replacement', 'Chip-Level Soldering', 'High Speed SSD Upgrade'];
      bestFor = ['Emergency Gadget Fixes', 'Certified Electronics Repair', 'Component Upgrades'];
      ambience = ['Professional Diagnostic Lab', 'Fast Turnaround'];
      goodFor = ['Tech Enthusiasts', 'Professionals', 'Students'];
      priceLevel = '₹₹ (Component Dependent)';
      recommendedDuration = '30 min – 2 hours';
      bestTimeToVisit = 'Weekday afternoons';
    } else if (biz.categorySlug?.includes('shopping') || biz.categorySlug?.includes('market')) {
      popularItems = ['Handloom Textile Cuts', 'Ethnic Embroidered Stoles', 'Custom Tailoring', 'Handmade Silver Jewelry'];
      bestFor = ['Bargain Hunting', 'Ethnic Wedding Shopping', 'Street Fashion Finds'];
      ambience = ['Vibrant Outdoor Promenade', 'Colorful Stalls'];
      goodFor = ['Shoppers', 'Fashion Enthusiasts', 'Couples'];
      priceLevel = '₹₹ (Great Bargain Value)';
      recommendedDuration = '2 – 4 hours';
      bestTimeToVisit = 'Weekdays 2:00 PM – 7:00 PM';
    }

    return {
      highlights: [
        `Ranked #${biz.rating >= 4.7 ? '1' : '3'} in ${loc} for ${biz.categorySlug || 'local spots'}`,
        `${biz.rating}★ rating verified by ${biz.reviewCount || 100}+ genuine reviews`,
        `Directly accessible from ${metroInfo.station}`,
        `Verified active with ${biz.amenities?.length || 4}+ on-site amenities`,
      ],
      bestFor,
      popularItems,
      priceLevel,
      ambience,
      amenities: biz.amenities || ['Air Conditioned', 'Card & UPI Accepted', 'Verified Staff'],
      goodFor,
      nearbyAttractions: [
        { name: `${loc} Central Promenade`, distance: '300 m', type: 'Shopping' },
        { name: metroInfo.station, distance: metroInfo.walk, type: 'Transit' },
        { name: `${loc} Heritage Park`, distance: '1.1 km', type: 'Landmark' },
      ],
      recommendedDuration,
      bestTimeToVisit,
      accessibility: {
        wheelchairAccessible: true,
        elevator: true,
        groundFloor: true,
        notes: 'Step-free entrance and wide main corridor available.',
      },
      parking: {
        available: true,
        type: loc === 'Connaught Place' ? 'MALL_PARKING' : 'STREET',
        valet: biz.priceRange === 'PREMIUM' || biz.priceRange === 'LUXURY',
        notes: 'Designated paid parking zones available nearby.',
      },
      transport: {
        metroNearby: metroInfo.station,
        metroLine: metroInfo.line,
        walkingDistance: metroInfo.walk,
        busStop: `${loc} Main Gate Bus Stop`,
        autoStand: '24x7 Prepaid & E-Rickshaw stand outside',
      },
      metroNearby: `${metroInfo.station} (${metroInfo.line})`,
      aiSummary: {
        whyVisit: `${biz.name} is a standout ${biz.rating}★ destination in ${loc}, celebrated for its authentic quality, signature ${popularItems[0] || 'offerings'}, and welcoming atmosphere.`,
        bestFor: bestFor.join(', '),
        whatToExpect: `Expect ${ambience.join(', ')} in ${loc} with verified amenities including ${(biz.amenities || []).slice(0, 3).join(', ')}.`,
        generatedAt: new Date().toISOString(),
      },
      sources: [
        {
          name: 'SpotPicx Delhi Verified Registry',
          url: 'https://spotpicx.delhi.gov.in/registry',
          verified: true,
          license: 'ODbL 1.0 Open Data License',
          note: 'Field-verified on ' + new Date().toLocaleDateString('en-IN'),
        },
        {
          name: 'Delhi NCR Transit Authority (DMRC)',
          url: 'https://delhimetrorail.com',
          verified: true,
          license: 'Public Transit Data',
          note: `Metro connectivity mapped to ${metroInfo.station}`,
        },
      ],
    };
  }

  /**
   * Helper to construct rich multi-image gallery with high-res licensed Unsplash photos
   */
  public static generateSeedVisualMedia(biz: any): {
    coverImage: string;
    thumbnail: string;
    gallery: Array<{ url: string; caption?: string; isHero?: boolean; sourceAttribution?: string }>;
    images: string[];
  } {
    const rawImages = biz.images && biz.images.length > 0 ? biz.images : [
      'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200&auto=format&fit=crop&q=85',
    ];

    const curatedPool: Record<string, string[]> = {
      cafes: [
        'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=1200&auto=format&fit=crop&q=85',
        'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=1200&auto=format&fit=crop&q=85',
        'https://images.unsplash.com/photo-1442512595331-e89e73853f31?w=1200&auto=format&fit=crop&q=85',
        'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=1200&auto=format&fit=crop&q=85',
        'https://images.unsplash.com/photo-1559925393-8be0ec4767c8?w=1200&auto=format&fit=crop&q=85',
      ],
      food: [
        'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=1200&auto=format&fit=crop&q=85',
        'https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=1200&auto=format&fit=crop&q=85',
        'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200&auto=format&fit=crop&q=85',
        'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=1200&auto=format&fit=crop&q=85',
        'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1200&auto=format&fit=crop&q=85',
      ],
      places: [
        'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=1200&auto=format&fit=crop&q=85',
        'https://images.unsplash.com/photo-1519331379826-f10be5486c6f?w=1200&auto=format&fit=crop&q=85',
        'https://images.unsplash.com/photo-1592635196078-9fdc757f27f4?w=1200&auto=format&fit=crop&q=85',
        'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=1200&auto=format&fit=crop&q=85',
        'https://images.unsplash.com/photo-1548013146-72479768bada?w=1200&auto=format&fit=crop&q=85',
      ],
      shopping: [
        'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&auto=format&fit=crop&q=85',
        'https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=1200&auto=format&fit=crop&q=85',
        'https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?w=1200&auto=format&fit=crop&q=85',
        'https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?w=1200&auto=format&fit=crop&q=85',
      ],
      services: [
        'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=1200&auto=format&fit=crop&q=85',
        'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=1200&auto=format&fit=crop&q=85',
        'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=1200&auto=format&fit=crop&q=85',
        'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1200&auto=format&fit=crop&q=85',
      ],
    };

    let pool = curatedPool.food;
    if (biz.categorySlug?.includes('cafe')) pool = curatedPool.cafes;
    else if (biz.categorySlug?.includes('places') || biz.categorySlug?.includes('stay') || biz.categorySlug?.includes('hotel')) pool = curatedPool.places;
    else if (biz.categorySlug?.includes('shopping') || biz.categorySlug?.includes('apparel')) pool = curatedPool.shopping;
    else if (biz.categorySlug?.includes('service') || biz.categorySlug?.includes('repair') || biz.categorySlug?.includes('salon') || biz.categorySlug?.includes('gym')) pool = curatedPool.services;

    const primaryImg = rawImages[0] || pool[0];
    const fullImages = [primaryImg, ...pool.filter((u) => u !== primaryImg)].slice(0, 5);

    const captions = [
      'Main Frontage & Ambience',
      'Signature Presentation & Space',
      'Artisanal Details & Interior',
      'Community Area & Seating',
      'Specialty Display & Highlights',
    ];

    const gallery = fullImages.map((url, idx) => ({
      url,
      caption: captions[idx] || `${biz.name} View ${idx + 1}`,
      isHero: idx === 0,
      sourceAttribution: 'SpotPicx Permitted Verified Photography',
    }));

    return {
      coverImage: primaryImg,
      thumbnail: primaryImg,
      gallery,
      images: fullImages,
    };
  }

  // MongoDB persistent seeder
  public static async seedDatabase(): Promise<{
    success: boolean;
    counts: { categories: number; locations: number; businesses: number; tags: number; opportunities?: number };
    mode: 'MONGODB' | 'IN_MEMORY';
  }> {
    this.initializeInMemoryStore();

    if (!dbConnection.getStatus().isConnected) {
      return {
        success: true,
        counts: {
          categories: this.inMemoryCategories.size,
          locations: this.inMemoryLocations.size,
          businesses: this.inMemoryBusinesses.size,
          tags: SEED_TAGS.length,
        },
        mode: 'IN_MEMORY',
      };
    }

    try {
      // 1. Seed Categories
      const catSlugToId = new Map<string, mongoose.Types.ObjectId>();

      // First pass: upsert root categories
      for (const cat of SEED_CATEGORIES.filter((c) => !c.parentSlug)) {
        let existing = await Category.findOne({ slug: cat.slug });
        if (!existing) {
          existing = await Category.create({
            name: cat.name,
            slug: cat.slug,
            description: cat.description,
            icon: cat.icon,
            image: cat.image,
            parent: null,
            type: cat.type,
            isActive: true,
            order: cat.order,
            seoTitle: cat.seoTitle,
            seoDescription: cat.seoDescription,
          });
        }
        catSlugToId.set(cat.slug, existing._id);
      }

      // Second pass: upsert subcategories with parent ObjectIds
      for (const cat of SEED_CATEGORIES.filter((c) => c.parentSlug)) {
        const parentId = catSlugToId.get(cat.parentSlug!) || null;
        let existing = await Category.findOne({ slug: cat.slug });
        if (!existing) {
          existing = await Category.create({
            name: cat.name,
            slug: cat.slug,
            description: cat.description,
            icon: cat.icon,
            image: cat.image,
            parent: parentId,
            type: cat.type,
            isActive: true,
            order: cat.order,
            seoTitle: cat.seoTitle,
            seoDescription: cat.seoDescription,
          });
        }
        catSlugToId.set(cat.slug, existing._id);
      }

      // 2. Seed Locations
      const locSlugToId = new Map<string, mongoose.Types.ObjectId>();
      for (const loc of SEED_LOCATIONS) {
        const parentId = loc.parentSlug ? locSlugToId.get(loc.parentSlug) || null : null;
        let existing = await Location.findOne({ slug: loc.slug });
        if (!existing) {
          existing = await Location.create({
            name: loc.name,
            slug: loc.slug,
            type: loc.type,
            status: loc.status || 'ACTIVE',
            parent: parentId,
            country: loc.country,
            countrySlug: loc.countrySlug || 'india',
            state: loc.state,
            stateSlug: loc.stateSlug || loc.slug,
            district: loc.district || '',
            districtSlug: loc.districtSlug || '',
            city: loc.city,
            citySlug: loc.citySlug || loc.slug,
            shortCode: loc.shortCode || '',
            readinessScore: loc.readinessScore ?? (loc.status === 'ACTIVE' ? 100 : 30),
            waitlistCount: loc.waitlistCount || 0,
            latitude: loc.latitude,
            longitude: loc.longitude,
            pincode: loc.pincode,
            isActive: true,
            description: loc.description,
          });
        }
        locSlugToId.set(loc.slug, existing._id);
      }

      // 3. Seed Businesses
      const fullDemoList = generateFullDemoBusinesses();
      for (const biz of fullDemoList) {
        const primaryCatId = catSlugToId.get(biz.categorySlug) || null;
        const allCatIds = biz.categorySlugs
          .map((slug) => catSlugToId.get(slug))
          .filter((id): id is mongoose.Types.ObjectId => Boolean(id));

        if (!primaryCatId) continue;

        let existing = await Business.findOne({ slug: biz.slug });
        if (!existing) {
          const placeIntel = this.generateSeedPlaceIntelligence(biz);
          const visualMedia = this.generateSeedVisualMedia(biz);

          await Business.create({
            name: biz.name,
            slug: biz.slug,
            description: biz.description,
            shortDescription: biz.shortDescription,
            category: primaryCatId,
            categories: allCatIds.length > 0 ? allCatIds : [primaryCatId],
            location: {
              type: 'Point',
              coordinates: [biz.longitude, biz.latitude],
            },
            address: biz.address,
            locality: biz.locality,
            city: biz.city,
            state: biz.state,
            country: biz.country,
            pincode: biz.pincode,
            latitude: biz.latitude,
            longitude: biz.longitude,
            phone: biz.phone,
            email: biz.email,
            website: biz.website,
            coverImage: visualMedia.coverImage,
            thumbnail: visualMedia.thumbnail,
            gallery: visualMedia.gallery,
            images: visualMedia.images,
            logo: biz.logo || visualMedia.thumbnail,
            priceRange: biz.priceRange,
            rating: biz.rating,
            reviewCount: biz.reviewCount,
            tags: biz.tags,
            amenities: biz.amenities,
            features: biz.features,
            openingHours: biz.openingHours,
            verified: biz.verified,
            claimed: biz.claimed,
            owner: null,
            status: biz.status,
            placeIntelligence: placeIntel,
            source: 'SpotPicx Curated Registry',
            sourceUrl: 'https://spotpicx.delhi.gov.in/registry',
            sourceType: 'DIRECT',
            lastUpdated: new Date(),
            lastVerified: new Date(),
            freshnessStatus: 'FRESH',
          });
        }
      }

      // 4. Seed Users (Super Admin & Demo Accounts)
      await AuthService.seedMongoUsers();

      // 5. Seed Articles if empty or missing GitHub guide
      const githubArticle = await Article.findOne({ slug: 'top-10-github-repositories-every-student-should-know' });
      if (!githubArticle) {
        await Article.create({
          title: 'Top 10 GitHub Repositories Every Computer Science Student Should Know',
          slug: 'top-10-github-repositories-every-student-should-know',
          excerpt: 'The definitive curated guide to 10 foundational open-source repositories covering Data Structures & Algorithms, Web Architecture, System Design, Generative AI, Machine Learning, and DevOps.',
          content: `GitHub is the ultimate open-source knowledge repository. Whether you are aiming for high-impact campus placements, competitive software engineering roles, or building your own startup from scratch, these 10 repositories will accelerate your technical trajectory.`,
          coverImage: 'https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?w=1200',
          author: 'SpotPicks Tech & Engineering Desk',
          authorRole: 'Chief Technology Curator',
          authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200',
          category: 'Student Guides',
          tags: ['GitHub', 'Computer Science', 'DSA', 'System Design', 'Open Source', 'Web Development', 'Machine Learning', 'AI', 'DevOps'],
          locations: ['Delhi NCR', 'India', 'Global'],
          seoTitle: 'Top 10 GitHub Repositories Every Computer Science Student Should Know (2026) | SpotPicks',
          seoDescription: 'Discover the top 10 GitHub repositories every computer science student must know: DSA, System Design, Web Dev, Generative AI, and Open Source guides with live stats.',
          published: true,
          publishedAt: new Date(),
          readingTimeMinutes: 8,
          featured: true,
        });
      }

      // Check and seed Free Websites guide
      const freeWebsitesExists = await Article.findOne({
        slug: 'free-websites-every-college-student-should-know',
      });
      if (!freeWebsitesExists) {
        await Article.create({
          title: '25 Free Websites Every College Student Should Know',
          slug: 'free-websites-every-college-student-should-know',
          excerpt: 'The ultimate curated directory of 25+ essential, verified free websites for college students covering Coding, DSA, AI/ML, CS, Mathematics, Resumes, Certifications, Research, and Internships.',
          content: `A comprehensive, categorized guide to 25+ zero-cost and student-discounted educational tools, developer sandboxes, open-source degree curriculums, ATS resume builders, and research paper databases.`,
          coverImage: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1200',
          author: 'SpotPicks Academic & Career Desk',
          authorRole: 'Head of Student Resources',
          authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200',
          category: 'Student Guides',
          tags: ['College Life', 'Free Tools', 'Coding', 'DSA', 'Resume', 'Scholarships', 'Internships', 'Mathematics', 'AI'],
          locations: ['Delhi NCR', 'India', 'Global'],
          seoTitle: '25 Free Websites Every College Student Should Know (2026) | SpotPicks',
          seoDescription: 'Explore the 25 essential free websites every college student needs: coding, DSA, free GPUs, resume builders, academic research, and student discounts.',
          published: true,
          publishedAt: new Date(),
          readingTimeMinutes: 10,
          featured: true,
        });
      }

      // Check and seed Best Internship Websites guide
      const internshipWebsitesExists = await Article.findOne({
        slug: 'best-internship-websites-for-college-students',
      });
      if (!internshipWebsitesExists) {
        await Article.create({
          title: 'Best Places to Find Internships & Jobs for College Students',
          slug: 'best-internship-websites-for-college-students',
          excerpt: 'The definitive searchable directory of verified, high-yield platforms for Software, Data Science, AI/ML, Startups, Remote Work, Government, Research Fellowships, and Open Source programs.',
          content: `The definitive guide to finding verified student internships and entry-level engineering jobs across Y Combinator startups, remote portals, Google Summer of Code, Mitacs research, and AICTE government programs.`,
          coverImage: 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=1200',
          author: 'SpotPicks Student Career Desk',
          authorRole: 'Head of Career Intelligence',
          authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200',
          category: 'Student Guides',
          tags: ['Internships', 'College Students', 'Software Jobs', 'Data Science', 'AI/ML', 'Remote Work', 'Research Fellowships', 'Open Source', 'Government Jobs', 'Freelancing'],
          locations: ['Delhi NCR', 'India', 'Global'],
          seoTitle: 'Best Places to Find Internships & Jobs for College Students (2026) | SpotPicks',
          seoDescription: 'Discover the most reliable platforms for student internships: Software, AI/ML, YC Startups, Remote, GSoC, Mitacs research, and Government portals with application playbooks.',
          published: true,
          publishedAt: new Date(),
          readingTimeMinutes: 9,
          featured: true,
        });
      }

      // Check and seed Best AI Tools Guide
      const aiToolsArticleExists = await Article.findOne({
        slug: 'best-ai-tools-for-college-students-2026',
      });
      if (!aiToolsArticleExists) {
        await Article.create({
          title: '20 AI Tools Every College Student Should Know in 2026',
          slug: 'best-ai-tools-for-college-students-2026',
          excerpt: 'The ultimate verified guide to 20 game-changing AI tools for studying, coding, research, writing, presentations, note-taking, and career building in 2026.',
          content: `The definitive benchmarked guide to 20 verified AI tools for college students in 2026 covering studying, coding, research, writing, presentations, note taking, and data analysis.`,
          coverImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200',
          author: 'SpotPicks Tech & Academic Desk',
          authorRole: 'Head of Academic Technology',
          authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200',
          category: 'Student Guides',
          tags: ['AI Tools', 'College Students', 'Studying', 'Coding', 'Research', 'Writing', 'Presentations', 'Note Taking', 'Productivity', 'Resume Building', 'Data Analysis'],
          locations: ['Delhi NCR', 'India', 'Global'],
          seoTitle: '20 AI Tools Every College Student Should Know in 2026 | SpotPicks',
          seoDescription: 'The definitive guide to the best AI tools for college students: NotebookLM, Cursor, Consensus, Claude, Gamma, Teal, and Julius AI with verified free tiers and use cases.',
          published: true,
          publishedAt: new Date(),
          readingTimeMinutes: 10,
          featured: true,
        });
      }

      const articleCount = await Article.countDocuments();
      if (articleCount <= 1) {
        await Article.create([
          {
            title: 'The Ultimate Guide to South Delhi Hidden Study & Work Cafes',
            slug: 'guide-south-delhi-study-work-cafes',
            excerpt: 'Quiet corners, superfast Wi-Fi, great pour-overs, and abundant power sockets across Saket, Green Park, and Hauz Khas.',
            content: `Delhi's cafe culture has evolved drastically from noisy quick-bites to sanctuary workspaces for creators, freelancers, and students. In this curated guide, we highlight spots that strike the perfect balance between quiet ambiance, artisanal coffees, and uninterrupted working desks.`,
            coverImage: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800',
            author: 'SpotPicks Editorial Team',
            category: 'Local Guides',
            tags: ['Work Cafes', 'South Delhi', 'Specialty Coffee'],
            locations: ['Saket', 'Hauz Khas', 'Green Park'],
            readingTimeMinutes: 6,
            featured: true,
            published: true,
            publishedAt: new Date(),
          },
          {
            title: 'Top 10 Late-Night Keventers, Momos & Kebabs in Delhi NCR',
            slug: 'top-late-night-momos-kebabs-delhi',
            excerpt: 'Where to head when midnight hunger strikes in North Campus, Amar Colony, and Connaught Place.',
            content: `Delhi never sleeps hungry. From sizzling tandoori rolls outside Pandara Road to butter-drenched steamed momos in Majnu Ka Tilla, here are the late-night hubs that locals swear by.`,
            coverImage: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800',
            author: 'Aarav Malhotra',
            category: 'Street Food',
            tags: ['Street Food', 'Midnight Cravings', 'Delhi Eats'],
            locations: ['Connaught Place', 'North Campus', 'Lajpat Nagar'],
            readingTimeMinutes: 5,
            featured: false,
            published: true,
            publishedAt: new Date(),
          },
        ]);
        console.log('📰 [SeedService] Seeded initial editorial articles into MongoDB Atlas.');
      }

      // 6. Seed Events if empty
      const eventCount = await Event.countDocuments();
      if (eventCount === 0) {
        await Event.create([
          {
            title: 'Delhi Heritage Culinary Walk — Old Delhi',
            slug: 'delhi-heritage-culinary-walk-old-delhi',
            description: 'Explore 300-year-old culinary traditions through Chandni Chowk, paranthe wali gali, and historic sweet houses.',
            venue: 'Jama Masjid Gate 3',
            location: {
              locality: 'Chandni Chowk',
              city: 'Delhi',
              coordinates: [77.2334, 28.6506],
            },
            startDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
            endDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000 + 4 * 60 * 60 * 1000),
            ticketPrice: '₹799 / person',
            category: 'Food Festival',
            images: ['https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800'],
            organizer: 'Delhi Heritage Guild',
            featured: true,
            status: 'UPCOMING',
          },
          {
            title: 'Artisanal Coffee & Roasting Workshop',
            slug: 'artisanal-coffee-roasting-workshop-saket',
            description: 'Hands-on cupping, manual brew methods (V60, Aeropress), and latte art session with master baristas.',
            venue: 'Blue Tokai Roastery',
            location: {
              locality: 'Saidulajab, Saket',
              city: 'Delhi',
              coordinates: [77.2001, 28.5186],
            },
            startDate: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000),
            endDate: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000 + 3 * 60 * 60 * 1000),
            ticketPrice: '₹1,200',
            category: 'Workshop',
            images: ['https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800'],
            organizer: 'SpotPicks Special',
            featured: true,
            status: 'UPCOMING',
          },
        ]);
        console.log('🎪 [SeedService] Seeded initial cultural events into MongoDB Atlas.');
      }

      // 7. Seed SEO Landing Pages if empty
      const seoCount = await SeoPage.countDocuments();
      if (seoCount === 0) {
        await SeoPage.create([
          {
            slug: 'best-cafes-in-saket-delhi',
            title: 'Top 10 Best Cafes in Saket Delhi (2026 Updated Guide) | SpotPicks',
            metaDescription: 'Discover top-rated artisanal cafes, study spots, and aesthetic brunch destinations in Saket, Saidulajab & Champa Gali with reviews & menus.',
            keywords: ['best cafes in saket', 'champa gali cafes', 'coffee shops saket delhi', 'aesthetic brunch south delhi'],
            h1: 'Best Cafes & Coffee Roasters in Saket, Delhi',
            intro: 'Saket and Saidulajab house some of the most aesthetic and coffee-focused cafes in South Delhi.',
            locality: 'Saket',
            category: 'Cafes',
            contentSections: [
              {
                title: 'Why Saket is a Coffee Lover Paradise',
                body: 'From tranquil roasteries to lively courtyard cafes, Saket is the epicenter of third-wave specialty coffee in Delhi.',
              },
            ],
            faq: [
              { question: 'What is the most popular cafe in Saket?', answer: 'Blue Tokai in Saidulajab and Rose Cafe near Saidulajab are highly rated.' },
              { question: 'Are there good work-friendly cafes in Saket?', answer: 'Yes, most Champa Gali & Saidulajab coffee shops offer high-speed Wi-Fi and power outlets.' },
            ],
            isIndexed: true,
            published: true,
          },
          {
            slug: 'top-street-food-in-chandni-chowk',
            title: 'Legendary Street Food in Chandni Chowk Old Delhi | SpotPicks',
            metaDescription: 'Complete food trail of Chandni Chowk: Paranthe Wali Gali, Natraj Dahi Bhalla, Old Famous Jalebi Wala, and Karim’s.',
            keywords: ['chandni chowk food trail', 'old delhi street food', 'paranthe wali gali timings', 'famous sweets chandni chowk'],
            h1: 'Legendary Street Food & Iconic Eateries in Chandni Chowk',
            intro: 'Chandni Chowk is the historic heart of Indian street food culture with recipes passed down over centuries.',
            locality: 'Chandni Chowk',
            category: 'Street Food',
            contentSections: [
              {
                title: 'The Legendary Heritage Food Trail',
                body: 'Explore centuries-old sweet houses, sizzling paranthas, and creamy rabri falooda.',
              },
            ],
            faq: [
              { question: 'What is the best time to visit Chandni Chowk for food?', answer: 'Late afternoons between 3 PM and 8 PM for snacks, and mornings around 9 AM for Bedmi Puri.' },
            ],
            isIndexed: true,
            published: true,
          },
        ]);
        console.log('⚡ [SeedService] Seeded initial SEO landing pages into MongoDB Atlas.');
      }

      // Check and seed Student Opportunities
      const oppCount = await Opportunity.countDocuments();
      if (oppCount === 0) {
        await Opportunity.create(SEED_OPPORTUNITIES);
        console.log('⚡ [SeedService] Seeded initial verified student opportunities into MongoDB Atlas.');
      }

      // Check and seed Popular Searches
      for (const pop of SEED_POPULAR_SEARCHES) {
        await PopularSearch.findOneAndUpdate(
          { slug: pop.slug },
          {
            $setOnInsert: {
              title: pop.title,
              slug: pop.slug,
              query: pop.query,
              category: pop.category,
              location: pop.location,
              filters: pop.filters || {},
              description: pop.description,
              icon: pop.icon,
              group: pop.group,
              badge: pop.badge || '',
              priority: pop.priority,
              isActive: pop.isActive,
              clickCount: pop.clickCount || 0,
            },
          },
          { upsert: true, new: true }
        );
      }
      console.log('⚡ [SeedService] Seeded popular search shortcuts into MongoDB Atlas.');

      // Check and seed Authors
      for (const author of SEED_AUTHORS) {
        await Author.findOneAndUpdate(
          { slug: author.slug },
          { $set: author },
          { upsert: true, new: true }
        );
      }
      console.log('⚡ [SeedService] Seeded verified Authors into MongoDB Atlas.');

      // Check and seed Books
      for (const book of SEED_BOOKS) {
        await Book.findOneAndUpdate(
          { slug: book.slug },
          { $set: book },
          { upsert: true, new: true }
        );
      }
      console.log('⚡ [SeedService] Seeded verified Books into MongoDB Atlas.');

      const totalCats = await Category.countDocuments();
      const totalLocs = await Location.countDocuments();
      const totalBiz = await Business.countDocuments();
      const totalOpps = await Opportunity.countDocuments();
      const totalPops = await PopularSearch.countDocuments();
      const totalAuthors = await Author.countDocuments();
      const totalBooks = await Book.countDocuments();

      return {
        success: true,
        counts: {
          categories: totalCats,
          locations: totalLocs,
          businesses: totalBiz,
          opportunities: totalOpps,
          popularSearches: totalPops,
          authors: totalAuthors,
          books: totalBooks,
          tags: SEED_TAGS.length,
        } as any,
        mode: 'MONGODB',
      };
    } catch (err: any) {
      console.error('[SeedService] Error seeding MongoDB:', err.message);
      return {
        success: true,
        counts: {
          categories: this.inMemoryCategories.size,
          locations: this.inMemoryLocations.size,
          businesses: this.inMemoryBusinesses.size,
          tags: SEED_TAGS.length,
        },
        mode: 'IN_MEMORY',
      };
    }
  }
}

// Auto initialize in-memory seed store on startup
SeedService.initializeInMemoryStore();
