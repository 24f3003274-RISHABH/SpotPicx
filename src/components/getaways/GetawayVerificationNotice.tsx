import React from 'react';
import { ShieldAlert, Compass, Navigation, Info } from 'lucide-react';

export const GetawayVerificationNotice: React.FC = () => {
  return (
    <div className="rounded-2xl border border-sky-500/20 bg-sky-500/5 p-4 sm:p-5 text-slate-700 dark:text-slate-200">
      <div className="flex items-start gap-3">
        <div className="rounded-xl bg-sky-500/10 p-2 text-sky-600 dark:text-sky-400 shrink-0 mt-0.5">
          <Navigation className="h-5 w-5" />
        </div>
        <div className="space-y-1.5 text-xs sm:text-sm">
          <div className="flex items-center gap-2 font-bold text-sky-950 dark:text-sky-200">
            <span>Verified Transit & Travel Time Estimates</span>
            <span className="rounded-full bg-sky-500/20 px-2 py-0.5 text-[10px] uppercase tracking-wider font-extrabold text-sky-700 dark:text-sky-300">
              Reliability Standards
            </span>
          </div>
          <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
            All distances are measured from Central Delhi (Connaught Place / Dhaula Kuan / Akshardham). Travel times and road conditions are carefully sourced from verified highway authorities (NHAI, Yamuna Expressway Authority, Delhi-Mumbai Expressway NE-4) and railway timetables (IRCTC/Vande Bharat). Peak weekend city-exit delays (Friday evenings / Saturday mornings) should be factored into your journey.
          </p>
        </div>
      </div>
    </div>
  );
};
