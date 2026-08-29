import React from 'react';
import {
  Search,
  Filter,
  SlidersHorizontal,
  X,
  Compass,
  Train,
  Car,
  CloudRain,
  Snowflake,
  Sun,
  MapPin,
} from 'lucide-react';
import {
  DistanceBracket,
  TripDuration,
  BudgetLevel,
  DestinationCategory,
  TravellerType,
  StateRegion,
} from '../../types/weekendGetaways.types';
import { DISTANCE_BRACKETS, GETAWAY_CATEGORIES, STATES_LIST } from '../../data/getaways/allWeekendGetaways';

interface GetawayFilterBarProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  selectedDistance: DistanceBracket | 'all';
  onDistanceChange: (d: DistanceBracket | 'all') => void;
  selectedCategory: DestinationCategory | 'all';
  onCategoryChange: (c: DestinationCategory | 'all') => void;
  selectedDuration: TripDuration | 'all';
  onDurationChange: (dur: TripDuration | 'all') => void;
  selectedBudget: BudgetLevel | 'all';
  onBudgetChange: (b: BudgetLevel | 'all') => void;
  selectedTravellerType: TravellerType | 'all';
  onTravellerTypeChange: (t: TravellerType | 'all') => void;
  selectedState: StateRegion | 'all';
  onStateChange: (s: StateRegion | 'all') => void;
  selectedSeasonSpecial: 'all' | 'monsoon' | 'winter' | 'summer';
  onSeasonSpecialChange: (s: 'all' | 'monsoon' | 'winter' | 'summer') => void;
  selectedTransitType: 'all' | 'train' | 'road';
  onTransitTypeChange: (t: 'all' | 'train' | 'road') => void;
  onResetFilters: () => void;
  totalResults: number;
}

