import React from 'react';
import { Link } from 'react-router-dom';
import { Route, Clock, Users, ArrowRight, CheckCircle } from 'lucide-react';
import { ReadingPathDefinition } from '../../types/book.types';

interface ReadingPathCardProps {
  path: ReadingPathDefinition;
}

export const ReadingPathCard: React.FC<ReadingPathCardProps> = ({ path }) => {
  const difficultyBadge = {
    BEGINNER: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    INTERMEDIATE: 'bg-blue-50 text-blue-700 border-blue-200',
    ADVANCED: 'bg-purple-50 text-purple-700 border-purple-200',
    COMPREHENSIVE: 'bg-indigo-50 text-indigo-700 border-indigo-200',
  }[path.difficulty];

  return (
    <div className="group flex flex-col justify-between p-6 rounded-2xl border border-gray-200/80 bg-white hover:border-indigo-200 hover:shadow-xl transition-all duration-300">
      <div>
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${difficultyBadge}`}>
            {path.difficulty}
          </span>
          <span className="text-xs font-semibold text-gray-500 flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-indigo-500" />
            {path.estimatedDuration}
          </span>
        </div>

        <Link to={`/books/paths/${path.slug}`}>
          <h3 className="text-lg font-bold text-gray-900 group-hover:text-indigo-600 transition-colors leading-snug mb-2">
            {path.title}
          </h3>
        </Link>

        <p className="text-xs text-gray-600 leading-relaxed line-clamp-3 mb-4">
          {path.description}
        </p>

        {/* Path Milestones Preview */}
        <div className="space-y-2 mb-4 bg-slate-50 p-3.5 rounded-xl border border-slate-100">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1">
            <Route className="w-3.5 h-3.5 text-indigo-600" />
            Curated Steps ({path.steps?.length || 0})
          </div>
          {path.steps?.slice(0, 3).map((step) => (
            <div key={step.order} className="flex items-start gap-2 text-xs text-slate-700">
              <span className="w-4 h-4 rounded-full bg-indigo-100 text-indigo-700 font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                {step.order}
              </span>
              <span className="line-clamp-1 font-medium">{step.title}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
        <span className="text-xs text-gray-500 line-clamp-1 max-w-[60%]">
          For: {path.targetAudience}
        </span>
        <Link
          to={`/books/paths/${path.slug}`}
          className="inline-flex items-center gap-1 text-xs font-bold text-indigo-600 hover:text-indigo-700 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-lg transition-colors"
        >
          View Roadmap <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
};
