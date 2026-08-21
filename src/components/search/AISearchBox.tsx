import React, { useState } from 'react';
import {
  Sparkles,
  Bot,
  Send,
  Loader2,
  CheckCircle2,
  Sliders,
  ArrowRight,
  ShieldCheck,
  Tag,
  MapPin,
  IndianRupee,
  Wifi,
  X,
} from 'lucide-react';
import { searchService } from '../../services/searchService';
import { StructuredSearchCriteria, AISearchApiResponse } from '../../types';
import { Button } from '../ui/Button';

interface AISearchBoxProps {
  onApplyCriteria?: (criteria: StructuredSearchCriteria, fullResponse?: AISearchApiResponse) => void;
  onClose?: () => void;
  defaultPrompt?: string;
  isCompact?: boolean;
}

/**
 * Natural Language AI Search Box Component
 * 
 * SPOTPICKS CONVERSATIONAL SEARCH:
 * Allows users to type free-form natural language prompts like:
 * "Find me a quiet cafe near JNU where I can work with WiFi under ₹500"
 * 
 * Invokes server-side Gemini 3.7 AI with graceful rule-based fallback,
 * rendering a transparent visual filter breakdown that users can inspect and apply.
 */
export const AISearchBox: React.FC<AISearchBoxProps> = ({
  onApplyCriteria,
  onClose,
  defaultPrompt = '',
  isCompact = false,
}) => {
  const [prompt, setPrompt] = useState(defaultPrompt);
  const [isLoading, setIsLoading] = useState(false);
  const [extractedCriteria, setExtractedCriteria] = useState<StructuredSearchCriteria | null>(null);
  const [providerUsed, setProviderUsed] = useState<string>('gemini-3.7-flash');
  const [fallbackUsed, setFallbackUsed] = useState<boolean>(false);
  const [executionTime, setExecutionTime] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  const [lastResponse, setLastResponse] = useState<AISearchApiResponse | null>(null);

  const samplePrompts = [
    'Find me a quiet cafe near JNU where I can work with WiFi under ₹500',
    'Romantic rooftop dinner in Hauz Khas under ₹1500 with couple seating',
    'Affordable momos and street food near Majnu Ka Tilla under ₹200',
    'Student hostel or PG near North Campus with AC and high-speed WiFi',
    'Laptop motherboard repair in Nehru Place with same-day service',
    'Late night coffee and desserts open now in Connaught Place',
  ];

  const handleExecuteAISearch = async (queryText?: string) => {
    const textToSearch = (queryText || prompt).trim();
    if (!textToSearch) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await searchService.searchWithAI(textToSearch);
      if (response && response.aiCriteria) {
        setExtractedCriteria(response.aiCriteria);
        setProviderUsed(response.aiMetadata?.providerUsed || 'gemini');
        setFallbackUsed(Boolean(response.aiMetadata?.fallbackUsed));
        setExecutionTime(response.aiMetadata?.aiExecutionTimeMs || 0);
        setLastResponse(response);
      }
    } catch (err: any) {
      console.error('AI search failed:', err);
      setError(err.message || 'AI search parser error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleApply = () => {
    if (extractedCriteria && onApplyCriteria) {
      onApplyCriteria(extractedCriteria, lastResponse || undefined);
    }
  };

  return (
    <div className="bg-gradient-to-br from-indigo-950 via-slate-900 to-indigo-900 text-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-indigo-500/20 relative overflow-hidden">
      {/* Background ambient decorative glows */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-violet-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header Bar */}
      <div className="relative z-10 flex items-center justify-between pb-4 border-b border-indigo-500/20 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-500 to-violet-500 flex items-center justify-center shadow-lg shadow-indigo-500/25">
            <Sparkles className="h-5 w-5 text-white animate-pulse" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-black text-white flex items-center gap-2">
              <span>SpotPicks AI Intelligence Search</span>
              <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-indigo-500/30 text-indigo-300 border border-indigo-400/30">
                Gemini 3.7
              </span>
            </h2>
            <p className="text-xs text-indigo-200/70">
              Natural language understanding for Delhi-NCR spots, budgets, and vibes
            </p>
          </div>
        </div>

        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* Main Input Form */}
      <div className="relative z-10 space-y-4">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleExecuteAISearch();
          }}
          className="relative"
        >
          <div className="relative flex items-center">
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g. Find me a quiet cafe near JNU where I can work with WiFi under ₹500..."
              className="w-full bg-slate-950/80 border border-indigo-400/30 rounded-2xl py-4 pl-5 pr-32 text-sm sm:text-base text-white placeholder-slate-400 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/40 shadow-inner"
            />

            <button
              type="submit"
              disabled={isLoading || !prompt.trim()}
              className="absolute right-2 top-2 bottom-2 px-5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold text-xs sm:text-sm flex items-center gap-2 transition-all cursor-pointer shadow-md shadow-indigo-600/30"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Analyzing...</span>
                </>
              ) : (
                <>
                  <span>Search</span>
                  <Send className="h-3.5 w-3.5" />
                </>
              )}
            </button>
          </div>
        </form>

        {/* Quick Suggestion Chips */}
        <div className="space-y-2">
          <div className="flex items-center gap-1.5 text-xs text-indigo-300 font-semibold">
            <Bot className="h-3.5 w-3.5 text-indigo-400" />
            <span>Try asking natural questions:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {samplePrompts.map((sp, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  setPrompt(sp);
                  handleExecuteAISearch(sp);
                }}
                className="text-xs text-slate-300 bg-white/5 hover:bg-white/10 hover:text-white border border-white/10 rounded-xl px-3 py-1.5 transition-all text-left cursor-pointer"
              >
                "{sp}"
              </button>
            ))}
          </div>
        </div>

        {/* AI Analysis & Extraction Breakdown Card */}
        {extractedCriteria && (
          <div className="mt-6 bg-slate-900/90 border border-indigo-500/30 rounded-2xl p-5 space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                <span className="text-sm font-bold text-white">Extracted Search Filters</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-indigo-300">
                <span className="px-2 py-0.5 rounded-md bg-indigo-900/60 border border-indigo-700 text-[11px]">
                  Engine: {providerUsed}
                </span>
                {fallbackUsed && (
                  <span className="px-2 py-0.5 rounded-md bg-amber-900/60 text-amber-300 border border-amber-700 text-[11px]">
                    Fallback Engine
                  </span>
                )}
                <span className="text-[11px] text-slate-400">{executionTime}ms</span>
              </div>
            </div>

            {/* Structured Criteria Pills */}
            <div className="flex flex-wrap gap-2.5 items-center">
              {extractedCriteria.category && (
                <div className="flex items-center gap-1 px-3 py-1 rounded-xl bg-indigo-500/20 border border-indigo-400/30 text-indigo-200 text-xs font-semibold">
                  <Tag className="h-3 w-3 text-indigo-400" />
                  <span>Category: <strong>{extractedCriteria.category}</strong></span>
                </div>
              )}

              {extractedCriteria.locality && (
                <div className="flex items-center gap-1 px-3 py-1 rounded-xl bg-emerald-500/20 border border-emerald-400/30 text-emerald-200 text-xs font-semibold">
                  <MapPin className="h-3 w-3 text-emerald-400" />
                  <span>Locality: <strong>{extractedCriteria.locality}</strong></span>
                </div>
              )}

              {extractedCriteria.priceMax && (
                <div className="flex items-center gap-1 px-3 py-1 rounded-xl bg-amber-500/20 border border-amber-400/30 text-amber-200 text-xs font-semibold">
                  <IndianRupee className="h-3 w-3 text-amber-400" />
                  <span>Budget: <strong>&lt; ₹{extractedCriteria.priceMax}</strong></span>
                </div>
              )}

              {extractedCriteria.priceRange && (
                <div className="flex items-center gap-1 px-3 py-1 rounded-xl bg-violet-500/20 border border-violet-400/30 text-violet-200 text-xs font-semibold">
                  <span>Tier: <strong>{extractedCriteria.priceRange}</strong></span>
                </div>
              )}

              {extractedCriteria.amenities.map((amenity, i) => (
                <div
                  key={i}
                  className="flex items-center gap-1 px-3 py-1 rounded-xl bg-sky-500/20 border border-sky-400/30 text-sky-200 text-xs font-semibold"
                >
                  <Wifi className="h-3 w-3 text-sky-400" />
                  <span>{amenity}</span>
                </div>
              ))}

              {extractedCriteria.tags.map((tag, i) => (
                <div
                  key={i}
                  className="px-2.5 py-1 rounded-xl bg-white/5 border border-white/10 text-slate-300 text-xs"
                >
                  #{tag}
                </div>
              ))}
            </div>

            {/* Explanation Note */}
            {extractedCriteria.explanation && (
              <p className="text-xs text-slate-300/80 italic bg-white/5 p-3 rounded-xl border border-white/5">
                "{extractedCriteria.explanation}"
              </p>
            )}

            {/* Action Bar */}
            <div className="flex items-center justify-between pt-2">
              <span className="text-xs text-slate-400">
                Found {lastResponse?.pagination?.total || lastResponse?.data?.length || 0} matching spots
              </span>
              <Button
                variant="primary"
                size="sm"
                onClick={handleApply}
                className="bg-indigo-500 hover:bg-indigo-400 text-white font-bold flex items-center gap-2"
              >
                <span>View Filtered Results</span>
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        {/* Error Notification */}
        {error && (
          <div className="p-4 bg-rose-500/10 border border-rose-500/30 text-rose-300 rounded-xl text-xs">
            {error}
          </div>
        )}
      </div>
    </div>
  );
};
