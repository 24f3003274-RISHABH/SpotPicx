import React from 'react';
import {
  Calendar,
  MapPin,
  ExternalLink,
  Award,
  Globe,
  Users,
  CheckCircle2,
  AlertCircle,
  Share2,
  Clock,
  Sparkles,
} from 'lucide-react';
import { Opportunity, OpportunityType, OpportunityStatus } from '../../types';

interface OpportunityCardProps {
  opportunity: Opportunity;
  onSelect?: (opportunity: Opportunity) => void;
  onShare?: (opportunity: Opportunity) => void;
}

const typeStyles: Record<OpportunityType, { bg: string; text: string; border: string }> = {
  'Scholarship': { bg: 'bg-emerald-50 text-emerald-700', text: 'text-emerald-700', border: 'border-emerald-200' },
  'Hackathon': { bg: 'bg-purple-50 text-purple-700', text: 'text-purple-700', border: 'border-purple-200' },
  'Coding Competition': { bg: 'bg-blue-50 text-blue-700', text: 'text-blue-700', border: 'border-blue-200' },
  'Research Program': { bg: 'bg-indigo-50 text-indigo-700', text: 'text-indigo-700', border: 'border-indigo-200' },
  'Fellowship': { bg: 'bg-amber-50 text-amber-800', text: 'text-amber-800', border: 'border-amber-200' },
  'Developer Program': { bg: 'bg-cyan-50 text-cyan-700', text: 'text-cyan-700', border: 'border-cyan-200' },
  'Open Source': { bg: 'bg-teal-50 text-teal-700', text: 'text-teal-700', border: 'border-teal-200' },
  'Entrepreneurship': { bg: 'bg-rose-50 text-rose-700', text: 'text-rose-700', border: 'border-rose-200' },
  'Student Conference': { bg: 'bg-orange-50 text-orange-700', text: 'text-orange-700', border: 'border-orange-200' },
};

const statusStyles: Record<OpportunityStatus, { bg: string; text: string; dot: string }> = {
  'Open': { bg: 'bg-emerald-100/80 text-emerald-800', text: 'text-emerald-800', dot: 'bg-emerald-500' },
  'Upcoming': { bg: 'bg-amber-100/80 text-amber-800', text: 'text-amber-800', dot: 'bg-amber-500' },
  'Closed': { bg: 'bg-slate-100 text-slate-600', text: 'text-slate-600', dot: 'bg-slate-400' },
  'Expired': { bg: 'bg-rose-100/80 text-rose-700', text: 'text-rose-700', dot: 'bg-rose-500' },
  'Unknown': { bg: 'bg-sky-100/80 text-sky-800', text: 'text-sky-800', dot: 'bg-sky-500' },
};

