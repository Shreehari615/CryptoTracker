import React from 'react';
import { Coins, Landmark, BarChart3, TrendingUp, Crown } from 'lucide-react';
import { formatLargeNumber } from '../../utils/formatters';
import { StatsBarSkeleton } from '../common/Skeleton';

const GlobalStatsBar = React.memo(function GlobalStatsBar({ globalData, loading, currency }) {
  if (loading || !globalData) {
    return (
      <div className="w-full bg-gray-50 dark:bg-surface-950 border-b border-gray-200 dark:border-gray-800">
        <StatsBarSkeleton />
      </div>
    );
  }

  const stats = [
    { label: 'Coins', value: globalData.active_cryptocurrencies?.toLocaleString() || '—', icon: <Coins size={12} className="text-amber-500" /> },
    { label: 'Exchanges', value: globalData.markets?.toLocaleString() || '—', icon: <Landmark size={12} className="text-blue-500" /> },
    { label: 'Market Cap', value: formatLargeNumber(globalData.total_market_cap?.[currency] || globalData.total_market_cap?.usd, currency), icon: <BarChart3 size={12} className="text-indigo-500" />, change: globalData.market_cap_change_percentage_24h_usd },
    { label: '24h Vol', value: formatLargeNumber(globalData.total_volume?.[currency] || globalData.total_volume?.usd, currency), icon: <TrendingUp size={12} className="text-crypto-green" /> },
    { label: 'Dominance', value: `BTC ${globalData.market_cap_percentage?.btc?.toFixed(1)}%  ETH ${globalData.market_cap_percentage?.eth?.toFixed(1)}%`, icon: <Crown size={12} className="text-yellow-500" /> },
  ];

  return (
    <div className="w-full bg-gray-50/80 dark:bg-surface-950/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-800/50">
      <div className="max-w-[1600px] mx-auto">
        <div className="flex items-center gap-4 md:gap-6 px-4 py-2 overflow-x-auto scrollbar-hide text-xs">
          {stats.map((stat) => (
            <div key={stat.label} className="flex items-center gap-1.5 flex-shrink-0 whitespace-nowrap">
              {stat.icon}
              <span className="text-gray-500 dark:text-gray-500 font-medium">{stat.label}:</span>
              <span className="text-gray-800 dark:text-gray-200 font-semibold">{stat.value}</span>
              {stat.change !== undefined && (
                <span className={`font-medium ${stat.change >= 0 ? 'text-crypto-green' : 'text-crypto-red'}`}>
                  {stat.change >= 0 ? '▲' : '▼'} {Math.abs(stat.change).toFixed(2)}%
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
});

export default GlobalStatsBar;
