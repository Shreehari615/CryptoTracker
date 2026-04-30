import React, { useRef, useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { CardSkeleton } from '../common/Skeleton';

/**
 * TrendingCoins Component
 * 
 * Displays a horizontal scrollable section of trending cryptocurrencies
 * with left/right navigation arrows for easy browsing.
 * Data sourced from CoinGecko's /search/trending endpoint.
 * Each card shows rank, logo, name, symbol, and market cap rank.
 */
const TrendingCoins = React.memo(function TrendingCoins({ trending, loading, onSelectCoin, coins }) {
  const scrollRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  // Check scroll position to show/hide arrows
  const updateScrollState = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const tolerance = 2;
    setCanScrollLeft(el.scrollLeft > tolerance);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - tolerance);
  }, []);

  // Initialize scroll state + listen for resize
  useEffect(() => {
    updateScrollState();
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener('scroll', updateScrollState, { passive: true });
    window.addEventListener('resize', updateScrollState);
    return () => {
      el.removeEventListener('scroll', updateScrollState);
      window.removeEventListener('resize', updateScrollState);
    };
  }, [updateScrollState, trending]);

  // Smooth scroll by a fixed amount
  const scroll = useCallback((direction) => {
    const el = scrollRef.current;
    if (!el) return;
    const cardWidth = 204; // card width (192px) + gap (12px)
    const scrollAmount = cardWidth * 2; // scroll 2 cards at a time
    el.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    });
  }, []);

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
      {/* Header with navigation arrows */}
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
          🔥 Trending
        </h2>

        {/* Navigation arrows */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => scroll('left')}
            disabled={!canScrollLeft}
            className={`p-1.5 rounded-lg border transition-all duration-200
              ${canScrollLeft
                ? 'bg-white dark:bg-surface-800 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-indigo-50 dark:hover:bg-indigo-950/30 hover:border-indigo-300 dark:hover:border-indigo-600 hover:text-indigo-600 dark:hover:text-indigo-400 shadow-sm'
                : 'border-gray-100 dark:border-gray-800 text-gray-300 dark:text-gray-700 cursor-not-allowed'
              }`}
            aria-label="Scroll trending left"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            onClick={() => scroll('right')}
            disabled={!canScrollRight}
            className={`p-1.5 rounded-lg border transition-all duration-200
              ${canScrollRight
                ? 'bg-white dark:bg-surface-800 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-indigo-50 dark:hover:bg-indigo-950/30 hover:border-indigo-300 dark:hover:border-indigo-600 hover:text-indigo-600 dark:hover:text-indigo-400 shadow-sm'
                : 'border-gray-100 dark:border-gray-800 text-gray-300 dark:text-gray-700 cursor-not-allowed'
              }`}
            aria-label="Scroll trending right"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
      
      {/* Scrollable container with gradient fade edges */}
      <div className="relative">
        {/* Left fade */}
        {canScrollLeft && (
          <div className="absolute left-0 top-0 bottom-2 w-8 z-10 pointer-events-none
                          bg-gradient-to-r from-gray-50 dark:from-surface-950 to-transparent" />
        )}

        {/* Right fade */}
        {canScrollRight && (
          <div className="absolute right-0 top-0 bottom-2 w-8 z-10 pointer-events-none
                          bg-gradient-to-l from-gray-50 dark:from-surface-950 to-transparent" />
        )}

        <div
          ref={scrollRef}
          className="flex gap-3 overflow-x-auto scrollbar-hide pb-2 scroll-smooth"
        >
          {trending.slice(0, 10).map((coin, index) => (
            <div
              key={coin.id || index}
              className="flex-shrink-0 w-48 p-4 rounded-xl 
                         bg-white dark:bg-surface-800 
                         border border-gray-200 dark:border-gray-800
                         hover:border-indigo-300 dark:hover:border-indigo-600
                         hover:shadow-lg hover:shadow-indigo-500/5
                         transition-all duration-200 cursor-pointer group"
              onClick={() => {
                // Find full coin data from market coins list
                const fullCoin = coins?.find(c => c.id === coin.id);
                if (fullCoin) {
                  onSelectCoin?.(fullCoin);
                } else {
                  // Coin not in top 100 — build a minimal object from trending data
                  onSelectCoin?.({
                    id: coin.id,
                    name: coin.name,
                    symbol: coin.symbol,
                    image: coin.large || coin.small || coin.thumb,
                    market_cap_rank: coin.market_cap_rank,
                    current_price: coin.data?.price,
                    price_change_percentage_24h_in_currency: coin.data?.price_change_percentage_24h?.usd,
                    market_cap: coin.data?.market_cap ? parseFloat(String(coin.data.market_cap).replace(/[^0-9.]/g, '')) : null,
                    total_volume: coin.data?.total_volume ? parseFloat(String(coin.data.total_volume).replace(/[^0-9.]/g, '')) : null,
                    sparkline_in_7d: coin.data?.sparkline ? { price: coin.data.sparkline } : null,
                  });
                }
              }}
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
    </div>
  );
});

export default TrendingCoins;
