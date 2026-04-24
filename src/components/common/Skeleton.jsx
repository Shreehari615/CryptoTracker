import React from 'react';

/**
 * Skeleton Loader Component
 * 
 * Displays a shimmering placeholder while data is loading.
 * Supports different shapes and sizes via props.
 * 
 * @param {string} className - Additional Tailwind classes for sizing
 * @param {string} variant - Shape variant: 'text', 'circle', 'rect'
 */
const Skeleton = React.memo(function Skeleton({ className = '', variant = 'rect' }) {
  const baseClasses = 'skeleton-shimmer animate-shimmer rounded';
  
  const variantClasses = {
    text: 'h-4 rounded',
    circle: 'rounded-full',
    rect: 'rounded-lg',
  };

  return (
    <div
      className={`${baseClasses} ${variantClasses[variant] || variantClasses.rect} ${className}`}
      aria-hidden="true"
      role="presentation"
    />
  );
});

/**
 * Table Skeleton — renders placeholder rows for the coin table
 * @param {number} rows - Number of skeleton rows to display
 */
export function TableSkeleton({ rows = 10 }) {
  return (
    <div className="space-y-2 p-4">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 py-3 px-4 rounded-lg">
          {/* Rank */}
          <Skeleton className="w-6 h-4" variant="text" />
          {/* Logo */}
          <Skeleton className="w-8 h-8 flex-shrink-0" variant="circle" />
          {/* Name + Symbol */}
          <div className="flex-1 space-y-1">
            <Skeleton className="w-24 h-4" variant="text" />
            <Skeleton className="w-12 h-3" variant="text" />
          </div>
          {/* Price */}
          <Skeleton className="w-20 h-4 hidden sm:block" variant="text" />
          {/* 1h change */}
          <Skeleton className="w-14 h-4 hidden md:block" variant="text" />
          {/* 24h change */}
          <Skeleton className="w-14 h-4 hidden md:block" variant="text" />
          {/* 7d change */}
          <Skeleton className="w-14 h-4 hidden lg:block" variant="text" />
          {/* Market cap */}
          <Skeleton className="w-24 h-4 hidden lg:block" variant="text" />
          {/* Volume */}
          <Skeleton className="w-20 h-4 hidden xl:block" variant="text" />
          {/* Sparkline */}
          <Skeleton className="w-28 h-10 hidden xl:block" variant="rect" />
        </div>
      ))}
    </div>
  );
}

/**
 * Card Skeleton — renders placeholder cards for trending/gainers sections
 */
export function CardSkeleton({ count = 5 }) {
  return (
    <div className="flex gap-3 overflow-hidden">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="flex-shrink-0 w-44 p-4 rounded-xl border border-gray-200 dark:border-gray-800 space-y-3"
        >
          <div className="flex items-center gap-2">
            <Skeleton className="w-8 h-8" variant="circle" />
            <div className="space-y-1 flex-1">
              <Skeleton className="w-16 h-4" variant="text" />
              <Skeleton className="w-10 h-3" variant="text" />
            </div>
          </div>
          <Skeleton className="w-20 h-4" variant="text" />
          <Skeleton className="w-14 h-3" variant="text" />
        </div>
      ))}
    </div>
  );
}

/**
 * Stats Bar Skeleton — placeholder for the global stats bar
 */
export function StatsBarSkeleton() {
  return (
    <div className="flex items-center gap-6 px-4 py-2">
      {Array.from({ length: 6 }).map((_, i) => (
        <Skeleton key={i} className="w-28 h-4" variant="text" />
      ))}
    </div>
  );
}

export default Skeleton;
