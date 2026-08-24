import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Bot,
  Send,
  Loader2,
  HelpCircle,
  MapPin,
  RefreshCw,
  Compass,
  ArrowRight,
  X,
  Search,
} from 'lucide-react';
import { searchService } from '../../services/searchService';
import { AskSpotPicksData } from '../../types';
import { AIResponseCard } from './AIResponseCard';

interface AskSpotPicksProps {
  initialQuestion?: string;
  onClose?: () => void;
  isCompact?: boolean;
}

const EXAMPLE_QUESTIONS = [
  'Best cafe near JNU under 500?',
  'Where can I take my girlfriend for a peaceful evening?',
  'Best momos near Connaught Place?',
  'Give me 5 places to visit in Delhi tonight.',
  'Where can I find cheap laptops near Nehru Place?',
  'Best family restaurants open now?',
];

export const AskSpotPicks: React.FC<AskSpotPicksProps> = ({
  initialQuestion = '',
  onClose,
  isCompact = false,
}) => {
  const [question, setQuestion] = useState(initialQuestion);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState<string>('Understanding question...');
  const [response, setResponse] = useState<AskSpotPicksData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAsk = async (queryToAsk?: string) => {
    const q = (queryToAsk || question).trim();
    if (!q) return;

    setIsLoading(true);
    setError(null);
    setLoadingStep('Understanding question...');

    const stepTimer1 = setTimeout(() => {
      setLoadingStep('Searching verified directory...');
    }, 900);

    const stepTimer2 = setTimeout(() => {
      setLoadingStep('Synthesizing recommendations with AI...');
    }, 2200);

    try {
      const data = await searchService.askSpotPicks(q);
      setResponse(data);
    } catch (err: any) {
      console.error('Ask SpotPicks error:', err);
      setError(
        err?.response?.data?.message ||
        err?.message ||
        'Unable to answer your question right now. Please try again.'
      );
    } finally {
      clearTimeout(stepTimer1);
      clearTimeout(stepTimer2);
      setIsLoading(false);
    }
  };

  const handleSelectExample = (ex: string) => {
    setQuestion(ex);
    handleAsk(ex);
  };

  const handleReset = () => {
    setQuestion('');
    setResponse(null);
    setError(null);
  };

  return (
    <div className="w-full space-y-6">
      {/* Search Input Container Card */}
      <div className="bg-gradient-to-br from-indigo-950 via-slate-900 to-indigo-900 text-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-indigo-500/25 relative overflow-hidden">
        {/* Ambient background glows */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-violet-600/15 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="relative z-10 flex items-center justify-between pb-4 border-b border-indigo-500/20 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-500 to-violet-500 flex items-center justify-center shadow-lg shadow-indigo-500/30">
              <Sparkles className="h-5 w-5 text-white animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                  Ask SpotPicx
                </h2>
                <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-indigo-500/30 text-indigo-300 border border-indigo-400/30">
                  Gemini AI Powered
                </span>
              </div>
              <p className="text-xs sm:text-sm text-indigo-200/80 font-normal">
                Tell us what you're looking for.
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

        {/* Question Form */}
        <div className="relative z-10 space-y-4">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleAsk();
            }}
            className="relative"
          >
            <div className="relative flex items-center">
              <input
                type="text"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="Ask any natural question (e.g. Best cafe near JNU under 500?)"
                className="w-full bg-slate-950/80 border border-indigo-400/30 rounded-2xl py-4 pl-5 pr-32 text-sm sm:text-base text-white placeholder-slate-400 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/40 shadow-inner"
              />

              <button
                type="submit"
                disabled={isLoading || !question.trim()}
                className="absolute right-2 top-2 bottom-2 px-5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold text-xs sm:text-sm flex items-center gap-2 transition-all cursor-pointer shadow-md shadow-indigo-600/30"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Thinking...</span>
                  </>
                ) : (
                  <>
                    <span>Ask AI</span>
                    <Send className="h-3.5 w-3.5" />
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Loading Indicator with Animated Step Progress */}
          {isLoading && (
            <div className="flex items-center gap-2.5 p-3 rounded-xl bg-indigo-900/40 border border-indigo-500/30 text-xs text-indigo-200 animate-pulse">
              <Loader2 className="h-4 w-4 animate-spin text-indigo-400 shrink-0" />
              <span>{loadingStep}</span>
            </div>
          )}

          {/* Examples Section */}
          <div className="space-y-2 pt-1">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs text-indigo-300 font-semibold">
                <Bot className="h-3.5 w-3.5 text-indigo-400" />
                <span>Try one of these questions:</span>
              </div>
              {response && (
                <button
                  type="button"
                  onClick={handleReset}
                  className="text-xs text-indigo-300 hover:text-white flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <RefreshCw className="h-3 w-3" />
                  <span>Ask another question</span>
                </button>
              )}
            </div>

            <div className="flex flex-wrap gap-2">
              {EXAMPLE_QUESTIONS.map((ex, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSelectExample(ex)}
                  className="text-xs text-slate-300 bg-white/5 hover:bg-white/10 hover:text-white border border-white/10 rounded-xl px-3 py-1.5 transition-all text-left cursor-pointer"
                >
                  "{ex}"
                </button>
              ))}
            </div>
          </div>

          {/* Error Notification */}
          {error && (
            <div className="p-4 bg-rose-500/10 border border-rose-500/30 text-rose-300 rounded-xl text-xs">
              {error}
            </div>
          )}
        </div>
      </div>

      {/* AI Answer Response Card */}
      {response && (
        <div className="relative z-10">
          <AIResponseCard data={response} />
        </div>
      )}
    </div>
  );
};
