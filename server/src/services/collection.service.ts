import mongoose from 'mongoose';
import { Collection, ICollection, CollectionVisibility } from '../models/Collection';
import { Business } from '../models/Business';
import { dbConnection } from '../config/db';
import { SeedService } from './seed.service';

export interface CreateCollectionInput {
  name: string;
  description?: string;
  coverImage?: string;
  visibility?: CollectionVisibility;
  items?: string[];
  category?: string;
}

export interface UpdateCollectionInput {
  name?: string;
  description?: string;
  coverImage?: string;
  visibility?: CollectionVisibility;
  category?: string;
}

export interface InMemoryCollection {
  _id: string;
  name: string;
  slug: string;
  description: string;
  coverImage: string;
  visibility: CollectionVisibility;
  owner: {
    _id: string;
    name: string;
    avatar?: string;
    username?: string;
  };
  items: any[]; // Populated businesses
  itemIds: string[];
  itemCount: number;
  likes: string[];
  isCurated: boolean;
  category: string;
  createdAt: Date;
  updatedAt: Date;
}

// Initial curated & user collections for Delhi NCR
const inMemoryCollections: InMemoryCollection[] = [
  {
    _id: 'col-delhi-cafes',
    name: 'My Delhi Cafes & Work Stays',
    slug: 'my-delhi-cafes',
    description: 'A hand-picked selection of aesthetic, high-speed WiFi cafes and peaceful study corners in South & Central Delhi.',
    coverImage: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=800&auto=format&fit=crop&q=80',
    visibility: 'PUBLIC',
    owner: {
      _id: 'usr-spotpicks-team',
      name: 'SpotPicks Editorial',
      username: 'spotpicks_team',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    },
    items: [],
    itemIds: ['ama-cafe-mkt', 'social-hauz-khas', 'jugmug-thela-saket', 'blue-tokai-saidulajab'],
    itemCount: 4,
    likes: ['usr-aarav', 'usr-priya'],
    isCurated: true,
    category: 'Cafes & Work',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    _id: 'col-date-places',
    name: 'Romantic Date Places in Delhi',
    slug: 'romantic-date-places',
    description: 'Candle-lit lake terraces, lush garden bistros, and heritage rooftop dinners with panoramic monument views.',
    coverImage: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&auto=format&fit=crop&q=80',
    visibility: 'PUBLIC',
    owner: {
      _id: 'usr-spotpicks-team',
      name: 'SpotPicks Editorial',
      username: 'spotpicks_team',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    },
    items: [],
    itemIds: ['social-hauz-khas', 'lado-sarai-art-cafe', 'haveli-dharampura-rooftop'],
    itemCount: 3,
    likes: ['usr-priya', 'usr-rohit'],
    isCurated: true,
    category: 'Dates & Fine Dining',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    _id: 'col-cheap-eats',
    name: 'Legendary Cheap Eats & Street Food',
    slug: 'cheap-eats-delhi',
    description: 'Iconic Old Delhi paranthe, steaming Tibetan laphing, chole bhature, and midnight rolls under ₹250.',
    coverImage: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=800&auto=format&fit=crop&q=80',
    visibility: 'PUBLIC',
    owner: {
      _id: 'usr-aarav',
      name: 'Aarav Sharma',
      username: 'aarav_delhi',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
    },
    items: [],
    itemIds: ['karims-jama-masjid', 'paranthe-wali-gali-spot', 'ama-cafe-mkt', 'sita-ram-chole-bhature'],
    itemCount: 4,
    likes: ['usr-priya'],
    isCurated: false,
    category: 'Street Food',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    _id: 'col-weekend-plans',
    name: 'Weekend Plans & Cultural Exploration',
    slug: 'weekend-plans-delhi',
    description: 'Art galleries in Lado Sarai, historic Qutub Complex sunset walks, and Sunday morning cycling spots.',
    coverImage: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=800&auto=format&fit=crop&q=80',
    visibility: 'PUBLIC',
    owner: {
      _id: 'usr-spotpicks-team',
      name: 'SpotPicks Editorial',
      username: 'spotpicks_team',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    },
    items: [],
    itemIds: ['qutub-minar-complex', 'red-fort-heritage-walk', 'sunder-nursery-gardens'],
    itemCount: 3,
    likes: [],
    isCurated: true,
    category: 'Heritage & Walks',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    _id: 'col-places-to-visit',
    name: 'Must-See Places to Visit (Delhi Bucket List)',
    slug: 'places-to-visit-delhi',
    description: 'Essential landmarks and iconic Delhi architectural masterpieces for first-time explorers and weekend tourists.',
    coverImage: 'https://images.unsplash.com/photo-1548013146-72479768bada?w=800&auto=format&fit=crop&q=80',
    visibility: 'PUBLIC',
    owner: {
      _id: 'usr-spotpicks-team',
      name: 'SpotPicks Editorial',
      username: 'spotpicks_team',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    },
    items: [],
    itemIds: ['humayun-tomb-heritage', 'qutub-minar-complex', 'chandni-chowk-bazaar'],
    itemCount: 3,
    likes: [],
    isCurated: true,
    category: 'Monuments',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

export class CollectionService {
  public static async createCollection(
    userId: string,
    userDoc: { name: string; avatar?: string; username?: string },
    input: CreateCollectionInput
  ) {
    if (!input.name || input.name.trim().length < 2) {
      throw new Error('Collection name must be at least 2 characters');
    }

    const slug =
      input.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '') +
      '-' +
      Math.random().toString(36).substr(2, 4);

    const items = input.items || [];

    if (dbConnection.getStatus().isConnected) {
      try {
        const collection = new Collection({
          name: input.name.trim(),
          slug,
          description: input.description?.trim() || '',
          coverImage:
            input.coverImage ||
            'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&auto=format&fit=crop&q=80',
          visibility: input.visibility || 'PUBLIC',
          owner: userId,
          items: items.map((id) => (mongoose.Types.ObjectId.isValid(id) ? new mongoose.Types.ObjectId(id) : id)),
          itemCount: items.length,
          category: input.category || 'General',
        });

        await collection.save();
        return collection;
      } catch (e) {
        console.warn('[CollectionService] DB createCollection error', e);
      }
    }

    // In-memory fallback
    const newCol: InMemoryCollection = {
      _id: `col-${Date.now()}`,
      name: input.name.trim(),
      slug,
      description: input.description?.trim() || '',
      coverImage:
        input.coverImage ||
        'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&auto=format&fit=crop&q=80',
      visibility: input.visibility || 'PUBLIC',
      owner: {
        _id: userId,
        name: userDoc.name,
        avatar: userDoc.avatar,
        username: userDoc.username,
      },
      items: [],
      itemIds: items,
      itemCount: items.length,
      likes: [],
      isCurated: false,
      category: input.category || 'Personal Collection',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    inMemoryCollections.unshift(newCol);
    return newCol;
  }

  public static async getCollections(params: {
    visibility?: CollectionVisibility;
    ownerId?: string;
    curatedOnly?: boolean;
    page?: number;
    limit?: number;
  } = {}) {
    const page = Math.max(1, Number(params.page) || 1);
    const limit = Math.min(50, Math.max(1, Number(params.limit) || 20));

    if (dbConnection.getStatus().isConnected) {
      try {
        const filter: Record<string, any> = {};
        if (params.ownerId) {
          filter.owner = params.ownerId;
        } else if (params.visibility) {
          filter.visibility = params.visibility;
        } else {
          filter.visibility = 'PUBLIC';
        }

        if (params.curatedOnly) {
          filter.isCurated = true;
        }

        const total = await Collection.countDocuments(filter);
        const collections = await Collection.find(filter)
          .populate('owner', 'name avatar username')
          .populate({ path: 'items', select: 'name slug locality images rating priceRange category' })
          .sort({ createdAt: -1 })
          .skip((page - 1) * limit)
          .limit(limit)
          .lean();

        return {
          collections,
          total,
          page,
          totalPages: Math.ceil(total / limit),
        };
      } catch (e) {
        console.warn('[CollectionService] DB getCollections error', e);
      }
    }

    // In-memory populate & filter
    let list = [...inMemoryCollections];

    if (params.ownerId) {
      list = list.filter((c) => c.owner._id === params.ownerId);
    } else if (params.visibility) {
      list = list.filter((c) => c.visibility === params.visibility);
    } else {
      list = list.filter((c) => c.visibility === 'PUBLIC');
    }

    if (params.curatedOnly) {
      list = list.filter((c) => c.isCurated);
    }

    // Populate business item details from in-memory store
    const allBusinesses = Array.from(SeedService.inMemoryBusinesses.values());
    const populatedList = list.map((col) => {
      const populatedItems = col.itemIds
        .map((id) => allBusinesses.find((b) => b._id === id || b.slug === id))
        .filter(Boolean);
      return {
        ...col,
        items: populatedItems,
        itemCount: populatedItems.length || col.itemIds.length,
      };
    });

    const total = populatedList.length;
    const paginated = populatedList.slice((page - 1) * limit, page * limit);

    return {
      collections: paginated,
      total,
      page,
      totalPages: Math.ceil(total / limit) || 1,
    };
  }

  public static async getCollectionById(collectionIdOrSlug: string, currentUserId?: string) {
    if (dbConnection.getStatus().isConnected) {
      try {
        const isObjId = mongoose.Types.ObjectId.isValid(collectionIdOrSlug);
        const query = isObjId ? { _id: collectionIdOrSlug } : { slug: collectionIdOrSlug };

        const col = await Collection.findOne(query)
          .populate('owner', 'name avatar username')
          .populate({ path: 'items', populate: { path: 'category' } })
          .lean();

        if (col) {
          if (col.visibility === 'PRIVATE' && col.owner?._id?.toString() !== currentUserId) {
            throw new Error('This collection is private');
          }
          return col;
        }
      } catch (e: any) {
        if (e.message.includes('private')) throw e;
        console.warn('[CollectionService] DB getCollectionById error', e);
      }
    }

    const col = inMemoryCollections.find(
      (c) => c._id === collectionIdOrSlug || c.slug === collectionIdOrSlug
    );

    if (!col) throw new Error('Collection not found');
    if (col.visibility === 'PRIVATE' && col.owner._id !== currentUserId) {
      throw new Error('This collection is private');
    }

    const allBusinesses = Array.from(SeedService.inMemoryBusinesses.values());
    const populatedItems = col.itemIds
      .map((id) => allBusinesses.find((b) => b._id === id || b.slug === id))
      .filter(Boolean);

    return {
      ...col,
      items: populatedItems,
      itemCount: populatedItems.length || col.itemIds.length,
    };
  }

  public static async toggleItemInCollection(
    collectionId: string,
    businessIdentifier: string,
    userId: string
  ) {
    if (dbConnection.getStatus().isConnected) {
      try {
        const col = await Collection.findById(collectionId);
        if (!col) throw new Error('Collection not found');
        if (col.owner.toString() !== userId) throw new Error('Unauthorized');

        // Resolve biz ID
        let bizId = businessIdentifier;
        if (!mongoose.Types.ObjectId.isValid(businessIdentifier)) {
          const biz = await Business.findOne({ slug: businessIdentifier });
          if (biz) bizId = biz._id.toString();
        }

        const bObjId = new mongoose.Types.ObjectId(bizId);
        const index = col.items.findIndex((id) => id.toString() === bizId);
        let isPresent = false;

        if (index > -1) {
          col.items.splice(index, 1);
          isPresent = false;
        } else {
          col.items.push(bObjId);
          isPresent = true;
        }

        col.itemCount = col.items.length;
        await col.save();
        return { isPresent, itemCount: col.itemCount };
      } catch (e) {
        console.warn('[CollectionService] DB toggleItem error', e);
      }
    }

    const col = inMemoryCollections.find((c) => c._id === collectionId);
    if (!col) throw new Error('Collection not found');
    if (col.owner._id !== userId) throw new Error('Unauthorized');

    const index = col.itemIds.indexOf(businessIdentifier);
    let isPresent = false;

    if (index > -1) {
      col.itemIds.splice(index, 1);
      isPresent = false;
    } else {
      col.itemIds.push(businessIdentifier);
      isPresent = true;
    }

    col.itemCount = col.itemIds.length;
    col.updatedAt = new Date();
    return { isPresent, itemCount: col.itemCount };
  }

  public static async deleteCollection(collectionId: string, userId: string, userRole: string) {
    if (dbConnection.getStatus().isConnected) {
      try {
        const col = await Collection.findById(collectionId);
        if (!col) throw new Error('Collection not found');

        const isOwner = col.owner.toString() === userId;
        const isAdmin = userRole === 'ADMIN' || userRole === 'SUPER_ADMIN';

        if (!isOwner && !isAdmin) throw new Error('Unauthorized');

        await Collection.findByIdAndDelete(collectionId);
        return { success: true };
      } catch (e) {
        console.warn('[CollectionService] DB deleteCollection error', e);
      }
    }

    const idx = inMemoryCollections.findIndex((c) => c._id === collectionId);
    if (idx === -1) throw new Error('Collection not found');

    const col = inMemoryCollections[idx];
    const isOwner = col.owner._id === userId;
    const isAdmin = userRole === 'ADMIN' || userRole === 'SUPER_ADMIN';

    if (!isOwner && !isAdmin) throw new Error('Unauthorized');

    inMemoryCollections.splice(idx, 1);
    return { success: true };
  }
}
