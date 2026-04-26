import React, { useState, useMemo } from 'react';
import { formatCurrency, formatLargeNumber } from '../../utils/formatters';

/**
 * CoinComparison — Select 2-4 coins and compare their metrics side by side.
 */
const CoinComparison = React.memo(function CoinComparison({ coins, currency }) {
  const [selectedIds, setSelectedIds] = useState(['bitcoin', 'ethereum']);

  const coinOptions = useMemo(() => {
    return coins.map((c) => ({ id: c.id, name: c.name, symbol: c.symbol.toUpperCase() }));
  }, [coins]);

  const selectedCoins = useMemo(() => {
    return selectedIds.map((id) => coins.find((c) => c.id === id)).filter(Boolean);
  }, [coins, selectedIds]);

  const handleChange = (index, newId) => {
    setSelectedIds((prev) => {
      const next = [...prev];
      next[index] = newId;
      return next;
    });
  };

  const addCoin = () => {
    if (selectedIds.length < 4) {
      const unused = coins.find((c) => !selectedIds.includes(c.id));
      if (unused) setSelectedIds((prev) => [...prev, unused.id]);
    }
  };

  const removeCoin = (index) => {
    if (selectedIds.length > 2) {
      setSelectedIds((prev) => prev.filter((_, i) => i !== index));
    }
  };

  const metrics = [
    { label: 'Price', render: (c) => formatCurrency(c.current_price, currency) },
    { label: 'Market Cap', render: (c) => formatLargeNumber(c.market_cap, currency) },
    { label: '24h Volume', render: (c) => formatLargeNumber(c.total_volume, currency) },
    { label: '1h %', render: (c) => renderPct(c.price_change_percentage_1h_in_currency) },
    { label: '24h %', render: (c) => renderPct(c.price_change_percentage_24h_in_currency) },
    { label: '7d %', render: (c) => renderPct(c.price_change_percentage_7d_in_currency) },
    { label: 'Market Cap Rank', render: (c) => `#${c.market_cap_rank}` },
    { label: 'Circulating Supply', render: (c) => c.circulating_supply?.toLocaleString() || '—' },
    { label: 'ATH', render: (c) => formatCurrency(c.ath, currency) },
    { label: 'ATL', render: (c) => formatCurrency(c.atl, currency) },
  ];

  function renderPct(val) {
    if (val == null) return '—';
    const isPos = val >= 0;
    return (
      <span className={isPos ? 'text-crypto-green' : 'text-crypto-red'}>
        {isPos ? '▲' : '▼'} {Math.abs(val).toFixed(2)}%
      </span>
    );
  }

  if (!coins.length) {
    return <div className="p-8 text-center text-sm text-gray-500">Loading...</div>;
  }

  return (
    <div className="p-5 md:p-6">
      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">Compare Coins</h3>
      <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">Select 2-4 coins to compare side by side</p>

      {/* Selectors */}
      <div className="flex flex-wrap gap-2 mb-5">
        {selectedIds.map((id, i) => (
          <div key={i} className="flex items-center gap-1">
            <select
              value={id}
              onChange={(e) => handleChange(i, e.target.value)}
              className="px-3 py-2 text-xs rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
            >
              {coinOptions.map((c) => (
                <option key={c.id} value={c.id}>{c.name} ({c.symbol})</option>
              ))}
            </select>
            {selectedIds.length > 2 && (
              <button onClick={() => removeCoin(i)} className="text-gray-400 hover:text-crypto-red text-xs px-1" title="Remove">✕</button>
            )}
          </div>
        ))}
        {selectedIds.length < 4 && (
          <button
            onClick={addCoin}
            className="px-3 py-2 text-xs rounded-lg border border-dashed border-gray-300 dark:border-gray-700 text-gray-500 hover:border-indigo-400 hover:text-indigo-500 transition-colors"
          >
            + Add Coin
          </button>
        )}
      </div>

      {/* Comparison Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-700">
              <th className="py-2 px-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase w-32">Metric</th>
              {selectedCoins.map((c) => (
                <th key={c.id} className="py-2 px-3 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <img src={c.image} alt={c.name} className="w-5 h-5 rounded-full" />
                    <span className="text-xs font-semibold text-gray-800 dark:text-gray-200">{c.symbol.toUpperCase()}</span>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {metrics.map((m) => (
              <tr key={m.label} className="border-b border-gray-100 dark:border-gray-800/50">
                <td className="py-2.5 px-3 text-xs font-medium text-gray-500 dark:text-gray-400">{m.label}</td>
                {selectedCoins.map((c) => (
                  <td key={c.id} className="py-2.5 px-3 text-right text-xs font-semibold text-gray-800 dark:text-gray-200 whitespace-nowrap">
                    {m.render(c)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
});

export default CoinComparison;
