import React from 'react';
import { ShieldCheck, Clock, Calendar, CheckCircle2, AlertCircle, Info } from 'lucide-react';
import { getGuideFreshness, formatGuideDate } from '../../utils/guideFreshness';
import { GuideMethodologyType } from '../../types/guides.types';

interface GuideMetaBadgeProps {
  lastReviewedDate: string;
  methodologyType: GuideMethodologyType;
  selectionMethodology?: string;
  badgeText?: string;
  authorName?: string;
  authorRole?: string;
  authorAvatar?: string;
  className?: string;
}

export const GuideMetaBadge: React.FC<GuideMetaBadgeProps> = ({
  lastReviewedDate,
  methodologyType,
  selectionMethodology,
  badgeText,
  authorName,
  authorRole,
  authorAvatar,
  className = '',
}) => {
  const freshness = getGuideFreshness(lastReviewedDate);

  const getFreshnessColor = () => {
    switch (freshness.status) {
      case 'FRESH':
        return 'bg-emerald-50 text-emerald-800 border-emerald-200';
      case 'UP_TO_DATE':
        return 'bg-blue-50 text-blue-800 border-blue-200';
      case 'REVIEW_DUE':
        return 'bg-amber-50 text-amber-900 border-amber-200';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  const getFreshnessIcon = () => {
    switch (freshness.status) {
      case 'FRESH':
        return <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />;
      case 'UP_TO_DATE':
        return <Clock className="w-4 h-4 text-blue-600 shrink-0" />;
      case 'REVIEW_DUE':
        return <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />;
      default:
        return <Info className="w-4 h-4 text-slate-500 shrink-0" />;
    }
  };

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Top badges bar */}
      <div className="flex flex-wrap items-center gap-2">
        {/* Editorial Transparency Badge */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-500/10 text-amber-900 border border-amber-500/20 rounded-full text-xs font-semibold tracking-wide">
          <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
          <span>{badgeText || methodologyType}</span>
        </div>

        {/* 90-Day Freshness Badge */}
        <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${getFreshnessColor()}`}>
          {getFreshnessIcon()}
          <span>{freshness.label}</span>
          <span className="text-slate-400">•</span>
          <span className="opacity-90">{formatGuideDate(lastReviewedDate)}</span>
        </div>
      </div>

      {/* Author and Methodology transparency box */}
      {(authorName || selectionMethodology) && (
        <div className="p-3.5 bg-slate-50/80 border border-slate-200/80 rounded-xl text-xs text-slate-600 space-y-2">
          {authorName && (
            <div className="flex items-center gap-2.5">
              {authorAvatar ? (
                <img
                  src={authorAvatar}
                  alt={authorName}
                  className="w-7 h-7 rounded-full object-cover border border-slate-300"
                />
              ) : (
                <div className="w-7 h-7 rounded-full bg-slate-200 flex items-center justify-center font-bold text-slate-600 text-xs">
                  {authorName[0]}
                </div>
              )}
              <div>
                <span className="font-semibold text-slate-900">{authorName}</span>
                {authorRole && <span className="text-slate-500 ml-1.5">({authorRole})</span>}
              </div>
            </div>
          )}

          {selectionMethodology && (
            <p className="text-slate-600 leading-relaxed text-xs">
              <strong className="text-slate-900 font-medium">Methodology & Transparency: </strong>
              {selectionMethodology}
            </p>
          )}
        </div>
      )}
    </div>
  );
};
