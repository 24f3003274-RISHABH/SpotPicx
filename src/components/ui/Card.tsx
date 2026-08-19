import React from 'react';
import { cn } from '../../utils/cn';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'flat' | 'interactive';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({
  className,
  variant = 'default',
  padding = 'md',
  children,
  ...props
}) => {
  const paddingMap = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };

  const variantMap = {
    default: 'bg-white border border-slate-200/80 shadow-sm rounded-2xl',
    flat: 'bg-slate-100/70 border border-slate-200/60 rounded-2xl',
    interactive:
      'bg-white border border-slate-200/80 shadow-sm hover:shadow-md hover:border-indigo-200 transition-all duration-200 cursor-pointer rounded-2xl',
  };

  return (
    <div className={cn(variantMap[variant], paddingMap[padding], className)} {...props}>
      {children}
    </div>
  );
};
