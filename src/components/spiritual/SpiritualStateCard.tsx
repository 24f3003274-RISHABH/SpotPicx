import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, ArrowRight, Sparkles } from 'lucide-react';
import { SpiritualStateInfo } from '../../types/spiritual.types';

interface SpiritualStateCardProps {
  stateInfo: SpiritualStateInfo;
}

export const SpiritualStateCard: React.FC<SpiritualStateCardProps> = ({ stateInfo }) => {
  return (
    <Link
      to={`/india/spiritual/${stateInfo.stateSlug}`}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 transition-all duration-300 hover:shadow-xl hover:border-amber-500/30 hover:-translate-y-1"
    >
      <div className="relative aspect-[16/9] w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
        <img
          src={stateInfo.heroImage}
          alt={stateInfo.stateName}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
        
        <div className="absolute top-3 left-3">
          <span className="inline-flex items-center gap-1 rounded-full bg-black/60 backdrop-blur-md px-2.5 py-1 text-xs font-semibold text-white border border-white/20">
            <MapPin className="h-3 w-3 text-amber-400" />
            {stateInfo.stateName}
          </span>
        </div>

        <div className="absolute bottom-3 left-3 right-3 text-white">
          <h3 className="text-lg font-bold text-white group-hover:text-amber-300 transition-colors">
            Spiritual {stateInfo.stateName}
          </h3>
          <p className="text-xs text-white/80 line-clamp-1 mt-0.5">
            {stateInfo.topSpiritualTowns.slice(0, 3).map((t) => t.name).join(' • ')}
          </p>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-4 sm:p-5 justify-between space-y-3">
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
          {stateInfo.overview}
        </p>

        {/* Circuits & Festivals */}
        <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800/80">
          <div className="flex flex-wrap gap-1">
            {stateInfo.majorPilgrimageCircuits.slice(0, 2).map((circ, idx) => (
              <span
                key={idx}
                className="inline-flex items-center gap-1 rounded-md bg-amber-500/10 dark:bg-amber-500/20 px-2 py-0.5 text-[11px] font-medium text-amber-800 dark:text-amber-300"
              >
                <Sparkles className="h-2.5 w-2.5" />
                {circ.name}
              </span>
            ))}
          </div>

          <div className="flex items-center justify-between text-xs font-semibold text-slate-900 dark:text-white pt-1">
            <span>Explore State Directory</span>
            <ArrowRight className="h-4 w-4 text-amber-600 dark:text-amber-400 transition-transform group-hover:translate-x-1" />
          </div>
        </div>
      </div>
    </Link>
  );
};