export const GetawayFilterBar: React.FC<GetawayFilterBarProps> = ({
  searchQuery,
  onSearchChange,
  selectedDistance,
  onDistanceChange,
  selectedCategory,
  onCategoryChange,
  selectedDuration,
  onDurationChange,
  selectedBudget,
  onBudgetChange,
  selectedTravellerType,
  onTravellerTypeChange,
  selectedState,
  onStateChange,
  selectedSeasonSpecial,
  onSeasonSpecialChange,
  selectedTransitType,
  onTransitTypeChange,
  onResetFilters,
  totalResults,
}) => {
  const hasActiveFilters =
    searchQuery !== '' ||
    selectedDistance !== 'all' ||
    selectedCategory !== 'all' ||
    selectedDuration !== 'all' ||
    selectedBudget !== 'all' ||
    selectedTravellerType !== 'all' ||
    selectedState !== 'all' ||
    selectedSeasonSpecial !== 'all' ||
    selectedTransitType !== 'all';

  return (
    <div className="space-y-4">
      {/* Primary Search and Quick Filters */}
      <div className="flex flex-col md:flex-row gap-3">
        {/* Search Bar */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search by destination name, activities, state, or keywords (e.g. Rafting, Tigers, Forts)..."
            className="w-full rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 pl-10 pr-10 py-3 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 shadow-sm"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* State Selector */}
        <div className="w-full md:w-56">
          <select
            value={selectedState}
            onChange={(e) => onStateChange(e.target.value as StateRegion | 'all')}
            className="w-full rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3.5 py-3 text-xs font-semibold text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500 shadow-sm"
          >
            <option value="all">All States & Regions</option>
            {STATES_LIST.map((st) => (
              <option key={st} value={st}>
                {st}
              </option>
            ))}
          </select>
        </div>

        {/* Reset Filter Button if active */}
        {hasActiveFilters && (
          <button
            onClick={onResetFilters}
            className="inline-flex items-center justify-center gap-1.5 rounded-2xl border border-rose-200 dark:border-rose-900/50 bg-rose-50 dark:bg-rose-950/30 px-4 py-3 text-xs font-bold text-rose-600 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-900/50 transition-colors shadow-sm"
          >
            <X className="h-4 w-4" />
            <span>Reset</span>
          </button>
        )}
      </div>

      {/* Distance Segmented Chips */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            Distance from Delhi
          </span>
          <span className="text-xs text-sky-600 dark:text-sky-400 font-semibold">
            {totalResults} Destination{totalResults === 1 ? '' : 's'} Matched
          </span>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => onDistanceChange('all')}
            className={`rounded-xl px-3.5 py-2 text-xs font-bold transition-all ${
              selectedDistance === 'all'
                ? 'bg-sky-600 text-white shadow-sm ring-2 ring-sky-500/30'
                : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-sky-500/40'
            }`}
          >
            All Distances
          </button>
          {DISTANCE_BRACKETS.map((d) => (
            <button
              key={d.id}
              type="button"
              onClick={() => onDistanceChange(d.id)}
              className={`rounded-xl px-3.5 py-2 text-xs font-bold transition-all ${
                selectedDistance === d.id
                  ? 'bg-sky-600 text-white shadow-sm ring-2 ring-sky-500/30'
                  : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-sky-500/40'
              }`}
            >
              {d.label}
            </button>
          ))}
        </div>
      </div>

      {/* Vibe / Theme Categories */}
      <div className="space-y-1.5">
        <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
          Experience & Vibe
        </span>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => onCategoryChange('all')}
            className={`rounded-xl px-3 py-1.5 text-xs font-semibold transition-all ${
              selectedCategory === 'all'
                ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-sm'
                : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:border-slate-400'
            }`}
          >
            All Vibes
          </button>
          {GETAWAY_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => onCategoryChange(cat.id)}
              className={`rounded-xl px-3 py-1.5 text-xs font-semibold transition-all ${
                selectedCategory === cat.id
                  ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-sm'
                  : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:border-slate-400'
              }`}
            >
              {cat.name} ({cat.count})
            </button>
          ))}
        </div>
      </div>

      {/* Secondary Fast Filters: Duration, Budget, Transit, Seasonal */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-2 border-t border-slate-100 dark:border-slate-800">
        {/* Duration */}
        <div>
          <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
            Trip Duration
          </label>
          <select
            value={selectedDuration}
            onChange={(e) => onDurationChange(e.target.value as TripDuration | 'all')}
            className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-2.5 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-1 focus:ring-sky-500"
          >
            <option value="all">Any Duration</option>
            <option value="1 Day (Day Trip)">1 Day (Day Trip)</option>
            <option value="2 Days / 1 Night">2 Days / 1 Night</option>
            <option value="3 Days / 2 Nights">3 Days / 2 Nights</option>
          </select>
        </div>

        {/* Budget */}
        <div>
          <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
            Budget Tier
          </label>
          <select
            value={selectedBudget}
            onChange={(e) => onBudgetChange(e.target.value as BudgetLevel | 'all')}
            className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-2.5 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-1 focus:ring-sky-500"
          >
            <option value="all">Any Budget</option>
            <option value="Budget">Budget Friendly (₹)</option>
            <option value="Moderate">Moderate (₹₹)</option>
            <option value="Luxury / Heritage">Luxury / Heritage (₹₹₹)</option>
          </select>
        </div>

        {/* Transit Mode */}
        <div>
          <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
            Transport
          </label>
          <select
            value={selectedTransitType}
            onChange={(e) => onTransitTypeChange(e.target.value as 'all' | 'train' | 'road')}
            className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-2.5 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-1 focus:ring-sky-500"
          >
            <option value="all">Any Transport</option>
            <option value="train">Train-Friendly (Vande Bharat/Express)</option>
            <option value="road">Direct Road Trips</option>
          </select>
        </div>

        {/* Seasonal Favorites */}
        <div>
          <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
            Seasonal Specials
          </label>
          <select
            value={selectedSeasonSpecial}
            onChange={(e) => onSeasonSpecialChange(e.target.value as 'all' | 'monsoon' | 'winter' | 'summer')}
            className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-2.5 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-1 focus:ring-sky-500"
          >
            <option value="all">All Seasons</option>
            <option value="winter">Winter Escapes (Oct-Mar)</option>
            <option value="monsoon">Monsoon Green Getaways</option>
            <option value="summer">Summer Hill Escapes</option>
          </select>
        </div>
      </div>
    </div>
  );
};
