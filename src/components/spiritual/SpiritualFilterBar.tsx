import React from 'react';
import { Search, Filter, Compass, MapPin } from 'lucide-react';
import { SpiritualTradition } from '../../types/spiritual.types';
import { SPIRITUAL_STATES } from '../../data/spiritual/spiritualStatesData';

export const ALL_TRADITIONS: SpiritualTradition[] = [
  'Hindu',
  'Buddhist',
  'Jain',
  'Sikh',
  'Muslim',
  'Christian',
  'Zoroastrian',
  'Bahá\'í',
  'Jewish',
];

interface SpiritualFilterBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedTradition: string;
  onTraditionChange: (tradition: string) => void;
  selectedState: string;
  onStateChange: (state: string) => void;
  selectedSpecialFilter: string;
  onSpecialFilterChange: (filter: string) => void;
  totalCount: number;
}

export const SpiritualFilterBar: React.FC<SpiritualFilterBarProps> = ({
  searchQuery,
  onSearchChange,
  selectedTradition,
  onTraditionChange,
  selectedState,
  onStateChange,
  selectedSpecialFilter,
  onSpecialFilterChange,
  totalCount,
}) => {
  return (
    <div className="space-y-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 p-4 sm:p-6 backdrop-blur-md shadow-sm">
      {/* Top row: Search input + State dropdown + Special views */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
        {/* Search input */}
        <div className="relative sm:col-span-6">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search by temple, dargah, church, town, tradition..."
            className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 pl-10 pr-4 py-2.5 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20 transition-all"
          />
        </div>

        {/* State select */}
        <div className="relative sm:col-span-3">
          <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
          <select
            value={selectedState}
            onChange={(e) => onStateChange(e.target.value)}
            className="w-full appearance-none rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 pl-10 pr-8 py-2.5 text-sm text-slate-900 dark:text-white focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20 transition-all cursor-pointer"
          >
            <option value="all">All States & UTs (India)</option>
            {SPIRITUAL_STATES.map((st) => (
              <option key={st.stateSlug} value={st.stateSlug}>
                {st.stateName}
              </option>
            ))}
          </select>
        </div>

        {/* Special Filter (Pilgrimages / Weekend trips / Temple Towns) */}
        <div className="relative sm:col-span-3">
          <Compass className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
          <select
            value={selectedSpecialFilter}
            onChange={(e) => onSpecialFilterChange(e.target.value)}
            className="w-full appearance-none rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 pl-10 pr-8 py-2.5 text-sm text-slate-900 dark:text-white focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20 transition-all cursor-pointer"
          >
            <option value="all">All Categories</option>
            <option value="top-pilgrimage">Major Pilgrimage Sites</option>
            <option value="temple-town">Famous Temple Towns</option>
            <option value="weekend-delhi">Weekend Trips from Delhi</option>
          </select>
        </div>
      </div>

      {/* Tradition Badges Pills */}
      <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80">
        <div className="flex items-center gap-2 mb-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
          <Filter className="h-3.5 w-3.5" />
          <span>Traditions & Faiths</span>
        </div>
        <div className="flex flex-wrap gap-1.5 sm:gap-2">
          <button
            type="button"
            onClick={() => onTraditionChange('all')}
            className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
              selectedTradition === 'all'
                ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-sm'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            All Faiths ({totalCount})
          </button>

          {ALL_TRADITIONS.map((tr) => (
            <button
              key={tr}
              type="button"
              onClick={() => onTraditionChange(tr)}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
                selectedTradition === tr
                  ? 'bg-amber-600 text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {tr}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
