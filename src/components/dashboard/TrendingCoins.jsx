import React from 'react';
import { CardSkeleton } from '../common/Skeleton';

/**
 * TrendingCoins Component
 * 
 * Displays a horizontal scrollable section of trending cryptocurrencies.
 * Data sourced from CoinGecko's /search/trending endpoint.
 * Each card shows rank, logo, name, symbol, and market cap rank.
 */
const TrendingCoins = React.memo(function TrendingCoins({ trending, loading }) {
  if (loading) {
    return (
      <div>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
          🔥 Trending
        </h2>
        <CardSkeleton count={7} />
      </div>
    );
  }

  if (!trending || trending.length === 0) return null;

  return (
    <div>
      <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
        🔥 Trending
      </h2>
      
      <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2">
        {trending.slice(0, 10).map((coin, index) => (
          <div
            key={coin.id || index}
            className="flex-shrink-0 w-48 p-4 rounded-xl 
                       bg-white dark:bg-surface-800 
                       border border-gray-200 dark:border-gray-800
                       hover:border-indigo-300 dark:hover:border-indigo-600
                       hover:shadow-lg hover:shadow-indigo-500/5
                       transition-all duration-200 cursor-pointer group"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="relative">
                <img
                  src={coin.thumb || coin.small}
                  alt={coin.name}
                  className="w-8 h-8 rounded-full"
                  loading="lazy"
                  width={32}
                  height={32}
                />
                {/* Rank badge */}
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-indigo-600 text-[9px] text-white font-bold flex items-center justify-center">
                  {index + 1}
                </span>
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-gray-900 dark:text-white truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                  {coin.name}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 uppercase">
                  {coin.symbol}
                </p>
              </div>
            </div>

            {/* Market cap rank */}
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-500 dark:text-gray-400">
                MCap Rank
              </span>
              <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                #{coin.market_cap_rank || '—'}
              </span>
            </div>

            {/* Score indicator */}
            {coin.score !== undefined && (
              <div className="mt-2 flex items-center gap-1">
                <div className="flex-1 h-1 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-purple-500"
                    style={{ width: `${Math.min((coin.score + 1) * 10, 100)}%` }}
                  />
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
});

export default TrendingCoins;
