import mongoose from 'mongoose';
import { Review, IReview } from '../models/Review';
import { Business } from '../models/Business';
import { dbConnection } from '../config/db';
import { SeedService } from './seed.service';

export interface CreateReviewInput {
  businessId: string;
  rating: number;
  title: string;
  comment: string;
  images?: string[];
  visitDate?: string | Date;
}

export interface UpdateReviewInput {
  rating?: number;
  title?: string;
  comment?: string;
  images?: string[];
  visitDate?: string | Date;
}

export interface ReviewQueryParams {
  page?: number;
  limit?: number;
  sort?: 'newest' | 'highest' | 'lowest' | 'helpful';
}

// In-Memory store for preview/dev mode
export interface InMemoryReview {
  _id: string;
  rating: number;
  title: string;
  comment: string;
  images: string[];
  visitDate: Date;
  business: string; // Business ID or slug
  businessName?: string;
  businessSlug?: string;
  user: {
    _id: string;
    name: string;
    avatar?: string;
    username?: string;
    role?: string;
  };
  likes: string[];
  likeCount: number;
  isReported: boolean;
  response?: {
    comment: string;
    respondedAt: Date;
    respondedBy: string;
  };
  status: 'PUBLISHED' | 'PENDING' | 'FLAGGED' | 'REMOVED';
  createdAt: Date;
  updatedAt: Date;
}

const inMemoryReviews: InMemoryReview[] = [
  {
    _id: 'rev-seed-1',
    rating: 5,
    title: 'Unbelievable Cold Brew and Heritage Aura!',
    comment: 'The architectural atmosphere is unmatched in Hauz Khas. Sit on the balcony overlooking the lake during golden hour with their signature pour-over. A quintessential Delhi experience!',
    images: ['https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=800&auto=format&fit=crop&q=80'],
    visitDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    business: 'social-hauz-khas',
    businessName: 'Hauz Khas Social & Rooftop',
    businessSlug: 'social-hauz-khas',
    user: {
      _id: 'usr-aarav',
      name: 'Aarav Sharma',
      username: 'aarav_delhi',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      role: 'USER',
    },
    likes: ['usr-priya', 'usr-rohit'],
    likeCount: 8,
    isReported: false,
    response: {
      comment: 'Thank you Aarav! We are thrilled you enjoyed the sunset balcony view. Look forward to welcoming you back for live indie music this Friday!',
      respondedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      respondedBy: 'Social Management',
    },
    status: 'PUBLISHED',
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
  },
  {
    _id: 'rev-seed-2',
    rating: 5,
    title: 'Pure Butter Mutton Nihari Heaven',
    comment: 'Woke up at 7:30 AM on a Sunday specifically for their slow-cooked nihari and hot tandoori khameeri roti. One of the best historic food joints in the subcontinent.',
    images: ['https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=800&auto=format&fit=crop&q=80'],
    visitDate: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
    business: 'karims-jama-masjid',
    businessName: "Karim's Historic Mughlai",
    businessSlug: 'karims-jama-masjid',
    user: {
      _id: 'usr-priya',
      name: 'Priya Mehra',
      username: 'priyamehra',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
      role: 'USER',
    },
    likes: ['usr-aarav'],
    likeCount: 14,
    isReported: false,
    status: 'PUBLISHED',
    createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
  },
  {
    _id: 'rev-seed-3',
    rating: 4,
    title: 'Authentic Tibetan Tingmo & Spicy Laphing',
    comment: 'Majnu Ka Tilla gem! The cold spicy laphing with sesame sauce gave an incredible punch. Seating can get packed on weekends so go early.',
    images: ['https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=800&auto=format&fit=crop&q=80'],
    visitDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
    business: 'ama-cafe-mkt',
    businessName: 'AMA Cafe & Bakery',
    businessSlug: 'ama-cafe-mkt',
    user: {
      _id: 'usr-rohit',
      name: 'Rohit Kulkarni',
      username: 'rohitk',
      avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80',
      role: 'USER',
    },
    likes: ['usr-aarav', 'usr-priya'],
    likeCount: 5,
    isReported: false,
    status: 'PUBLISHED',
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
  },
];

