import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  MapPin,
  Compass,
  ArrowRight,
  TrendingUp,
  Store,
  X,
  Sparkles,
} from 'lucide-react';
import { useSearchSuggestions } from '../../hooks/useSearch';

interface SearchAutocompleteProps {
  initialValue?: string;
  placeholder?: string;
  onSearch?: (query: string) => void;
  className?: string;
  autoFocus?: boolean;
}

export const SearchAutocomplete: React.FC<SearchAutocompleteProps> = ({
  initialValue = '',
  placeholder = 'Search "best cafes", "momos under 200", "laptop repair near JNU"...',
  onSearch,
  className = '',
  autoFocus = false,
}) => {
  const navigate = useNavigate();
  const [query, setQuery] = useState(initialValue);
  const [debouncedQuery, setDebouncedQuery] = useState(initialValue);
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Debounce query state by 200ms
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(query);
    }, 200);
    return () => clearTimeout(handler);
  }, [query]);

  // Synchronize when initialValue changes externally
  useEffect(() => {
    setQuery(initialValue);
  }, [initialValue]);

  // Fetch suggestions
  const { data: suggestions, isLoading } = useSearchSuggestions(debouncedQuery, isOpen);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      setIsOpen(false);
      if (onSearch) {
        onSearch(query.trim());
      } else {
        navigate(`/search?q=${encodeURIComponent(query.trim())}`);
      }
    }
  };

  const handleSelectSuggestion = (searchString: string) => {
    setQuery(searchString);
    setIsOpen(false);
    if (onSearch) {
      onSearch(searchString);
    } else {
      navigate(`/search?q=${encodeURIComponent(searchString)}`);
    }
  };

  const handleSelectBusiness = (slug: string) => {
    setIsOpen(false);
    navigate(`/business/${slug}`);
  };

  const handleSelectCategory = (slug: string) => {
    setIsOpen(false);
    navigate(`/category/${slug}`);
  };

  const handleSelectLocation = (slug: string) => {
    setIsOpen(false);
    navigate(`/location/${slug}`);
  };

  const hasSuggestions =
    suggestions &&
    (suggestions.businesses.length > 0 ||
      suggestions.categories.length > 0 ||
      suggestions.locations.length > 0 ||
      suggestions.popularSearches.length > 0);

  return (
    <div ref={containerRef} className={`relative w-full ${className}`}>
      <form onSubmit={handleSubmit} className="relative flex items-center">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
          <Search className="h-5 w-5 text-indigo-500" />
        </div>

        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          placeholder={placeholder}
          autoFocus={autoFocus}
          className="w-full h-12 md:h-14 pl-12 pr-28 rounded-2xl bg-white border border-slate-200 shadow-sm text-sm md:text-base text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/15 transition-all"
        />

        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
          {query && (
            <button
              type="button"
              onClick={() => {
                setQuery('');
                setDebouncedQuery('');
              }}
              className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>
          )}

          <button
            type="submit"
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs md:text-sm font-semibold rounded-xl transition-colors flex items-center gap-1.5 shadow-sm cursor-pointer"
          >
            <span>Search</span>
            <ArrowRight className="h-3.5 w-3.5 hidden sm:inline" />
          </button>
        </div>
      </form>

      {/* Auto-complete Suggestions Dropdown */}
      {isOpen && hasSuggestions && (
        <div className="absolute left-0 right-0 top-full mt-2 bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-150 max-h-[420px] overflow-y-auto">
          {/* Quick Popular / Curated Phrases */}
          {suggestions.popularSearches && suggestions.popularSearches.length > 0 && (
            <div className="p-3 border-b border-slate-100 bg-slate-50/50">
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2 px-2 flex items-center gap-1.5">
                <TrendingUp className="h-3.5 w-3.5 text-indigo-500" />
                <span>Trending Searches</span>
              </div>
              <div className="flex flex-wrap gap-1.5 px-1">
                {suggestions.popularSearches.map((item, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSelectSuggestion(item)}
                    className="text-xs px-2.5 py-1 bg-white hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-200 text-slate-700 font-medium rounded-lg border border-slate-200/80 transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <Search className="h-3 w-3 text-slate-400" />
                    <span>{item}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="p-2 divide-y divide-slate-100">
            {/* Matching Businesses */}
            {suggestions.businesses.length > 0 && (
              <div className="py-1">
                <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-3 py-1 flex items-center gap-1.5">
                  <Store className="h-3.5 w-3.5 text-indigo-500" />
                  <span>Matching Spots</span>
                </div>
                {suggestions.businesses.map((biz, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSelectBusiness(biz.slug)}
                    className="w-full text-left px-3 py-2 rounded-xl hover:bg-slate-50 flex items-center justify-between group transition-colors cursor-pointer"
                  >
                    <div>
                      <div className="text-xs font-bold text-slate-900 group-hover:text-indigo-600">
                        {biz.name}
                      </div>
                      <div className="text-[11px] text-slate-400 flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        <span>{biz.locality}</span>
                        {biz.categoryName && (
                          <>
                            <span>•</span>
                            <span className="text-indigo-600">{biz.categoryName}</span>
                          </>
                        )}
                      </div>
                    </div>
                    <ArrowRight className="h-3.5 w-3.5 text-slate-300 group-hover:text-indigo-600 -translate-x-1 group-hover:translate-x-0 transition-transform" />
                  </button>
                ))}
              </div>
            )}

            {/* Matching Categories */}
            {suggestions.categories.length > 0 && (
              <div className="py-1">
                <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-3 py-1 flex items-center gap-1.5">
                  <Compass className="h-3.5 w-3.5 text-indigo-500" />
                  <span>Categories</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 px-1">
                  {suggestions.categories.map((cat, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleSelectCategory(cat.slug)}
                      className="text-left px-2.5 py-1.5 rounded-lg hover:bg-indigo-50/80 text-xs font-semibold text-slate-700 hover:text-indigo-700 flex items-center gap-2 transition-colors cursor-pointer"
                    >
                      <span className="text-sm">{cat.icon || '🏷️'}</span>
                      <span>{cat.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Matching Localities */}
            {suggestions.locations.length > 0 && (
              <div className="py-1">
                <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-3 py-1 flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5 text-indigo-500" />
                  <span>Hubs & Localities</span>
                </div>
                <div className="flex flex-wrap gap-1.5 px-2 py-1">
                  {suggestions.locations.map((loc, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleSelectLocation(loc.slug)}
                      className="text-xs px-2.5 py-1 bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 text-slate-700 font-medium rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      <MapPin className="h-3 w-3 text-indigo-500" />
                      <span>{loc.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
