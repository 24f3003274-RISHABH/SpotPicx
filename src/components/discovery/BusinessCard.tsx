import React from 'react';
import { Link } from 'react-router-dom';
import {
  Star,
  MapPin,
  CheckCircle2,
  Bookmark,
  ArrowRight,
  Sparkles,
  Phone,
  Clock,
  ExternalLink,
  Navigation,
} from 'lucide-react';
import { Business } from '../../types';
import { Badge } from '../ui/Badge';
import { useAuthStore } from '../../store/useAuthStore';

interface BusinessCardProps {
  business: Business;
  viewMode?: 'grid' | 'list';
}

const priceRangeMap: Record<string, { label: string; text: string; color: string }> = {
  BUDGET: { label: '₹', text: 'Budget-Friendly', color: 'text-emerald-700 bg-emerald-50 border-emerald-200' },
  MODERATE: { label: '₹₹', text: 'Moderate', color: 'text-indigo-700 bg-indigo-50 border-indigo-200' },
  PREMIUM: { label: '₹₹₹', text: 'Premium', color: 'text-purple-700 bg-purple-50 border-purple-200' },
  LUXURY: { label: '₹₹₹₹', text: 'Luxury', color: 'text-amber-800 bg-amber-50 border-amber-200' },
};

export const BusinessCard: React.FC<BusinessCardProps> = ({ business, viewMode = 'grid' }) => {
  const { user, isAuthenticated } = useAuthStore();

  const primaryImage =
    business.images && business.images.length > 0
      ? business.images[0]
      : 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&auto=format&fit=crop&q=80';

  const categoryName =
    typeof business.category === 'object' && business.category !== null
      ? (business.category as any).name
      : business.categoryDetails?.name || 'Local Spot';

  const priceInfo = priceRangeMap[business.priceRange] || priceRangeMap.MODERATE;

  const formatDistance = (km?: number) => {
    if (typeof km !== 'number') return null;
    if (km < 1) {
      return `${Math.round(km * 1000)} m away`;
    }
    return `${km.toFixed(1)} km away`;
  };

  const distanceText = formatDistance(business.distanceKm);

  if (viewMode === 'list') {
    return (
      <div className="group bg-white rounded-2xl border border-slate-200 hover:border-indigo-300 hover:shadow-md transition-all overflow-hidden flex flex-col sm:flex-row">
        {/* Image */}
        <div className="relative sm:w-64 h-48 sm:h-auto shrink-0 bg-slate-100 overflow-hidden">
          <img
            src={primaryImage}
            alt={business.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
          {business.verified && (
            <div className="absolute top-3 left-3 bg-emerald-600/90 backdrop-blur-xs text-white text-[11px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1 shadow-xs">
              <CheckCircle2 className="h-3 w-3" />
              <span>Verified</span>
            </div>
          )}
          <div className="absolute bottom-3 left-3 bg-slate-950/80 backdrop-blur-xs text-white text-xs font-bold px-2 py-0.5 rounded-md">
            {priceInfo.label} • {business.locality}
          </div>
        </div>

        {/* Content */}
        <div className="p-5 flex-1 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between gap-2 mb-1.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-600">
                {categoryName}
              </span>
              <div className="flex items-center gap-2">
                {distanceText && (
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-indigo-700 bg-indigo-50 border border-indigo-200/60 px-2 py-0.5 rounded-md">
                    <Navigation className="h-3 w-3" />
                    {distanceText}
                  </span>
                )}
                <div className="flex items-center gap-1 text-amber-500 bg-amber-50 px-2 py-0.5 rounded-lg border border-amber-200/60 text-xs font-bold">
                  <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                  <span>{business.rating ? business.rating.toFixed(1) : '4.5'}</span>
                  <span className="text-slate-400 font-normal">
                    ({business.reviewCount?.toLocaleString() || 10})
                  </span>
                </div>
              </div>
            </div>

            <Link to={`/business/${business.slug}`}>
              <h3 className="text-lg font-bold text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-1">
                {business.name}
              </h3>
            </Link>

            <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
              {business.shortDescription || business.description}
            </p>

            <div className="flex flex-wrap items-center gap-3 mt-3 text-xs text-slate-500">
              <div className="flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5 text-slate-400" />
                <span>{business.locality}, {business.city}</span>
              </div>
              {business.phone && (
                <div className="hidden md:flex items-center gap-1">
                  <Phone className="h-3.5 w-3.5 text-slate-400" />
                  <span>{business.phone}</span>
                </div>
              )}
            </div>

            {/* Tags */}
            {business.tags && business.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-3">
                {business.tags.slice(0, 3).map((tag, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-0.5 text-[10px] font-medium bg-slate-100 text-slate-600 rounded-md"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="pt-4 mt-3 border-t border-slate-100 flex items-center justify-between">
            <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${priceInfo.color}`}>
              {priceInfo.text}
            </span>
            <Link
              to={`/business/${business.slug}`}
              className="inline-flex items-center gap-1 text-xs font-bold text-indigo-600 hover:text-indigo-700 bg-indigo-50 hover:bg-indigo-100/80 px-3 py-1.5 rounded-lg transition-colors"
            >
              <span>View Spot</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Default Grid View Card
  return (
    <div className="group bg-white rounded-2xl border border-slate-200 hover:border-indigo-300 hover:shadow-md transition-all overflow-hidden flex flex-col h-full">
      {/* Card Image */}
      <div className="relative h-48 w-full bg-slate-100 overflow-hidden shrink-0">
        <img
          src={primaryImage}
          alt={business.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />

        {/* Top Badges */}
        <div className="absolute top-3 inset-x-3 flex items-center justify-between pointer-events-none">
          {business.verified ? (
            <div className="bg-emerald-600/90 backdrop-blur-xs text-white text-[10px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1 shadow-xs pointer-events-auto">
              <CheckCircle2 className="h-3 w-3" />
              <span>Verified</span>
            </div>
          ) : (
            <div className="bg-slate-800/80 backdrop-blur-xs text-white text-[10px] font-medium px-2 py-0.5 rounded-md pointer-events-auto">
              SpotPicks
            </div>
          )}

          <div className="flex items-center gap-1 pointer-events-auto">
            {distanceText && (
              <span className="bg-slate-900/90 backdrop-blur-xs text-white text-[10px] font-bold px-2 py-0.5 rounded-md shadow-xs">
                {distanceText}
              </span>
            )}
            <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold shadow-xs ${priceInfo.color}`}>
              {priceInfo.label}
            </span>
          </div>
        </div>

        {/* Locality badge on image */}
        <div className="absolute bottom-3 left-3 bg-slate-950/75 backdrop-blur-xs text-white text-[11px] font-medium px-2 py-0.5 rounded-md flex items-center gap-1">
          <MapPin className="h-3 w-3 text-indigo-400" />
          <span>{business.locality}</span>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between gap-2 mb-1.5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-600 truncate">
              {categoryName}
            </span>

            {/* Rating pill */}
            <div className="flex items-center gap-1 text-amber-500 bg-amber-50 px-1.5 py-0.5 rounded-md border border-amber-200/60 text-[11px] font-bold shrink-0">
              <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
              <span>{business.rating ? business.rating.toFixed(1) : '4.5'}</span>
              <span className="text-slate-400 font-normal">
                ({business.reviewCount || 10})
              </span>
            </div>
          </div>

          <Link to={`/business/${business.slug}`}>
            <h3 className="font-bold text-slate-900 text-base group-hover:text-indigo-600 transition-colors line-clamp-1">
              {business.name}
            </h3>
          </Link>

          <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
            {business.shortDescription || business.description}
          </p>

          {/* Tags */}
          {business.tags && business.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-3">
              {business.tags.slice(0, 2).map((t, idx) => (
                <span
                  key={idx}
                  className="px-2 py-0.5 text-[10px] font-medium bg-slate-100 text-slate-600 rounded-md"
                >
                  #{t}
                </span>
              ))}
              {business.tags.length > 2 && (
                <span className="px-1.5 py-0.5 text-[10px] text-slate-400">
                  +{business.tags.length - 2}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Footer Action */}
        <div className="pt-3 mt-4 border-t border-slate-100 flex items-center justify-between">
          <div className="text-[11px] text-slate-400 truncate max-w-[150px]">
            {business.address}
          </div>
          <Link
            to={`/business/${business.slug}`}
            className="inline-flex items-center gap-1 text-xs font-bold text-indigo-600 hover:text-indigo-700 bg-indigo-50 hover:bg-indigo-100/80 px-2.5 py-1.5 rounded-lg transition-colors shrink-0"
          >
            <span>View</span>
            <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
      </div>
    </div>
  );
};
