import React, { useEffect, useState } from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';
import { AdvertisementItem, monetizationService } from '../../services/monetizationService';

interface AdBannerProps {
  placement?: string;
  category?: string;
  className?: string;
}

export const AdBanner: React.FC<AdBannerProps> = ({
  placement = 'HOME_FEED',
  category,
  className = '',
}) => {
  const [ad, setAd] = useState<AdvertisementItem | null>(null);

  useEffect(() => {
    let mounted = true;
    monetizationService.getAdsByPlacement(placement, { category, limit: 1 }).then((ads) => {
      if (mounted && ads.length > 0) {
        setAd(ads[0]);
        monetizationService.trackAdImpression(ads[0]._id);
      }
    });
    return () => {
      mounted = false;
    };
  }, [placement, category]);

  if (!ad) return null;

  const handleClick = () => {
    monetizationService.trackAdClick(ad._id);
    if (ad.targetUrl) {
      window.location.href = ad.targetUrl;
    }
  };

  return (
    <div
      id={`ad-banner-${ad._id}`}
      onClick={handleClick}
      className={`group relative overflow-hidden rounded-2xl border border-neutral-200 bg-neutral-900 text-white p-6 shadow-sm transition-all hover:shadow-md cursor-pointer ${className}`}
    >
      {/* Background Ambience Image */}
      {ad.imageUrl && (
        <div className="absolute inset-0 opacity-25 mix-blend-overlay">
          <img
            src={ad.imageUrl}
            alt=""
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            referrerPolicy="no-referrer"
          />
        </div>
      )}

      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1.5 max-w-2xl">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 rounded bg-amber-400/20 px-2 py-0.5 text-[11px] font-semibold text-amber-300">
              <Sparkles className="h-3 w-3 text-amber-400" />
              {ad.badgeLabel || 'Sponsored'}
            </span>
            {ad.sponsorName && <span className="text-xs text-neutral-400">• {ad.sponsorName}</span>}
          </div>
          <h3 className="text-lg md:text-xl font-bold tracking-tight text-white group-hover:text-amber-300 transition-colors">
            {ad.headline}
          </h3>
          <p className="text-sm text-neutral-300 line-clamp-2 leading-relaxed">
            {ad.description}
          </p>
        </div>

        <button
          id={`btn-banner-action-${ad._id}`}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-amber-500 px-5 py-2.5 text-xs font-bold text-neutral-950 shadow-sm transition-all group-hover:bg-amber-400 group-hover:shadow-amber-500/20 whitespace-nowrap self-start md:self-auto"
        >
          <span>{ad.callToAction || 'Discover More'}</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
};
