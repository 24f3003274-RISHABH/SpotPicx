import React from 'react';
import { Sparkles, Calendar, MapPin, ChevronRight } from 'lucide-react';
import { HISTORIC_CITIES_OF_DELHI } from '../../data/delhi/heritageCategories';

interface HeritageTimelineProps {
  selectedCity?: string | null;
  onSelectCity?: (cityName: string | null) => void;
}

export const HeritageTimeline: React.FC<HeritageTimelineProps> = ({
  selectedCity,
  onSelectCity,
}) => {
  return (
    <section className="my-12 rounded-3xl bg-slate-900 text-white p-6 sm:p-10 relative overflow-hidden shadow-xl">
      {/* Background ambient accents */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 rounded-full bg-indigo-600/20 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />

      <div className="relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-semibold uppercase tracking-wider mb-3">
              <Sparkles className="h-3.5 w-3.5" />
              Chronological Architecture Timeline
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
              The Historic Cities of Delhi
            </h2>
            <p className="text-sm text-slate-300 max-w-2xl mt-1.5 leading-relaxed">
              Explore how Delhi migrated across the landscape over three millennia, leaving distinct architectural layers from ancient Indraprastha and Mehrauli to Shahjahanabad and New Delhi.
            </p>
          </div>

          {selectedCity && onSelectCity && (
            <button
              type="button"
              onClick={() => onSelectCity(null)}
              className="text-xs font-semibold text-indigo-300 hover:text-white bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-xl transition-colors shrink-0"
            >
              Reset City Filter
            </button>
          )}
        </div>

        {/* Timeline Horizontal Scrollable Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {HISTORIC_CITIES_OF_DELHI.map((city) => {
            const isSelected = selectedCity === city.name;
            return (
              <div
                key={city.number}
                onClick={() => onSelectCity && onSelectCity(isSelected ? null : city.name)}
                className={`group cursor-pointer rounded-2xl p-5 border transition-all duration-300 ${
                  isSelected
                    ? 'bg-indigo-600/30 border-indigo-400 ring-2 ring-indigo-400/50 shadow-lg'
                    : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20'
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-2.5">
                  <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-indigo-500/30 text-indigo-200 text-xs font-bold border border-indigo-400/30">
                    #{city.number}
                  </span>
                  <span className="inline-flex items-center gap-1 text-[11px] font-medium text-amber-300/90 bg-amber-400/10 px-2.5 py-0.5 rounded-full">
                    <Calendar className="h-3 w-3" />
                    {city.period}
                  </span>
                </div>

                <h3 className="text-base font-bold text-white group-hover:text-indigo-200 transition-colors mb-1.5 leading-snug">
                  {city.name}
                </h3>

                <p className="text-xs text-slate-300 line-clamp-1 mb-2">
                  <span className="text-slate-400">Founder:</span> {city.founder}
                </p>

                <div className="pt-2.5 border-t border-white/10 flex items-start gap-1.5 text-xs text-slate-300">
                  <MapPin className="h-3.5 w-3.5 text-indigo-400 shrink-0 mt-0.5" />
                  <span className="line-clamp-2 leading-relaxed">{city.highlights}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
