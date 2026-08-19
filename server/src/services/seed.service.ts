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
        images: biz.images,
        logo: biz.logo,
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
            images: biz.images,
            logo: biz.logo,
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
