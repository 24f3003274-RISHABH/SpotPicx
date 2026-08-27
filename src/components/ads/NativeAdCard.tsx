import React, { useEffect } from 'react';
import { Sparkles, ArrowUpRight, MapPin, Star } from 'lucide-react';
import { AdvertisementItem, monetizationService } from '../../services/monetizationService';

interface NativeAdCardProps {
  ad: AdvertisementItem;
  className?: string;
}

export const NativeAdCard: React.FC<NativeAdCardProps> = ({ ad, className = '' }) => {
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
      id={`native-ad-${ad._id}`}
      onClick={handleClick}
      className={`group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-neutral-200/80 bg-white p-4 shadow-sm transition-all hover:border-amber-300 hover:shadow-md cursor-pointer ${className}`}
    >
      <div>
        {/* Visual Media */}
        <div className="relative aspect-[16/10] w-full overflow-hidden rounded-xl bg-neutral-100 mb-3.5">
          {ad.imageUrl ? (
            <img
              src={ad.imageUrl}
              alt={ad.headline}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              referrerPolicy="no-referrer"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-amber-50 text-amber-700">
              <Sparkles className="h-8 w-8" />
            </div>
          )}

          {/* Transparent Non-Intrusive Sponsored Badge */}
          <div className="absolute top-2.5 left-2.5">
            <span className="inline-flex items-center gap-1 rounded-md bg-neutral-900/80 backdrop-blur-md px-2 py-0.5 text-[10px] font-semibold text-amber-300 uppercase tracking-wider">
              <Sparkles className="h-2.5 w-2.5 text-amber-400" />
              {ad.badgeLabel || 'Sponsored'}
            </span>
          </div>
        </div>

        {/* Text Details */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between gap-2">
            <h4 className="text-base font-bold text-neutral-900 group-hover:text-amber-600 transition-colors line-clamp-1">
              {ad.headline}
            </h4>
            <ArrowUpRight className="h-4 w-4 text-neutral-400 group-hover:text-amber-600 transition-colors flex-shrink-0" />
          </div>

          <p className="text-xs text-neutral-600 line-clamp-2 leading-relaxed">
            {ad.description}
          </p>
        </div>
      </div>

      {/* Footer Info */}
      <div className="mt-4 pt-3 border-t border-neutral-100 flex items-center justify-between text-xs text-neutral-500">
        <span className="truncate max-w-[150px] font-medium text-neutral-700">
          {ad.sponsorName || 'Promoted Spot'}
        </span>
        <span className="font-semibold text-amber-700 group-hover:underline inline-flex items-center gap-0.5">
          {ad.callToAction || 'View Spot'}
        </span>
      </div>
    </div>
  );
};
