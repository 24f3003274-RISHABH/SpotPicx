import React, { useState } from 'react';
import { MapPin, Search, X, Check, ChevronDown, Compass } from 'lucide-react';
import { POPULAR_DELHI_LOCALITIES } from '../../constants/locations';
import { LocationItem } from '../../types';

interface LocationSelectorProps {
  selectedLocality?: string;
  selectedRadiusKm?: number;
  onSelectLocality: (localityName: string, locality?: any) => void;
  onSelectRadius?: (radiusKm: number) => void;
  onClear?: () => void;
  className?: string;
  showRadius?: boolean;
}

export const LocationSelector: React.FC<LocationSelectorProps> = ({
  selectedLocality = '',
  selectedRadiusKm = 10,
  onSelectLocality,
  onSelectRadius,
  onClear,
  className = '',
  showRadius = true,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredLocalities = POPULAR_DELHI_LOCALITIES.filter((loc) =>
    loc.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const radiusOptions = [
    { value: 2, label: 'Within 2 km (Walking)' },
    { value: 5, label: 'Within 5 km (Short Drive)' },
    { value: 10, label: 'Within 10 km (Neighborhood)' },
    { value: 25, label: 'Within 25 km (Delhi NCR)' },
  ];

  return (
    <div className={`relative ${className}`}>
      {/* Trigger Button */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          aria-expanded={isOpen}
          className={`flex items-center justify-between gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all border shadow-2xs cursor-pointer ${
            selectedLocality
              ? 'bg-indigo-50 border-indigo-300 text-indigo-900'
              : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center gap-1.5 truncate">
            <MapPin className={`h-4 w-4 shrink-0 ${selectedLocality ? 'text-indigo-600' : 'text-slate-400'}`} />
            <span className="truncate">{selectedLocality || 'Select Delhi Locality'}</span>
          </div>
          <ChevronDown className={`h-3.5 w-3.5 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>

        {selectedLocality && onClear && (
          <button
            type="button"
            onClick={onClear}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer"
            title="Clear locality filter"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Dropdown Popover */}
      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-30"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute top-full left-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl border border-slate-200 shadow-2xl p-4 z-40 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <span className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1">
                <Compass className="h-3.5 w-3.5 text-indigo-600" />
                <span>Delhi NCR Localities</span>
              </span>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="text-slate-400 hover:text-slate-700"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Search Input */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search neighborhood (e.g. CP, Hauz Khas)..."
                className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
                autoFocus
              />
            </div>

            {/* Quick chips list */}
            <div className="max-h-48 overflow-y-auto space-y-1 pr-1">
              <button
                type="button"
                onClick={() => {
                  onSelectLocality('');
                  setIsOpen(false);
                }}
                className={`w-full flex items-center justify-between p-2 rounded-xl text-xs font-medium transition-colors text-left cursor-pointer ${
                  !selectedLocality ? 'bg-indigo-50 text-indigo-900 font-bold' : 'hover:bg-slate-50 text-slate-700'
                }`}
              >
                <span>All Delhi NCR</span>
                {!selectedLocality && <Check className="h-3.5 w-3.5 text-indigo-600" />}
              </button>

              {filteredLocalities.map((loc) => {
                const isSelected = selectedLocality.toLowerCase() === loc.name.toLowerCase();
                return (
                  <button
                    key={loc.id}
                    type="button"
                    onClick={() => {
                      onSelectLocality(loc.name, loc);
                      setIsOpen(false);
                    }}
                    className={`w-full flex items-center justify-between p-2 rounded-xl text-xs font-medium transition-colors text-left cursor-pointer ${
                      isSelected ? 'bg-indigo-50 text-indigo-900 font-bold' : 'hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <div>
                      <div>{loc.name}</div>
                      <div className="text-[10px] text-slate-400">{loc.city}</div>
                    </div>
                    {isSelected && <Check className="h-3.5 w-3.5 text-indigo-600" />}
                  </button>
                );
              })}
            </div>

            {/* Radius selector */}
            {showRadius && onSelectRadius && (
              <div className="pt-3 border-t border-slate-100 space-y-2">
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
                  Search Radius:
                </label>
                <div className="grid grid-cols-2 gap-1.5">
                  {radiusOptions.map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => onSelectRadius(opt.value)}
                      className={`px-2.5 py-1.5 rounded-lg text-[11px] font-semibold transition-colors cursor-pointer text-left ${
                        selectedRadiusKm === opt.value
                          ? 'bg-indigo-600 text-white shadow-2xs'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};
