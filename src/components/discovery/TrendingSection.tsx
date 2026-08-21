import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Flame, TrendingUp, Search, Sparkles, Star, MapPin, ArrowRight } from 'lucide-react';
import { searchService } from '../../services/searchService';
import { TrendingData } from '../../types';
import { Card } from '../ui/Card';

interface TrendingSectionProps {
  onSearchSelect?: (query: string) => void;
  className?: string;
}

/**
 * Trending Discovery Section
 * 
 * SPOTPICKS TRENDING ENGINE:
 * Displays real-time trending searches, most active categories, and top-ranked spots
 * across Delhi-NCR based on rolling search appearances, CTR, and review ratings.
 */
export const TrendingSection: React.FC<TrendingSectionProps> = ({ onSearchSelect, className = '' }) => {
  const [trendingData, setTrendingData] = useState<TrendingData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;
    const fetchTrending = async () => {
      try {
        const data = await searchService.getTrending();
        if (isMounted) setTrendingData(data);
      } catch (err) {
        console.error('Failed to load trending data:', err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };
    fetchTrending();
    return () => {
      isMounted = false;
    };
  }, []);

  if (isLoading || !trendingData) {
    return null;
  }

  const { searches, businesses, categories } = trendingData;

  const handleQueryClick = (query: string) => {
    if (onSearchSelect) {
      onSearchSelect(query);
    } else {
      navigate(`/search?q=${encodeURIComponent(query)}`);
    }
  };

  return (
    <section className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-amber-500/10 text-amber-600">
            <Flame className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900">Trending Right Now</h2>
            <p className="text-xs text-slate-500">
              Most searched spots, neighborhoods, and queries across Delhi-NCR
            </p>
          </div>
        </div>
      </div>

      {/* Trending Search Chips */}
      {searches && searches.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500 uppercase tracking-wider">
            <TrendingUp className="h-3.5 w-3.5 text-amber-500" />
            <span>Top Searched Queries</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {searches.map((s, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleQueryClick(s.query)}
                className="group flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white hover:bg-amber-50 border border-slate-200 hover:border-amber-300 text-xs font-semibold text-slate-700 hover:text-amber-900 transition-all shadow-2xs cursor-pointer"
              >
                <Search className="h-3 w-3 text-slate-400 group-hover:text-amber-600" />
                <span>{s.query}</span>
                {s.trend === 'hot' && (
                  <span className="px-1.5 py-0.2 bg-rose-100 text-rose-700 text-[10px] font-bold rounded">
                    HOT
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Trending Businesses Horizontal Scroll Grid */}
      {businesses && businesses.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {businesses.slice(0, 4).map((b) => (
            <Link
              key={b.id || b.slug}
              to={`/biz/${b.slug}`}
              className="group block"
            >
              <Card className="overflow-hidden border-slate-200/80 hover:border-indigo-400 hover:shadow-lg transition-all duration-200 h-full flex flex-col rounded-2xl">
                <div className="relative h-40 w-full overflow-hidden bg-slate-100">
                  <img
                    src={b.image}
                    alt={b.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    referrerPolicy="no-referrer"
                  />
                  {b.badge && (
                    <div className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-lg bg-slate-900/80 backdrop-blur-md text-white text-[11px] font-bold shadow-md">
                      {b.badge}
                    </div>
                  )}
                  {b.rating && (
                    <div className="absolute bottom-2.5 right-2.5 px-2 py-0.5 rounded-md bg-white/95 backdrop-blur-md text-slate-900 font-extrabold text-xs flex items-center gap-1 shadow-sm">
                      <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                      <span>{b.rating.toFixed(1)}</span>
                    </div>
                  )}
                </div>

                <div className="p-4 flex-1 flex flex-col justify-between space-y-2">
                  <div>
                    <h3 className="font-bold text-sm text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-1">
                      {b.name}
                    </h3>
                    <div className="flex items-center gap-1 text-xs text-slate-500 mt-0.5">
                      <MapPin className="h-3 w-3 text-slate-400 shrink-0" />
                      <span className="truncate">{b.locality || 'Delhi NCR'}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                    <span className="text-slate-500 font-medium text-[11px]">
                      {b.category || 'Spot'}
                    </span>
                    <span className="text-indigo-600 font-bold group-hover:translate-x-0.5 transition-transform flex items-center gap-0.5">
                      Explore <ArrowRight className="h-3 w-3" />
                    </span>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
};
