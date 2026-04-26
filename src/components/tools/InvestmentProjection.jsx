import React, { useState, useMemo } from 'react';
import { formatCurrency } from '../../utils/formatters';
import { Coins, TrendingUp } from 'lucide-react';

/**
 * InvestmentProjection — If I invest $X today, how much coin do I get?
 * Projects future value based on historical growth rates.
 */
const InvestmentProjection = React.memo(function InvestmentProjection({ coins, currency }) {
  const [coinId, setCoinId] = useState('bitcoin');
  const [investAmount, setInvestAmount] = useState('');

  const selectedCoin = useMemo(() => coins.find((c) => c.id === coinId), [coins, coinId]);
  const currentPrice = selectedCoin?.current_price || 0;

  const projection = useMemo(() => {
    if (!investAmount || isNaN(investAmount) || parseFloat(investAmount) <= 0 || !currentPrice) return null;
    const amount = parseFloat(investAmount);
    const coinsBought = amount / currentPrice;

    // Use 7d change to project (annualized)
    const change7d = selectedCoin?.price_change_percentage_7d_in_currency || 0;
    const weeklyRate = change7d / 100;

    // Projected values at different timeframes
    const project = (weeks) => {
      const futurePrice = currentPrice * Math.pow(1 + weeklyRate, weeks);
      const futureValue = coinsBought * futurePrice;
      const gain = futureValue - amount;
      const gainPct = (gain / amount) * 100;
      return { futurePrice, futureValue, gain, gainPct };
    };

    return {
      coinsBought,
      month1: project(4),
      month3: project(13),
      month6: project(26),
      year1: project(52),
      year2: project(104),
    };
  }, [investAmount, currentPrice, selectedCoin]);

  if (!coins.length) return <div className="p-8 text-center text-sm text-gray-500">Loading...</div>;

  return (
    <div className="p-5 md:p-6">
      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">Investment Projection</h3>
      <p className="text-xs text-gray-500 dark:text-gray-400 mb-5">
        See how much coin you get today and projected returns based on recent trends
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-5">
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Coin</label>
          <select value={coinId} onChange={(e) => setCoinId(e.target.value)}
            className="w-full px-3 py-2.5 text-sm rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50">
            {coins.map((c) => <option key={c.id} value={c.id}>{c.name} ({c.symbol.toUpperCase()})</option>)}
          </select>
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Invest Amount ({currency.toUpperCase()})</label>
          <input type="number" value={investAmount} onChange={(e) => setInvestAmount(e.target.value)}
            placeholder="e.g. 1000" min="0" step="any"
            className="w-full px-3 py-2.5 text-sm rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 tabular-nums" />
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Current Price</label>
          <div className="w-full px-3 py-2.5 text-sm rounded-xl bg-gray-100 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-semibold tabular-nums">
            {formatCurrency(currentPrice, currency)}
          </div>
        </div>
      </div>

      {projection && (
        <>
          {/* Coins bought today */}
          <div className="flex items-center gap-2 mb-4 p-3 rounded-xl bg-indigo-50 dark:bg-indigo-950/20 border border-indigo-200 dark:border-indigo-800">
            <Coins size={16} className="text-indigo-500" />
            <p className="text-sm text-gray-800 dark:text-gray-200">
              You get <span className="font-bold text-indigo-600 dark:text-indigo-400 tabular-nums">{projection.coinsBought.toLocaleString(undefined, { maximumFractionDigits: 8 })}</span> {selectedCoin?.symbol?.toUpperCase()} today
            </p>
          </div>

          {/* Projection table */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="py-2 px-3 text-left text-xs font-semibold text-gray-500 uppercase">Period</th>
                  <th className="py-2 px-3 text-right text-xs font-semibold text-gray-500 uppercase">Projected Price</th>
                  <th className="py-2 px-3 text-right text-xs font-semibold text-gray-500 uppercase">Value</th>
                  <th className="py-2 px-3 text-right text-xs font-semibold text-gray-500 uppercase">Gain/Loss</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { label: '1 Month', data: projection.month1 },
                  { label: '3 Months', data: projection.month3 },
                  { label: '6 Months', data: projection.month6 },
                  { label: '1 Year', data: projection.year1 },
                  { label: '2 Years', data: projection.year2 },
                ].map(({ label, data }) => {
                  const isPos = data.gain >= 0;
                  return (
                    <tr key={label} className="border-b border-gray-100 dark:border-gray-800/50">
                      <td className="py-2.5 px-3 text-xs font-medium text-gray-700 dark:text-gray-300">{label}</td>
                      <td className="py-2.5 px-3 text-right text-xs font-semibold text-gray-800 dark:text-gray-200 tabular-nums whitespace-nowrap">{formatCurrency(data.futurePrice, currency)}</td>
                      <td className="py-2.5 px-3 text-right text-xs font-semibold text-gray-800 dark:text-gray-200 tabular-nums whitespace-nowrap">{formatCurrency(data.futureValue, currency)}</td>
                      <td className={`py-2.5 px-3 text-right text-xs font-bold tabular-nums whitespace-nowrap ${isPos ? 'text-crypto-green' : 'text-crypto-red'}`}>
                        {isPos ? '+' : ''}{data.gainPct.toFixed(1)}%
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <p className="text-[10px] text-gray-400 mt-2">⚠ Projections based on recent 7-day trend. Past performance does not guarantee future results.</p>
        </>
      )}
    </div>
  );
});

export default InvestmentProjection;
