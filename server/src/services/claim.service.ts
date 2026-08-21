import mongoose from 'mongoose';
import { BusinessClaim, IBusinessClaim, ClaimStatus } from '../models/BusinessClaim';
import { Business } from '../models/Business';
import { User } from '../models/User';
import { Notification } from '../models/Notification';
import { dbConnection } from '../config/db';
import { SeedService } from './seed.service';
import { USER_ROLES } from '../constants/roles';

// In-Memory Dev Store for resilient fallback
export interface InMemoryClaim {
  _id: string;
  business: any;
  user: any;
  documents: string[];
  message: string;
  status: ClaimStatus;
  reviewedBy?: any;
  reviewedAt?: string | null;
  rejectionReason?: string;
  createdAt: string;
  updatedAt: string;
}

const inMemoryClaims: Map<string, InMemoryClaim> = new Map();

// Seed a demo claim in memory for demonstration
inMemoryClaims.set('claim_demo_1', {
  _id: 'claim_demo_1',
  business: {
    _id: 'spot-2',
    name: 'Social Offline Hauz Khas',
    slug: 'social-offline-hauz-khas',
    locality: 'Hauz Khas Village',
    city: 'Delhi',
  },
  user: {
    _id: 'usr_owner_1',
    name: 'Rohan Oberoi',
    email: 'owner@spotpicks.com',
    role: 'BUSINESS_OWNER',
  },
  documents: [
    'https://images.unsplash.com/photo-1450133064473-71024230f91b?w=600&auto=format&fit=crop&q=80',
    'GST_Certificate_Delhi_HKV.pdf',
    'Electricity_Bill_HauzKhas_2026.pdf',
  ],
  message: 'I am the general manager of Social Hauz Khas. Submitting our commercial tax registration and license for verification.',
  status: 'PENDING',
  createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
  updatedAt: new Date(Date.now() - 3600000 * 24).toISOString(),
});

