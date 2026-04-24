import React, { useEffect, useCallback } from 'react';
import { X, TrendingUp, TrendingDown, Crown, BarChart3, Coins, Activity } from 'lucide-react';
import PriceChart from './PriceChart';
import { formatCurrency, formatLargeNumber, formatPercentage, formatFullDate } from '../../utils/formatters';

/**
 * CoinModal Component
 * 
 * Slide-in drawer showing detailed information about a selected coin.
 * Desktop: slides in from the right
 * Mobile: slides up from the bottom
 * 
 * Enhanced with:
 * - Market Cap Rank badge in header
 * - Prominent 1h / 24h / 7d change badges with icons
 * - ATH & ATL dates clearly displayed
 * - Fully diluted valuation
 * - Volume/Market Cap ratio
 */
const CoinModal = React.memo(function CoinModal({ coin, currency, onClose }) {
  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden'; // Prevent background scroll
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  // Prevent click inside modal from closing it
  const handleModalClick = useCallback((e) => {
    e.stopPropagation();
  }, []);

  if (!coin) return null;

  const priceChange24h = coin.price_change_percentage_24h_in_currency;
  const isPositive = (priceChange24h ?? 0) >= 0;

  // Calculate 24h High/Low bar position
  const highLowRange = (coin.high_24h || 0) - (coin.low_24h || 0);
  const currentPosition = highLowRange > 0
    ? ((coin.current_price - (coin.low_24h || 0)) / highLowRange) * 100
    : 50;

  // Price changes data with icons
  const priceChanges = [
    { label: '1h', value: coin.price_change_percentage_1h_in_currency },
    { label: '24h', value: coin.price_change_percentage_24h_in_currency },
    { label: '7d', value: coin.price_change_percentage_7d_in_currency },
  ];

  // Volume/Market Cap ratio
  const volMcapRatio = coin.market_cap > 0
    ? ((coin.total_volume / coin.market_cap) * 100).toFixed(2)
    : null;

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="coin-modal-title"
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-fade-in" />

      {/* Drawer Panel */}
      <div
        onClick={handleModalClick}
        className="relative w-full max-w-lg h-full bg-white dark:bg-surface-900 shadow-2xl 
                   overflow-y-auto animate-slide-in-right
                   md:rounded-l-2xl
                   max-md:absolute max-md:bottom-0 max-md:left-0 max-md:right-0 
                   max-md:max-w-none max-md:h-[90vh] max-md:rounded-t-2xl max-md:animate-slide-up"
      >
        {/* Header */}
        <div className="sticky top-0 z-10 bg-white/90 dark:bg-surface-900/90 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img
                src={coin.image}
                alt={coin.name}
                className="w-10 h-10 rounded-full"
                width={40}
                height={40}
              />
              <div>
                <h2 id="coin-modal-title" className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  {coin.name}
                  <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded">
                    {coin.symbol}
                  </span>
                </h2>
                <div className="flex items-center gap-2 mt-0.5">
                  {/* Market Cap Rank Badge */}
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-100 dark:bg-indigo-900/30 px-1.5 py-0.5 rounded-full">
                    <Crown size={10} />
                    Rank #{coin.market_cap_rank}
                  </span>
                </div>
              </div>
            </div>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label="Close modal"
              id="close-modal-btn"
            >
              <X size={20} className="text-gray-500" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="px-6 py-5 space-y-6">
          {/* Current Price */}
          <div>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">
              {formatCurrency(coin.current_price, currency)}
            </p>
            <div className="flex items-center gap-2 mt-1">
              <span
                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${
                  isPositive
                    ? 'bg-crypto-green/10 text-crypto-green'
                    : 'bg-crypto-red/10 text-crypto-red'
                }`}
              >
                {isPositive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                {formatPercentage(priceChange24h)}
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400">24h</span>
            </div>
          </div>

          {/* Price Change Badges — 1h / 24h / 7d */}
          <div className="grid grid-cols-3 gap-3">
            {priceChanges.map((item) => {
              const val = item.value;
              const pos = val !== null && val !== undefined && val >= 0;
              const Icon = pos ? TrendingUp : TrendingDown;
              return (
                <div
                  key={item.label}
                  className={`p-3 rounded-xl text-center border ${
                    val === null || val === undefined
                      ? 'border-gray-200 dark:border-gray-700'
                      : pos
                        ? 'border-crypto-green/20 bg-crypto-green/5'
                        : 'border-crypto-red/20 bg-crypto-red/5'
                  }`}
                >
                  <p className="text-[10px] uppercase font-semibold text-gray-500 dark:text-gray-400 mb-1">
                    {item.label}
                  </p>
                  <div className="flex items-center justify-center gap-1">
                    {val !== null && val !== undefined && (
                      <Icon size={12} className={pos ? 'text-crypto-green' : 'text-crypto-red'} />
                    )}
                    <p
                      className={`text-sm font-bold ${
                        val === null || val === undefined
                          ? 'text-gray-400'
                          : pos
                            ? 'text-crypto-green'
                            : 'text-crypto-red'
                      }`}
                    >
                      {val !== null && val !== undefined ? formatPercentage(val) : '—'}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* 24h High / Low Bar */}
          <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4">
            <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-2">
              <span>24h Low</span>
              <span>24h High</span>
            </div>
            <div className="relative h-2 rounded-full bg-gradient-to-r from-crypto-red via-yellow-400 to-crypto-green overflow-hidden">
              <div
                className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-white dark:bg-gray-200 border-2 border-gray-800 dark:border-white shadow-md"
                style={{ left: `calc(${Math.min(Math.max(currentPosition, 3), 97)}% - 6px)` }}
              />
            </div>
            <div className="flex justify-between text-xs font-semibold text-gray-900 dark:text-white mt-2">
              <span>{formatCurrency(coin.low_24h, currency)}</span>
              <span>{formatCurrency(coin.high_24h, currency)}</span>
            </div>
          </div>

          {/* Market Stats */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <BarChart3 size={14} className="text-indigo-500" />
              Market Stats
            </h3>
            
            <StatRow
              label="Market Cap Rank"
              value={`#${coin.market_cap_rank}`}
            />
            <StatRow
              label="Market Cap"
              value={formatLargeNumber(coin.market_cap, currency)}
            />
            <StatRow
              label="24h Trading Volume"
              value={formatLargeNumber(coin.total_volume, currency)}
            />
            {volMcapRatio && (
              <StatRow
                label="Volume / Market Cap"
                value={`${volMcapRatio}%`}
              />
            )}
            {coin.fully_diluted_valuation && (
              <StatRow
                label="Fully Diluted Valuation"
                value={formatLargeNumber(coin.fully_diluted_valuation, currency)}
              />
            )}
          </div>

          {/* Supply Info */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Coins size={14} className="text-indigo-500" />
              Supply
            </h3>

            <StatRow
              label="Circulating Supply"
              value={coin.circulating_supply
                ? `${coin.circulating_supply.toLocaleString()} ${coin.symbol?.toUpperCase()}`
                : '—'
              }
            />
            {coin.total_supply && (
              <StatRow
                label="Total Supply"
                value={`${coin.total_supply.toLocaleString()} ${coin.symbol?.toUpperCase()}`}
              />
            )}
            {coin.max_supply && (
              <StatRow
                label="Max Supply"
                value={`${coin.max_supply.toLocaleString()} ${coin.symbol?.toUpperCase()}`}
              />
            )}
            
            {/* Supply progress bar */}
            {coin.circulating_supply && coin.max_supply && (
              <div className="pt-1">
                <div className="flex justify-between text-[10px] text-gray-500 dark:text-gray-400 mb-1">
                  <span>Circulating</span>
                  <span>{((coin.circulating_supply / coin.max_supply) * 100).toFixed(1)}%</span>
                </div>
                <div className="h-1.5 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-indigo-500"
                    style={{ width: `${(coin.circulating_supply / coin.max_supply) * 100}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* All-Time High / Low */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Activity size={14} className="text-indigo-500" />
              All-Time Records
            </h3>
            
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-crypto-green/5 border border-crypto-green/20 rounded-xl p-3">
                <div className="flex items-center gap-1 mb-2">
                  <TrendingUp size={12} className="text-crypto-green" />
                  <p className="text-[10px] uppercase font-semibold text-gray-500 dark:text-gray-400">
                    All-Time High
                  </p>
                </div>
                <p className="text-sm font-bold text-crypto-green">
                  {formatCurrency(coin.ath, currency)}
                </p>
                <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-1 flex items-center gap-1">
                  📅 {formatFullDate(coin.ath_date)}
                </p>
                <p className="text-[10px] font-semibold text-crypto-red mt-0.5">
                  {coin.ath_change_percentage?.toFixed(1)}% from ATH
                </p>
              </div>
              <div className="bg-crypto-red/5 border border-crypto-red/20 rounded-xl p-3">
                <div className="flex items-center gap-1 mb-2">
                  <TrendingDown size={12} className="text-crypto-red" />
                  <p className="text-[10px] uppercase font-semibold text-gray-500 dark:text-gray-400">
                    All-Time Low
                  </p>
                </div>
                <p className="text-sm font-bold text-crypto-red">
                  {formatCurrency(coin.atl, currency)}
                </p>
                <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-1 flex items-center gap-1">
                  📅 {formatFullDate(coin.atl_date)}
                </p>
                <p className="text-[10px] font-semibold text-crypto-green mt-0.5">
                  +{coin.atl_change_percentage?.toFixed(1)}% from ATL
                </p>
              </div>
            </div>
          </div>

          {/* Price Chart */}
          <div>
            <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-3">
              Price Chart
            </h3>
            <PriceChart coinId={coin.id} currency={currency} />
          </div>
        </div>
      </div>
    </div>
  );
});

/**
 * StatRow — helper component for market stats key-value pairs
 */
function StatRow({ label, value }) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-800/50 last:border-0">
      <span className="text-xs text-gray-500 dark:text-gray-400">{label}</span>
      <span className="text-xs font-semibold text-gray-900 dark:text-white">{value}</span>
    </div>
  );
}

export default CoinModal;
