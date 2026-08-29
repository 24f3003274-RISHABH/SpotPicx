import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  TrendingUp,
  Flame,
  Coffee,
  Heart,
  Wrench,
  GraduationCap,
  Landmark,
  Sparkles,
  Mountain,
  BookOpen,
  Building,
  Compass,
  ShoppingBag,
  MapPin,
  UtensilsCrossed,
  ArrowRight,
  Wifi,
  Search,
} from 'lucide-react';
import { motion } from 'motion/react';
import { searchService } from '../../services/searchService';
import { PopularSearchItem, PopularSearchGroup } from '../../types';

interface PopularSearchesSectionProps {
  variant?: 'compact' | 'expanded';
  className?: string;
}

// Icon mapping helper
const getIconComponent = (iconName?: string) => {
  switch (iconName) {
    case 'Flame':
      return <Flame className="h-3.5 w-3.5 text-amber-500" />;
    case 'Coffee':
      return <Coffee className="h-3.5 w-3.5 text-amber-700" />;
    case 'Wifi':
      return <Wifi className="h-3.5 w-3.5 text-blue-500" />;
    case 'Heart':
      return <Heart className="h-3.5 w-3.5 text-rose-500" />;
    case 'Wrench':
      return <Wrench className="h-3.5 w-3.5 text-slate-600" />;
    case 'Home':
    case 'Building':
      return <Building className="h-3.5 w-3.5 text-indigo-500" />;
    case 'UtensilsCrossed':
      return <UtensilsCrossed className="h-3.5 w-3.5 text-emerald-600" />;
    case 'Landmark':
      return <Landmark className="h-3.5 w-3.5 text-amber-600" />;
    case 'Sparkles':
      return <Sparkles className="h-3.5 w-3.5 text-purple-500" />;
    case 'Mountain':
      return <Mountain className="h-3.5 w-3.5 text-teal-600" />;
    case 'BookOpen':
      return <BookOpen className="h-3.5 w-3.5 text-blue-600" />;
    case 'Compass':
      return <Compass className="h-3.5 w-3.5 text-indigo-600" />;
    case 'ShoppingBag':
      return <ShoppingBag className="h-3.5 w-3.5 text-pink-500" />;
    case 'MapPin':
      return <MapPin className="h-3.5 w-3.5 text-red-500" />;
    default:
      return <Search className="h-3.5 w-3.5 text-indigo-500" />;
  }
};

