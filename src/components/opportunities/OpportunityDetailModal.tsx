import React, { useState } from 'react';
import {
  X,
  Calendar,
  MapPin,
  ExternalLink,
  Award,
  Globe,
  Users,
  CheckCircle2,
  AlertCircle,
  Share2,
  Copy,
  Check,
  Building,
  Tag,
  ShieldCheck,
} from 'lucide-react';
import { Opportunity } from '../../types';

interface OpportunityDetailModalProps {
  opportunity: Opportunity | null;
  isOpen: boolean;
  onClose: () => void;
}

export const OpportunityDetailModal: React.FC<OpportunityDetailModalProps> = ({
  opportunity,
  isOpen,
  onClose,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen || !opportunity) return null;

  const shareUrl = `${window.location.origin}/student-opportunities?opp=${opportunity.slug}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShareWhatsApp = () => {
    const text = encodeURIComponent(
      `Check out this student opportunity: ${opportunity.name} by ${opportunity.organization}\n${shareUrl}`
    );
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  const handleShareLinkedIn = () => {
    const url = encodeURIComponent(shareUrl);
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}`, '_blank');
  };

  const formatDeadline = (dateStr: string | null) => {
    if (!dateStr || !opportunity.isDeadlineVerified) {
      return 'Check official website';
    }
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return 'Check official website';
    return d.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto animate-fade-in">
      <div
        className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-800">
              {opportunity.opportunityType}
            </span>
            <span className="text-xs text-slate-400">• SpotPicks Verified Hub</span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-8 space-y-6 max-h-[80vh] overflow-y-auto">
          {/* Org & Title */}
          <div className="flex items-start gap-4">
            <img
              src={
                opportunity.organizationLogo ||
                'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=200'
              }
              alt={opportunity.organization}
              className="h-16 w-16 rounded-2xl object-cover border border-slate-200 shadow-xs"
            />
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
                <Building className="h-3.5 w-3.5" />
                <span>{opportunity.organization}</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 leading-snug">
                {opportunity.name}
              </h2>
            </div>
          </div>

          {/* Quick Metrics Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-100 text-xs">
            <div>
              <span className="text-slate-400 block mb-0.5 font-medium">Status</span>
              <span className="font-bold text-slate-900">{opportunity.status}</span>
            </div>
            <div>
              <span className="text-slate-400 block mb-0.5 font-medium">Location</span>
              <span className="font-bold text-slate-900">{opportunity.location}</span>
            </div>
            <div className="col-span-2 sm:col-span-1">
              <span className="text-slate-400 block mb-0.5 font-medium">Application Deadline</span>
              <span
                className={`font-bold ${
                  opportunity.isDeadlineVerified ? 'text-slate-900' : 'text-amber-700'
                }`}
              >
                {formatDeadline(opportunity.deadline)}
              </span>
            </div>
          </div>

          {/* Description */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              Overview & Objectives
            </h4>
            <p className="text-sm text-slate-700 leading-relaxed">
              {opportunity.fullDescription || opportunity.shortDescription}
            </p>
          </div>

          {/* Key Qualifications & Eligibility */}
          <div className="space-y-3 p-4 rounded-2xl bg-emerald-50/50 border border-emerald-100">
            <div className="flex items-start gap-2.5 text-xs text-slate-800">
              <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-slate-900 block mb-0.5">Eligibility Criteria</span>
                <span className="text-slate-700 leading-relaxed">{opportunity.eligibility}</span>
              </div>
            </div>

            <div className="flex items-start gap-2.5 text-xs text-slate-800 pt-2 border-t border-emerald-100">
              <Users className="h-4 w-4 text-blue-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-slate-900 block mb-0.5">Target Audience</span>
                <span className="text-slate-700 leading-relaxed">{opportunity.whoShouldApply}</span>
              </div>
            </div>
          </div>

          {/* Grant/Stipend if available */}
          {opportunity.stipendOrPrize && (
            <div className="flex items-center gap-3 p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900">
              <Award className="h-5 w-5 text-amber-600 shrink-0" />
              <div>
                <span className="font-bold block mb-0.5">Award & Financial Support</span>
                <span>{opportunity.stipendOrPrize}</span>
              </div>
            </div>
          )}

          {/* Tags */}
          {opportunity.tags && opportunity.tags.length > 0 && (
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2">
                Domain Tags
              </span>
              <div className="flex flex-wrap gap-1.5">
                {opportunity.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 text-slate-600 text-xs font-medium"
                  >
                    <Tag className="h-3 w-3 text-slate-400" />
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Verified Official Notice */}
          <div className="flex items-start gap-2 p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-500">
            <ShieldCheck className="h-4 w-4 text-slate-400 shrink-0 mt-0.5" />
            <p>
              SpotPicks adheres to strict verified data guidelines. Always verify specific date windows,
              prerequisites, and document formats directly on the host portal before submitting.
            </p>
          </div>

          {/* Social Share Strip */}
          <div className="pt-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2">
              Share with Classmates & Study Groups
            </span>
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={handleCopyLink}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
              >
                {copied ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
                <span>{copied ? 'Link Copied!' : 'Copy Link'}</span>
              </button>

              <button
                onClick={handleShareWhatsApp}
                className="px-3 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold transition-colors cursor-pointer"
              >
                WhatsApp
              </button>

              <button
                onClick={handleShareLinkedIn}
                className="px-3 py-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-800 text-xs font-bold transition-colors cursor-pointer"
              >
                LinkedIn
              </button>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-6 bg-slate-50 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
          <a
            href={opportunity.officialWebsite}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-white hover:bg-slate-100 text-slate-800 text-xs font-bold border border-slate-200 transition-all shadow-xs"
          >
            <Globe className="h-4 w-4 text-slate-500" />
            <span>Visit Provider Website</span>
          </a>

          <a
            href={opportunity.officialApplicationLink}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-md hover:shadow-lg transition-all"
          >
            <span>Proceed to Official Application</span>
            <ExternalLink className="h-4 w-4" />
          </a>
        </div>
      </div>
    </div>
  );
};
