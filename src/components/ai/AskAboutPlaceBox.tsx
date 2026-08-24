import React, { useState } from 'react';
import {
  Sparkles,
  Bot,
  Send,
  Loader2,
  ShieldCheck,
  CheckCircle2,
  HelpCircle,
  ExternalLink,
  Info,
  ChevronDown,
  RefreshCw,
  Lightbulb,
} from 'lucide-react';
import { Business, AskAboutPlaceResponse } from '../../types';
import { discoveryService } from '../../services/discoveryService';

interface AskAboutPlaceBoxProps {
  business: Business;
}

export const AskAboutPlaceBox: React.FC<AskAboutPlaceBoxProps> = ({ business }) => {
  const [question, setQuestion] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState<AskAboutPlaceResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const quickQuestions = [
    'Is this place good for couples or dates?',
    'What are the signature & most popular items to order?',
    'How do I reach here by Delhi Metro?',
    'Is parking available or valet provided?',
  ];

  const handleAsk = async (queryText?: string) => {
    const q = (queryText || question).trim();
    if (!q) return;

    setIsLoading(true);
    setError(null);

    try {
      const data = await discoveryService.askAboutPlace(business._id || business.slug, q);
      setResponse(data);
    } catch (err: any) {
      console.error('Ask about place error:', err);
      setError(
        err?.response?.data?.error?.message ||
        err?.message ||
        'Unable to answer question right now. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectQuick = (q: string) => {
    setQuestion(q);
    handleAsk(q);
  };

  return (
    <div className="bg-white rounded-3xl border border-indigo-100 shadow-sm p-6 sm:p-8 space-y-6 relative overflow-hidden">
      {/* Decorative accent */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50/50 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-md shadow-indigo-200">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <span>Ask AI About {business.name}</span>
              <span className="px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 text-[10px] font-bold tracking-wide uppercase">
                Grounded
              </span>
            </h3>
            <p className="text-xs text-slate-500">
              Get instant, verified answers about ambience, transit, food recommendations, and parking.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-[11px] text-slate-400 font-medium self-start sm:self-auto bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200/60">
          <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
          <span>Verified Spot Data</span>
        </div>
      </div>

      {/* Quick Prompt Suggestions */}
      <div className="space-y-2">
        <div className="flex items-center gap-1 text-xs font-semibold text-slate-500">
          <Lightbulb className="h-3.5 w-3.5 text-amber-500" />
          <span>Suggested Questions:</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {quickQuestions.map((q, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleSelectQuick(q)}
              disabled={isLoading}
              className="text-left text-xs bg-slate-50 hover:bg-indigo-50 hover:border-indigo-200 border border-slate-200 text-slate-700 hover:text-indigo-700 px-3 py-1.5 rounded-xl transition-colors cursor-pointer disabled:opacity-50"
            >
              {q}
            </button>
          ))}
        </div>
      </div>

      {/* Input Box */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleAsk();
        }}
        className="relative flex items-center"
      >
        <input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder={`Ask anything about ${business.name} (e.g., "Is it quiet for working?", "Nearest metro?")...`}
          disabled={isLoading}
          className="w-full pl-4 pr-24 py-3.5 rounded-2xl bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:bg-white focus:outline-none text-sm text-slate-900 placeholder:text-slate-400 transition-all shadow-inner"
        />
        <button
          type="submit"
          disabled={isLoading || !question.trim()}
          className="absolute right-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5 shadow-xs cursor-pointer"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
              <span>Checking...</span>
            </>
          ) : (
            <>
              <span>Ask AI</span>
              <Send className="h-3 w-3" />
            </>
          )}
        </button>
      </form>

      {/* Error display */}
      {error && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-center gap-2">
          <Info className="h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Loading state indicator */}
      {isLoading && (
        <div className="p-6 rounded-2xl bg-indigo-50/50 border border-indigo-100 flex items-center justify-center gap-3 text-xs text-indigo-700 animate-pulse">
          <Loader2 className="h-4 w-4 animate-spin text-indigo-600" />
          <span>Consulting verified venue attributes & Delhi transit intelligence...</span>
        </div>
      )}

      {/* AI Answer Card */}
      {response && !isLoading && (
        <div className="bg-slate-50/90 rounded-2xl border border-indigo-100 p-5 space-y-4 shadow-xs animate-in fade-in duration-300">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200/70">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
              <Bot className="h-4 w-4 text-indigo-600" />
              <span>Answer for: &ldquo;{response.question}&rdquo;</span>
            </div>
            <div className="flex items-center gap-2 text-[10px] text-slate-400">
              <span>{response.latencyMs}ms</span>
              <span className="px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold">
                {response.confidence} CONFIDENCE
              </span>
            </div>
          </div>

          {/* Answer Text */}
          <div className="text-sm text-slate-700 leading-relaxed whitespace-pre-line space-y-2">
            {response.answer}
          </div>

          {/* Highlights */}
          {response.highlights && response.highlights.length > 0 && (
            <div className="pt-3 border-t border-slate-200/60 flex flex-wrap items-center gap-2">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                Key Takeaways:
              </span>
              {response.highlights.map((hl, i) => (
                <span
                  key={i}
                  className="px-2.5 py-1 rounded-lg bg-white border border-indigo-100 text-indigo-800 text-xs font-medium shadow-2xs"
                >
                  ✓ {hl}
                </span>
              ))}
            </div>
          )}

          {/* Sources & Grounding Transparency */}
          {response.sources && response.sources.length > 0 && (
            <div className="pt-3 border-t border-slate-200/60 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-500">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="font-semibold text-slate-700">Verified Sources:</span>
                {response.sources.map((src, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-white border border-slate-200 text-slate-700"
                  >
                    <CheckCircle2 className="h-3 w-3 text-emerald-600" />
                    <span>{src.name}</span>
                    {src.url && (
                      <a
                        href={src.url}
                        target="_blank"
                        rel="noreferrer noopener"
                        className="text-indigo-600 hover:text-indigo-800 ml-0.5"
                      >
                        <ExternalLink className="h-2.5 w-2.5 inline" />
                      </a>
                    )}
                  </span>
                ))}
              </div>
              <span className="text-[10px] text-slate-400 italic">
                AI Place Concierge by SpotPicx & Gemini
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
