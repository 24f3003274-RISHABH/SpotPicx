import { FreshnessInfo, FreshnessStatus } from '../types/guides.types';

/**
 * Calculates content freshness based on the 90-day review policy.
 * - < 60 days: FRESH (Green)
 * - 60 - 90 days: UP_TO_DATE (Blue/Slate)
 * - > 90 days: REVIEW_DUE (Amber/Red Alert)
 */
export function getGuideFreshness(lastReviewedDateStr: string): FreshnessInfo {
  if (!lastReviewedDateStr) {
    return {
      status: 'REVIEW_DUE',
      daysSinceReview: 999,
      label: 'Review Overdue (No audit date)',
      badgeClass: 'bg-rose-50 text-rose-700 border-rose-200',
      isStale: true,
    };
  }

  const reviewDate = new Date(lastReviewedDateStr);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - reviewDate.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays <= 60) {
    return {
      status: 'FRESH',
      daysSinceReview: diffDays,
      label: diffDays === 0 ? 'Verified Today' : `Verified & Fresh (${diffDays}d ago)`,
      badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      isStale: false,
    };
  } else if (diffDays <= 90) {
    return {
      status: 'UP_TO_DATE',
      daysSinceReview: diffDays,
      label: `Up to Date (${diffDays}d ago)`,
      badgeClass: 'bg-sky-50 text-sky-700 border-sky-200',
      isStale: false,
    };
  } else {
    return {
      status: 'REVIEW_DUE',
      daysSinceReview: diffDays,
      label: `Review Due (${diffDays}d ago • >90d)`,
      badgeClass: 'bg-amber-50 text-amber-800 border-amber-300',
      isStale: true,
    };
  }
}

export function formatGuideDate(dateStr: string): string {
  if (!dateStr) return 'Recently';
  try {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  } catch {
    return dateStr;
  }
}