export class ClaimService {
  /**
   * Submit a new business claim
   */
  public static async submitClaim(
    businessId: string,
    userId: string,
    data: { documents?: string[]; message?: string }
  ) {
    if (dbConnection.getStatus().isConnected) {
      // Check if business exists
      const business = await Business.findById(businessId);
      if (!business) {
        throw new Error('Business not found');
      }

      if (business.claimed && business.owner) {
        throw new Error('This business is already claimed and verified by its proprietor.');
      }

      // Check existing pending claim by this user
      const existing = await BusinessClaim.findOne({
        business: businessId,
        user: userId,
        status: 'PENDING',
      });
      if (existing) {
        throw new Error('You already have a pending claim submitted for this establishment.');
      }

      const claim = await BusinessClaim.create({
        business: businessId,
        user: userId,
        documents: data.documents || [],
        message: data.message || '',
        status: 'PENDING',
      });

      // Notify admin / user
      await Notification.create({
        recipient: userId,
        type: 'SYSTEM_ALERT',
        title: 'Claim Application Received',
        message: `Your verification request for "${business.name}" has been submitted for editorial moderation.`,
        link: '/business/dashboard',
      }).catch(() => {});

      return claim.toObject();
    }

    // In-Memory Fallback
    SeedService.initializeInMemoryStore();
    const biz = Array.from(SeedService.inMemoryBusinesses.values()).find(
      (b) => b._id === businessId || b.slug === businessId
    );
    if (!biz) throw new Error('Business not found');

    const newId = `claim_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const newClaim: InMemoryClaim = {
      _id: newId,
      business: {
        _id: biz._id,
        name: biz.name,
        slug: biz.slug,
        locality: biz.locality,
        city: biz.city,
      },
      user: {
        _id: userId,
        name: 'Proprietor',
        email: 'user@spotpicks.com',
      },
      documents: data.documents || [
        'https://images.unsplash.com/photo-1450133064473-71024230f91b?w=600&auto=format&fit=crop&q=80',
        'Business_Registration_Delhi.pdf',
      ],
      message: data.message || 'Owner claim verification request',
      status: 'PENDING',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    inMemoryClaims.set(newId, newClaim);
    return newClaim;
  }

  /**
   * Get claims for current user
   */
  public static async getMyClaims(userId: string) {
    if (dbConnection.getStatus().isConnected) {
      return BusinessClaim.find({ user: userId })
        .populate('business', 'name slug locality city images address rating verified claimed')
        .sort({ createdAt: -1 })
        .lean();
    }

    return Array.from(inMemoryClaims.values()).filter(
      (c) => c.user._id === userId || c.user.id === userId
    );
  }

  /**
   * Get all claims for Admin Panel
   */
  public static async getAllClaims(status?: string) {
    if (dbConnection.getStatus().isConnected) {
      const filter: any = {};
      if (status && ['PENDING', 'APPROVED', 'REJECTED'].includes(status.toUpperCase())) {
        filter.status = status.toUpperCase();
      }

      return BusinessClaim.find(filter)
        .populate('business', 'name slug locality city images address verified claimed owner')
        .populate('user', 'name username email role avatar')
        .populate('reviewedBy', 'name email username')
        .sort({ createdAt: -1 })
        .lean();
    }

    let list = Array.from(inMemoryClaims.values());
    if (status) {
      list = list.filter((c) => c.status === status.toUpperCase());
    }
    return list.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  /**
   * Approve a claim (Admin only)
   */
  public static async approveClaim(claimId: string, adminUser: any) {
    if (dbConnection.getStatus().isConnected) {
      const claim = await BusinessClaim.findById(claimId).populate('business').populate('user');
      if (!claim) throw new Error('Claim record not found');
      if (claim.status === 'APPROVED') throw new Error('Claim is already approved');

      claim.status = 'APPROVED';
      claim.reviewedBy = adminUser._id;
      claim.reviewedAt = new Date();
      await claim.save();

      // Update Business model: set claimed = true, verified = true, and owner = claim.user
      const businessId = (claim.business as any)._id || claim.business;
      const claimantUserId = (claim.user as any)._id || claim.user;

      await Business.findByIdAndUpdate(businessId, {
        claimed: true,
        verified: true,
        owner: claimantUserId,
      });

      // Update user role to BUSINESS_OWNER if currently USER
      const user = await User.findById(claimantUserId);
      if (user && user.role === USER_ROLES.USER) {
        user.role = USER_ROLES.BUSINESS_OWNER;
        await user.save();
      }

      // Send in-app notification
      await Notification.create({
        recipient: claimantUserId,
        type: 'BUSINESS_VERIFIED',
        title: 'Business Claim Approved! 🎉',
        message: `Congratulations! Your ownership claim for "${(claim.business as any).name || 'your establishment'}" has been approved. You now have full management privileges in your Business Hub.`,
        link: '/business/dashboard',
      }).catch(() => {});

      return claim.toObject();
    }

    // In-Memory Fallback
    const claim = inMemoryClaims.get(claimId);
    if (!claim) throw new Error('Claim record not found');

    claim.status = 'APPROVED';
    claim.reviewedBy = {
      _id: adminUser.id || 'usr_admin_1',
      name: adminUser.name || 'SpotPicks Admin',
    };
    claim.reviewedAt = new Date().toISOString();
    claim.updatedAt = new Date().toISOString();

    // Mark in-memory business as claimed & owned
    SeedService.initializeInMemoryStore();
    const bizSlugOrId = claim.business._id || claim.business.slug;
    const biz = Array.from(SeedService.inMemoryBusinesses.values()).find(
      (b) => b._id === bizSlugOrId || b.slug === bizSlugOrId
    );
    if (biz) {
      biz.claimed = true;
      biz.verified = true;
      biz.owner = claim.user._id || claim.user.id;
      SeedService.inMemoryBusinesses.set(biz.slug, biz);
    }

    return claim;
  }

  /**
   * Reject a claim (Admin only)
   */
  public static async rejectClaim(claimId: string, adminUser: any, reason?: string) {
    if (dbConnection.getStatus().isConnected) {
      const claim = await BusinessClaim.findById(claimId).populate('business');
      if (!claim) throw new Error('Claim record not found');

      claim.status = 'REJECTED';
      claim.reviewedBy = adminUser._id;
      claim.reviewedAt = new Date();
      claim.rejectionReason = reason || 'Documentation could not be verified.';
      await claim.save();

      // Send in-app notification
      const claimantUserId = (claim.user as any)._id || claim.user;
      await Notification.create({
        recipient: claimantUserId,
        type: 'SYSTEM_ALERT',
        title: 'Business Claim Update',
        message: `Your ownership claim for "${(claim.business as any).name || 'the establishment'}" could not be approved at this time. Reason: ${claim.rejectionReason}`,
        link: '/business/dashboard',
      }).catch(() => {});

      return claim.toObject();
    }

    // In-Memory Fallback
    const claim = inMemoryClaims.get(claimId);
    if (!claim) throw new Error('Claim record not found');

    claim.status = 'REJECTED';
    claim.rejectionReason = reason || 'Insufficient proof of authorization or ownership documentation.';
    claim.reviewedBy = {
      _id: adminUser.id || 'usr_admin_1',
      name: adminUser.name || 'SpotPicks Admin',
    };
    claim.reviewedAt = new Date().toISOString();
    claim.updatedAt = new Date().toISOString();

    return claim;
  }
}
