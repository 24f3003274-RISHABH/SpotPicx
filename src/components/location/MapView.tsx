import React, { useState, useMemo, useRef, useEffect } from 'react';
import {
  Plus,
  Minus,
  RotateCcw,
  Navigation,
  Layers,
  Maximize2,
  Minimize2,
  MapPin,
  ExternalLink,
} from 'lucide-react';
import { Business } from '../../types';
import { MapMarker } from './MapMarker';
import { BusinessPreviewCard } from './BusinessPreviewCard';
import { mapService } from '../../services/map';
import { MapCoordinate } from '../../services/map/types';

interface MapViewProps {
  businesses: Business[];
  selectedBusiness?: Business | null;
  hoveredBusinessId?: string | null;
  userCoords?: MapCoordinate | null;
  radiusKm?: number;
  onSelectBusiness?: (business: Business) => void;
  className?: string;
  isFullScreen?: boolean;
  onToggleFullScreen?: () => void;
  interactive?: boolean;
}

export const MapView: React.FC<MapViewProps> = ({
  businesses = [],
  selectedBusiness = null,
  hoveredBusinessId = null,
  userCoords = null,
  radiusKm,
  onSelectBusiness,
  className = '',
  isFullScreen = false,
  onToggleFullScreen,
  interactive = true,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [activeSpot, setActiveSpot] = useState<Business | null>(selectedBusiness || null);

  useEffect(() => {
    if (selectedBusiness) {
      setActiveSpot(selectedBusiness);
    }
  }, [selectedBusiness]);

  // Compute map bounding box from businesses and user coords
  const mapBounds = useMemo(() => {
    const coords: MapCoordinate[] = businesses.map((b) => ({
      lat: b.latitude,
      lng: b.longitude,
    }));

    if (userCoords) {
      coords.push(userCoords);
    }

    if (coords.length === 0) {
      return {
        minLat: 28.52,
        maxLat: 28.72,
        minLng: 77.08,
        maxLng: 77.32,
      };
    }

    const lats = coords.map((c) => c.lat);
    const lngs = coords.map((c) => c.lng);

    const minLat = Math.min(...lats);
    const maxLat = Math.max(...lats);
    const minLng = Math.min(...lngs);
    const maxLng = Math.max(...lngs);

    // Add padding margin (at least ~0.04 deg so markers aren't pinned to edge)
    const latPadding = Math.max((maxLat - minLat) * 0.18, 0.035);
    const lngPadding = Math.max((maxLng - minLng) * 0.18, 0.035);

    return {
      minLat: minLat - latPadding,
      maxLat: maxLat + latPadding,
      minLng: minLng - lngPadding,
      maxLng: maxLng + lngPadding,
    };
  }, [businesses, userCoords]);

  // Convert GPS (lat, lng) to percentage coords inside container
  const getPercentCoords = (lat: number, lng: number) => {
    const { minLat, maxLat, minLng, maxLng } = mapBounds;
    const latRange = maxLat - minLat || 0.1;
    const lngRange = maxLng - minLng || 0.1;

    // Latitude is inverted in 2D screen Y
    const x = ((lng - minLng) / lngRange) * 100;
    const y = ((maxLat - lat) / latRange) * 100;

    return {
      x: Math.max(4, Math.min(96, x)),
      y: Math.max(6, Math.min(94, y)),
    };
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!interactive) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !interactive) return;
    setPan({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleResetView = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
    setActiveSpot(null);
  };

  const userPercent = userCoords ? getPercentCoords(userCoords.lat, userCoords.lng) : null;
  const activeProvider = mapService.getActiveProvider();

  return (
    <div
      ref={containerRef}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      className={`relative overflow-hidden bg-slate-900 rounded-3xl border border-slate-800 select-none shadow-xl transition-all ${
        isDragging ? 'cursor-grabbing' : 'cursor-grab'
      } ${className}`}
      style={{ minHeight: isFullScreen ? '100%' : '420px' }}
    >
      {/* 1. Realistic stylized vector map canvas background with Delhi rivers, greens & metro arteries */}
      <div
        className="absolute inset-0 transition-transform duration-150 origin-center pointer-events-none"
        style={{
          transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
        }}
      >
        {/* Dark theme map grid background */}
        <div className="absolute inset-0 bg-[#0f172a]" />

        {/* Ambient street grid texture */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:48px_48px] opacity-40" />

        {/* Simulated Yamuna River curve */}
        <svg className="absolute inset-0 w-full h-full opacity-35" preserveAspectRatio="none">
          <path
            d="M 68% 0 Q 72% 35, 62% 60 T 78% 100"
            fill="none"
            stroke="#0284c7"
            strokeWidth="28"
            strokeLinecap="round"
          />
          {/* Delhi Ring Roads simulation */}
          <ellipse cx="50%" cy="50%" rx="36%" ry="32%" fill="none" stroke="#334155" strokeWidth="6" />
          <ellipse cx="50%" cy="50%" rx="22%" ry="20%" fill="none" stroke="#475569" strokeWidth="4" />
          <path d="M 0 50% Q 50% 48, 100% 50%" fill="none" stroke="#334155" strokeWidth="4" />
          <path d="M 50% 0 Q 48% 50, 50% 100%" fill="none" stroke="#334155" strokeWidth="4" />
        </svg>

        {/* User Search Radius Circle overlay if available */}
        {userPercent && radiusKm && (
          <div
            className="absolute rounded-full border-2 border-indigo-400/50 bg-indigo-500/10 pointer-events-none -translate-x-1/2 -translate-y-1/2 transition-all duration-300"
            style={{
              left: `${userPercent.x}%`,
              top: `${userPercent.y}%`,
              width: `${radiusKm * 18}px`,
              height: `${radiusKm * 18}px`,
            }}
          />
        )}

        {/* User Current Location Marker (Blue pulsing dot) */}
        {userPercent && (
          <div
            className="absolute z-20 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
            style={{
              left: `${userPercent.x}%`,
              top: `${userPercent.y}%`,
            }}
          >
            <div className="relative flex items-center justify-center">
              <span className="animate-ping absolute inline-flex h-8 w-8 rounded-full bg-blue-400 opacity-60" />
              <div className="w-5 h-5 rounded-full bg-blue-500 border-2 border-white shadow-lg flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-white" />
              </div>
            </div>
            <div className="absolute top-6 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-md bg-blue-600/90 text-white text-[9px] font-bold whitespace-nowrap shadow-md">
              You are here
            </div>
          </div>
        )}

        {/* Business Markers Placement */}
        {businesses.map((business) => {
          const { x, y } = getPercentCoords(business.latitude, business.longitude);
          const isSelected = activeSpot?.slug === business.slug || activeSpot?._id === business._id;
          const isHovered = hoveredBusinessId === business._id || hoveredBusinessId === business.slug;

          return (
            <div
              key={business._id || business.slug}
              className="absolute pointer-events-auto"
              style={{
                left: `${x}%`,
                top: `${y}%`,
              }}
            >
              <MapMarker
                business={business}
                isSelected={isSelected}
                isHovered={isHovered}
                onClick={(b) => {
                  setActiveSpot(b);
                  onSelectBusiness?.(b);
                }}
              />
            </div>
          );
        })}
      </div>

      {/* 2. Top-left & Top-right map controls overlay */}
      <div className="absolute top-4 left-4 z-30 flex items-center gap-2 pointer-events-auto">
        <span className="px-3 py-1 rounded-xl bg-slate-950/80 backdrop-blur-md text-white text-xs font-bold border border-slate-700/80 shadow-md flex items-center gap-1.5">
          <MapPin className="h-3.5 w-3.5 text-indigo-400" />
          <span>{businesses.length} Spots Mapped</span>
        </span>

        <span className="hidden sm:inline-flex px-2.5 py-1 rounded-xl bg-slate-950/60 backdrop-blur-md text-slate-300 text-[10px] font-semibold border border-slate-800">
          Provider: {activeProvider.name}
        </span>
      </div>

      {/* Top right zoom & layout controls */}
      <div className="absolute top-4 right-4 z-30 flex flex-col gap-1.5 pointer-events-auto">
        {onToggleFullScreen && (
          <button
            type="button"
            onClick={onToggleFullScreen}
            className="p-2 rounded-xl bg-slate-950/80 hover:bg-slate-900 text-white border border-slate-700/80 backdrop-blur-md shadow-md transition-colors cursor-pointer"
            title={isFullScreen ? 'Exit Full Screen' : 'Full Screen Map'}
          >
            {isFullScreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
          </button>
        )}

        <button
          type="button"
          onClick={() => setZoom((z) => Math.min(z + 0.3, 2.5))}
          className="p-2 rounded-xl bg-slate-950/80 hover:bg-slate-900 text-white border border-slate-700/80 backdrop-blur-md shadow-md transition-colors cursor-pointer"
          title="Zoom In"
        >
          <Plus className="h-4 w-4" />
        </button>

        <button
          type="button"
          onClick={() => setZoom((z) => Math.max(z - 0.3, 0.7))}
          className="p-2 rounded-xl bg-slate-950/80 hover:bg-slate-900 text-white border border-slate-700/80 backdrop-blur-md shadow-md transition-colors cursor-pointer"
          title="Zoom Out"
        >
          <Minus className="h-4 w-4" />
        </button>

        {(zoom !== 1 || pan.x !== 0 || pan.y !== 0) && (
          <button
            type="button"
            onClick={handleResetView}
            className="p-2 rounded-xl bg-slate-950/80 hover:bg-slate-900 text-indigo-400 border border-slate-700/80 backdrop-blur-md shadow-md transition-colors cursor-pointer"
            title="Reset Map View"
          >
            <RotateCcw className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* 3. Floating BusinessPreviewCard at bottom when a marker is selected */}
      {activeSpot && (
        <div className="absolute bottom-4 inset-x-4 z-40 flex justify-center pointer-events-auto">
          <BusinessPreviewCard
            business={activeSpot}
            userCoords={userCoords}
            onClose={() => setActiveSpot(null)}
          />
        </div>
      )}
    </div>
  );
};
