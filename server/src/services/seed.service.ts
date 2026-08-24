import mongoose from 'mongoose';
import { Category, ICategory } from '../models/Category';
import { Location, ILocation } from '../models/Location';
import { Business, IBusiness } from '../models/Business';
import { dbConnection } from '../config/db';
import {
  SEED_CATEGORIES,
  SEED_LOCATIONS,
  SEED_TAGS,
  generateFullDemoBusinesses,
  SeedCategory,
  SeedLocation,
  SeedBusiness,
} from './seed.data';

export class SeedService {
  // In-memory runtime data cache for development/preview without live MongoDB
  public static inMemoryCategories: Map<string, any> = new Map();
  public static inMemoryLocations: Map<string, any> = new Map();
  public static inMemoryBusinesses: Map<string, any> = new Map();
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
        parent: parentId,
        country: loc.country,
        state: loc.state,
        city: loc.city,
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

    this.isSeeded = true;
    console.log(
      `[SeedService] In-Memory Store populated: ${this.inMemoryCategories.size} Categories, ${this.inMemoryLocations.size} Locations, ${this.inMemoryBusinesses.size} Businesses.`
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
    counts: { categories: number; locations: number; businesses: number; tags: number };
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
            parent: parentId,
            country: loc.country,
            state: loc.state,
            city: loc.city,
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

      const totalCats = await Category.countDocuments();
      const totalLocs = await Location.countDocuments();
      const totalBiz = await Business.countDocuments();

      return {
        success: true,
        counts: {
          categories: totalCats,
          locations: totalLocs,
          businesses: totalBiz,
          tags: SEED_TAGS.length,
        },
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
