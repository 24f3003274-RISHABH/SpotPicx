import React, { useEffect } from 'react';
import { Star, MapPin, ExternalLink, Sparkles, ArrowRight } from 'lucide-react';
import { AdvertisementItem, monetizationService } from '../../services/monetizationService';

interface SponsoredListingCardProps {
  ad: AdvertisementItem;
  className?: string;
}

export const SponsoredListingCard: React.FC<SponsoredListingCardProps> = ({ ad, className = '' }) => {
  useEffect(() => {
    if (ad._id) {
      monetizationService.trackAdImpression(ad._id);
    }
  }, [ad._id]);

  const handleClick = () => {
    if (ad._id) {
      monetizationService.trackAdClick(ad._id);
    }
    if (ad.targetUrl) {
      window.location.href = ad.targetUrl;
    }
  };

  return (
    <div
      id={`sponsored-listing-${ad._id}`}
      onClick={handleClick}
      className={`group relative overflow-hidden rounded-2xl border border-amber-200/80 bg-gradient-to-br from-amber-50/40 via-white to-amber-50/20 p-5 shadow-sm transition-all hover:border-amber-400 hover:shadow-md cursor-pointer ${className}`}
    >
      {/* Top Meta Bar with Clear Non-Intrusive Sponsored Label */}
      <div className="flex items-center justify-between gap-2 pb-3 mb-3 border-b border-amber-100/80">
        <div className="flex items-center gap-1.5">
          <span className="inline-flex items-center gap-1 rounded-md bg-amber-500/10 px-2 py-0.5 text-xs font-semibold text-amber-800 tracking-wide">
            <Sparkles className="h-3 w-3 text-amber-600" />
            {ad.badgeLabel || 'Sponsored'}
          </span>
          {ad.sponsorName && (
            <span className="text-xs text-neutral-500 truncate max-w-[200px]">
              • {ad.sponsorName}
            </span>
          )}
        </div>
        <span className="text-[11px] font-medium text-neutral-400">Promoted Partner</span>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-start">
        {ad.imageUrl && (
          <div className="relative h-28 w-full sm:w-36 flex-shrink-0 overflow-hidden rounded-xl bg-neutral-100">
            <img
              src={ad.imageUrl}
              alt={ad.headline}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              referrerPolicy="no-referrer"
            />
          </div>
        )}

        <div className="flex-1 min-w-0">
          <h4 className="text-base font-bold text-neutral-900 group-hover:text-amber-700 transition-colors line-clamp-1">
            {ad.headline}
          </h4>
          <p className="mt-1 text-sm text-neutral-600 line-clamp-2 leading-relaxed">
            {ad.description}
          </p>

          <div className="mt-3 flex items-center justify-between gap-3 pt-2">
            <div className="flex items-center gap-2 text-xs text-neutral-500">
              {ad.business?.locality && (
                <span className="inline-flex items-center gap-1">
                  <MapPin className="h-3 w-3 text-neutral-400" />
                  {ad.business.locality}
                </span>
              )}
              {ad.business?.rating && (
                <span className="inline-flex items-center gap-1 font-medium text-amber-700">
                  <Star className="h-3 w-3 fill-amber-400 text-amber-500" />
                  {ad.business.rating}
                </span>
              )}
            </div>

            <button
              id={`btn-cta-${ad._id}`}
              className="inline-flex items-center gap-1.5 rounded-lg bg-neutral-900 px-3.5 py-1.5 text-xs font-semibold text-white shadow-sm transition-colors group-hover:bg-amber-600"
            >
              <span>{ad.callToAction || 'View Details'}</span>
              <ArrowRight className="h-3 w-3" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
