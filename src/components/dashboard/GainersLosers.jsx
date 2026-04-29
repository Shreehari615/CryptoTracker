import React, { useMemo } from 'react';
import { formatCurrency, formatPercentage } from '../../utils/formatters';

/**
 * GainersLosers Component
 * 
 * Displays two side-by-side sections showing:
 * - Top 5 gainers (highest 24h % change)
 * - Top 5 losers (lowest 24h % change)
 * 
 * Derived from the main coins data — no additional API calls needed.
 */
const GainersLosers = React.memo(function GainersLosers({ coins, currency, onSelectCoin }) {
  // Compute top gainers and losers from the full coin list
  const { gainers, losers } = useMemo(() => {
    if (!coins || coins.length === 0) return { gainers: [], losers: [] };

    // Filter coins that have valid 24h change data
    const validCoins = coins.filter(
      (c) => c.price_change_percentage_24h_in_currency !== null &&
             c.price_change_percentage_24h_in_currency !== undefined
    );

    const sorted = [...validCoins].sort(
      (a, b) => b.price_change_percentage_24h_in_currency - a.price_change_percentage_24h_in_currency
    );

    return {
      gainers: sorted.slice(0, 5),
      losers: sorted.slice(-5).reverse(), // Reverse so biggest loser is first
    };
  }, [coins]);

  if (!coins || coins.length === 0) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Top Gainers */}
      <div className="bg-white dark:bg-surface-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-4 shadow-sm">
        <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
          <span className="w-6 h-6 rounded-full bg-crypto-green/10 flex items-center justify-center text-xs">🚀</span>
          Top Gainers (24h)
        </h3>
        <div className="space-y-2">
          {gainers.map((coin) => (
            <CoinMiniCard
              key={coin.id}
              coin={coin}
              currency={currency}
              type="gainer"
              onSelect={onSelectCoin}
            />
          ))}
        </div>
      </div>

      {/* Top Losers */}
      <div className="bg-white dark:bg-surface-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-4 shadow-sm">
        <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
          <span className="w-6 h-6 rounded-full bg-crypto-red/10 flex items-center justify-center text-xs">📉</span>
          Top Losers (24h)
        </h3>
        <div className="space-y-2">
          {losers.map((coin) => (
            <CoinMiniCard
              key={coin.id}
              coin={coin}
              currency={currency}
              type="loser"
              onSelect={onSelectCoin}
            />
          ))}
        </div>
      </div>
    </div>
  );
});

/**
 * CoinMiniCard — compact card for gainers/losers list items
 */
const CoinMiniCard = React.memo(function CoinMiniCard({ coin, currency, type, onSelect }) {
  const change = coin.price_change_percentage_24h_in_currency;
  const isPositive = change >= 0;

  return (
    <div
      className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors cursor-pointer"
      onClick={() => onSelect?.(coin)}
    >
      {/* Rank + Logo */}
      <img
        src={coin.image}
        alt={coin.name}
        className="w-7 h-7 rounded-full flex-shrink-0"
        loading="lazy"
        width={28}
        height={28}
      />

      {/* Name + Symbol */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
          {coin.name}
        </p>
        <p className="text-[11px] text-gray-500 dark:text-gray-400 uppercase">
          {coin.symbol}
        </p>
      </div>

      {/* Price + Change */}
      <div className="text-right flex-shrink-0">
        <p className="text-sm font-semibold text-gray-900 dark:text-white">
          {formatCurrency(coin.current_price, currency)}
        </p>
        <p
          className={`text-xs font-semibold ${
            isPositive ? 'text-crypto-green' : 'text-crypto-red'
          }`}
        >
          {isPositive ? '▲' : '▼'} {Math.abs(change).toFixed(2)}%
        </p>
      </div>
    </div>
  );
});

export default GainersLosers;
