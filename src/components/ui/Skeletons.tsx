import React from 'react';

export const BusinessCardSkeleton: React.FC<{ viewMode?: 'grid' | 'list' }> = ({ viewMode = 'grid' }) => {
  if (viewMode === 'list') {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-4 flex flex-col sm:flex-row gap-4 animate-pulse">
        <div className="sm:w-64 h-44 bg-slate-200 rounded-xl shrink-0" />
        <div className="flex-1 flex flex-col justify-between py-1 space-y-3">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <div className="h-3 w-20 bg-slate-200 rounded" />
              <div className="h-4 w-12 bg-slate-200 rounded" />
            </div>
            <div className="h-5 w-3/4 bg-slate-200 rounded" />
            <div className="h-3 w-full bg-slate-100 rounded" />
            <div className="h-3 w-2/3 bg-slate-100 rounded" />
          </div>
          <div className="flex justify-between items-center pt-3 border-t border-slate-100">
            <div className="h-4 w-16 bg-slate-200 rounded" />
            <div className="h-6 w-20 bg-slate-200 rounded-lg" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden flex flex-col h-full animate-pulse">
      <div className="h-48 w-full bg-slate-200" />
      <div className="p-4 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <div className="h-3 w-24 bg-slate-200 rounded" />
            <div className="h-4 w-10 bg-slate-200 rounded" />
          </div>
          <div className="h-5 w-4/5 bg-slate-200 rounded" />
          <div className="h-3 w-full bg-slate-100 rounded" />
          <div className="h-3 w-2/3 bg-slate-100 rounded" />
        </div>
        <div className="flex justify-between items-center pt-3 border-t border-slate-100">
          <div className="h-3 w-24 bg-slate-200 rounded" />
          <div className="h-6 w-16 bg-slate-200 rounded-lg" />
        </div>
      </div>
    </div>
  );
};

export const CategoryCardSkeleton: React.FC = () => {
  return (
    <div className="p-5 bg-white rounded-2xl border border-slate-200 animate-pulse space-y-3">
      <div className="w-12 h-12 rounded-xl bg-slate-200" />
      <div className="h-4 w-28 bg-slate-200 rounded" />
      <div className="h-3 w-36 bg-slate-100 rounded" />
    </div>
  );
};

export const BusinessDetailSkeleton: React.FC = () => {
  return (
    <div className="py-8 space-y-8 animate-pulse">
      {/* Image Gallery Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-[380px]">
        <div className="md:col-span-2 h-full bg-slate-200 rounded-3xl" />
        <div className="hidden md:grid grid-rows-2 gap-4 h-full">
          <div className="bg-slate-200 rounded-2xl" />
          <div className="bg-slate-200 rounded-2xl" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="h-8 w-3/4 bg-slate-200 rounded" />
          <div className="h-4 w-1/2 bg-slate-100 rounded" />
          <div className="h-32 bg-slate-100 rounded-2xl" />
          <div className="h-48 bg-slate-100 rounded-2xl" />
        </div>
        <div className="space-y-6">
          <div className="h-64 bg-slate-200 rounded-2xl" />
          <div className="h-40 bg-slate-100 rounded-2xl" />
        </div>
      </div>
    </div>
  );
};
