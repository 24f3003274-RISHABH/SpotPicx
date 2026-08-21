import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Compass, Star, MapPin, ArrowRight, RotateCcw, Heart } from 'lucide-react';
import { usePersonalization } from '../../hooks/usePersonalization';
import { searchService } from '../../services/searchService';
import { PersonalizedRecommendationsResponse } from '../../types';
import { Card } from '../ui/Card';

interface PersonalizedPicksSectionProps {
  className?: string;
}

/**
 * Personalized Picks Section Component
 * 
 * SPOTPICKS SAFE PERSONALIZATION:
 * Reads local browsing signals (recent categories, localities, price points).
 * If interactions >= 3, serves multi-factor affinity recommendations with clear "Because you liked..." reasons.
 * If interactions < 3, provides curated top-rated spots without premature bias.
 */
export const PersonalizedPicksSection: React.FC<PersonalizedPicksSectionProps> = ({ className = '' }) => {
  const { profile, totalInteractions, clearHistory } = usePersonalization();
  const [data, setData] = useState<PersonalizedRecommendationsResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const fetchPersonalized = async () => {
      try {
        const res = await searchService.getPersonalized(profile, 4);
        if (isMounted) setData(res);
      } catch (err) {
        console.error('Failed to load personalized recommendations:', err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    fetchPersonalized();
    return () => {
      isMounted = false;
    };
  }, [profile]);

  if (isLoading || !data || !data.items || data.items.length === 0) {
    return null;
  }

  const { isPersonalized, reason, items } = data;

  return (
    <section className={`space-y-5 ${className}`}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-600">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                {isPersonalized ? 'Recommended For You' : 'Curated Top Picks'}
              </h2>
              {isPersonalized && (
                <span className="px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700 text-[10px] font-extrabold uppercase tracking-wider">
                  Personalized
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500">{reason}</p>
          </div>
        </div>

        {isPersonalized && (
          <button
            type="button"
            onClick={clearHistory}
            className="text-xs text-slate-400 hover:text-slate-600 self-start sm:self-auto flex items-center gap-1 cursor-pointer transition-colors"
            title="Clear browsing taste profile"
          >
            <RotateCcw className="h-3 w-3" />
            <span>Reset taste profile</span>
          </button>
        )}
      </div>

      {/* Grid of Recommended Spots */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {items.map((item) => (
          <Link
            key={item.id || item.slug}
            to={`/biz/${item.slug}`}
            className="group block"
          >
            <Card className="overflow-hidden border-slate-200/80 hover:border-indigo-400 hover:shadow-lg transition-all duration-200 h-full flex flex-col rounded-2xl">
              <div className="relative h-40 w-full overflow-hidden bg-slate-100">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  referrerPolicy="no-referrer"
                />
                {item.matchReason && (
                  <div className="absolute top-2.5 left-2.5 max-w-[85%] px-2.5 py-1 rounded-lg bg-slate-900/85 backdrop-blur-md text-indigo-200 text-[10px] font-semibold truncate shadow-md">
                    {item.matchReason}
                  </div>
                )}
                {item.rating && (
                  <div className="absolute bottom-2.5 right-2.5 px-2 py-0.5 rounded-md bg-white/95 backdrop-blur-md text-slate-900 font-extrabold text-xs flex items-center gap-1 shadow-sm">
                    <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                    <span>{typeof item.rating === 'number' ? item.rating.toFixed(1) : item.rating}</span>
                  </div>
                )}
              </div>

              <div className="p-4 flex-1 flex flex-col justify-between space-y-2">
                <div>
                  <h3 className="font-bold text-sm text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-1">
                    {item.name}
                  </h3>
                  <div className="flex items-center gap-1 text-xs text-slate-500 mt-0.5">
                    <MapPin className="h-3 w-3 text-slate-400 shrink-0" />
                    <span className="truncate">{item.locality || 'Delhi NCR'}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                  <span className="text-slate-500 font-medium text-[11px]">
                    {item.category || 'Spot'}
                  </span>
                  <span className="text-indigo-600 font-bold group-hover:translate-x-0.5 transition-transform flex items-center gap-0.5">
                    View Spot <ArrowRight className="h-3 w-3" />
                  </span>
                </div>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </section>
  );
};
