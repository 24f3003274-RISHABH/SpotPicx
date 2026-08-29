import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Clock, ExternalLink, Sparkles } from 'lucide-react';
import { SpiritualPlace } from '../../types/spiritual.types';

interface SpiritualPlaceCardProps {
  place: SpiritualPlace;
}

export const SpiritualPlaceCard: React.FC<SpiritualPlaceCardProps> = ({ place }) => {
  const getTraditionBadgeColor = (tradition: string) => {
    switch (tradition) {
      case 'Hindu':
        return 'bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/20';
      case 'Buddhist':
        return 'bg-yellow-500/10 text-yellow-700 dark:text-yellow-300 border-yellow-500/20';
      case 'Jain':
        return 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/20';
      case 'Sikh':
        return 'bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-500/20';
      case 'Muslim':
        return 'bg-teal-500/10 text-teal-700 dark:text-teal-300 border-teal-500/20';
      case 'Christian':
        return 'bg-rose-500/10 text-rose-700 dark:text-rose-300 border-rose-500/20';
      case 'Zoroastrian':
        return 'bg-purple-500/10 text-purple-700 dark:text-purple-300 border-purple-500/20';
      case 'Bahá\'í':
        return 'bg-cyan-500/10 text-cyan-700 dark:text-cyan-300 border-cyan-500/20';
      case 'Jewish':
        return 'bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 border-indigo-500/20';
      default:
        return 'bg-slate-500/10 text-slate-700 dark:text-slate-300 border-slate-500/20';
    }
  };

  return (
    <div
      id={`spiritual-card-${place.slug}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 transition-all duration-300 hover:shadow-xl hover:border-amber-500/30 hover:-translate-y-1"
    >
      {/* Image container */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
        <img
          src={place.heroImage}
          alt={place.name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2">
          <span
            className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-semibold backdrop-blur-md ${getTraditionBadgeColor(
              place.tradition
            )} bg-white/90 dark:bg-slate-900/90 shadow-sm`}
          >
            {place.tradition}
          </span>
          {place.isTopPilgrimage && (
            <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/90 text-white px-2.5 py-0.5 text-xs font-medium backdrop-blur-md shadow-sm">
              <Sparkles className="h-3 w-3" />
              Major Pilgrimage
            </span>
          )}
        </div>

        {/* Bottom overlay location */}
        <div className="absolute bottom-3 left-3 right-3 text-white">
          <div className="flex items-center gap-1.5 text-xs text-white/90 font-medium drop-shadow-sm">
            <MapPin className="h-3.5 w-3.5 shrink-0 text-amber-400" />
            <span className="truncate">{place.cityDistrict}, {place.stateName}</span>
          </div>
        </div>
      </div>

      {/* Card Content */}
      <div className="flex flex-1 flex-col p-5 space-y-3">
        <div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors line-clamp-1">
            {place.name}
          </h3>
          <p className="text-xs font-medium text-amber-700 dark:text-amber-400 mt-0.5 line-clamp-1">
            {place.traditionDetail}
          </p>
        </div>

        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed flex-1">
          {place.shortDescription}
        </p>

        {/* Highlights & Duration */}
        <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5 text-slate-400" />
            <span>{place.suggestedDuration}</span>
          </div>
          <span className="text-[11px] font-medium text-slate-400 dark:text-slate-500 truncate max-w-[140px]">
            {place.architecturalStyle.split(' ')[0]} Style
          </span>
        </div>

        {/* Action Link */}
        <div className="pt-1 flex items-center justify-between">
          <Link
            to={`/india/spiritual/place/${place.slug}`}
            className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-4 py-2.5 text-xs font-semibold hover:bg-amber-600 dark:hover:bg-amber-400 hover:text-white dark:hover:text-slate-900 transition-colors shadow-sm"
          >
            Explore Destination & Pilgrimage Guide
            <ExternalLink className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
};
