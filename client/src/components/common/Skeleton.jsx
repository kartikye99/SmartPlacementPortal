import React from 'react';

export const Skeleton = ({ className = '', rounded = 'rounded-xl' }) => {
  return (
    <div
      className={`bg-slate-800/80 animate-shimmer ${rounded} ${className}`}
    />
  );
};

export const SkeletonCard = () => {
  return (
    <div className="glass-panel rounded-2xl p-6 space-y-4">
      <div className="flex items-center justify-between">
        <Skeleton className="h-5 w-32" />
        <Skeleton className="h-8 w-8 rounded-full" />
      </div>
      <Skeleton className="h-8 w-24" />
      <Skeleton className="h-3 w-full" />
      <Skeleton className="h-3 w-2/3" />
    </div>
  );
};

export const SkeletonRow = () => {
  return (
    <div className="flex items-center gap-4 py-3 border-b border-slate-800/60">
      <Skeleton className="h-10 w-10 rounded-full shrink-0" />
      <div className="space-y-2 flex-1">
        <Skeleton className="h-4 w-40" />
        <Skeleton className="h-3 w-24" />
      </div>
      <Skeleton className="h-6 w-20 rounded-full" />
    </div>
  );
};
