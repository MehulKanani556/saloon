import React from 'react';

const Skeleton = ({ className }) => (
  <div className={`animate-pulse bg-slate-200 rounded-xl ${className}`} />
);

export default Skeleton;

export const CardSkeleton = () => (
    <div className="glass-card p-6 border-white/60 shadow-premium">
        <div className="flex items-start justify-between">
            <Skeleton className="p-10 rounded-2xl w-14 h-14" />
            <Skeleton className="w-12 h-4 rounded-full" />
        </div>
        <div className="mt-6 flex flex-col gap-2">
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-8 w-32" />
        </div>
    </div>
)