export class ReviewService {
  public static async createReview(
    userId: string,
    userDoc: { name: string; avatar?: string; username?: string; role?: string },
    input: CreateReviewInput
  ) {
    const { businessId, rating, title, comment, images = [], visitDate } = input;

    // Validate rating
    const parsedRating = Math.round(Number(rating));
    if (isNaN(parsedRating) || parsedRating < 1 || parsedRating > 5) {
      throw new Error('Rating must be an integer between 1 and 5');
    }

    if (!title || title.trim().length < 2) {
      throw new Error('Review title must be at least 2 characters');
    }

    if (!comment || comment.trim().length < 10) {
      throw new Error('Review comment must be at least 10 characters');
    }

    // Resolve target business
    let targetBizId = businessId;
    let targetBizSlug = businessId;
    let targetBizName = 'Delhi Spot';

    if (dbConnection.getStatus().isConnected) {
      try {
        const isObjId = mongoose.Types.ObjectId.isValid(businessId);
        const bizQuery = isObjId ? { _id: businessId } : { slug: businessId };
        const biz = await Business.findOne(bizQuery);
        if (!biz) {
          throw new Error('Business not found');
        }
        targetBizId = biz._id.toString();
        targetBizSlug = biz.slug;
        targetBizName = biz.name;

        // Check for duplicate review
        const existingReview = await Review.findOne({
          business: biz._id,
          user: userId,
        });

        if (existingReview) {
          // Update the existing review instead of throwing hard error
          existingReview.rating = parsedRating;
          existingReview.title = title.trim();
          existingReview.comment = comment.trim();
          existingReview.images = images.slice(0, 6);
          if (visitDate) existingReview.visitDate = new Date(visitDate);
          await existingReview.save();

          await this.recalculateBusinessRating(biz._id.toString());
          return existingReview;
        }

        const review = new Review({
          rating: parsedRating,
          title: title.trim(),
          comment: comment.trim(),
          images: images.slice(0, 6),
          visitDate: visitDate ? new Date(visitDate) : new Date(),
          business: biz._id,
          user: userId,
          status: 'PUBLISHED',
        });

        await review.save();
        await this.recalculateBusinessRating(biz._id.toString());
        return review;
      } catch (err: any) {
        if (err.message.includes('Business not found') || err.message.includes('Rating')) {
          throw err;
        }
        // Fallback to in-memory on db failure
      }
    }

    // In-memory fallback
    const memBiz =
      SeedService.inMemoryBusinesses.get(businessId) ||
      Array.from(SeedService.inMemoryBusinesses.values()).find(
        (b) => b._id === businessId || b.slug === businessId
      );

    if (memBiz) {
      targetBizId = memBiz._id;
      targetBizSlug = memBiz.slug;
      targetBizName = memBiz.name;
    }

    // Check duplicate in memory
    const existingMemIdx = inMemoryReviews.findIndex(
      (r) =>
        (r.business === targetBizId || r.business === targetBizSlug) &&
        r.user._id === userId
    );

    if (existingMemIdx !== -1) {
      inMemoryReviews[existingMemIdx].rating = parsedRating;
      inMemoryReviews[existingMemIdx].title = title.trim();
      inMemoryReviews[existingMemIdx].comment = comment.trim();
      inMemoryReviews[existingMemIdx].images = images.slice(0, 6);
      if (visitDate) inMemoryReviews[existingMemIdx].visitDate = new Date(visitDate);
      inMemoryReviews[existingMemIdx].updatedAt = new Date();

      this.recalculateInMemoryBusinessRating(targetBizSlug);
      return inMemoryReviews[existingMemIdx];
    }

    const newRev: InMemoryReview = {
      _id: `rev-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      rating: parsedRating,
      title: title.trim(),
      comment: comment.trim(),
      images: images.slice(0, 6),
      visitDate: visitDate ? new Date(visitDate) : new Date(),
      business: targetBizId,
      businessName: targetBizName,
      businessSlug: targetBizSlug,
      user: {
        _id: userId,
        name: userDoc.name,
        avatar: userDoc.avatar,
        username: userDoc.username,
        role: userDoc.role,
      },
      likes: [],
      likeCount: 0,
      isReported: false,
      status: 'PUBLISHED',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    inMemoryReviews.unshift(newRev);
    this.recalculateInMemoryBusinessRating(targetBizSlug);
    return newRev;
  }

  public static async getBusinessReviews(
    businessIdentifier: string,
    params: ReviewQueryParams = {}
  ) {
    const page = Math.max(1, Number(params.page) || 1);
    const limit = Math.min(50, Math.max(1, Number(params.limit) || 10));
    const skip = (page - 1) * limit;

    if (dbConnection.getStatus().isConnected) {
      try {
        const isObjId = mongoose.Types.ObjectId.isValid(businessIdentifier);
        let bizId = businessIdentifier;

        if (!isObjId) {
          const biz = await Business.findOne({ slug: businessIdentifier });
          if (biz) bizId = biz._id.toString();
        }

        const filter: any = {
          business: bizId,
          status: { $in: ['PUBLISHED', 'PENDING'] },
        };

        const total = await Review.countDocuments(filter);
        const reviews = await Review.find(filter)
          .populate('user', 'name avatar username role')
          .sort(
            params.sort === 'highest'
              ? { rating: -1, createdAt: -1 }
              : params.sort === 'lowest'
              ? { rating: 1, createdAt: -1 }
              : params.sort === 'helpful'
              ? { likeCount: -1, createdAt: -1 }
              : { createdAt: -1 }
          )
          .skip(skip)
          .limit(limit)
          .lean();

        // Calculate rating breakdown (counts of 5,4,3,2,1 stars)
        const allRatings = await Review.find(filter, 'rating').lean();
        const breakdown = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
        let sum = 0;

        for (const r of allRatings) {
          const star = Math.min(5, Math.max(1, r.rating)) as 1 | 2 | 3 | 4 | 5;
          breakdown[star] = (breakdown[star] || 0) + 1;
          sum += r.rating;
        }

        const average = allRatings.length > 0 ? Number((sum / allRatings.length).toFixed(1)) : 0;

        return {
          reviews,
          stats: {
            total,
            average,
            breakdown,
          },
          pagination: {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
            hasNextPage: page * limit < total,
            hasPrevPage: page > 1,
          },
        };
      } catch (e) {
        console.warn('[ReviewService] DB read error, falling back to memory', e);
      }
    }

    // In-memory reviews filter
    const matches = inMemoryReviews.filter(
      (r) =>
        r.status === 'PUBLISHED' &&
        (r.business === businessIdentifier ||
          r.businessSlug === businessIdentifier ||
          r._id === businessIdentifier)
    );

    // Calculate rating breakdown
    const breakdown = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    let sum = 0;

    for (const r of matches) {
      const star = Math.min(5, Math.max(1, r.rating)) as 1 | 2 | 3 | 4 | 5;
      breakdown[star] = (breakdown[star] || 0) + 1;
      sum += r.rating;
    }

    const average = matches.length > 0 ? Number((sum / matches.length).toFixed(1)) : 4.8;
    const total = matches.length;

    // Sort
    const sorted = [...matches].sort((a, b) => {
      if (params.sort === 'highest') return b.rating - a.rating;
      if (params.sort === 'lowest') return a.rating - b.rating;
      if (params.sort === 'helpful') return b.likeCount - a.likeCount;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    const paginated = sorted.slice(skip, skip + limit);

    return {
      reviews: paginated,
      stats: {
        total,
        average,
        breakdown,
      },
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit) || 1,
        hasNextPage: page * limit < total,
        hasPrevPage: page > 1,
      },
    };
  }

  public static async getUserReviews(userId: string) {
    if (dbConnection.getStatus().isConnected) {
      try {
        return await Review.find({ user: userId })
          .populate('business', 'name slug locality city images rating')
          .sort({ createdAt: -1 })
          .lean();
      } catch (e) {
        console.warn('[ReviewService] DB getUserReviews error', e);
      }
    }

    return inMemoryReviews.filter((r) => r.user._id === userId);
  }

  public static async updateReview(
    reviewId: string,
    userId: string,
    userRole: string,
    input: UpdateReviewInput
  ) {
    if (dbConnection.getStatus().isConnected) {
      try {
        const review = await Review.findById(reviewId);
        if (!review) throw new Error('Review not found');

        const isOwner = review.user.toString() === userId;
        const isAdmin = userRole === 'ADMIN' || userRole === 'SUPER_ADMIN';

        if (!isOwner && !isAdmin) {
          throw new Error('Unauthorized to update this review');
        }

        if (input.rating) review.rating = Math.round(input.rating);
        if (input.title) review.title = input.title.trim();
        if (input.comment) review.comment = input.comment.trim();
        if (input.images) review.images = input.images.slice(0, 6);
        if (input.visitDate) review.visitDate = new Date(input.visitDate);

        await review.save();
        await this.recalculateBusinessRating(review.business.toString());
        return review;
      } catch (e) {
        console.warn('[ReviewService] DB update error', e);
      }
    }

    const idx = inMemoryReviews.findIndex((r) => r._id === reviewId);
    if (idx === -1) throw new Error('Review not found');

    const rev = inMemoryReviews[idx];
    const isOwner = rev.user._id === userId;
    const isAdmin = userRole === 'ADMIN' || userRole === 'SUPER_ADMIN';

    if (!isOwner && !isAdmin) throw new Error('Unauthorized to update this review');

    if (input.rating) rev.rating = Math.round(input.rating);
    if (input.title) rev.title = input.title.trim();
    if (input.comment) rev.comment = input.comment.trim();
    if (input.images) rev.images = input.images.slice(0, 6);
    if (input.visitDate) rev.visitDate = new Date(input.visitDate);
    rev.updatedAt = new Date();

    if (rev.businessSlug) this.recalculateInMemoryBusinessRating(rev.businessSlug);
    return rev;
  }

  public static async deleteReview(reviewId: string, userId: string, userRole: string) {
    if (dbConnection.getStatus().isConnected) {
      try {
        const review = await Review.findById(reviewId);
        if (!review) throw new Error('Review not found');

        const isOwner = review.user.toString() === userId;
        const isAdmin = userRole === 'ADMIN' || userRole === 'SUPER_ADMIN';

        if (!isOwner && !isAdmin) {
          throw new Error('Unauthorized to delete this review');
        }

        const bizId = review.business.toString();
        await Review.findByIdAndDelete(reviewId);
        await this.recalculateBusinessRating(bizId);
        return { success: true };
      } catch (e) {
        console.warn('[ReviewService] DB delete error', e);
      }
    }

    const idx = inMemoryReviews.findIndex((r) => r._id === reviewId);
    if (idx === -1) throw new Error('Review not found');

    const rev = inMemoryReviews[idx];
    const isOwner = rev.user._id === userId;
    const isAdmin = userRole === 'ADMIN' || userRole === 'SUPER_ADMIN';

    if (!isOwner && !isAdmin) throw new Error('Unauthorized to delete this review');

    inMemoryReviews.splice(idx, 1);
    if (rev.businessSlug) this.recalculateInMemoryBusinessRating(rev.businessSlug);
    return { success: true };
  }

  public static async toggleLikeReview(reviewId: string, userId: string) {
    if (dbConnection.getStatus().isConnected) {
      try {
        const review = await Review.findById(reviewId);
        if (!review) throw new Error('Review not found');

        const uObjId = new mongoose.Types.ObjectId(userId);
        const index = review.likes.findIndex((id) => id.toString() === userId);
        let isLiked = false;

        if (index > -1) {
          review.likes.splice(index, 1);
          isLiked = false;
        } else {
          review.likes.push(uObjId);
          isLiked = true;
        }

        review.likeCount = review.likes.length;
        await review.save();
        return { likeCount: review.likeCount, isLiked };
      } catch (e) {
        console.warn('[ReviewService] DB like error', e);
      }
    }

    const rev = inMemoryReviews.find((r) => r._id === reviewId);
    if (!rev) throw new Error('Review not found');

    const index = rev.likes.indexOf(userId);
    let isLiked = false;

    if (index > -1) {
      rev.likes.splice(index, 1);
      isLiked = false;
    } else {
      rev.likes.push(userId);
      isLiked = true;
    }

    rev.likeCount = rev.likes.length;
    return { likeCount: rev.likeCount, isLiked };
  }

  public static async respondToReview(
    reviewId: string,
    userId: string,
    userRole: string,
    comment: string,
    respondedBy: string
  ) {
    if (!comment || comment.trim().length < 2) {
      throw new Error('Response comment is required');
    }

    if (dbConnection.getStatus().isConnected) {
      try {
        const review = await Review.findById(reviewId).populate('business');
        if (!review) throw new Error('Review not found');

        review.response = {
          comment: comment.trim(),
          respondedAt: new Date(),
          respondedBy: respondedBy || 'Business Management',
        };

        await review.save();
        return review;
      } catch (e) {
        console.warn('[ReviewService] DB response error', e);
      }
    }

    const rev = inMemoryReviews.find((r) => r._id === reviewId);
    if (!rev) throw new Error('Review not found');

    rev.response = {
      comment: comment.trim(),
      respondedAt: new Date(),
      respondedBy: respondedBy || 'Business Management',
    };
    rev.updatedAt = new Date();
    return rev;
  }

  public static async getAllReviewsAdmin(status?: string) {
    if (dbConnection.getStatus().isConnected) {
      const filter: any = {};
      if (status && status !== 'ALL') {
        filter.status = status;
      }
      return Review.find(filter)
        .populate('business', 'name slug locality rating')
        .populate('user', 'name username avatar role email')
        .sort({ createdAt: -1 })
        .lean();
    }

    let list = [...inMemoryReviews];
    if (status && status !== 'ALL') {
      list = list.filter((r) => r.status === status);
    }
    return list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  public static async updateReviewStatus(reviewId: string, status: string) {
    if (dbConnection.getStatus().isConnected) {
      const review = await Review.findByIdAndUpdate(reviewId, { status }, { new: true });
      if (!review) throw new Error('Review not found');
      return review;
    }

    const rev = inMemoryReviews.find((r) => r._id === reviewId);
    if (!rev) throw new Error('Review not found');
    rev.status = status as any;
    rev.updatedAt = new Date();
    return rev;
  }

  public static async getOwnerReviews(userId: string) {
    if (dbConnection.getStatus().isConnected) {
      const businesses = await Business.find({ owner: userId }).select('_id');
      const bizIds = businesses.map((b) => b._id);
      return Review.find({ business: { $in: bizIds } })
        .populate('business', 'name slug locality')
        .populate('user', 'name username avatar')
        .sort({ createdAt: -1 })
        .lean();
    }

    // In-memory
    return inMemoryReviews.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  // Recalculate average rating for business

  private static async recalculateBusinessRating(businessId: string) {
    try {
      const stats = await Review.aggregate([
        { $match: { business: new mongoose.Types.ObjectId(businessId), status: 'PUBLISHED' } },
        {
          $group: {
            _id: '$business',
            avgRating: { $avg: '$rating' },
            reviewCount: { $sum: 1 },
          },
        },
      ]);

      if (stats.length > 0) {
        const avg = Number(stats[0].avgRating.toFixed(1));
        const count = stats[0].reviewCount;
        await Business.findByIdAndUpdate(businessId, {
          rating: avg,
          reviewCount: count,
        });
      }
    } catch (e) {
      console.warn('[ReviewService] Rating recalc error', e);
    }
  }

  private static recalculateInMemoryBusinessRating(businessSlug: string) {
    const biz = SeedService.inMemoryBusinesses.get(businessSlug);
    if (!biz) return;

    const matches = inMemoryReviews.filter(
      (r) => (r.business === biz._id || r.businessSlug === businessSlug) && r.status === 'PUBLISHED'
    );

    if (matches.length > 0) {
      const sum = matches.reduce((acc, r) => acc + r.rating, 0);
      biz.rating = Number((sum / matches.length).toFixed(1));
      biz.reviewCount = matches.length;
    }
  }
}
