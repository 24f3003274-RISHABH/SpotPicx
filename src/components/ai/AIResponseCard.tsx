import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Markdown from 'react-markdown';
import {
  Sparkles,
  Bot,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  Copy,
  Check,
  ThumbsUp,
  ThumbsDown,
  ArrowRight,
  MapPin,
  Star,
  Globe,
  Tag,
  Info,
  Clock,
  Navigation,
} from 'lucide-react';
import { AskSpotPicksData, Business } from '../../types';
import { BusinessCard } from '../discovery/BusinessCard';
import { Button } from '../ui/Button';

interface AIResponseCardProps {
  data: AskSpotPicksData;
  onExploreMore?: () => void;
}

export const AIResponseCard: React.FC<AIResponseCardProps> = ({ data, onExploreMore }) => {
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);
  const [feedback, setFeedback] = useState<'liked' | 'disliked' | null>(null);

  const handleCopy = () => {
    if (data.answer) {
      navigator.clipboard.writeText(data.answer);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleViewInSearch = () => {
    if (onExploreMore) {
      onExploreMore();
      return;
    }

    const params = new URLSearchParams();
    if (data.criteria?.category) params.set('category', data.criteria.category);
    if (data.criteria?.locality) params.set('locality', data.criteria.locality);
    if (data.criteria?.priceMax) params.set('priceMax', data.criteria.priceMax.toString());
    if (data.criteria?.priceRange) params.set('priceRange', data.criteria.priceRange);
    if (data.criteria?.amenities && data.criteria.amenities.length > 0) {
      params.set('amenities', data.criteria.amenities.join(','));
    }
    if (data.criteria?.tags && data.criteria.tags.length > 0) {
      params.set('tags', data.criteria.tags.join(','));
    }
    if (!data.criteria?.category && !data.criteria?.locality && data.question) {
      params.set('q', data.question);
    }
    navigate(`/search?${params.toString()}`);
  };

  return (
    <div className="bg-white rounded-3xl border border-indigo-100 shadow-xl overflow-hidden animate-in fade-in slide-in-from-bottom-3 duration-400">
      {/* Header Accent Bar */}
      <div className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-slate-900 px-6 py-4 text-white flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500 to-violet-400 flex items-center justify-center shadow-md shadow-indigo-500/30">
            <Sparkles className="h-5 w-5 text-white animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-extrabold text-sm sm:text-base text-white tracking-tight">
                Ask SpotPicks Answer
              </h3>
              {data.groundedWithWeb && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-[10px] font-bold uppercase tracking-wider">
                  <Globe className="h-2.5 w-2.5" /> Live Grounded
                </span>
              )}
              {data.fallbackUsed && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-indigo-500/30 text-indigo-200 border border-indigo-400/30 text-[10px] font-semibold">
                  Verified Directory Match
                </span>
              )}
            </div>
            <p className="text-xs text-indigo-200/80 line-clamp-1">
              "{data.question}"
            </p>
          </div>
        </div>

        {/* Action controls: Copy, Thumbs feedback */}
        <div className="flex items-center gap-1.5 ml-auto">
          <button
            type="button"
            onClick={handleCopy}
            title="Copy answer"
            className="p-1.5 rounded-lg text-indigo-200 hover:text-white hover:bg-white/10 transition-colors text-xs flex items-center gap-1 cursor-pointer"
          >
            {copied ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
            <span className="hidden sm:inline">{copied ? 'Copied' : 'Copy'}</span>
          </button>

          <div className="h-4 w-px bg-white/20 mx-1" />

          <button
            type="button"
            onClick={() => setFeedback(feedback === 'liked' ? null : 'liked')}
            title="Helpful recommendation"
            className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
              feedback === 'liked' ? 'bg-emerald-500/30 text-emerald-300' : 'text-indigo-200 hover:text-white hover:bg-white/10'
            }`}
          >
            <ThumbsUp className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => setFeedback(feedback === 'disliked' ? null : 'disliked')}
            title="Not helpful"
            className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
              feedback === 'disliked' ? 'bg-rose-500/30 text-rose-300' : 'text-indigo-200 hover:text-white hover:bg-white/10'
            }`}
          >
            <ThumbsDown className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Main Body */}
      <div className="p-6 sm:p-8 space-y-6">
        {/* Markdown Conversational Answer */}
        <div className="bg-slate-50/70 border border-slate-200/70 rounded-2xl p-5 text-slate-800 leading-relaxed text-sm sm:text-base">
          <div className="markdown-body prose prose-slate max-w-none prose-p:my-2 prose-strong:text-indigo-950 prose-strong:font-bold prose-ul:my-2 prose-li:my-0.5">
            <Markdown>{data.answer}</Markdown>
          </div>
        </div>

        {/* Extracted Query Criteria Filters (if present) */}
        {data.criteria && (data.criteria.category || data.criteria.locality || data.criteria.priceMax || data.criteria.amenities?.length > 0) && (
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
              <Tag className="h-3.5 w-3.5 text-indigo-600" />
              <span>Extracted Filter Criteria</span>
            </h4>
            <div className="flex flex-wrap gap-2">
              {data.criteria.category && (
                <span className="px-3 py-1 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-semibold">
                  Category: <strong>{data.criteria.category}</strong>
                </span>
              )}
              {data.criteria.locality && (
                <span className="px-3 py-1 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold">
                  Locality: <strong>{data.criteria.locality}</strong>
                </span>
              )}
              {data.criteria.priceMax && (
                <span className="px-3 py-1 rounded-xl bg-amber-50 border border-amber-200 text-amber-700 text-xs font-semibold">
                  Budget: <strong>&lt; ₹{data.criteria.priceMax}</strong>
                </span>
              )}
              {data.criteria.priceRange && (
                <span className="px-3 py-1 rounded-xl bg-purple-50 border border-purple-200 text-purple-700 text-xs font-semibold">
                  Tier: <strong>{data.criteria.priceRange}</strong>
                </span>
              )}
              {data.criteria.amenities?.map((amenity, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 rounded-xl bg-sky-50 border border-sky-200 text-sky-700 text-xs font-semibold"
                >
                  {amenity}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Recommended Places Section */}
        {data.recommendedBusinesses && data.recommendedBusinesses.length > 0 && (
          <div className="space-y-4 pt-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-emerald-600" />
                <h4 className="font-extrabold text-base sm:text-lg text-slate-900">
                  Recommended Verified Places ({data.recommendedBusinesses.length})
                </h4>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleViewInSearch}
                className="text-xs font-bold text-indigo-600 border-indigo-200 hover:bg-indigo-50"
              >
                <span>View All Matches</span>
                <ArrowRight className="h-3.5 w-3.5 ml-1" />
              </Button>
            </div>

            {/* Grid of Business Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {data.recommendedBusinesses.slice(0, 6).map((business: Business) => (
                <BusinessCard key={business._id || business.slug} business={business} viewMode="grid" />
              ))}
            </div>
          </div>
        )}

        {/* Web Grounding Sources (Google Search Grounding) */}
        {data.sources && data.sources.length > 0 && (
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2.5">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
              <Globe className="h-3.5 w-3.5 text-indigo-600" />
              <span>Grounding Sources & References:</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {data.sources.map((source, idx) => (
                <a
                  key={idx}
                  href={source.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-xs text-slate-700 hover:text-indigo-600 hover:border-indigo-300 transition-colors shadow-xs group"
                >
                  <span className="font-medium truncate max-w-[200px] sm:max-w-[260px]">{source.title}</span>
                  <ExternalLink className="h-3 w-3 text-slate-400 group-hover:text-indigo-600 transition-colors shrink-0" />
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Disclaimer / Accuracy Note */}
        <div className="flex items-start gap-2.5 text-xs text-slate-500 pt-2 border-t border-slate-100">
          <Info className="h-4 w-4 text-slate-400 shrink-0 mt-0.5" />
          <p>
            SpotPicks recommendations are based on our verified local directory data and real-time signals. Prices, timings, and menus are subject to merchant updates. For live reservations or inquiries, contact the venue directly.
          </p>
        </div>
      </div>
    </div>
  );
};