export const OpportunityCard: React.FC<OpportunityCardProps> = ({
  opportunity,
  onSelect,
  onShare,
}) => {
  const typeStyle = typeStyles[opportunity.opportunityType] || {
    bg: 'bg-slate-100 text-slate-700',
    text: 'text-slate-700',
    border: 'border-slate-200',
  };

  const statusStyle = statusStyles[opportunity.status] || {
    bg: 'bg-slate-100 text-slate-700',
    text: 'text-slate-700',
    dot: 'bg-slate-400',
  };

  const formatDeadline = (dateStr: string | null) => {
    if (!dateStr || !opportunity.isDeadlineVerified) {
      return null;
    }
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return null;
    return d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const formattedDeadline = formatDeadline(opportunity.deadline);

  return (
    <div
      id={`opp-card-${opportunity.slug}`}
      className="group relative flex flex-col justify-between rounded-2xl bg-white p-6 border border-slate-200 shadow-xs hover:shadow-md hover:border-slate-300 transition-all duration-200"
    >
      {/* Top Meta Bar */}
      <div>
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex items-center gap-3">
            <img
              src={
                opportunity.organizationLogo ||
                'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=200'
              }
              alt={`${opportunity.organization} logo`}
              className="h-11 w-11 rounded-xl object-cover border border-slate-100 shadow-xs"
              loading="lazy"
            />
            <div>
              <span className="text-xs font-semibold text-slate-500 line-clamp-1">
                {opportunity.organization}
              </span>
              <h3 className="text-lg font-bold text-slate-900 leading-snug group-hover:text-rose-600 transition-colors">
                {opportunity.name}
              </h3>
            </div>
          </div>

          {/* Status Badge */}
          <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold tracking-wide uppercase ${statusStyle.bg}`}
          >
            <span className={`h-1.5 w-1.5 rounded-full ${statusStyle.dot} ${opportunity.status === 'Open' ? 'animate-pulse' : ''}`} />
            {opportunity.status}
          </span>
        </div>

        {/* Tags & Pills */}
        <div className="flex flex-wrap items-center gap-2 mb-4">
          {/* Opportunity Type */}
          <span
            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold border ${typeStyle.bg} ${typeStyle.border}`}
          >
            <Award className="h-3 w-3" />
            {opportunity.opportunityType}
          </span>

          {/* Location */}
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200">
            <MapPin className="h-3 w-3 text-slate-500" />
            {opportunity.location}
          </span>

          {/* Featured or This Week badge */}
          {opportunity.isThisWeek && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200">
              <Sparkles className="h-3 w-3 text-rose-500" />
              This Week
            </span>
          )}
        </div>

        {/* Short Description */}
        <p className="text-sm text-slate-600 line-clamp-3 mb-4 leading-relaxed">
          {opportunity.shortDescription}
        </p>

        {/* Eligibility Section */}
        <div className="rounded-xl bg-slate-50 p-3.5 border border-slate-100 mb-4 space-y-2">
          <div className="flex items-start gap-2 text-xs text-slate-700">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 mt-0.5 shrink-0" />
            <div>
              <span className="font-bold text-slate-900">Eligibility: </span>
              <span className="text-slate-600">{opportunity.eligibility}</span>
            </div>
          </div>

          <div className="flex items-start gap-2 text-xs text-slate-700">
            <Users className="h-3.5 w-3.5 text-blue-600 mt-0.5 shrink-0" />
            <div>
              <span className="font-bold text-slate-900">Target: </span>
              <span className="text-slate-600">{opportunity.whoShouldApply}</span>
            </div>
          </div>
        </div>

        {/* Stipend / Award info if present */}
        {opportunity.stipendOrPrize && (
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-amber-50/70 border border-amber-200/80 text-amber-900 text-xs font-semibold mb-4">
            <Award className="h-3.5 w-3.5 text-amber-600 shrink-0" />
            <span>{opportunity.stipendOrPrize}</span>
          </div>
        )}
      </div>

      {/* Card Footer: Deadline & Action Buttons */}
      <div className="pt-4 border-t border-slate-100 space-y-3">
        {/* Deadline Display */}
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5 text-slate-400" />
            {formattedDeadline ? (
              <span className="font-medium text-slate-700">
                Deadline:{' '}
                <span className="font-bold text-slate-900">{formattedDeadline}</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-slate-500 font-medium">
                <AlertCircle className="h-3 w-3 text-slate-400" />
                Deadline: <span className="font-semibold text-slate-700">Check official website</span>
              </span>
            )}
          </div>

          {onShare && (
            <button
              onClick={() => onShare(opportunity)}
              className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
              title="Share Opportunity"
              aria-label="Share Opportunity"
            >
              <Share2 className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        {/* Action Button Strip */}
        <div className="grid grid-cols-2 gap-2">
          <a
            href={opportunity.officialWebsite}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-all border border-slate-200"
          >
            <Globe className="h-3.5 w-3.5 text-slate-500" />
            <span>Website</span>
          </a>

          <a
            href={opportunity.officialApplicationLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-xs hover:shadow-sm transition-all"
          >
            <span>Apply Now</span>
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </div>

        {onSelect && (
          <button
            onClick={() => onSelect(opportunity)}
            className="w-full text-center text-xs font-semibold text-slate-500 hover:text-rose-600 py-1 transition-colors cursor-pointer"
          >
            View Complete Details & Guidelines →
          </button>
        )}
      </div>
    </div>
  );
};
