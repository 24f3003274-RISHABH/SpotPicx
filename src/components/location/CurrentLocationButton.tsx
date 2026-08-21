import React from 'react';
import { Navigation, Loader2, MapPin, X } from 'lucide-react';
import { useGeolocation } from '../../hooks/useGeolocation';
import { MapCoordinate } from '../../services/map/types';

interface CurrentLocationButtonProps {
  onLocationAcquired?: (coords: MapCoordinate) => void;
  onLocationCleared?: () => void;
  onPermissionDenied?: () => void;
  className?: string;
  size?: 'sm' | 'md';
}

export const CurrentLocationButton: React.FC<CurrentLocationButtonProps> = ({
  onLocationAcquired,
  onLocationCleared,
  onPermissionDenied,
  className = '',
  size = 'md',
}) => {
  const { coordinates, status, localityLabel, requestLocation, clearLocation } = useGeolocation();

  const handleClick = async () => {
    if (coordinates) {
      clearLocation();
      onLocationCleared?.();
      return;
    }

    const coords = await requestLocation();
    if (coords) {
      onLocationAcquired?.(coords);
    } else {
      onPermissionDenied?.();
    }
  };

  const isGranted = status === 'granted' && coordinates;
  const isLoading = status === 'loading';

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isLoading}
      aria-label={isGranted ? 'Clear GPS location' : 'Use My Current Location'}
      className={`inline-flex items-center gap-2 rounded-xl font-bold transition-all cursor-pointer shadow-2xs ${
        size === 'sm' ? 'px-3 py-1.5 text-xs' : 'px-3.5 py-2 text-xs sm:text-sm'
      } ${
        isGranted
          ? 'bg-emerald-50 text-emerald-800 border border-emerald-300 hover:bg-emerald-100'
          : 'bg-white text-slate-700 border border-slate-200 hover:border-indigo-400 hover:text-indigo-600'
      } ${className}`}
    >
      {isLoading ? (
        <Loader2 className="h-4 w-4 animate-spin text-indigo-600" />
      ) : isGranted ? (
        <>
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-600" />
          </span>
          <span className="truncate max-w-[130px] sm:max-w-[180px]">{localityLabel || 'Near Me (GPS)'}</span>
          <X className="h-3.5 w-3.5 ml-0.5 text-emerald-600 hover:text-emerald-800" />
        </>
      ) : (
        <>
          <Navigation className="h-4 w-4 text-indigo-600 shrink-0" />
          <span>Use My Location</span>
        </>
      )}
    </button>
  );
};
