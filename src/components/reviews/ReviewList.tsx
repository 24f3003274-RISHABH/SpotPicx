import React, { useState, useEffect } from 'react';
import {
  MessageSquare,
  ArrowUpDown,
  Filter,
  Loader2,
  Sparkles,
  Heart,
  MessageSquarePlus,
} from 'lucide-react';
import { Review, ReviewStats, PaginationMeta } from '../../types';
import { ReviewCard } from './ReviewCard';
import { RatingBreakdownCard } from './RatingBreakdownCard';
import { ReviewForm } from './ReviewForm';
import { reviewApi } from '../../api/reviewApi';
import { useAuth } from '../../hooks/useAuth';
import { Button } from '../ui/Button';
import { EmptyState } from '../ui/EmptyState';

interface ReviewListProps {
  businessId: string;
  businessName: string;
}

export const ReviewList: React.FC<ReviewListProps> = ({ businessId, businessName }) => {
  const { user } = useAuth();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [stats, setStats] = useState<ReviewStats>({
    total: 0,
    average: 4.8,
    breakdown: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
  });
  const [pagination, setPagination] = useState<PaginationMeta>({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 1,
    hasNextPage: false,
    hasPrevPage: false,
  });
  const [sortBy, setSortBy] = useState<'newest' | 'highest' | 'lowest' | 'helpful'>('newest');
  const [isLoading, setIsLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingReview, setEditingReview] = useState<Review | null>(null);

  const fetchReviews = async (page = 1, sort = sortBy) => {
    setIsLoading(true);
    try {
      const res = await reviewApi.getBusinessReviews(businessId, { page, limit: 10, sort });
      setReviews(res.data || []);
      if (res.stats) setStats(res.stats);
      if (res.pagination) setPagination(res.pagination);
    } catch (err) {
      console.warn('Failed to load reviews', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews(1, sortBy);
  }, [businessId, sortBy]);

  const userReview = user
    ? reviews.find((r) => r.user?._id === user.id || (r.user as any)?._id === (user as any)._id)
    : null;

  const handleOpenWriteModal = () => {
    if (!user) {
      alert('Please sign in to write a review on SpotPicks.');
      return;
    }
    setEditingReview(userReview || null);
    setIsFormOpen(true);
  };

  const handleReviewSuccess = (newOrUpdatedReview: Review) => {
    fetchReviews(1, sortBy);
  };

  const handleReviewDeleted = (deletedId: string) => {
    setReviews(reviews.filter((r) => r._id !== deletedId));
    fetchReviews(pagination.page, sortBy);
  };

  return (
    <div className="space-y-8">
      {/* 1. Rating Summary Breakdown Card */}
      <RatingBreakdownCard
        stats={stats}
        businessName={businessName}
        onWriteReviewClick={handleOpenWriteModal}
        hasUserReviewed={Boolean(userReview)}
      />

      {/* 2. Sorting & Controls Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-slate-200/80">
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-bold text-slate-900">Community Reviews</h3>
          <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700">
            {stats.total}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
            <ArrowUpDown className="h-3.5 w-3.5" />
            <span>Sort by:</span>
          </div>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="text-xs font-semibold px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-slate-800 focus:outline-hidden focus:border-indigo-600 cursor-pointer"
          >
            <option value="newest">Newest First</option>
            <option value="helpful">Most Helpful</option>
            <option value="highest">Highest Rating (5★)</option>
            <option value="lowest">Lowest Rating (1★)</option>
          </select>
        </div>
      </div>

      {/* 3. Review Cards List */}
      {isLoading ? (
        <div className="py-12 flex flex-col items-center justify-center gap-3 text-slate-400">
          <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
          <span className="text-xs font-medium">Loading verified reviews...</span>
        </div>
      ) : reviews.length === 0 ? (
        <EmptyState
          icon={<MessageSquare className="h-7 w-7 text-indigo-500" />}
          title="No Reviews Yet"
          description={`Be the first explorer to share recommendations, tips, and photos for ${businessName}!`}
          actionLabel="Write First Review"
          onAction={handleOpenWriteModal}
        />
      ) : (
        <div className="space-y-4">
          {reviews.map((rev) => (
            <ReviewCard
              key={rev._id}
              review={rev}
              onReviewUpdated={() => fetchReviews(pagination.page, sortBy)}
              onReviewDeleted={handleReviewDeleted}
              onEditClick={(r) => {
                setEditingReview(r);
                setIsFormOpen(true);
              }}
            />
          ))}

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="flex items-center justify-between pt-6 border-t border-slate-200 text-xs">
              <span className="text-slate-500">
                Page {pagination.page} of {pagination.totalPages}
              </span>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={!pagination.hasPrevPage}
                  onClick={() => fetchReviews(pagination.page - 1)}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={!pagination.hasNextPage}
                  onClick={() => fetchReviews(pagination.page + 1)}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Review Modal Form */}
      <ReviewForm
        businessId={businessId}
        businessName={businessName}
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingReview(null);
        }}
        onSuccess={handleReviewSuccess}
        existingReview={editingReview}
      />
    </div>
  );
};
