import React from 'react';
import { ShieldCheck, Info } from 'lucide-react';

interface SpiritualVerificationNoticeProps {
  officialSource?: string;
  officialWebsite?: string;
  compact?: boolean;
}

export const SpiritualVerificationNotice: React.FC<SpiritualVerificationNoticeProps> = ({
  officialSource,
  officialWebsite,
  compact = false,
}) => {
  if (compact) {
    return (
      <div className="flex items-center gap-2 rounded-lg bg-amber-500/10 border border-amber-500/20 px-3 py-2 text-xs text-amber-800 dark:text-amber-300">
        <ShieldCheck className="h-4 w-4 shrink-0 text-amber-600 dark:text-amber-400" />
        <span>
          <strong>Notice:</strong> Please verify current timings, darshan rules, and festival schedules with the official source.
        </span>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-4 sm:p-5 text-sm text-slate-700 dark:text-slate-300">
      <div className="flex items-start gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400">
          <Info className="h-5 w-5" />
        </div>
        <div className="space-y-1.5 flex-1">
          <h4 className="font-semibold text-slate-900 dark:text-white">
            Authoritative & Verified Information Notice
          </h4>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            SpotPicks curates factual historical and architectural documentation without theological rankings or bias. Religious rituals, VIP darshan passes, camera rules, dress codes, and seasonal opening dates change frequently.
          </p>
          <div className="pt-1 flex flex-wrap items-center gap-2 text-xs font-medium text-amber-800 dark:text-amber-300">
            <span>Official Reference: {officialSource || 'Official Shrine Trust / State Tourism Department'}</span>
            {officialWebsite && (
              <>
                <span>•</span>
                <a
                  href={officialWebsite}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline hover:text-amber-900 dark:hover:text-amber-200 transition-colors"
                >
                  Visit Official Website →
                </a>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
