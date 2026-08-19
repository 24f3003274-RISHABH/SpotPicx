import mongoose from 'mongoose';
import { Business, IBusiness } from '../models/Business';
import { Category } from '../models/Category';
import { dbConnection } from '../config/db';
import { SeedService } from './seed.service';
import { CreateBusinessInput, UpdateBusinessInput } from '../validators/business.validator';

export interface BusinessQueryParams {
  page?: number;
  limit?: number;
  category?: string;
  locality?: string;
  city?: string;
  priceRange?: string;
  verified?: boolean | string;
  rating?: number | string;
  tags?: string | string[];
  q?: string;
  sort?: 'rating' | 'reviews' | 'newest' | 'name';
}

export class BusinessService {
  public static async getBusinesses(params: BusinessQueryParams) {
    const page = Math.max(1, Number(params.page) || 1);
    const limit = Math.min(50, Math.max(1, Number(params.limit) || 20));
    const skip = (page - 1) * limit;

    if (dbConnection.getStatus().isConnected) {
      try {
        const filter: Record<string, any> = { status: 'ACTIVE' };

        // City filter
        if (params.city) {
          filter.city = new RegExp(`^${params.city}$`, 'i');
        }

        // Locality filter
        if (params.locality) {
          filter.locality = new RegExp(params.locality, 'i');
        }

        // Price range filter
        if (params.priceRange) {
          filter.priceRange = params.priceRange.toUpperCase();
        }

        // Verified filter
        if (params.verified !== undefined) {
          filter.verified = params.verified === true || params.verified === 'true';
        }

        // Minimum rating filter
        if (params.rating) {
          filter.rating = { $gte: Number(params.rating) };
        }

        // Tags filter
        if (params.tags) {
          const tagsArray = Array.isArray(params.tags) ? params.tags : [params.tags];
          filter.tags = { $in: tagsArray };
        }

        // Category filter (support category ObjectId or slug)
        if (params.category) {
          if (mongoose.Types.ObjectId.isValid(params.category)) {
            filter.$or = [{ category: params.category }, { categories: params.category }];
          } else {
            const catDoc = await Category.findOne({ slug: params.category });
            if (catDoc) {
              filter.$or = [{ category: catDoc._id }, { categories: catDoc._id }];
            }
          }
        }

        // Full text search query
        if (params.q && params.q.trim()) {
          const keyword = params.q.trim();
          filter.$or = [
            { name: { $regex: keyword, $options: 'i' } },
            { description: { $regex: keyword, $options: 'i' } },
            { shortDescription: { $regex: keyword, $options: 'i' } },
            { tags: { $in: [new RegExp(keyword, 'i')] } },
            { locality: { $regex: keyword, $options: 'i' } },
          ];
        }

        // Sort configuration
        let sortOption: Record<string, any> = { rating: -1, reviewCount: -1 };
        if (params.sort === 'reviews') sortOption = { reviewCount: -1 };
        else if (params.sort === 'newest') sortOption = { createdAt: -1 };
        else if (params.sort === 'name') sortOption = { name: 1 };
        else if (params.sort === 'rating') sortOption = { rating: -1 };

        const [items, total] = await Promise.all([
          Business.find(filter)
            .populate('category', 'name slug icon image')
            .populate('categories', 'name slug icon')
            .sort(sortOption)
            .skip(skip)
            .limit(limit)
            .lean(),
          Business.countDocuments(filter),
        ]);

        const totalPages = Math.ceil(total / limit);

        return {
          data: items,
          pagination: {
            total,
            page,
            limit,
            totalPages,
            hasNextPage: page < totalPages,
            hasPrevPage: page > 1,
          },
        };
      } catch (err: any) {
        console.warn('[BusinessService] Fallback to in-memory business search:', err.message);
      }
    }

    // In-Memory Fallback
    SeedService.initializeInMemoryStore();
    let all = Array.from(SeedService.inMemoryBusinesses.values()).filter(
      (b) => b.status === 'ACTIVE'
    );

    // City filter
    if (params.city) {
      all = all.filter((b) => b.city.toLowerCase() === params.city?.toLowerCase());
    }

    // Locality filter
    if (params.locality) {
      all = all.filter((b) =>
        b.locality.toLowerCase().includes(params.locality!.toLowerCase())
      );
    }

    // Price range
    if (params.priceRange) {
      all = all.filter((b) => b.priceRange === params.priceRange?.toUpperCase());
    }

    // Verified
    if (params.verified !== undefined) {
      const isVer = params.verified === true || params.verified === 'true';
      all = all.filter((b) => b.verified === isVer);
    }

    // Rating
    if (params.rating) {
      all = all.filter((b) => b.rating >= Number(params.rating));
    }

    // Category
    if (params.category) {
      all = all.filter(
        (b) =>
          b.categorySlug === params.category ||
          (b.categorySlugs && b.categorySlugs.includes(params.category!))
      );
    }

    // Keyword Search
    if (params.q && params.q.trim()) {
      const q = params.q.trim().toLowerCase();
      all = all.filter(
        (b) =>
          b.name.toLowerCase().includes(q) ||
          b.description.toLowerCase().includes(q) ||
          b.shortDescription.toLowerCase().includes(q) ||
          b.locality.toLowerCase().includes(q) ||
          (b.tags && b.tags.some((t: string) => t.toLowerCase().includes(q)))
      );
    }

    // Tags
    if (params.tags) {
      const tagList = Array.isArray(params.tags) ? params.tags : [params.tags];
      all = all.filter((b) =>
        tagList.some((t) => b.tags && b.tags.includes(t))
      );
    }

    // Sort
    if (params.sort === 'reviews') all.sort((a, b) => b.reviewCount - a.reviewCount);
    else if (params.sort === 'newest') all.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    else if (params.sort === 'name') all.sort((a, b) => a.name.localeCompare(b.name));
    else all.sort((a, b) => b.rating - a.rating || b.reviewCount - a.reviewCount);

    const total = all.length;
    const totalPages = Math.ceil(total / limit);
    const paginatedItems = all.slice(skip, skip + limit);

    return {
      data: paginatedItems,
      pagination: {
        total,
        page,
        limit,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    };
  }

  public static async getBusinessBySlug(slugOrId: string) {
    if (dbConnection.getStatus().isConnected) {
      try {
        let query: Record<string, any> = { slug: slugOrId };
        if (mongoose.Types.ObjectId.isValid(slugOrId)) {
          query = { $or: [{ _id: slugOrId }, { slug: slugOrId }] };
        }

        const business = await Business.findOne(query)
          .populate('category', 'name slug icon image description')
          .populate('categories', 'name slug icon')
          .populate('owner', 'name email username avatar role')
          .lean();

        if (business) return business;
      } catch (err: any) {
        console.warn('[BusinessService] Fallback to in-memory slug lookup:', err.message);
      }
    }

    // In-memory fallback
    SeedService.initializeInMemoryStore();
    return (
      SeedService.inMemoryBusinesses.get(slugOrId) ||
      Array.from(SeedService.inMemoryBusinesses.values()).find(
        (b) => b._id === slugOrId || b.slug === slugOrId
      ) ||
      null
    );
  }

  public static async createBusiness(input: CreateBusinessInput, userId: string) {
    const slug =
      input.slug ||
      input.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '') +
        '-' +
        Math.floor(100 + Math.random() * 900);

    if (dbConnection.getStatus().isConnected) {
      // Find category ObjectId
      let catId: any = input.category;
      if (!mongoose.Types.ObjectId.isValid(input.category)) {
        const cat = await Category.findOne({ slug: input.category });
        if (cat) catId = cat._id;
      }

      const business = await Business.create({
        ...input,
        slug,
        category: catId,
        location: {
          type: 'Point',
          coordinates: [input.longitude || 77.209, input.latitude || 28.6139],
        },
        owner: userId ? new mongoose.Types.ObjectId(userId) : null,
      });

      return business.toObject();
    }

    // In-memory create
    SeedService.initializeInMemoryStore();
    const newId = new mongoose.Types.ObjectId().toString();
    const newBiz = {
      _id: newId,
      ...input,
      slug,
      rating: 5.0,
      reviewCount: 1,
      location: {
        type: 'Point',
        coordinates: [input.longitude || 77.209, input.latitude || 28.6139],
      },
      owner: userId,
      status: input.status || 'ACTIVE',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    SeedService.inMemoryBusinesses.set(slug, newBiz);
    return newBiz;
  }

  public static async updateBusiness(id: string, input: UpdateBusinessInput, user: any) {
    if (dbConnection.getStatus().isConnected) {
      const business = await Business.findById(id);
      if (!business) return null;

      // Ownership verification: Allow if owner, ADMIN, or SUPER_ADMIN
      const isOwner = business.owner && business.owner.toString() === user._id.toString();
      const isAdmin = ['ADMIN', 'SUPER_ADMIN', 'EDITOR'].includes(user.role);

      if (!isOwner && !isAdmin) {
        throw new Error('UNAUTHORIZED_MODIFICATION: You do not have permission to update this business');
      }

      Object.assign(business, input);
      if (input.latitude || input.longitude) {
        business.location = {
          type: 'Point',
          coordinates: [
            input.longitude ?? business.longitude,
            input.latitude ?? business.latitude,
          ],
        };
      }

      await business.save();
      return business.toObject();
    }

    // In-memory update
    SeedService.initializeInMemoryStore();
    let biz = Array.from(SeedService.inMemoryBusinesses.values()).find((b) => b._id === id || b.slug === id);
    if (!biz) return null;

    Object.assign(biz, input, { updatedAt: new Date() });
    SeedService.inMemoryBusinesses.set(biz.slug, biz);
    return biz;
  }

  public static async deleteBusiness(id: string, user: any) {
    if (dbConnection.getStatus().isConnected) {
      const business = await Business.findById(id);
      if (!business) return false;

      const isOwner = business.owner && business.owner.toString() === user._id.toString();
      const isAdmin = ['ADMIN', 'SUPER_ADMIN'].includes(user.role);

      if (!isOwner && !isAdmin) {
        throw new Error('UNAUTHORIZED_DELETION: You do not have permission to delete this business');
      }

      await Business.findByIdAndDelete(id);
      return true;
    }

    // In-memory delete
    SeedService.initializeInMemoryStore();
    const biz = Array.from(SeedService.inMemoryBusinesses.values()).find((b) => b._id === id || b.slug === id);
    if (!biz) return false;

    SeedService.inMemoryBusinesses.delete(biz.slug);
    return true;
  }
}
