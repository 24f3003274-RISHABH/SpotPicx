import React from 'react';
import { Link } from 'react-router-dom';
import {
  MapPin,
  Clock,
  Ticket,
  Train,
  Sparkles,
  Award,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';
import { DelhiHeritagePlace } from '../../types/delhiHeritage.types';

interface HeritagePlaceCardProps {
  place: DelhiHeritagePlace;
  onOpenMap?: (place: DelhiHeritagePlace) => void;
}

export const HeritagePlaceCard: React.FC<HeritagePlaceCardProps> = ({ place, onOpenMap }) => {
  const isFree =
    place.visitingInfo.entryFee.indianCitizens.toLowerCase().includes('free');

  return (
    <div
      id={`place-card-${place.slug}`}
      className="group relative flex flex-col overflow-hidden rounded-2xl bg-white border border-slate-200/80 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1"
    >
      {/* Image Banner */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-100">
        <img
          src={place.heroImage}
          alt={place.name}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-900/90 backdrop-blur-md px-3 py-1 text-xs font-semibold text-white shadow-sm border border-white/10">
            {place.category}
          </span>

          <div className="flex items-center gap-1.5">
            {place.isUNESCO && (
              <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/95 backdrop-blur-md px-2.5 py-1 text-[11px] font-bold text-slate-950 shadow-sm">
                <Award className="h-3 w-3" />
                UNESCO
              </span>
            )}
            {isFree && (
              <span className="inline-flex items-center rounded-full bg-emerald-600/90 backdrop-blur-md px-2.5 py-1 text-[11px] font-semibold text-white shadow-sm">
                Free Entry
              </span>
            )}
          </div>
        </div>

        {/* Bottom overlay info */}
        <div className="absolute bottom-3 left-3 right-3 text-white">
          <div className="text-[11px] font-medium tracking-wide text-indigo-200 uppercase flex items-center gap-1.5">
            <span>{place.dynastyOrEra}</span>
            <span className="h-1 w-1 rounded-full bg-indigo-300" />
            <span>{place.builtInYearOrCentury.split('(')[0].trim()}</span>
          </div>
          <h3 className="text-lg font-bold text-white leading-tight line-clamp-1 group-hover:text-indigo-200 transition-colors">
            {place.name}
          </h3>
        </div>
      </div>

      {/* Content Body */}
      <div className="flex flex-1 flex-col justify-between p-5">
        <div>
          <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mb-4">
            {place.tagline}
          </p>

          {/* Quick Meta Grid */}
          <div className="grid grid-cols-2 gap-2.5 text-xs text-slate-600 mb-4 bg-slate-50/80 p-3 rounded-xl border border-slate-100">
            <div className="flex items-center gap-2">
              <Train className="h-3.5 w-3.5 text-indigo-600 shrink-0" />
              <span className="truncate font-medium">{place.location.nearestMetro.replace(' Metro Station', '')}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-3.5 w-3.5 text-slate-500 shrink-0" />
              <span className="truncate">{place.suggestedDuration}</span>
            </div>
            <div className="flex items-center gap-2">
              <Ticket className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
              <span className="truncate font-medium">
                {isFree ? 'Free Admission' : place.visitingInfo.entryFee.indianCitizens.split('(')[0]}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-3.5 w-3.5 text-rose-500 shrink-0" />
              <span className="truncate">{place.location.zone}</span>
            </div>
          </div>

          {/* Key highlights tags */}
          <div className="flex flex-wrap gap-1.5 mb-4">
            {place.thingsToSee.slice(0, 2).map((item, idx) => (
              <span
                key={idx}
                className="inline-flex items-center text-[11px] font-medium text-slate-700 bg-white border border-slate-200 rounded-md px-2 py-0.5"
              >
                {item.title}
              </span>
            ))}
            {place.thingsToSee.length > 2 && (
              <span className="inline-flex items-center text-[11px] font-medium text-slate-400 bg-slate-50 rounded-md px-1.5 py-0.5">
                +{place.thingsToSee.length - 2} more
              </span>
            )}
          </div>
        </div>

        {/* Card Footer */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2 mt-auto">
          <div className="flex items-center gap-1 text-[11px] text-slate-500">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
            <span className="truncate">ASI / Official Data</span>
          </div>

          <div className="flex items-center gap-2">
            {onOpenMap && (
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onOpenMap(place);
                }}
                className="text-xs font-semibold text-slate-600 hover:text-indigo-600 px-2 py-1 rounded-lg hover:bg-slate-100 transition-colors"
              >
                Map
              </button>
            )}
            <Link
              to={`/delhi/heritage/place/${place.slug}`}
              className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-700 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-lg transition-colors"
            >
              <span>Explore</span>
              <ChevronRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
