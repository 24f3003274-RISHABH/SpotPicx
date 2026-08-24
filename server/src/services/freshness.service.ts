import { Business, IBusiness } from '../models/Business';
import { dbConnection } from '../config/db';

export type FreshnessStatus = 'FRESH' | 'RECENT' | 'STALE' | 'EXPIRED';

export interface FreshnessCalculation {
  status: FreshnessStatus;
  label: string;
  formattedTime: string;
  isFresh: boolean;
  color: string;
  ageHours: number;
}

export interface FreshnessStats {
  fresh: number;
  recent: number;
  stale: number;
  expired: number;
  total: number;
  lastRecalculatedAt: string;
}

export class FreshnessService {
  /**
   * Configurable thresholds (in hours and days)
   */
  private static getThresholds() {
    const freshHours = Number(process.env.FRESHNESS_FRESH_HOURS) || 24; // < 24 hrs
    const recentDays = Number(process.env.FRESHNESS_RECENT_DAYS) || 7; // 1-7 days
    const staleDays = Number(process.env.FRESHNESS_STALE_DAYS) || 30; // 7-30 days

    return {
      freshMs: freshHours * 60 * 60 * 1000,
      recentMs: recentDays * 24 * 60 * 60 * 1000,
      staleMs: staleDays * 24 * 60 * 60 * 1000,
    };
  }

  /**
   * Computes freshness status from a given verification or update timestamp
   */
  public static computeFreshness(dateInput?: Date | string | null): FreshnessCalculation {
    const now = Date.now();
    let targetTime = dateInput ? new Date(dateInput).getTime() : 0;

    if (!targetTime || isNaN(targetTime)) {
      targetTime = now - 1000 * 60 * 60 * 2; // Default to fresh if newly created
    }

    const diffMs = Math.max(0, now - targetTime);
    const ageHours = Math.round(diffMs / (1000 * 60 * 60));
    const ageDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const { freshMs, recentMs, staleMs } = this.getThresholds();

    if (diffMs <= freshMs) {
      const label = ageHours <= 1 ? 'Updated just now' : `Updated ${ageHours}h ago`;
      return {
        status: 'FRESH',
        label: 'Updated today',
        formattedTime: label,
        isFresh: true,
        color: 'emerald',
        ageHours,
      };
    }

    if (diffMs <= recentMs) {
      const label = ageDays <= 1 ? 'Updated yesterday' : `Verified ${ageDays} days ago`;
      return {
        status: 'RECENT',
        label: 'Verified this week',
        formattedTime: label,
        isFresh: true,
        color: 'sky',
        ageHours,
      };
    }

    if (diffMs <= staleMs) {
      return {
        status: 'STALE',
        label: 'Verified this month',
        formattedTime: `Updated ${ageDays} days ago`,
        isFresh: false,
        color: 'amber',
        ageHours,
      };
    }

    return {
      status: 'EXPIRED',
      label: 'Needs re-verification',
      formattedTime: `Updated ${ageDays} days ago`,
      isFresh: false,
      color: 'rose',
      ageHours,
    };
  }

  /**
   * Recalculates and bulk updates freshnessStatus on all businesses in MongoDB
   */
  public static async recalculateAllFreshness(): Promise<{ updatedCount: number; stats: FreshnessStats }> {
    if (!dbConnection.getStatus().isConnected) {
      return {
        updatedCount: 0,
        stats: {
          fresh: 0,
          recent: 0,
          stale: 0,
          expired: 0,
          total: 0,
          lastRecalculatedAt: new Date().toISOString(),
        },
      };
    }

    try {
      const businesses = await Business.find({}, '_id lastVerified lastUpdated updatedAt').lean();
      let updatedCount = 0;

      const bulkOps: any[] = [];
      for (const biz of businesses) {
        const checkDate = biz.lastVerified || biz.lastUpdated || biz.updatedAt;
        const freshness = this.computeFreshness(checkDate);

        bulkOps.push({
          updateOne: {
            filter: { _id: biz._id },
            update: { $set: { freshnessStatus: freshness.status } },
          },
        });
      }

      if (bulkOps.length > 0) {
        const result = await Business.bulkWrite(bulkOps, { ordered: false });
        updatedCount = result.modifiedCount || bulkOps.length;
      }

      const stats = await this.getFreshnessStats();
      return { updatedCount, stats };
    } catch (err: any) {
      console.error('[FreshnessService] Recalculation error:', err);
      const stats = await this.getFreshnessStats();
      return { updatedCount: 0, stats };
    }
  }

  /**
   * Aggregates freshness breakdown across all businesses
   */
  public static async getFreshnessStats(): Promise<FreshnessStats> {
    if (!dbConnection.getStatus().isConnected) {
      return {
        fresh: 0,
        recent: 0,
        stale: 0,
        expired: 0,
        total: 0,
        lastRecalculatedAt: new Date().toISOString(),
      };
    }

    try {
      const [fresh, recent, stale, expired, total] = await Promise.all([
        Business.countDocuments({ freshnessStatus: 'FRESH' }),
        Business.countDocuments({ freshnessStatus: 'RECENT' }),
        Business.countDocuments({ freshnessStatus: 'STALE' }),
        Business.countDocuments({ freshnessStatus: 'EXPIRED' }),
        Business.countDocuments({}),
      ]);

      return {
        fresh,
        recent,
        stale,
        expired,
        total,
        lastRecalculatedAt: new Date().toISOString(),
      };
    } catch (err) {
      console.warn('[FreshnessService] Failed to retrieve aggregate stats:', err);
      return {
        fresh: 0,
        recent: 0,
        stale: 0,
        expired: 0,
        total: 0,
        lastRecalculatedAt: new Date().toISOString(),
      };
    }
  }
}
