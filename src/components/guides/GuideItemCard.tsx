import React from 'react';
import {
  MapPin,
  Clock,
  Ticket,
  Train,
  Hourglass,
  ExternalLink,
  Compass,
  CheckCircle2,
  BookOpen,
  ArrowRight,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Top10GuideItem } from '../../types/guides.types';

interface GuideItemCardProps {
  item: Top10GuideItem;
}

export const GuideItemCard: React.FC<GuideItemCardProps> = ({ item }) => {
  const mapsUrl = item.coordinates
    ? `https://www.google.com/maps/search/?api=1&query=${item.coordinates.lat},${item.coordinates.lng}`
    : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(item.name + ' ' + (item.location || ''))}`;

  return (
    <article
      id={`spot-${item.rank}`}
      className="scroll-mt-24 bg-white border border-slate-200/90 rounded-2xl shadow-sm hover:shadow-md transition-shadow overflow-hidden"
    >
      {/* Header section with Rank and Title */}
      <div className="p-6 md:p-8 pb-4">
        <div className="flex items-start gap-4">
          {/* Rank Badge */}
          <div className="flex flex-col items-center justify-center w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-slate-900 text-white font-black text-xl md:text-2xl shadow-inner shrink-0">
            <span className="text-[10px] uppercase tracking-wider font-semibold text-amber-400 leading-none mb-0.5">
              Rank
            </span>
            <span>#{item.rank}</span>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-900 border border-amber-200">
                {item.category}
              </span>
              {item.location && (
                <span className="inline-flex items-center gap-1 text-xs text-slate-500 font-medium">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <span className="truncate max-w-[240px]">{item.location}</span>
                </span>
              )}
            </div>

            <h3 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight leading-snug">
              {item.name}
            </h3>
          </div>
        </div>
      </div>

      {/* Image if available */}
      {item.image && (
        <div className="px-6 md:px-8 mb-5">
          <div className="relative aspect-video md:aspect-[21/9] w-full rounded-xl overflow-hidden bg-slate-100 border border-slate-200">
            <img
              src={item.image}
              alt={item.name}
              className="w-full h-full object-cover"
              loading="lazy"
            />
            <div className="absolute bottom-3 right-3">
              <a
                href={mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/95 hover:bg-white text-slate-900 text-xs font-semibold rounded-lg shadow-md backdrop-blur-sm transition-transform hover:scale-105"
              >
                <Compass className="w-3.5 h-3.5 text-blue-600" />
                <span>Open in Google Maps</span>
                <ExternalLink className="w-3 h-3 text-slate-400" />
              </a>
            </div>
          </div>
        </div>
      )}

      <div className="px-6 md:px-8 pb-6 md:pb-8 space-y-5">
        {/* Why this was selected box */}
        <div className="p-4 bg-amber-50/70 border border-amber-200/80 rounded-xl">
          <div className="flex items-start gap-2.5">
            <div className="w-5 h-5 rounded-full bg-amber-200 flex items-center justify-center shrink-0 mt-0.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-amber-800" />
            </div>
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-amber-900 mb-1">
                Why It Was Selected
              </h4>
              <p className="text-sm text-slate-800 leading-relaxed font-medium">
                {item.selectionReason}
              </p>
            </div>
          </div>
        </div>

        {/* Factual Description */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
            Factual Overview
          </h4>
          <p className="text-sm md:text-base text-slate-700 leading-relaxed">
            {item.factualDescription}
          </p>
        </div>

        {/* Highlights Tags */}
        {item.highlights && item.highlights.length > 0 && (
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
              Key Highlights & Offerings
            </h4>
            <div className="flex flex-wrap gap-2">
              {item.highlights.map((h, i) => (
                <span
                  key={i}
                  className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200/80 text-slate-800 rounded-lg text-xs font-medium border border-slate-200 transition-colors"
                >
                  ✓ {h}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Important Visitor Information Grid */}
        {item.importantInfo && (
          <div className="bg-slate-50 border border-slate-200/90 rounded-xl p-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-3 flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-slate-600" />
              <span>Important Visitor Information</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              {item.importantInfo.timings && (
                <div className="flex items-start gap-2 text-slate-700">
                  <Clock className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-slate-900 block">Timings</span>
                    <span>{item.importantInfo.timings}</span>
                  </div>
                </div>
              )}

              {item.importantInfo.entryFee && (
                <div className="flex items-start gap-2 text-slate-700">
                  <Ticket className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-slate-900 block">Pricing / Entry</span>
                    <span>{item.importantInfo.entryFee}</span>
                  </div>
                </div>
              )}

              {item.importantInfo.nearestMetroOrTransit && (
                <div className="flex items-start gap-2 text-slate-700">
                  <Train className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-slate-900 block">Nearest Metro / Transit</span>
                    <span>{item.importantInfo.nearestMetroOrTransit}</span>
                  </div>
                </div>
              )}

              {item.importantInfo.recommendedDuration && (
                <div className="flex items-start gap-2 text-slate-700">
                  <Hourglass className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-slate-900 block">Recommended Duration</span>
                    <span>{item.importantInfo.recommendedDuration}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Footer info: Source and Internal Links */}
        <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500">
          {item.source && (
            <div>
              <span className="font-medium text-slate-600">Source: </span>
              {item.source.url ? (
                <a
                  href={item.source.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline inline-flex items-center gap-1"
                >
                  {item.source.title} ({item.source.publisher})
                  <ExternalLink className="w-2.5 h-2.5" />
                </a>
              ) : (
                <span>
                  {item.source.title} {item.source.publisher ? `(${item.source.publisher})` : ''}
                </span>
              )}
            </div>
          )}

          {item.internalLink && (
            <Link
              to={item.internalLink.url}
              className="inline-flex items-center gap-1 font-semibold text-blue-600 hover:text-blue-800 ml-auto"
            >
              <span>{item.internalLink.label}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          )}
        </div>
      </div>
    </article>
  );
};
