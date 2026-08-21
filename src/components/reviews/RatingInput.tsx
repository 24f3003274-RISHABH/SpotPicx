import React, { useState } from 'react';
import { Star } from 'lucide-react';

interface RatingInputProps {
  value: number;
  onChange: (rating: number) => void;
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  required?: boolean;
}

const RATING_LABELS: Record<number, string> = {
  1: 'Terrible — Avoid',
  2: 'Poor — Needs Improvement',
  3: 'Average — Met Expectations',
  4: 'Very Good — Worth Visiting',
  5: 'Exceptional — Top Recommendation',
};

export const RatingInput: React.FC<RatingInputProps> = ({
  value,
  onChange,
  size = 'md',
  disabled = false,
}) => {
  const [hoverRating, setHoverRating] = useState<number | null>(null);

  const starSizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8',
  };

  const activeRating = hoverRating !== null ? hoverRating : value;

  return (
    <div className="space-y-1.5">
      <div className="flex items-center gap-1.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            disabled={disabled}
            onClick={() => onChange(star)}
            onMouseEnter={() => !disabled && setHoverRating(star)}
            onMouseLeave={() => !disabled && setHoverRating(null)}
            className={`p-1 rounded-lg transition-transform ${
              disabled ? 'cursor-not-allowed opacity-60' : 'cursor-pointer hover:scale-115 active:scale-95'
            } focus:outline-hidden focus:ring-2 focus:ring-amber-400`}
            aria-label={`Rate ${star} of 5 stars`}
          >
            <Star
              className={`${starSizeClasses[size]} transition-colors ${
                star <= activeRating
                  ? 'fill-amber-400 text-amber-400'
                  : 'fill-slate-100 text-slate-300'
              }`}
            />
          </button>
        ))}
      </div>

      <div className="text-xs font-semibold text-amber-800 h-4">
        {activeRating > 0 ? RATING_LABELS[activeRating] : 'Select a rating (1 to 5 stars)'}
      </div>
    </div>
  );
};
