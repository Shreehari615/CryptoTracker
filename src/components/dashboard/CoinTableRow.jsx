import React from 'react';
import { formatCurrency, formatPercentage } from '../../utils/formatters';
import SparklineChart from './SparklineChart';
import { formatLargeNumber } from '../../utils/formatters';

/**
 * CoinTableRow Component
 * 
 * Renders a single row in the cryptocurrency table.
 * Wrapped with React.memo to prevent unnecessary re-renders
 * when other rows in the table update.
 * 
 * @param {Object} coin - Coin data from CoinGecko API
 * @param {string} currency - Active currency (usd, inr, eur)
 * @param {Function} onSelect - Callback when row is clicked
 */
const CoinTableRow = React.memo(function CoinTableRow({ coin, currency, onSelect }) {
  const priceChange1h = coin.price_change_percentage_1h_in_currency;
  const priceChange24h = coin.price_change_percentage_24h_in_currency;
  const priceChange7d = coin.price_change_percentage_7d_in_currency;

  /**
   * Renders a color-coded percentage badge
   * Green with up arrow for positive, red with down arrow for negative
   */
  const renderChange = (value) => {
    if (value === null || value === undefined) {
      return <span className="text-gray-400">—</span>;
    }

    const isPositive = value >= 0;
    return (
      <span
        className={`inline-flex items-center gap-0.5 text-sm font-medium ${
          isPositive ? 'text-crypto-green' : 'text-crypto-red'
        }`}
      >
        <svg className="w-3 h-3" viewBox="0 0 12 12" fill="currentColor">
          {isPositive ? (
            <path d="M6 2l4 6H2z" />
          ) : (
            <path d="M6 10l4-6H2z" />
          )}
        </svg>
        {Math.abs(value).toFixed(2)}%
      </span>
    );
  };

  return (
    <tr
      onClick={() => onSelect(coin)}
      className="table-row-hover cursor-pointer border-b border-gray-100 dark:border-gray-800/50 
                 last:border-0 group"
      id={`coin-row-${coin.id}`}
    >
      {/* Rank */}
      <td className="py-4 px-3 text-sm text-gray-500 dark:text-gray-400 font-medium">
        {coin.market_cap_rank}
      </td>

      {/* Logo + Name + Symbol */}
      <td className="py-4 px-3">
        <div className="flex items-center gap-3">
          <img
            src={coin.image}
            alt={coin.name}
            className="w-8 h-8 rounded-full flex-shrink-0"
            loading="lazy"
            width={32}
            height={32}
          />
          <div className="min-w-0">
            <p className="text-sm font-semibold text-gray-900 dark:text-white truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
              {coin.name}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 uppercase">
              {coin.symbol}
            </p>
          </div>
        </div>
      </td>

      {/* Current Price */}
      <td className="py-4 px-3 text-sm font-semibold text-gray-900 dark:text-white text-right">
        {formatCurrency(coin.current_price, currency)}
      </td>

      {/* 1h Change */}
      <td className="py-4 px-3 text-right hidden md:table-cell">
        {renderChange(priceChange1h)}
      </td>

      {/* 24h Change */}
      <td className="py-4 px-3 text-right hidden md:table-cell">
        {renderChange(priceChange24h)}
      </td>

      {/* 7d Change */}
      <td className="py-4 px-3 text-right hidden lg:table-cell">
        {renderChange(priceChange7d)}
      </td>

      {/* Market Cap */}
      <td className="py-4 px-3 text-right hidden lg:table-cell">
        <span className="text-sm text-gray-700 dark:text-gray-300">
          {formatLargeNumber(coin.market_cap, currency)}
        </span>
      </td>

      {/* Total Volume */}
      <td className="py-4 px-3 text-right hidden xl:table-cell">
        <span className="text-sm text-gray-700 dark:text-gray-300">
          {formatLargeNumber(coin.total_volume, currency)}
        </span>
      </td>

      {/* 7d Sparkline Chart */}
      <td className="py-4 px-3 hidden xl:table-cell">
        <SparklineChart
          data={coin.sparkline_in_7d?.price}
          isPositive={(priceChange7d ?? 0) >= 0}
        />
      </td>
    </tr>
  );
});

export default CoinTableRow;
