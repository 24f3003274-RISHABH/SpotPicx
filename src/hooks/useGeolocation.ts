import { useState, useEffect, useCallback } from 'react';
import { MapCoordinate } from '../services/map/types';
import { POPULAR_DELHI_LOCALITIES } from '../constants/locations';
import { mapService } from '../services/map';

export type GeolocationStatus = 'idle' | 'prompt' | 'loading' | 'granted' | 'denied' | 'unavailable';

export interface GeolocationState {
  coordinates: MapCoordinate | null;
  status: GeolocationStatus;
  error: string | null;
  localityLabel: string | null;
  isNearDelhi: boolean;
  requestLocation: () => Promise<MapCoordinate | null>;
  clearLocation: () => void;
}

const STORAGE_KEY = 'spotpicks_user_geo';

export const useGeolocation = (): GeolocationState => {
  const [coordinates, setCoordinates] = useState<MapCoordinate | null>(() => {
    try {
      const saved = sessionStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [status, setStatus] = useState<GeolocationStatus>(() => (coordinates ? 'granted' : 'idle'));
  const [error, setError] = useState<string | null>(null);

  // Check closest known Delhi locality for privacy-first label
  const getClosestLocality = (coord: MapCoordinate): string => {
    let closest = POPULAR_DELHI_LOCALITIES[0];
    let minDistance = Infinity;

    for (const loc of POPULAR_DELHI_LOCALITIES) {
      const dist = mapService.calculateDistanceKm(coord, { lat: loc.latitude, lng: loc.longitude });
      if (dist < minDistance) {
        minDistance = dist;
        closest = loc;
      }
    }

    if (minDistance < 6) {
      return `${closest.name} Vicinity`;
    }
    if (minDistance < 35) {
      return 'Delhi NCR Region';
    }
    return 'Your Approximate Location';
  };

  const isNearDelhi = coordinates
    ? mapService.calculateDistanceKm(coordinates, { lat: 28.6139, lng: 77.2090 }) < 70
    : false;

  const localityLabel = coordinates ? getClosestLocality(coordinates) : null;

  const requestLocation = useCallback(async (): Promise<MapCoordinate | null> => {
    if (!navigator.geolocation) {
      setStatus('unavailable');
      setError('Geolocation is not supported by your browser.');
      return null;
    }

    setStatus('loading');
    setError(null);

    return new Promise((resolve) => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const newCoord: MapCoordinate = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setCoordinates(newCoord);
          setStatus('granted');
          try {
            sessionStorage.setItem(STORAGE_KEY, JSON.stringify(newCoord));
          } catch {}
          resolve(newCoord);
        },
        (err) => {
          console.warn('Geolocation access denied or timed out:', err.message);
          setStatus(err.code === err.PERMISSION_DENIED ? 'denied' : 'unavailable');
          setError(
            err.code === err.PERMISSION_DENIED
              ? 'Location permission was denied. You can select a neighborhood manually.'
              : 'Unable to acquire precise GPS coordinates.'
          );
          resolve(null);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 60000,
        }
      );
    });
  }, []);

  const clearLocation = useCallback(() => {
    setCoordinates(null);
    setStatus('idle');
    setError(null);
    try {
      sessionStorage.removeItem(STORAGE_KEY);
    } catch {}
  }, []);

  return {
    coordinates,
    status,
    error,
    localityLabel,
    isNearDelhi,
    requestLocation,
    clearLocation,
  };
};
