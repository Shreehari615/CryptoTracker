import React, { useState, useMemo } from 'react';
import { formatCurrency } from '../../utils/formatters';
import { CalendarClock } from 'lucide-react';

/**
 * SIPCalculator — Systematic Investment Plan / Dollar Cost Averaging calculator.
 * User enters: coin, monthly investment, duration.
 * Shows: total invested, coins accumulated, projected value.
 */
const SIPCalculator = React.memo(function SIPCalculator({ coins, currency }) {
  const [coinId, setCoinId] = useState('bitcoin');
  const [monthlyAmount, setMonthlyAmount] = useState('');
  const [durationMonths, setDurationMonths] = useState(12);

  const selectedCoin = useMemo(() => coins.find((c) => c.id === coinId), [coins, coinId]);
  const currentPrice = selectedCoin?.current_price || 0;

  const result = useMemo(() => {
    if (!monthlyAmount || isNaN(monthlyAmount) || parseFloat(monthlyAmount) <= 0 || !currentPrice) return null;
    const monthly = parseFloat(monthlyAmount);
    const totalInvested = monthly * durationMonths;

    // DCA: buy same $ amount each month at current price (simplified)
    const coinsPerMonth = monthly / currentPrice;
    const totalCoins = coinsPerMonth * durationMonths;
    const currentValue = totalCoins * currentPrice;

    // Use 7d change to estimate monthly growth for projection
    const change7d = selectedCoin?.price_change_percentage_7d_in_currency || 0;
    const monthlyRate = (change7d / 100) * (30 / 7); // Approximate monthly from weekly

    // Simulate month-by-month DCA with price changes
    let totalCoinsProjected = 0;
    let projectedPrice = currentPrice;
    const monthlyBreakdown = [];

    for (let m = 1; m <= durationMonths; m++) {
      const coinsThisMonth = monthly / projectedPrice;
      totalCoinsProjected += coinsThisMonth;
      const cumulativeValue = totalCoinsProjected * projectedPrice;
      monthlyBreakdown.push({
        month: m,
        price: projectedPrice,
        coinsThisMonth,
        totalCoins: totalCoinsProjected,
        totalInvested: monthly * m,
        value: cumulativeValue,
      });
      projectedPrice = projectedPrice * (1 + monthlyRate);
    }

    const finalValue = totalCoinsProjected * projectedPrice;
    const totalGain = finalValue - totalInvested;
    const gainPct = totalInvested > 0 ? (totalGain / totalInvested) * 100 : 0;

    return { totalInvested, totalCoins: totalCoinsProjected, finalValue, totalGain, gainPct, monthlyBreakdown };
  }, [monthlyAmount, durationMonths, currentPrice, selectedCoin]);

  if (!coins.length) return <div className="p-8 text-center text-sm text-gray-500">Loading...</div>;

  const isProfit = result && result.totalGain >= 0;

  const durations = [
    { label: '3M', value: 3 },
    { label: '6M', value: 6 },
    { label: '1Y', value: 12 },
    { label: '2Y', value: 24 },
    { label: '3Y', value: 36 },
    { label: '5Y', value: 60 },
  ];

  return (
    <div className="p-5 md:p-6">
      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">SIP / DCA Calculator</h3>
      <p className="text-xs text-gray-500 dark:text-gray-400 mb-5">
        Calculate returns from systematic monthly investments (Dollar Cost Averaging)
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Coin</label>
          <select value={coinId} onChange={(e) => setCoinId(e.target.value)}
            className="w-full px-3 py-2.5 text-sm rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50">
            {coins.map((c) => <option key={c.id} value={c.id}>{c.name} ({c.symbol.toUpperCase()})</option>)}
          </select>
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Monthly Investment ({currency.toUpperCase()})</label>
          <input type="number" value={monthlyAmount} onChange={(e) => setMonthlyAmount(e.target.value)}
            placeholder="e.g. 500" min="0" step="any"
            className="w-full px-3 py-2.5 text-sm rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 tabular-nums" />
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Duration</label>
          <div className="flex flex-wrap gap-1.5">
            {durations.map((d) => (
              <button key={d.value} onClick={() => setDurationMonths(d.value)}
                className={`px-2.5 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                  durationMonths === d.value
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}>
                {d.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {result && (
        <div className={`rounded-xl p-4 border ${isProfit ? 'bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800' : 'bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-800'}`}>
          <div className="flex items-center gap-2 mb-3">
            <CalendarClock size={16} className="text-indigo-500" />
            <span className="text-xs font-semibold text-gray-600 dark:text-gray-400">
              After {durationMonths} months of {formatCurrency(parseFloat(monthlyAmount), currency)}/month
            </span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div>
              <p className="text-[10px] text-gray-500 uppercase font-medium mb-0.5">Total Invested</p>
              <p className="text-sm font-bold text-gray-900 dark:text-white tabular-nums">{formatCurrency(result.totalInvested, currency)}</p>
            </div>
            <div>
              <p className="text-[10px] text-gray-500 uppercase font-medium mb-0.5">Coins Accumulated</p>
              <p className="text-sm font-bold text-gray-900 dark:text-white tabular-nums">{result.totalCoins.toLocaleString(undefined, { maximumFractionDigits: 6 })}</p>
            </div>
            <div>
              <p className="text-[10px] text-gray-500 uppercase font-medium mb-0.5">Projected Value</p>
              <p className="text-sm font-bold text-gray-900 dark:text-white tabular-nums">{formatCurrency(result.finalValue, currency)}</p>
            </div>
            <div>
              <p className="text-[10px] text-gray-500 uppercase font-medium mb-0.5">Projected Gain</p>
              <p className={`text-sm font-bold tabular-nums ${isProfit ? 'text-crypto-green' : 'text-crypto-red'}`}>
                {isProfit ? '+' : ''}{result.gainPct.toFixed(1)}%
              </p>
            </div>
          </div>
          <p className="text-[10px] text-gray-400 mt-3">⚠ Based on recent 7-day trend projected forward. Not financial advice.</p>
        </div>
      )}
    </div>
  );
});

export default SIPCalculator;