export const PopularSearchesSection: React.FC<PopularSearchesSectionProps> = ({
  variant = 'compact',
  className = '',
}) => {
  const navigate = useNavigate();
  const [popularSearches, setPopularSearches] = useState<PopularSearchItem[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<PopularSearchGroup>('ALL');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const fetchSearches = async () => {
      try {
        const items = await searchService.getPopularSearches();
        if (isMounted) {
          setPopularSearches(items);
          setLoading(false);
        }
      } catch (err) {
        console.error('Error fetching popular searches:', err);
        if (isMounted) setLoading(false);
      }
    };

    fetchSearches();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleSearchClick = (item: PopularSearchItem) => {
    // Fire click tracking
    searchService.trackPopularSearchClick(item.slug || item.id || item.title);

    // Build URLSearchParams
    const params = new URLSearchParams();
    if (item.query) params.set('q', item.query);
    if (item.category && item.category !== 'All') params.set('category', item.category);
    if (item.location && item.location !== 'All') params.set('locality', item.location);

    if (item.filters) {
      if (item.filters.priceMax) params.set('priceMax', String(item.filters.priceMax));
      if (item.filters.priceMin) params.set('priceMin', String(item.filters.priceMin));
      if (item.filters.priceRange) params.set('priceRange', item.filters.priceRange);
      if (item.filters.tags && item.filters.tags.length > 0) {
        params.set('tags', Array.isArray(item.filters.tags) ? item.filters.tags.join(',') : item.filters.tags);
      }
      if (item.filters.amenities && item.filters.amenities.length > 0) {
        params.set('amenities', Array.isArray(item.filters.amenities) ? item.filters.amenities.join(',') : item.filters.amenities);
      }
      if (item.filters.sort) params.set('sort', item.filters.sort);
    }

    navigate(`/search?${params.toString()}`);
  };

  // Fallback defaults if API is loading or empty
  const defaultItems: PopularSearchItem[] = [
    { id: '1', title: 'Best cafes', slug: 'best-cafes', query: 'best cafes', category: 'cafes-bakeries', icon: 'Coffee', group: 'FOOD' },
    { id: '2', title: 'Momos under 200', slug: 'momos-under-200', query: 'momos under 200', category: 'street-food', icon: 'Flame', badge: '₹200', group: 'FOOD' },
    { id: '3', title: 'Quiet cafes with WiFi', slug: 'quiet-cafes-wifi', query: 'quiet cafes with wifi', category: 'cafes-bakeries', icon: 'Wifi', group: 'STUDENTS' },
    { id: '4', title: 'Rooftop date places', slug: 'rooftop-date-places', query: 'rooftop date places', icon: 'Heart', group: 'EXPERIENCES' },
    { id: '5', title: 'Laptop repair', slug: 'laptop-repair', query: 'laptop repair', location: 'Nehru Place', icon: 'Wrench', group: 'SERVICES' },
    { id: '6', title: 'Student PGs', slug: 'student-pgs', query: 'student pgs', category: 'pgs-hostels', icon: 'Building', group: 'STUDENTS' },
    { id: '7', title: 'Delhi Heritage Places', slug: 'delhi-heritage', query: 'delhi heritage places', icon: 'Landmark', group: 'PLACES' },
    { id: '8', title: 'Places in Dehradun', slug: 'places-in-dehradun', query: 'places to visit in dehradun', icon: 'Mountain', group: 'TRAVEL' },
  ];

  const itemsToRender = popularSearches.length > 0 ? popularSearches : defaultItems;

  const filteredItems = selectedGroup === 'ALL'
    ? itemsToRender
    : itemsToRender.filter((item) => item.group === selectedGroup);

  // Compact Hero Strip Variant
  if (variant === 'compact') {
    return (
      <div className={`flex flex-wrap items-center justify-center gap-1.5 pt-1 text-xs text-slate-500 ${className}`}>
        <span className="font-semibold text-slate-700 flex items-center gap-1 text-[11px] uppercase tracking-wider">
          <TrendingUp className="h-3.5 w-3.5 text-indigo-600" /> Popular:
        </span>
        {itemsToRender.slice(0, 8).map((item) => (
          <button
            key={item.slug || item.id || item.title}
            type="button"
            onClick={() => handleSearchClick(item)}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white border border-slate-200 hover:border-indigo-300 hover:text-indigo-600 text-slate-700 shadow-2xs transition-all text-xs font-medium cursor-pointer group"
          >
            {getIconComponent(item.icon)}
            <span>{item.title}</span>
            {item.badge && (
              <span className="text-[10px] px-1 py-0.2 bg-indigo-50 text-indigo-600 rounded font-semibold border border-indigo-100 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                {item.badge}
              </span>
            )}
          </button>
        ))}
      </div>
    );
  }

  // Expanded Discovery Card Grid Variant
  const groups: Array<{ key: PopularSearchGroup; label: string }> = [
    { key: 'ALL', label: 'All Popular' },
    { key: 'FOOD', label: 'Food & Street Food' },
    { key: 'STUDENTS', label: 'Students & PGs' },
    { key: 'PLACES', label: 'Places & Heritage' },
    { key: 'SERVICES', label: 'Tech & Repairs' },
    { key: 'TRAVEL', label: 'Weekend & Travel' },
  ];

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Category Pills Header */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
            <TrendingUp className="h-4 w-4" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-base">Popular Searches & Curated Trails</h3>
            <p className="text-xs text-slate-500">Verified local shortcuts across Delhi NCR and India</p>
          </div>
        </div>

        {/* Group Filter Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
          {groups.map((grp) => (
            <button
              key={grp.key}
              type="button"
              onClick={() => setSelectedGroup(grp.key)}
              className={`px-3 py-1 text-xs font-medium rounded-full transition-all whitespace-nowrap cursor-pointer ${
                selectedGroup === grp.key
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {grp.label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Search Tiles */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2.5">
        {filteredItems.map((item, idx) => (
          <motion.button
            key={item.slug || item.id || idx}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.98 }}
            type="button"
            onClick={() => handleSearchClick(item)}
            className="flex flex-col text-left p-3 rounded-xl bg-white border border-slate-200/90 hover:border-indigo-400 hover:shadow-md transition-all group cursor-pointer"
          >
            <div className="flex items-center justify-between w-full mb-1.5">
              <div className="w-7 h-7 rounded-lg bg-slate-50 group-hover:bg-indigo-50 text-slate-700 group-hover:text-indigo-600 flex items-center justify-center transition-colors">
                {getIconComponent(item.icon)}
              </div>
              {item.badge && (
                <span className="text-[10px] px-1.5 py-0.5 bg-slate-100 group-hover:bg-indigo-100 text-slate-600 group-hover:text-indigo-700 rounded-full font-semibold">
                  {item.badge}
                </span>
              )}
            </div>

            <div className="font-semibold text-xs text-slate-900 group-hover:text-indigo-600 line-clamp-1 transition-colors">
              {item.title}
            </div>

            {item.description && (
              <div className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                {item.description}
              </div>
            )}

            <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400 group-hover:text-indigo-600">
              <span>{item.location || 'Explore spots'}</span>
              <ArrowRight className="h-3 w-3 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );
};
