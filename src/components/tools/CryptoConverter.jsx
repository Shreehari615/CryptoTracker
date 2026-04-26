import React, { useState, useMemo, useCallback } from 'react';
import { ArrowDownUp } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';

/**
 * CryptoConverter — Convert between any two cryptocurrencies or fiat currencies.
 * Uses live prices from the coins data already fetched.
 */
const CryptoConverter = React.memo(function CryptoConverter({ coins, currency }) {
  const [fromId, setFromId] = useState('bitcoin');
  const [toId, setToId] = useState('ethereum');
  const [amount, setAmount] = useState('1');

  // Build list of available coins for dropdowns
  const coinOptions = useMemo(() => {
    if (!coins.length) return [];
    return coins.map((c) => ({
      id: c.id,
      name: c.name,
      symbol: c.symbol.toUpperCase(),
      price: c.current_price,
      image: c.image,
    }));
  }, [coins]);

  const fromCoin = useMemo(() => coinOptions.find((c) => c.id === fromId), [coinOptions, fromId]);
  const toCoin = useMemo(() => coinOptions.find((c) => c.id === toId), [coinOptions, toId]);

  // Calculate conversion
  const result = useMemo(() => {
    if (!fromCoin || !toCoin || !amount || isNaN(amount)) return null;
    const numAmount = parseFloat(amount);
    if (numAmount <= 0) return null;
    // Convert: amount * (fromPrice / toPrice)
    return (numAmount * fromCoin.price) / toCoin.price;
  }, [fromCoin, toCoin, amount]);

  const fiatValue = useMemo(() => {
    if (!fromCoin || !amount || isNaN(amount)) return 0;
    return parseFloat(amount) * fromCoin.price;
  }, [fromCoin, amount]);

  // Swap from/to
  const handleSwap = useCallback(() => {
    setFromId(toId);
    setToId(fromId);
  }, [fromId, toId]);

  if (!coins.length) {
    return (
      <div className="p-8 text-center text-sm text-gray-500 dark:text-gray-400">
        Loading coin data...
      </div>
    );
  }

  return (
    <div className="p-5 md:p-6">
      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
        Crypto Converter
      </h3>
      <p className="text-xs text-gray-500 dark:text-gray-400 mb-5">
        Convert between any two cryptocurrencies using live market prices
      </p>

      <div className="flex flex-col md:flex-row items-stretch md:items-end gap-4">
        {/* FROM */}
        <div className="flex-1 space-y-2">
          <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">From</label>
          <select
            value={fromId}
            onChange={(e) => setFromId(e.target.value)}
            className="w-full px-3 py-2.5 text-sm rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
          >
            {coinOptions.map((c) => (
              <option key={c.id} value={c.id}>{c.name} ({c.symbol})</option>
            ))}
          </select>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Enter amount"
            min="0"
            step="any"
            className="w-full px-3 py-2.5 text-sm rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 tabular-nums"
          />
        </div>

        {/* Swap Button */}
        <button
          onClick={handleSwap}
          className="self-center p-2.5 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-200 dark:hover:bg-indigo-800/40 transition-colors md:mb-1"
          title="Swap currencies"
        >
          <ArrowDownUp size={18} />
        </button>

        {/* TO */}
        <div className="flex-1 space-y-2">
          <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">To</label>
          <select
            value={toId}
            onChange={(e) => setToId(e.target.value)}
            className="w-full px-3 py-2.5 text-sm rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
          >
            {coinOptions.map((c) => (
              <option key={c.id} value={c.id}>{c.name} ({c.symbol})</option>
            ))}
          </select>
          {/* Result */}
          <div className="w-full px-3 py-2.5 text-sm rounded-xl bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 font-bold tabular-nums">
            {result !== null ? result.toLocaleString(undefined, { maximumFractionDigits: 8 }) : '—'}
          </div>
        </div>
      </div>

      {/* Summary */}
      {result !== null && fromCoin && toCoin && (
        <div className="mt-4 p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50 text-xs text-gray-600 dark:text-gray-400 space-y-1">
          <p>
            <span className="font-semibold text-gray-800 dark:text-gray-200">{parseFloat(amount)} {fromCoin.symbol}</span>
            {' = '}
            <span className="font-semibold text-gray-800 dark:text-gray-200">{result.toLocaleString(undefined, { maximumFractionDigits: 8 })} {toCoin.symbol}</span>
          </p>
          <p>
            ≈ {formatCurrency(fiatValue, currency)}
          </p>
          <p className="text-[10px] text-gray-400 dark:text-gray-500">
            1 {fromCoin.symbol} = {(fromCoin.price / toCoin.price).toLocaleString(undefined, { maximumFractionDigits: 8 })} {toCoin.symbol}
          </p>
        </div>
      )}
    </div>
  );
});

export default CryptoConverter;
