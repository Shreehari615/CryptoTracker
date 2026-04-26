import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { ArrowUpDown, ArrowUp, ArrowDown, RefreshCw } from 'lucide-react';
import CoinTableRow from './CoinTableRow';
import { TableSkeleton } from '../common/Skeleton';
import ErrorState from '../common/ErrorState';

/**
 * CoinTable Component
 * 
 * Main data table displaying the top 100 cryptocurrencies.
 * Features:
 * - Sortable column headers (Price, 24h %, Market Cap)
 * - Sticky table header
 * - Live countdown timer "Updated at HH:MM:SS • Refreshing in XXs"
 * - No-results message for empty search
 * - Auto-refresh indicator
 * - Click row to open coin detail modal
 */

// Refresh interval in seconds
const REFRESH_INTERVAL = 60;

const CoinTable = React.memo(function CoinTable({
  coins,
  loading,
  error,
  currency,
  lastUpdated,
  onRefresh,
  onSelectCoin,
  searchQuery,
  isWatchlisted,
  onToggleWatchlist,
}) {
  // --- Sort State (single object to avoid React batching issues) ---
  const [sort, setSort] = useState({ key: null, dir: 'desc' });

  // --- Countdown Timer State ---
  const [countdown, setCountdown] = useState(REFRESH_INTERVAL);
  const countdownRef = useRef(null);

  // Reset countdown whenever lastUpdated changes (i.e., API refetched)
  useEffect(() => {
    setCountdown(REFRESH_INTERVAL);

    if (countdownRef.current) clearInterval(countdownRef.current);

    countdownRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) return REFRESH_INTERVAL;
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (countdownRef.current) clearInterval(countdownRef.current);
    };
  }, [lastUpdated]);

  // --- Sort Handler (single setState, no batching issues) ---
  const handleSort = useCallback((key) => {
    setSort((prev) => {
      if (prev.key === key) {
        // Same column — toggle asc/desc
        return { key, dir: prev.dir === 'desc' ? 'asc' : 'desc' };
      }
      // New column — default descending
      return { key, dir: 'desc' };
    });
  }, []);

  // --- Reset sort (used by refresh button) ---
  const resetSort = useCallback(() => {
    setSort({ key: null, dir: 'desc' });
  }, []);

  // --- Sorted Coins (memoized) ---
  const sortedCoins = useMemo(() => {
    if (!sort.key || !coins.length) return coins;

    const keyMap = {
      price: 'current_price',
      change1h: 'price_change_percentage_1h_in_currency',
      change24h: 'price_change_percentage_24h_in_currency',
      change7d: 'price_change_percentage_7d_in_currency',
      volume: 'total_volume',
      marketCap: 'market_cap',
    };

    const field = keyMap[sort.key];
    if (!field) return coins;

    return [...coins].sort((a, b) => {
      const aVal = a[field] ?? 0;
      const bVal = b[field] ?? 0;
      return sort.dir === 'asc' ? aVal - bVal : bVal - aVal;
    });
  }, [coins, sort]);

  // --- Sort Icon Helper (active = inline, inactive = absolute so no space taken) ---
  const renderSortIcon = (key) => {
    if (sort.key !== key) {
      return null; // No icon when not sorting — hover effect handled by CSS
    }
    return sort.dir === 'asc'
      ? <ArrowUp size={12} className="inline-block text-indigo-500 ml-1 align-middle" />
      : <ArrowDown size={12} className="inline-block text-indigo-500 ml-1 align-middle" />;
  };

  // Format lastUpdated time as HH:MM:SS
  const formattedTime = lastUpdated
    ? lastUpdated.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true })
    : '';

  // --- Loading state — show skeleton ---
  if (loading && coins.length === 0) {
    return (
      <div className="bg-white dark:bg-surface-900 rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden">
        <TableSkeleton rows={15} />
      </div>
    );
  }

  // --- Error state with no cached data ---
  if (error && coins.length === 0) {
    return (
      <div className="bg-white dark:bg-surface-900 rounded-2xl border border-gray-200 dark:border-gray-800">
        <ErrorState message={error} onRetry={onRefresh} />
      </div>
    );
  }

  // Sortable header class — text-right aligns both text and inline sort icon to right edge
  const sortableThClass = `py-3 px-3 text-right text-xs font-semibold text-gray-500 dark:text-gray-400 
                            uppercase tracking-wider cursor-pointer select-none whitespace-nowrap
                            hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors group/th`;

  return (
    <div className="bg-white dark:bg-surface-900 rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden shadow-sm">
      {/* Table Header Bar — countdown timer + refresh indicator */}
      <div className="flex items-center justify-between px-4 md:px-6 py-3 border-b border-gray-100 dark:border-gray-800/50">
        <h2 className="text-base font-bold text-gray-900 dark:text-white">
          Cryptocurrency Prices by Market Cap
        </h2>
        
        <div className="flex items-center gap-3">
          {/* Error banner for refresh failures */}
          {error && coins.length > 0 && (
            <button
              onClick={onRefresh}
              className="flex items-center gap-1.5 text-xs text-crypto-red font-medium 
                         hover:text-red-400 transition-colors"
            >
              <RefreshCw size={12} />
              Refresh failed — Retry
            </button>
          )}
          
          {/* Countdown timer + Refresh button */}
          {lastUpdated && !error && (
            <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
              <span className="relative flex h-2 w-2">
                <span className="animate-pulse-dot absolute inline-flex h-full w-full rounded-full bg-crypto-green opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-crypto-green"></span>
              </span>
              <span className="hidden sm:inline">
                Updated at {formattedTime} • Refresh in <span className="font-semibold text-gray-700 dark:text-gray-300 tabular-nums">{countdown}s</span>
              </span>
              <span className="sm:hidden tabular-nums">{countdown}s</span>
              {/* Manual refresh button — also resets sort to default */}
              <button
                onClick={() => { resetSort(); onRefresh(); }}
                className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 
                           text-gray-400 hover:text-indigo-500 transition-all"
                aria-label="Refresh data now"
                title="Refresh & reset sort"
              >
                <RefreshCw size={14} />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Scrollable table container — horizontal scroll shows all columns, Name stays frozen */}
      <div className="overflow-x-auto max-h-[70vh] overflow-y-auto">
        <table className="w-full" style={{ minWidth: '1050px' }}>
          {/* Sticky header (top) */}
          <thead className="sticky top-0 z-20 bg-gray-50 dark:bg-surface-800 shadow-sm">
            <tr>
              {/* Sticky: Star */}
              <th className="py-3 px-2 text-center text-xs font-semibold text-gray-500 dark:text-gray-400 w-[40px]
                             sticky left-0 z-[21] bg-gray-50 dark:bg-surface-800">
              </th>
              {/* Sticky: # */}
              <th className="py-3 px-2 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider w-[44px]
                             sticky left-[40px] z-[21] bg-gray-50 dark:bg-surface-800">
                #
              </th>
              {/* Sticky: Coin */}
              <th className="py-3 px-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider
                             sticky left-[84px] z-[21] bg-gray-50 dark:bg-surface-800">
                Coin
              </th>

              <th className={sortableThClass} onClick={() => handleSort('price')}>
                Price{renderSortIcon('price')}
              </th>
              <th className={sortableThClass} onClick={() => handleSort('change1h')}>
                1h{renderSortIcon('change1h')}
              </th>
              <th className={sortableThClass} onClick={() => handleSort('change24h')}>
                24h{renderSortIcon('change24h')}
              </th>
              <th className={sortableThClass} onClick={() => handleSort('change7d')}>
                7d{renderSortIcon('change7d')}
              </th>
              <th className={sortableThClass} onClick={() => handleSort('volume')}>
                24h Volume{renderSortIcon('volume')}
              </th>
              <th className={sortableThClass} onClick={() => handleSort('marketCap')}>
                Market Cap{renderSortIcon('marketCap')}
              </th>
              <th className="py-3 px-3 text-right text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider whitespace-nowrap">
                Last 7 Days
              </th>
            </tr>
          </thead>

          <tbody>
            {sortedCoins.map((coin) => (
              <CoinTableRow
                key={coin.id}
                coin={coin}
                currency={currency}
                onSelect={onSelectCoin}
                isWatchlisted={isWatchlisted?.(coin.id)}
                onToggleWatchlist={onToggleWatchlist}
              />
            ))}
          </tbody>
        </table>

        {/* No results message — shown when search yields empty results */}
        {sortedCoins.length === 0 && !loading && (
          <div className="flex flex-col items-center justify-center py-16 px-4">
            <div className="w-14 h-14 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-4">
              <svg className="w-7 h-7 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            {searchQuery ? (
              <>
                <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  No coins found for &ldquo;{searchQuery}&rdquo;
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Try searching with a different name or symbol.
                </p>
              </>
            ) : (
              <>
                <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  No cryptocurrency data available
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
                  Failed to load data. Please try again.
                </p>
                <button
                  onClick={onRefresh}
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold 
                             bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors"
                >
                  <RefreshCw size={12} />
                  Try Again
                </button>
              </>
            )}
          </div>
        )}
      </div>

      {/* Results count footer */}
      <div className="px-4 md:px-6 py-3 border-t border-gray-100 dark:border-gray-800/50">
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Showing {sortedCoins.length} cryptocurrencies
          {sort.key && (
            <span> • Sorted by <span className="font-medium text-gray-700 dark:text-gray-300">
              {{ price: 'Price', change1h: '1h Change', change24h: '24h Change', change7d: '7d Change', volume: '24h Volume', marketCap: 'Market Cap' }[sort.key]}
            </span> ({sort.dir === 'asc' ? 'low → high' : 'high → low'})</span>
          )}
        </p>
      </div>
    </div>
  );
});

export default CoinTable;
