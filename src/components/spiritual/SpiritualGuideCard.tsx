import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Clock, ArrowRight } from 'lucide-react';
import { SpiritualGuide } from '../../types/spiritual.types';

interface SpiritualGuideCardProps {
  guide: SpiritualGuide;
}

export const SpiritualGuideCard: React.FC<SpiritualGuideCardProps> = ({ guide }) => {
  return (
    <Link
      to={`/india/spiritual/guide/${guide.slug}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 transition-all duration-300 hover:shadow-xl hover:border-amber-500/30 hover:-translate-y-1"
    >
      <div className="relative aspect-[16/9] w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
        <img
          src={guide.heroImage}
          alt={guide.title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        
        <div className="absolute top-3 left-3">
          <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/90 text-white px-2.5 py-1 text-xs font-semibold backdrop-blur-md shadow-sm">
            <BookOpen className="h-3 w-3" />
            {guide.category}
          </span>
        </div>

        <div className="absolute bottom-3 right-3">
          <span className="inline-flex items-center gap-1 rounded-full bg-black/60 backdrop-blur-md px-2.5 py-0.5 text-xs text-white/90 font-medium">
            <Clock className="h-3 w-3 text-amber-400" />
            {guide.readTime}
          </span>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-5 justify-between space-y-3">
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors line-clamp-2">
            {guide.title}
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 mt-1.5 leading-relaxed">
            {guide.subtitle}
          </p>
        </div>

        <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs font-semibold text-amber-600 dark:text-amber-400">
          <span>Read Comprehensive Guide</span>
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </div>
      </div>
    </Link>
  );
};
