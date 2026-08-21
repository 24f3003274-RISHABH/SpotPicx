import React from 'react';
import { Link } from 'react-router-dom';
import {
  Star,
  MapPin,
  CheckCircle2,
  Navigation,
  ArrowRight,
  X,
  Phone,
  Clock,
  Heart,
} from 'lucide-react';
import { Business } from '../../types';
import { mapService } from '../../services/map';
import { DistanceBadge } from './DistanceBadge';
import { useSavedStore } from '../../store/useSavedStore';

interface BusinessPreviewCardProps {
  business: Business;
  userCoords?: { lat: number; lng: number } | null;
  onClose?: () => void;
  className?: string;
}

export const BusinessPreviewCard: React.FC<BusinessPreviewCardProps> = ({
  business,
  userCoords,
  onClose,
  className = '',
}) => {
  const { isSpotSaved, toggleSaveSpot } = useSavedStore();
  const spotId = business._id || business.slug;
  const isSaved = isSpotSaved(spotId);

  const primaryImage =
    business.images && business.images.length > 0
      ? business.images[0]
      : 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&auto=format&fit=crop&q=80';

  const categoryName =
    typeof business.category === 'object' && business.category !== null
      ? (business.category as any).name
      : business.categoryDetails?.name || 'Local Spot';

  // Calculate live distance from user coordinates if available
  const computedDistanceKm =
    business.distanceKm ??
    (userCoords
      ? mapService.calculateDistanceKm(userCoords, { lat: business.latitude, lng: business.longitude })
      : null);

  const directionsUrl = mapService.getDirectionsUrl({
    destination: {
      lat: business.latitude,
      lng: business.longitude,
    },
    origin: userCoords || undefined,
  });

  return (
    <div
      className={`bg-white rounded-2xl border border-slate-200/90 shadow-2xl p-3 sm:p-4 max-w-sm sm:max-w-md w-full animate-in fade-in zoom-in-95 duration-200 ${className}`}
    >
      {/* Top row: Close button and category */}
      <div className="flex items-center justify-between gap-2 mb-2">
        <div className="flex items-center gap-1.5 truncate">
          <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md truncate">
            {categoryName}
          </span>
          {business.verified && (
            <span className="inline-flex items-center gap-0.5 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded-md">
              <CheckCircle2 className="h-2.5 w-2.5" />
              <span>Verified</span>
            </span>
          )}
        </div>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              toggleSaveSpot(business);
            }}
            className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
              isSaved ? 'text-rose-600 bg-rose-50' : 'text-slate-400 hover:text-slate-700 hover:bg-slate-100'
            }`}
            title="Save Spot"
          >
            <Heart className={`h-4 w-4 ${isSaved ? 'fill-rose-600' : ''}`} />
          </button>

          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
              title="Close Preview"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {/* Main card body with image thumbnail and description */}
      <div className="flex gap-3">
        <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden bg-slate-100 shrink-0">
          <img
            src={primaryImage}
            alt={business.name}
            className="w-full h-full object-cover"
            loading="lazy"
            referrerPolicy="no-referrer"
          />
        </div>

        <div className="flex-1 min-w-0 space-y-1">
          <Link to={`/business/${business.slug}`}>
            <h4 className="font-bold text-slate-900 text-sm sm:text-base hover:text-indigo-600 transition-colors truncate">
              {business.name}
            </h4>
          </Link>

          <div className="flex items-center gap-2 text-xs">
            <div className="flex items-center gap-1 text-amber-500 font-bold bg-amber-50 px-1.5 py-0.5 rounded-md">
              <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
              <span>{business.rating ? business.rating.toFixed(1) : '4.5'}</span>
              <span className="text-slate-400 font-normal">({business.reviewCount || 10})</span>
            </div>

            {computedDistanceKm !== null && <DistanceBadge distanceKm={computedDistanceKm} size="sm" />}
          </div>

          <div className="flex items-center gap-1 text-xs text-slate-500 truncate">
            <MapPin className="h-3 w-3 text-slate-400 shrink-0" />
            <span className="truncate">{business.locality}, {business.city}</span>
          </div>
        </div>
      </div>

      {/* Action Footer: Directions & View Details */}
      <div className="flex items-center gap-2 mt-3 pt-3 border-t border-slate-100">
        <a
          href={directionsUrl}
          target="_blank"
          rel="noreferrer"
          className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-colors cursor-pointer"
        >
          <Navigation className="h-3.5 w-3.5 text-indigo-600" />
          <span>Directions</span>
        </a>

        <Link
          to={`/business/${business.slug}`}
          className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-colors shadow-2xs"
        >
          <span>View Spot</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </div>
  );
};
