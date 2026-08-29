import React from 'react';
import {
  X,
  MapPin,
  Train,
  ExternalLink,
  Navigation,
  Copy,
  Check,
  ShieldCheck,
} from 'lucide-react';
import { DelhiHeritagePlace } from '../../types/delhiHeritage.types';

interface HeritageMapModalProps {
  place: DelhiHeritagePlace | null;
  onClose: () => void;
}

export const HeritageMapModal: React.FC<HeritageMapModalProps> = ({ place, onClose }) => {
  const [copied, setCopied] = React.useState(false);

  if (!place) return null;

  const { lat, lng } = place.location.coordinates;
  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;

  const copyCoordinates = () => {
    navigator.clipboard.writeText(`${lat}, ${lng}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
      <div
        className="relative w-full max-w-lg overflow-hidden rounded-3xl bg-white shadow-2xl border border-slate-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-3 p-6 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-indigo-600 mb-1">
              <ShieldCheck className="h-4 w-4 text-emerald-600" />
              <span>Verified Geolocation & Transit</span>
            </div>
            <h3 className="text-xl font-bold text-slate-900 leading-tight">{place.name}</h3>
            <p className="text-xs text-slate-500 mt-0.5">{place.location.locality}, {place.location.zone}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body Info */}
        <div className="p-6 space-y-4">
          {/* Address Box */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
            <div className="flex items-start gap-3">
              <MapPin className="h-5 w-5 text-rose-500 shrink-0 mt-0.5" />
              <div>
                <div className="text-xs font-semibold text-slate-800">Official Monument Address</div>
                <p className="text-xs text-slate-600 leading-relaxed mt-0.5">{place.location.address}</p>
              </div>
            </div>
          </div>

          {/* Metro Connectivity */}
          <div className="p-4 rounded-2xl bg-indigo-50/70 border border-indigo-100">
            <div className="flex items-start gap-3">
              <Train className="h-5 w-5 text-indigo-600 shrink-0 mt-0.5" />
              <div>
                <div className="text-xs font-semibold text-indigo-950">Nearest Delhi Metro Station</div>
                <p className="text-xs text-indigo-900 font-medium mt-0.5">
                  {place.location.nearestMetro} ({place.location.metroLine})
                </p>
                <p className="text-xs text-indigo-700 mt-1">{place.location.distanceFromMetro}</p>
              </div>
            </div>
          </div>

          {/* Coordinates */}
          <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-100/80 text-xs text-slate-700">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-900">GPS Coordinates:</span>
              <code className="bg-white px-2 py-0.5 rounded border border-slate-200 font-mono text-slate-800">
                {lat.toFixed(4)}° N, {lng.toFixed(4)}° E
              </code>
            </div>
            <button
              type="button"
              onClick={copyCoordinates}
              className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-700"
            >
              {copied ? (
                <>
                  <Check className="h-3.5 w-3.5 text-emerald-600" />
                  <span className="text-emerald-600">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5" />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-6 pt-0 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
          >
            Close
          </button>
          <a
            href={googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 text-xs font-semibold text-white hover:bg-indigo-700 shadow-sm transition-colors"
          >
            <Navigation className="h-4 w-4" />
            <span>Open in Google Maps</span>
            <ExternalLink className="h-3.5 w-3.5 opacity-80" />
          </a>
        </div>
      </div>
    </div>
  );
};
