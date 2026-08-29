import React from 'react';
import { Link } from 'react-router-dom';
import {
  MapPin,
  Clock,
  Car,
  Train,
  Sparkles,
  ArrowRight,
  Navigation,
  Calendar,
  Layers,
  ExternalLink,
} from 'lucide-react';
import { WeekendGetawayPlace } from '../../types/weekendGetaways.types';

interface GetawayCardProps {
  place: WeekendGetawayPlace;
  onOpenMap?: (place: WeekendGetawayPlace) => void;
}

export const GetawayCard: React.FC<GetawayCardProps> = ({ place, onOpenMap }) => {
  const hasTrain = place.bestTransportOptions.some((t) => t.mode.includes('Train'));

  return (
    <div
      id={`getaway-card-${place.slug}`}
      className="group flex flex-col rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-sm hover:shadow-xl hover:border-sky-500/40 transition-all duration-300"
    >
      {/* Image Banner with Badges */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
        <img
          src={place.heroImage}
          alt={place.name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />

        {/* Distance Badge */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
          <span className="rounded-lg bg-black/70 backdrop-blur-md px-2.5 py-1 text-xs font-bold text-white shadow-sm flex items-center gap-1 border border-white/10">
            <Navigation className="h-3 w-3 text-sky-400" />
            <span>{place.distanceKm} km from Delhi</span>
          </span>
          <span className="rounded-lg bg-sky-600/90 backdrop-blur-md px-2.5 py-1 text-xs font-bold text-white shadow-sm">
            {place.state}
          </span>
        </div>

        {/* Duration & Budget Badge */}
        <div className="absolute top-3 right-3 flex items-center gap-1.5">
          <span className="rounded-lg bg-emerald-700/90 backdrop-blur-md px-2 py-0.5 text-[11px] font-bold text-white">
            {place.budgetLevel}
          </span>
        </div>

        {/* Bottom Title on Image */}
        <div className="absolute bottom-3 left-3 right-3 space-y-1">
          <div className="flex items-center gap-1.5 text-xs text-sky-300 font-semibold">
            <span>{place.districtOrRegion}</span>
          </div>
          <h3 className="text-lg sm:text-xl font-black text-white leading-tight drop-shadow-md">
            {place.name}
          </h3>
        </div>
      </div>

      {/* Card Body */}
      <div className="flex flex-1 flex-col p-4 sm:p-5 space-y-4 justify-between">
        <div className="space-y-3">
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed">
            {place.tagline}
          </p>

          {/* Quick Metrics Grid */}
          <div className="grid grid-cols-2 gap-2 text-xs pt-1 border-t border-slate-100 dark:border-slate-800/60">
            <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
              <Clock className="h-3.5 w-3.5 text-sky-500 shrink-0" />
              <span className="truncate" title={place.idealDuration}>
                {place.idealDuration}
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
              <Calendar className="h-3.5 w-3.5 text-amber-500 shrink-0" />
              <span className="truncate" title={place.bestSeason}>
                {place.bestSeason.split('(')[0].trim()}
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
              <Car className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
              <span className="truncate" title={place.estimatedDriveTime}>
                {place.estimatedDriveTime.split('(')[0].trim()}
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
              <Train className="h-3.5 w-3.5 text-purple-500 shrink-0" />
              <span className="truncate">
                {hasTrain ? 'Train-Friendly' : 'Direct Highway Road'}
              </span>
            </div>
          </div>

          {/* Highlights Chips */}
          <div className="space-y-1.5">
            <div className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
              Top Experiences
            </div>
            <div className="flex flex-wrap gap-1.5">
              {place.keyHighlights.slice(0, 3).map((hl, idx) => (
                <span
                  key={idx}
                  className="rounded-md bg-slate-100 dark:bg-slate-800 px-2 py-0.5 text-[11px] font-medium text-slate-700 dark:text-slate-300"
                >
                  {hl}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
          {onOpenMap && (
            <button
              type="button"
              onClick={() => onOpenMap(place)}
              className="inline-flex items-center gap-1 text-xs font-semibold text-sky-600 dark:text-sky-400 hover:text-sky-700 dark:hover:text-sky-300 transition-colors"
            >
              <MapPin className="h-3.5 w-3.5" />
              <span>Route Map</span>
            </button>
          )}

          <Link
            to={`/delhi/weekend-getaways/destination/${place.slug}`}
            className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-slate-900 dark:bg-white px-3.5 py-2 text-xs font-bold text-white dark:text-slate-900 hover:bg-sky-600 dark:hover:bg-sky-400 dark:hover:text-white transition-all ml-auto shadow-sm"
          >
            <span>Explore Guide</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
};
