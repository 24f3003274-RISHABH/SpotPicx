import React from 'react';
import {
  Utensils,
  Coffee,
  Landmark,
  ShoppingBag,
  Hotel,
  Wine,
  Wrench,
  Sparkles,
  MapPin,
  Star,
} from 'lucide-react';
import { Business } from '../../types';

interface MapMarkerProps {
  business: Business;
  isSelected?: boolean;
  isHovered?: boolean;
  onClick?: (business: Business) => void;
  onMouseEnter?: (business: Business) => void;
  onMouseLeave?: () => void;
}

const getCategoryIcon = (category: any) => {
  const catSlug = typeof category === 'object' && category !== null ? category.slug : String(category || '');
  if (catSlug.includes('food') || catSlug.includes('rest')) return Utensils;
  if (catSlug.includes('cafe')) return Coffee;
  if (catSlug.includes('heritage') || catSlug.includes('place')) return Landmark;
  if (catSlug.includes('shop')) return ShoppingBag;
  if (catSlug.includes('hotel') || catSlug.includes('pg')) return Hotel;
  if (catSlug.includes('night') || catSlug.includes('bar')) return Wine;
  if (catSlug.includes('repair') || catSlug.includes('service')) return Wrench;
  return Sparkles;
};

export const MapMarker: React.FC<MapMarkerProps> = ({
  business,
  isSelected = false,
  isHovered = false,
  onClick,
  onMouseEnter,
  onMouseLeave,
}) => {
  const Icon = getCategoryIcon(business.category);

  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        onClick?.(business);
      }}
      onMouseEnter={() => onMouseEnter?.(business)}
      onMouseLeave={() => onMouseLeave?.()}
      aria-label={`Marker for ${business.name}, rating ${business.rating}`}
      className={`group relative flex items-center justify-center transition-all duration-300 transform -translate-x-1/2 -translate-y-full cursor-pointer focus:outline-none ${
        isSelected ? 'z-30 scale-125' : isHovered ? 'z-20 scale-110' : 'z-10 hover:scale-110'
      }`}
    >
      {/* Pin Body */}
      <div
        className={`relative flex items-center gap-1 px-2 py-1 rounded-full shadow-lg border transition-all ${
          isSelected
            ? 'bg-indigo-600 border-white text-white ring-4 ring-indigo-300/80'
            : isHovered
            ? 'bg-slate-900 border-indigo-400 text-white shadow-xl'
            : 'bg-white border-slate-300 text-slate-800 hover:border-indigo-500'
        }`}
      >
        <div
          className={`w-5 h-5 rounded-full flex items-center justify-center ${
            isSelected ? 'bg-white/20' : 'bg-indigo-50 text-indigo-600'
          }`}
        >
          <Icon className="h-3 w-3" />
        </div>

        <div className="flex items-center gap-0.5 text-[11px] font-extrabold pr-0.5">
          <Star className={`h-2.5 w-2.5 ${isSelected ? 'fill-amber-300 text-amber-300' : 'fill-amber-400 text-amber-400'}`} />
          <span>{business.rating ? business.rating.toFixed(1) : '4.5'}</span>
        </div>

        {/* Pin Needle pointer */}
        <div
          className={`absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-2.5 h-2.5 rotate-45 border-r border-b ${
            isSelected
              ? 'bg-indigo-600 border-white'
              : isHovered
              ? 'bg-slate-900 border-indigo-400'
              : 'bg-white border-slate-300'
          }`}
        />
      </div>

      {/* Hover tooltip label */}
      {(isHovered || isSelected) && (
        <div className="absolute -top-7 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-md bg-slate-950/90 text-white text-[10px] font-bold whitespace-nowrap pointer-events-none shadow-md backdrop-blur-xs">
          {business.name}
        </div>
      )}
    </button>
  );
};
