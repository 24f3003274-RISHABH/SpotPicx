import React from 'react';
import { Navigation } from 'lucide-react';
import { mapService } from '../../services/map';

interface DistanceBadgeProps {
  distanceKm?: number | null;
  className?: string;
  size?: 'sm' | 'md';
  variant?: 'subtle' | 'solid' | 'pill';
}

export const DistanceBadge: React.FC<DistanceBadgeProps> = ({
  distanceKm,
  className = '',
  size = 'sm',
  variant = 'subtle',
}) => {
  const formatted = mapService.formatDistance(distanceKm);
  if (!formatted) return null;

  const sizeStyles = {
    sm: 'text-[11px] px-2 py-0.5 gap-1',
    md: 'text-xs px-2.5 py-1 gap-1.5',
  };

  const variantStyles = {
    subtle: 'bg-indigo-50 text-indigo-700 border border-indigo-200/70',
    solid: 'bg-slate-900 text-white shadow-2xs',
    pill: 'bg-white/90 backdrop-blur-xs text-slate-800 border border-slate-200 shadow-xs font-semibold',
  };

  return (
    <span
      className={`inline-flex items-center font-bold rounded-lg tracking-tight transition-colors ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
      title={`${formatted} away from current location`}
      aria-label={`Distance: ${formatted}`}
    >
      <Navigation className={size === 'sm' ? 'h-3 w-3 shrink-0' : 'h-3.5 w-3.5 shrink-0'} />
      <span>{formatted}</span>
    </span>
  );
};
