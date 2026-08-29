import React from 'react';
import { X, MapPin, Navigation, Car, Train, ExternalLink, ArrowUpRight } from 'lucide-react';
import { WeekendGetawayPlace } from '../../types/weekendGetaways.types';

interface GetawayMapModalProps {
  place: WeekendGetawayPlace | null;
  onClose: () => void;
}

export const GetawayMapModal: React.FC<GetawayMapModalProps> = ({ place, onClose }) => {
  if (!place) return null;

  const googleMapsUrl = `https://www.google.com/maps/dir/Delhi,+India/${encodeURIComponent(
    place.name + ', ' + place.state
  )}/@${place.coordinates.lat},${place.coordinates.lng},10z`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="rounded-xl bg-sky-500/10 p-2 text-sky-600 dark:text-sky-400">
              <MapPin className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                {place.name}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {place.districtOrRegion}, {place.state} • {place.distanceKm} km from Delhi
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-2 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 space-y-4 text-xs sm:text-sm">
          {/* Coordinates Box */}
          <div className="flex items-center justify-between rounded-xl bg-slate-50 dark:bg-slate-800/60 p-3 text-xs">
            <span className="font-semibold text-slate-600 dark:text-slate-300">
              GPS Coordinates:
            </span>
            <code className="font-mono text-sky-600 dark:text-sky-400 font-bold">
              {place.coordinates.lat.toFixed(4)}° N, {place.coordinates.lng.toFixed(4)}° E
            </code>
          </div>

          {/* Highway Route */}
          <div className="space-y-1.5 rounded-2xl border border-slate-100 dark:border-slate-800 p-3.5">
            <div className="flex items-center gap-1.5 font-bold text-slate-900 dark:text-white text-xs uppercase tracking-wider">
              <Car className="h-4 w-4 text-emerald-500" />
              <span>Recommended Highway Route</span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-mono">
              {place.highwayRoute}
            </p>
            <div className="text-[11px] text-slate-500 pt-1">
              <strong>Road Note:</strong> {place.roadConditionNote}
            </div>
          </div>

          {/* Nearest Railway */}
          <div className="space-y-1.5 rounded-2xl border border-slate-100 dark:border-slate-800 p-3.5">
            <div className="flex items-center gap-1.5 font-bold text-slate-900 dark:text-white text-xs uppercase tracking-wider">
              <Train className="h-4 w-4 text-purple-500" />
              <span>Rail Transit Connectivity</span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300">
              <strong>Nearest Station:</strong> {place.nearestTrainStation}
            </p>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-5 bg-slate-50 dark:bg-slate-800/40 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            Close
          </button>
          <a
            href={googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-xs font-bold text-white shadow-md transition-colors"
          >
            <span>Open Directions in Google Maps</span>
            <ExternalLink className="h-4 w-4" />
          </a>
        </div>
      </div>
    </div>
  );
};
