import React from 'react';
import { Search, RotateCcw, AlertCircle, Sparkles } from 'lucide-react';
import { Button } from './Button';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  actionLabel,
  onAction,
  className = '',
}) => {
  return (
    <div
      className={`p-10 md:p-14 text-center rounded-3xl border border-dashed border-slate-300 bg-white space-y-4 ${className}`}
    >
      <div className="w-14 h-14 mx-auto rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center shadow-xs">
        {icon || <Search className="h-7 w-7" />}
      </div>
      <div className="max-w-md mx-auto space-y-1">
        <h3 className="text-lg font-bold text-slate-900">{title}</h3>
        <p className="text-xs text-slate-500 leading-relaxed">{description}</p>
      </div>
      {actionLabel && onAction && (
        <div className="pt-2">
          <Button variant="outline" size="sm" onClick={onAction} leftIcon={<RotateCcw className="h-3.5 w-3.5" />}>
            {actionLabel}
          </Button>
        </div>
      )}
    </div>
  );
};
