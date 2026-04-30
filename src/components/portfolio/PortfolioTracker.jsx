import React, { useState, useCallback, useMemo } from 'react';
import { Plus, Trash2, X, Briefcase, TrendingUp, TrendingDown, DollarSign, PieChart, ChevronDown, ChevronUp } from 'lucide-react';
import { formatCurrency, formatPercentage } from '../../utils/formatters';

const ALLOC_COLORS = ['#6366f1','#8b5cf6','#06b6d4','#10b981','#f59e0b','#ef4444','#ec4899','#14b8a6','#f97316','#64748b'];

const PortfolioTracker = React.memo(function PortfolioTracker({ coins, currency, portfolio, addEntry, removeEntry, clearPortfolio, stats }) {
  const [showForm, setShowForm] = useState(false);
  const [expandedCoin, setExpandedCoin] = useState(null);
  const [form, setForm] = useState({ coinId: '', buyPrice: '', quantity: '', date: new Date().toISOString().split('T')[0] });

  const selectedCoin = useMemo(() => coins.find(c => c.id === form.coinId), [coins, form.coinId]);

  const handleSubmit = useCallback((e) => {
    e.preventDefault();
    if (!form.coinId || !form.buyPrice || !form.quantity) return;
    const coin = coins.find(c => c.id === form.coinId);
    if (!coin) return;
    addEntry({ coinId: coin.id, name: coin.name, symbol: coin.symbol, image: coin.image, buyPrice: parseFloat(form.buyPrice), quantity: parseFloat(form.quantity), date: form.date });
    setForm({ coinId: '', buyPrice: '', quantity: '', date: new Date().toISOString().split('T')[0] });
    setShowForm(false);
  }, [form, coins, addEntry]);

  if (portfolio.length === 0 && !showForm) {
    return (
      <div className="bg-white dark:bg-surface-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-12 text-center">
        <div className="w-16 h-16 rounded-full bg-indigo-100 dark:bg-indigo-900/20 flex items-center justify-center mx-auto mb-4">
          <Briefcase size={28} className="text-indigo-500" />
        </div>
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Start Your Portfolio</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 max-w-md mx-auto mb-6">Track your crypto investments, view allocation, and monitor profit/loss in real time.</p>
        <button onClick={() => setShowForm(true)} className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl transition-colors shadow-lg shadow-indigo-500/20">
          <Plus size={16} /> Add First Holding
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-surface-800 rounded-2xl border border-gray-200 dark:border-gray-800 p-5">
          <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 mb-1.5"><DollarSign size={14} className="text-indigo-500" />Current Value</div>
          <div className="text-2xl font-extrabold text-gray-900 dark:text-white">{formatCurrency(stats.currentValue, currency)}</div>
        </div>
        <div className="bg-white dark:bg-surface-800 rounded-2xl border border-gray-200 dark:border-gray-800 p-5">
          <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 mb-1.5"><Briefcase size={14} className="text-purple-500" />Total Invested</div>
          <div className="text-2xl font-extrabold text-gray-900 dark:text-white">{formatCurrency(stats.totalInvested, currency)}</div>
        </div>
        <div className={`rounded-2xl border p-5 ${stats.totalPnL >= 0 ? 'bg-emerald-50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800/50' : 'bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-800/50'}`}>
          <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 mb-1.5">
            {stats.totalPnL >= 0 ? <TrendingUp size={14} className="text-emerald-500" /> : <TrendingDown size={14} className="text-red-500" />}
            Total Profit / Loss
          </div>
          <div className={`text-2xl font-extrabold ${stats.totalPnL >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}>
            {stats.totalPnL >= 0 ? '+' : ''}{formatCurrency(stats.totalPnL, currency)}
          </div>
          <div className={`text-xs font-semibold mt-0.5 ${stats.totalPnL >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>{formatPercentage(stats.totalPnLPercent)}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Allocation Donut */}
        {stats.holdings.length > 0 && (
          <div className="bg-white dark:bg-surface-800 rounded-2xl border border-gray-200 dark:border-gray-800 p-5">
            <h3 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2 mb-4"><PieChart size={14} className="text-indigo-500" />Allocation</h3>
            <div className="flex justify-center">
              <svg viewBox="0 0 160 160" className="w-40 h-40">
                {(() => {
                  let cum = -90;
                  return stats.allocation.map((item, i) => {
                    const angle = (item.value / 100) * 360;
                    const start = cum; cum += angle;
                    const r = 60, cx = 80, cy = 80;
                    const s = (start * Math.PI) / 180, e = (cum * Math.PI) / 180;
                    const x1 = cx + r * Math.cos(s), y1 = cy + r * Math.sin(s);
                    const x2 = cx + r * Math.cos(e), y2 = cy + r * Math.sin(e);
                    if (angle < 0.5) return null;
                    return <path key={item.coinId} d={`M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${angle > 180 ? 1 : 0} 1 ${x2} ${y2} Z`} fill={ALLOC_COLORS[i % ALLOC_COLORS.length]} stroke="white" strokeWidth="2" className="dark:stroke-surface-800" />;
                  });
                })()}
                <circle cx="80" cy="80" r="35" className="fill-white dark:fill-surface-800" />
                <text x="80" y="77" textAnchor="middle" className="fill-gray-400 dark:fill-gray-500" style={{ fontSize: '10px' }}>Total</text>
                <text x="80" y="92" textAnchor="middle" className="fill-gray-900 dark:fill-white font-bold" style={{ fontSize: '12px' }}>{stats.holdings.length} coins</text>
              </svg>
            </div>
            <div className="mt-3 space-y-1.5">
              {stats.allocation.map((item, i) => (
                <div key={item.coinId} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: ALLOC_COLORS[i % ALLOC_COLORS.length] }} />
                    <span className="text-gray-700 dark:text-gray-300 font-medium">{item.name}</span>
                  </div>
                  <span className="text-gray-500 dark:text-gray-400 font-semibold">{item.value.toFixed(1)}%</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Holdings List */}
        <div className={`bg-white dark:bg-surface-800 rounded-2xl border border-gray-200 dark:border-gray-800 p-5 ${stats.holdings.length > 0 ? 'lg:col-span-2' : 'lg:col-span-3'}`}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2"><Briefcase size={14} className="text-indigo-500" />Your Holdings</h3>
            <div className="flex items-center gap-2">
              {portfolio.length > 0 && <button onClick={clearPortfolio} className="text-[10px] font-medium text-red-500 hover:text-red-600">Clear All</button>}
              <button onClick={() => setShowForm(!showForm)} className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors">
                <Plus size={12} /> Add
              </button>
            </div>
          </div>

          {/* Add Form */}
          {showForm && (
            <form onSubmit={handleSubmit} className="mb-4 p-4 rounded-xl bg-gray-50 dark:bg-surface-900 border border-gray-200 dark:border-gray-700 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">Add New Holding</span>
                <button type="button" onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600"><X size={14} /></button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <select value={form.coinId} onChange={e => setForm(p => ({...p, coinId: e.target.value}))} required className="w-full px-3 py-2 text-xs rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-surface-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500/50 focus:outline-none">
                  <option value="">Select Coin...</option>
                  {coins.map(c => <option key={c.id} value={c.id}>{c.name} ({c.symbol.toUpperCase()})</option>)}
                </select>
                <input type="date" value={form.date} onChange={e => setForm(p => ({...p, date: e.target.value}))} className="w-full px-3 py-2 text-xs rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-surface-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500/50 focus:outline-none" />
                <div className="relative">
                  <input type="number" step="any" min="0" placeholder="Buy Price" value={form.buyPrice} onChange={e => setForm(p => ({...p, buyPrice: e.target.value}))} required className="w-full px-3 py-2 text-xs rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-surface-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500/50 focus:outline-none" />
                  {selectedCoin && <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[9px] text-gray-400">Now: {formatCurrency(selectedCoin.current_price, currency)}</span>}
                </div>
                <input type="number" step="any" min="0" placeholder="Quantity" value={form.quantity} onChange={e => setForm(p => ({...p, quantity: e.target.value}))} required className="w-full px-3 py-2 text-xs rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-surface-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500/50 focus:outline-none" />
              </div>
              {form.buyPrice && form.quantity && <div className="text-[10px] text-gray-500">Total cost: {formatCurrency(parseFloat(form.buyPrice) * parseFloat(form.quantity), currency)}</div>}
              <button type="submit" className="w-full py-2 text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors">Add to Portfolio</button>
            </form>
          )}

          {/* Holdings rows */}
          <div className="space-y-2">
            {stats.holdings.map((h) => (
              <div key={h.coinId}>
                <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-surface-900 transition-colors cursor-pointer" onClick={() => setExpandedCoin(expandedCoin === h.coinId ? null : h.coinId)}>
                  <img src={h.image} alt={h.name} className="w-8 h-8 rounded-full" loading="lazy" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm font-semibold text-gray-900 dark:text-white truncate">{h.name}</span>
                      <span className="text-[10px] text-gray-400 uppercase">{h.symbol}</span>
                    </div>
                    <div className="text-[10px] text-gray-500">{h.quantity.toFixed(h.quantity < 1 ? 6 : 4)} coins • Avg {formatCurrency(h.avgBuyPrice, currency)}</div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className="text-sm font-bold text-gray-900 dark:text-white">{formatCurrency(h.currentValue, currency)}</div>
                    <div className={`text-[10px] font-semibold flex items-center justify-end gap-0.5 ${h.pnl >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                      {h.pnl >= 0 ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
                      {h.pnl >= 0 ? '+' : ''}{formatCurrency(h.pnl, currency)} ({formatPercentage(h.pnlPercent)})
                    </div>
                  </div>
                  <div className="text-gray-400">{expandedCoin === h.coinId ? <ChevronUp size={14} /> : <ChevronDown size={14} />}</div>
                </div>
                {expandedCoin === h.coinId && (
                  <div className="ml-11 mr-3 mb-2 space-y-1">
                    {h.entries.map(entry => (
                      <div key={entry.id} className="flex items-center justify-between px-3 py-2 rounded-lg bg-gray-50 dark:bg-surface-900 text-[10px]">
                        <span className="text-gray-500">{entry.date}</span>
                        <span className="text-gray-700 dark:text-gray-300 font-medium">{parseFloat(entry.quantity).toFixed(4)} @ {formatCurrency(parseFloat(entry.buyPrice), currency)}</span>
                        <span className="text-gray-500">= {formatCurrency(parseFloat(entry.buyPrice) * parseFloat(entry.quantity), currency)}</span>
                        <button onClick={e => { e.stopPropagation(); removeEntry(entry.id); }} className="text-red-400 hover:text-red-600 p-0.5"><Trash2 size={11} /></button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
});

export default PortfolioTracker;
