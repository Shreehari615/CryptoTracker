import React from 'react';
import { Star } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';
import SparklineChart from './SparklineChart';
import { formatLargeNumber } from '../../utils/formatters';

/**
 * CoinTableRow — CoinGecko-style row with readable font sizes.
 * Name shows inline with symbol, long names wrap to 2 lines.
 */
const CoinTableRow = React.memo(function CoinTableRow({ coin, currency, onSelect, isWatchlisted, onToggleWatchlist }) {
  const priceChange1h = coin.price_change_percentage_1h_in_currency;
  const priceChange24h = coin.price_change_percentage_24h_in_currency;
  const priceChange7d = coin.price_change_percentage_7d_in_currency;

  const renderChange = (value) => {
    if (value === null || value === undefined) {
      return <span className="text-gray-400">—</span>;
    }
    const isPositive = value >= 0;
    return (
      <span className={`inline-flex items-center gap-0.5 text-sm font-medium ${isPositive ? 'text-crypto-green' : 'text-crypto-red'}`}>
        <svg className="w-3 h-3" viewBox="0 0 12 12" fill="currentColor">
          {isPositive ? <path d="M6 2l4 6H2z" /> : <path d="M6 10l4-6H2z" />}
        </svg>
        {Math.abs(value).toFixed(2)}%
      </span>
    );
  };

  const handleStarClick = (e) => {
    e.stopPropagation();
    onToggleWatchlist?.(coin.id);
  };

  return (
    <tr
      onClick={() => onSelect(coin)}
      className="table-row-hover cursor-pointer border-b border-gray-100 dark:border-gray-800/50 last:border-0 group"
      id={`coin-row-${coin.id}`}
    >
      {/* Star — sticky */}
      <td className="py-4 px-2 text-center sticky left-0 z-[2] bg-white dark:bg-surface-900 group-hover:bg-gray-50 dark:group-hover:bg-gray-800/50 transition-colors">
        <button onClick={handleStarClick} className="p-0.5 hover:scale-125 transition-transform"
          title={isWatchlisted ? 'Remove from watchlist' : 'Add to watchlist'}>
          <Star size={16}
            className={isWatchlisted ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300 dark:text-gray-600 hover:text-yellow-400'} />
        </button>
      </td>

      {/* Rank — sticky */}
      <td className="py-4 px-2 text-sm text-gray-500 dark:text-gray-400 font-medium sticky left-[40px] z-[2] bg-white dark:bg-surface-900 group-hover:bg-gray-50 dark:group-hover:bg-gray-800/50 transition-colors">
        {coin.market_cap_rank}
      </td>

      {/* Coin — Logo + Name + Symbol inline, long names wrap — sticky */}
      <td className="py-4 px-3 sticky left-[84px] z-[2] bg-white dark:bg-surface-900 group-hover:bg-gray-50 dark:group-hover:bg-gray-800/50 transition-colors">
        <div className="flex items-center gap-2.5">
          <img src={coin.image} alt={coin.name} className="w-7 h-7 rounded-full flex-shrink-0" loading="lazy" width={28} height={28} />
          <div className="min-w-0">
            <span className="text-sm font-semibold text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors leading-snug">
              {coin.name}
            </span>
            {' '}
            <span className="text-xs text-gray-400 dark:text-gray-500 uppercase">{coin.symbol}</span>
          </div>
        </div>
      </td>

      {/* Price */}
      <td className="py-4 px-3 text-sm font-bold text-gray-900 dark:text-white text-right whitespace-nowrap">
        {formatCurrency(coin.current_price, currency)}
      </td>

      {/* 1h % */}
      <td className="py-4 px-3 text-right whitespace-nowrap">
        {renderChange(priceChange1h)}
      </td>

      {/* 24h % */}
      <td className="py-4 px-3 text-right whitespace-nowrap">
        {renderChange(priceChange24h)}
      </td>

      {/* 7d % */}
      <td className="py-4 px-3 text-right whitespace-nowrap">
        {renderChange(priceChange7d)}
      </td>

      {/* 24h Volume */}
      <td className="py-4 px-3 text-right whitespace-nowrap">
        <span className="text-sm text-gray-700 dark:text-gray-300">{formatLargeNumber(coin.total_volume, currency)}</span>
      </td>

      {/* Market Cap */}
      <td className="py-4 px-3 text-right whitespace-nowrap">
        <span className="text-sm text-gray-700 dark:text-gray-300">{formatLargeNumber(coin.market_cap, currency)}</span>
      </td>

      {/* Last 7 Days Sparkline */}
      <td className="py-4 px-3 text-right">
        <div className="inline-block">
          <SparklineChart data={coin.sparkline_in_7d?.price} isPositive={(priceChange7d ?? 0) >= 0} />
        </div>
      </td>
    </tr>
  );
});

export default CoinTableRow;
