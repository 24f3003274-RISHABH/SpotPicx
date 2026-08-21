import React from 'react';
import { Star, MessageSquarePlus, Award } from 'lucide-react';
import { ReviewStats } from '../../types';
import { Button } from '../ui/Button';

interface RatingBreakdownCardProps {
  stats: ReviewStats;
  businessName: string;
  onWriteReviewClick: () => void;
  hasUserReviewed?: boolean;
}

export const RatingBreakdownCard: React.FC<RatingBreakdownCardProps> = ({
  stats,
  businessName,
  onWriteReviewClick,
  hasUserReviewed = false,
}) => {
  const { total, average, breakdown } = stats;

  const starRows: Array<5 | 4 | 3 | 2 | 1> = [5, 4, 3, 2, 1];

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-6 border-b border-slate-100">
        {/* Big Average Score */}
        <div className="flex items-center gap-4">
          <div className="flex flex-col items-center justify-center p-3 bg-amber-50 rounded-2xl border border-amber-100 min-w-20">
            <span className="text-3xl font-extrabold text-amber-950 leading-none">
              {average > 0 ? average.toFixed(1) : '4.8'}
            </span>
            <div className="flex items-center gap-0.5 mt-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`h-3 w-3 ${
                    star <= Math.round(average || 4.8)
                      ? 'fill-amber-400 text-amber-400'
                      : 'fill-slate-200 text-slate-200'
                  }`}
                />
              ))}
            </div>
          </div>

          <div className="space-y-0.5">
            <div className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
              <span>Overall Community Score</span>
              <Award className="h-4 w-4 text-indigo-600" />
            </div>
            <p className="text-xs text-slate-500">
              Based on {total} verified explorer reviews and visitor ratings.
            </p>
          </div>
        </div>

        {/* Action Button */}
        <Button
          variant={hasUserReviewed ? 'outline' : 'primary'}
          size="sm"
          onClick={onWriteReviewClick}
          leftIcon={<MessageSquarePlus className="h-4 w-4" />}
          className="shrink-0"
        >
          {hasUserReviewed ? 'Edit Your Review' : 'Write a Review'}
        </Button>
      </div>

      {/* Progress Bars for 5, 4, 3, 2, 1 stars */}
      <div className="space-y-2.5">
        {starRows.map((stars) => {
          const count = breakdown[stars] || 0;
          const percentage = total > 0 ? Math.round((count / total) * 100) : 0;

          return (
            <div key={stars} className="flex items-center gap-3 text-xs">
              <div className="flex items-center gap-1 w-12 font-medium text-slate-700 shrink-0">
                <span>{stars}</span>
                <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
              </div>

              <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-amber-400 rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${percentage}%` }}
                />
              </div>

              <span className="w-10 text-right text-slate-400 font-mono text-[11px] shrink-0">
                {percentage}%
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
