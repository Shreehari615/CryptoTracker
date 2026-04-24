import React, { useState, useMemo } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';
import { RefreshCw } from 'lucide-react';
import { useCoinChart } from '../../hooks/useCoinChart';
import { formatCurrency } from '../../utils/formatters';
import Skeleton from '../common/Skeleton';

/**
 * PriceChart Component
 * 
 * Interactive area chart showing historical price data.
 * Features:
 * - 7D / 30D / 90D toggle buttons
 * - Retry button on error
 * - Gradient fill + responsive tooltip
 */
const PriceChart = React.memo(function PriceChart({ coinId, currency }) {
  const [days, setDays] = useState(7);
  const { chartData, loading, error, refetch } = useCoinChart(coinId, currency, days);

  // Calculate price change to determine chart color
  const priceChange = useMemo(() => {
    if (chartData.length < 2) return 0;
    return chartData[chartData.length - 1].price - chartData[0].price;
  }, [chartData]);

  const isPositive = priceChange >= 0;
  const chartColor = isPositive ? '#16c784' : '#ea3943';
  const gradientId = `priceGradient-${coinId}-${days}`;

  // Custom tooltip component
  const CustomTooltip = ({ active, payload }) => {
    if (!active || !payload || !payload.length) return null;
    const data = payload[0].payload;
    return (
      <div className="bg-white dark:bg-gray-800 px-3 py-2 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
        <p className="text-xs text-gray-500 dark:text-gray-400">{data.label}</p>
        <p className="text-sm font-bold text-gray-900 dark:text-white">
          {formatCurrency(data.price, currency)}
        </p>
      </div>
    );
  };

  // Format Y-axis ticks
  const formatYAxis = (value) => {
    if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
    if (value >= 1000) return `${(value / 1000).toFixed(1)}K`;
    if (value >= 1) return value.toFixed(2);
    return value.toFixed(4);
  };

  // Reduce X-axis label density
  const xAxisData = useMemo(() => {
    if (!chartData.length) return [];
    const interval = Math.max(1, Math.floor(chartData.length / 6));
    return chartData.map((d, i) => ({
      ...d,
      showLabel: i % interval === 0,
    }));
  }, [chartData]);

  // Time range options
  const timeOptions = [
    { label: '7D', value: 7 },
    { label: '30D', value: 30 },
    { label: '90D', value: 90 },
  ];

  return (
    <div>
      {/* Time Range Toggle */}
      <div className="flex items-center gap-2 mb-4">
        {timeOptions.map((option) => (
          <button
            key={option.value}
            onClick={() => setDays(option.value)}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all duration-200 ${
              days === option.value
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>

      {/* Chart Area */}
      <div className="h-64 md:h-72">
        {loading ? (
          <div className="h-full flex items-center justify-center">
            <Skeleton className="w-full h-full" variant="rect" />
          </div>
        ) : error ? (
          <div className="h-full flex flex-col items-center justify-center gap-3">
            <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
              <svg className="w-6 h-6 text-crypto-red" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4.5c-.77-.833-2.694-.833-3.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
              Failed to load chart data
            </p>
            <button
              onClick={refetch}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold 
                         bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg 
                         transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
            >
              <RefreshCw size={12} />
              Retry
            </button>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={xAxisData} margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
              <defs>
                <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={chartColor} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={chartColor} stopOpacity={0.02} />
                </linearGradient>
              </defs>
              
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="currentColor"
                className="text-gray-200 dark:text-gray-800"
                vertical={false}
              />
              
              <XAxis
                dataKey="label"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 10, fill: '#9ca3af' }}
                interval="preserveStartEnd"
                minTickGap={40}
              />
              
              <YAxis
                domain={['auto', 'auto']}
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 10, fill: '#9ca3af' }}
                tickFormatter={formatYAxis}
                width={55}
              />
              
              <Tooltip content={<CustomTooltip />} />
              
              <Area
                type="monotone"
                dataKey="price"
                stroke={chartColor}
                strokeWidth={2}
                fill={`url(#${gradientId})`}
                isAnimationActive={true}
                animationDuration={500}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
});

export default PriceChart;
