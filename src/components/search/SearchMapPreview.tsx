import React, { useState } from 'react';
import {
  MapPin,
  Navigation,
  Compass,
  Star,
  ExternalLink,
  Layers,
  Sparkles,
  Info,
} from 'lucide-react';
import { Business } from '../../types';
import { Link } from 'react-router-dom';

interface SearchMapPreviewProps {
  businesses: Business[];
  userLocation?: { lat: number; lng: number } | null;
  radiusKm?: number;
  selectedBusinessId?: string;
  onSelectBusiness?: (business: Business) => void;
  className?: string;
}

export const SearchMapPreview: React.FC<SearchMapPreviewProps> = ({
  businesses,
  userLocation,
  radiusKm = 10,
  selectedBusinessId,
  onSelectBusiness,
  className = '',
}) => {
  const [activePin, setActivePin] = useState<Business | null>(
    businesses.find((b) => b._id === selectedBusinessId) || businesses[0] || null
  );

  // Delhi center reference: 28.6139 N, 77.2090 E
  // Calculate relative pixel offsets on a normalized 2D map projection for Delhi bounds
  // Lat: 28.45 to 28.75 (30km N-S)
  // Lng: 77.00 to 77.35 (35km E-W)
  const minLat = 28.45;
  const maxLat = 28.75;
  const minLng = 77.0;
  const maxLng = 77.35;

  const projectCoords = (lat: number, lng: number) => {
    const clampedLat = Math.min(maxLat, Math.max(minLat, lat));
    const clampedLng = Math.min(maxLng, Math.max(minLng, lng));

    // X percentage (left to right)
    const xPct = ((clampedLng - minLng) / (maxLng - minLng)) * 80 + 10;
    // Y percentage (top to bottom, inverted lat)
    const yPct = ((maxLat - clampedLat) / (maxLat - minLat)) * 80 + 10;

    return { x: xPct, y: yPct };
  };

  return (
    <div
      className={`relative w-full h-[360px] md:h-[500px] bg-slate-900 rounded-3xl overflow-hidden border border-slate-800 shadow-xl flex flex-col ${className}`}
    >
      {/* Top Map Toolbar */}
      <div className="absolute top-4 left-4 right-4 z-20 flex items-center justify-between pointer-events-none">
        <div className="bg-slate-950/85 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-slate-700/60 text-white text-xs font-semibold flex items-center gap-2 shadow-lg pointer-events-auto">
          <Layers className="h-3.5 w-3.5 text-indigo-400" />
          <span>Delhi NCR Discovery Map</span>
          <span className="bg-indigo-600/80 text-[10px] px-1.5 py-0.5 rounded font-mono">
            {businesses.length} spots
          </span>
        </div>

        {userLocation && (
          <div className="bg-emerald-950/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-emerald-700/60 text-emerald-300 text-xs font-medium flex items-center gap-1.5 shadow-lg pointer-events-auto">
            <Navigation className="h-3.5 w-3.5 text-emerald-400" />
            <span>GPS Active (within {radiusKm}km)</span>
          </div>
        )}
      </div>

      {/* Stylized Vector Grid Background representing Delhi Metro Map / Geography */}
      <div className="relative flex-1 w-full h-full bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:20px_20px] bg-slate-950 overflow-hidden cursor-grab active:cursor-grabbing">
        {/* River Yamuna Stylized Blue Curve */}
        <svg
          className="absolute inset-0 w-full h-full opacity-35 pointer-events-none"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          <path
            d="M 65,0 C 68,25 60,45 64,70 C 66,85 75,95 78,100"
            fill="none"
            stroke="#38bdf8"
            strokeWidth="3.5"
            strokeDasharray="4 2"
          />
          <text x="68" y="30" fill="#38bdf8" fontSize="2.5" className="font-mono font-bold tracking-widest">
            YAMUNA RIVER
          </text>
        </svg>

        {/* Ring Road and Major Landmarks Circles */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
          <div className="w-[320px] h-[320px] rounded-full border border-dashed border-indigo-400/80 flex items-center justify-center">
            <div className="w-[180px] h-[180px] rounded-full border border-indigo-500/50"></div>
          </div>
        </div>

        {/* Major Delhi Hub Labels */}
        <div className="absolute top-[28%] left-[48%] text-[10px] font-bold text-slate-500 tracking-wider pointer-events-none">
          CONNAUGHT PLACE
        </div>
        <div className="absolute top-[68%] left-[42%] text-[10px] font-bold text-slate-500 tracking-wider pointer-events-none">
          HAUZ KHAS / SAKET
        </div>
        <div className="absolute top-[18%] left-[52%] text-[10px] font-bold text-slate-500 tracking-wider pointer-events-none">
          MAJNU KA TILLA
        </div>
        <div className="absolute top-[52%] left-[62%] text-[10px] font-bold text-slate-500 tracking-wider pointer-events-none">
          NEHRU PLACE
        </div>

        {/* User GPS Pin if available */}
        {userLocation && (
          <div
            className="absolute z-30 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center"
            style={{
              left: `${projectCoords(userLocation.lat, userLocation.lng).x}%`,
              top: `${projectCoords(userLocation.lat, userLocation.lng).y}%`,
            }}
          >
            <div className="relative flex items-center justify-center">
              <span className="absolute w-8 h-8 rounded-full bg-emerald-400/40 animate-ping" />
              <div className="w-5 h-5 rounded-full bg-emerald-500 border-2 border-white shadow-lg flex items-center justify-center">
                <Navigation className="h-3 w-3 text-white fill-white" />
              </div>
            </div>
            <span className="mt-1 px-1.5 py-0.5 bg-emerald-950/90 text-emerald-300 text-[9px] font-bold rounded-md border border-emerald-600/60 shadow">
              You
            </span>
          </div>
        )}

        {/* Render Spot Markers */}
        {businesses.map((biz) => {
          const lat = biz.latitude || (biz.location?.coordinates ? biz.location.coordinates[1] : 28.6139);
          const lng = biz.longitude || (biz.location?.coordinates ? biz.location.coordinates[0] : 77.209);
          const { x, y } = projectCoords(lat, lng);
          const isSelected = activePin?._id === biz._id;

          return (
            <button
              key={biz._id || biz.slug}
              type="button"
              onClick={() => {
                setActivePin(biz);
                if (onSelectBusiness) onSelectBusiness(biz);
              }}
              style={{ left: `${x}%`, top: `${y}%` }}
              className={`absolute z-20 -translate-x-1/2 -translate-y-1/2 group transition-all duration-200 cursor-pointer focus:outline-none ${
                isSelected ? 'scale-125 z-30' : 'hover:scale-115'
              }`}
            >
              <div
                className={`flex items-center gap-1 px-2 py-1 rounded-xl text-[11px] font-bold shadow-lg transition-all ${
                  isSelected
                    ? 'bg-indigo-600 text-white ring-4 ring-indigo-400/40'
                    : 'bg-white text-slate-900 border border-slate-200 hover:bg-indigo-50 hover:text-indigo-600'
                }`}
              >
                <MapPin
                  className={`h-3.5 w-3.5 ${
                    isSelected ? 'text-white' : 'text-indigo-600'
                  }`}
                />
                <span className="max-w-[80px] md:max-w-[110px] truncate">{biz.name}</span>
                <span
                  className={`text-[10px] px-1 rounded ${
                    isSelected ? 'bg-indigo-700 text-white' : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  ★{biz.rating ? biz.rating.toFixed(1) : '4.5'}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Selected Spot Bottom Card Overlay */}
      {activePin && (
        <div className="absolute bottom-4 left-4 right-4 z-30 bg-white/95 backdrop-blur-md rounded-2xl p-4 border border-slate-200 shadow-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 animate-in fade-in slide-in-from-bottom-2">
          <div className="flex items-center gap-3">
            <img
              src={
                activePin.images && activePin.images.length > 0
                  ? activePin.images[0]
                  : 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=200'
              }
              alt={activePin.name}
              className="w-14 h-14 rounded-xl object-cover border border-slate-200 shrink-0"
            />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider">
                  {typeof activePin.category === 'object'
                    ? (activePin.category as any).name
                    : activePin.category}
                </span>
                <span className="text-slate-300">•</span>
                <span className="text-xs font-semibold text-slate-700">{activePin.locality}</span>
                {typeof activePin.distanceKm === 'number' && (
                  <span className="text-[10px] bg-indigo-50 text-indigo-700 font-bold px-1.5 py-0.5 rounded">
                    {activePin.distanceKm < 1
                      ? `${Math.round(activePin.distanceKm * 1000)}m away`
                      : `${activePin.distanceKm.toFixed(1)}km away`}
                  </span>
                )}
              </div>
              <h4 className="text-sm font-bold text-slate-900 line-clamp-1">{activePin.name}</h4>
              <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                <div className="flex items-center text-amber-500 font-bold text-xs">
                  <Star className="h-3 w-3 fill-amber-400" />
                  <span className="ml-1">{activePin.rating?.toFixed(1) || '4.5'}</span>
                </div>
                <span>({activePin.reviewCount || 10} reviews)</span>
                <span>•</span>
                <span>{activePin.priceRange}</span>
              </div>
            </div>
          </div>

          <Link
            to={`/business/${activePin.slug}`}
            className="w-full sm:w-auto px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-1.5 shrink-0 shadow-sm"
          >
            <span>View Full Details</span>
            <ExternalLink className="h-3.5 w-3.5" />
          </Link>
        </div>
      )}
    </div>
  );
};
