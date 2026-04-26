import React, { useState, useMemo } from 'react';
import { formatCurrency } from '../../utils/formatters';
import { TrendingUp, TrendingDown, AlertCircle } from 'lucide-react';

/**
 * ProfitCalculator — Calculate profit/loss on a crypto investment.
 * User enters: coin, buy price, quantity
 * Shows: current price (auto), profit/loss, return %
 */
const ProfitCalculator = React.memo(function ProfitCalculator({ coins, currency }) {
  const [coinId, setCoinId] = useState('bitcoin');
  const [buyPrice, setBuyPrice] = useState('');
  const [quantity, setQuantity] = useState('');
  const [validationMsg, setValidationMsg] = useState('');

  const selectedCoin = useMemo(() => coins.find((c) => c.id === coinId), [coins, coinId]);
  const currentPrice = selectedCoin?.current_price || 0;

  const result = useMemo(() => {
    setValidationMsg('');

    if (!buyPrice && !quantity) return null;

    const buy = parseFloat(buyPrice);
    const qty = parseFloat(quantity);

    if (!buyPrice || !quantity) {
      setValidationMsg('Please fill in all fields to calculate.');
      return null;
    }
    if (isNaN(buy) || buy <= 0) {
      setValidationMsg('Buy price must be a positive number.');
      return null;
    }
    if (isNaN(qty) || qty <= 0) {
      setValidationMsg('Quantity must be a positive number.');
      return null;
    }

    const investedAmount = buy * qty;
    const currentValue = qty * currentPrice;
    const profitLoss = currentValue - investedAmount;
    const returnPct = investedAmount > 0 ? (profitLoss / investedAmount) * 100 : 0;

    return { investedAmount, currentValue, profitLoss, returnPct, qty };
  }, [buyPrice, quantity, currentPrice]);

  if (!coins.length) {
    return <div className="p-8 text-center text-sm text-gray-500">Loading...</div>;
  }

  const isProfit = result && result.profitLoss >= 0;

  const fmt = (num) => num.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  return (
    <div className="p-5 md:p-6">
      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">Profit / Loss Calculator</h3>
      <p className="text-xs text-gray-500 dark:text-gray-400 mb-5">
        Calculate your investment returns based on current market prices
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
        {/* Coin Selector */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Coin</label>
          <select
            value={coinId}
            onChange={(e) => setCoinId(e.target.value)}
            className="w-full px-3 py-2.5 text-sm rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
          >
            {coins.map((c) => (
              <option key={c.id} value={c.id}>{c.name} ({c.symbol.toUpperCase()})</option>
            ))}
          </select>
        </div>

        {/* Buy Price */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">
            Coin price when you bought ({currency.toUpperCase()})
          </label>
          <input
            type="number"
            value={buyPrice}
            onChange={(e) => setBuyPrice(e.target.value)}
            placeholder="e.g. 50000"
            min="0"
            step="any"
            className="w-full px-3 py-2.5 text-sm rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 tabular-nums"
          />
          <p className="text-[10px] text-gray-400 dark:text-gray-500">Enter the market price of this coin at the time you invested.</p>
        </div>

        {/* Quantity */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Quantity (Coins)</label>
          <input
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            placeholder="e.g. 0.5"
            min="0"
            step="any"
            className="w-full px-3 py-2.5 text-sm rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 tabular-nums"
          />
        </div>

        {/* Current Price — auto-filled */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Current Price ({currency.toUpperCase()})</label>
          <div className="w-full px-3 py-2.5 text-sm rounded-xl bg-gray-100 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-semibold tabular-nums">
            {formatCurrency(currentPrice, currency)}
          </div>
          <p className="text-[10px] text-gray-400 dark:text-gray-500">Auto-filled from live market data.</p>
        </div>
      </div>

      {/* Validation Message */}
      {validationMsg && (
        <div className="flex items-center gap-2 mb-4 text-xs text-amber-600 dark:text-amber-400">
          <AlertCircle size={14} />
          {validationMsg}
        </div>
      )}

      {/* Result Card */}
      {result && (
        <div className={`rounded-xl p-4 border ${
          isProfit
            ? 'bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800'
            : 'bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-800'
        }`}>
          <div className="flex items-center gap-2 mb-3">
            {isProfit ? <TrendingUp size={18} className="text-crypto-green" /> : <TrendingDown size={18} className="text-crypto-red" />}
            <span className={`text-sm font-bold ${isProfit ? 'text-crypto-green' : 'text-crypto-red'}`}>
              {isProfit ? 'Profit' : 'Loss'}
            </span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div>
              <p className="text-[10px] text-gray-500 dark:text-gray-400 uppercase font-medium mb-0.5">Total Invested</p>
              <p className="text-sm font-bold text-gray-900 dark:text-white tabular-nums">{formatCurrency(result.investedAmount, currency)}</p>
            </div>
            <div>
              <p className="text-[10px] text-gray-500 dark:text-gray-400 uppercase font-medium mb-0.5">Current Value</p>
              <p className="text-sm font-bold text-gray-900 dark:text-white tabular-nums">{formatCurrency(result.currentValue, currency)}</p>
            </div>
            <div>
              <p className="text-[10px] text-gray-500 dark:text-gray-400 uppercase font-medium mb-0.5">Profit / Loss</p>
              <p className={`text-sm font-bold tabular-nums ${isProfit ? 'text-crypto-green' : 'text-crypto-red'}`}>
                {isProfit ? '+' : ''}{formatCurrency(result.profitLoss, currency)}
              </p>
            </div>
            <div>
              <p className="text-[10px] text-gray-500 dark:text-gray-400 uppercase font-medium mb-0.5">Return %</p>
              <p className={`text-sm font-bold tabular-nums ${isProfit ? 'text-crypto-green' : 'text-crypto-red'}`}>
                {isProfit ? '+' : ''}{fmt(result.returnPct)}%
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
});

export default ProfitCalculator;
