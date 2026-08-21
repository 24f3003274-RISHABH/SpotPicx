import React from 'react';
import { RefreshCw, Home, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from './Button';
import { ROUTES } from '../../constants/routes';

interface FriendlyErrorProps {
  title?: string;
  message?: string;
  error?: any;
  onRetry?: () => void;
  showHomeButton?: boolean;
  className?: string;
}

export const FriendlyError: React.FC<FriendlyErrorProps> = ({
  title = 'Something went wrong',
  message,
  error,
  onRetry,
  showHomeButton = true,
  className = '',
}) => {
  // Translate technical errors into friendly consumer messages
  const getFriendlyMessage = (): string => {
    if (message) return message;
    if (!error) return 'We encountered a momentary issue while loading this page. Please try again.';

    const errStr = typeof error === 'string' ? error : error?.message || '';
    if (errStr.includes('404') || errStr.toLowerCase().includes('not found')) {
      return "We couldn't find the spot or collection you were looking for. It may have been moved or updated.";
    }
    if (errStr.includes('500') || errStr.toLowerCase().includes('internal server')) {
      return 'Our servers are taking a quick breath. Please refresh or try again in a moment.';
    }
    if (errStr.toLowerCase().includes('network') || errStr.toLowerCase().includes('failed to fetch')) {
      return 'Unable to connect right now. Please check your internet connection and try again.';
    }
    return 'Something went wrong on our end. Please try again.';
  };

  return (
    <div className={`p-8 md:p-12 text-center rounded-3xl border border-slate-200 bg-white shadow-xs space-y-4 max-w-lg mx-auto my-8 ${className}`}>
      <div className="w-14 h-14 mx-auto rounded-2xl bg-rose-50 text-rose-500 flex items-center justify-center shadow-2xs">
        <AlertCircle className="h-7 w-7" />
      </div>
      <div className="space-y-1.5">
        <h3 className="text-lg font-bold text-slate-900">{title}</h3>
        <p className="text-xs sm:text-sm text-slate-500 leading-relaxed max-w-sm mx-auto">
          {getFriendlyMessage()}
        </p>
      </div>

      <div className="pt-2 flex items-center justify-center gap-3">
        {onRetry && (
          <Button
            variant="outline"
            size="sm"
            onClick={onRetry}
            leftIcon={<RefreshCw className="h-3.5 w-3.5" />}
          >
            Try Again
          </Button>
        )}
        {showHomeButton && (
          <Link to={ROUTES.HOME}>
            <Button
              variant="secondary"
              size="sm"
              leftIcon={<Home className="h-3.5 w-3.5" />}
            >
              Back to Home
            </Button>
          </Link>
        )}
      </div>
    </div>
  );
};
