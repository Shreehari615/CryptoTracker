import { useState, useEffect, useCallback } from 'react';
import { fetchCoinChart } from '../services/api';

/**
 * Custom hook for fetching historical price chart data for a coin
 * 
 * Used inside the coin detail modal to render interactive price charts.
 * Transforms raw API data into Recharts-compatible format.
 * Exposes a refetch function for manual retry on error.
 * 
 * @param {string|null} coinId - CoinGecko coin ID (null = don't fetch)
 * @param {string} currency - Target currency
 * @param {number|string} days - Number of days of history (7, 30, 90, 'max')
 */
export function useCoinChart(coinId, currency = 'usd', days = 7) {
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    if (!coinId) return;

    try {
      setLoading(true);
      setError(null);

      const data = await fetchCoinChart(coinId, currency, days);

      // Transform API response into chart-friendly format
      // API returns: { prices: [[timestamp, price], ...] }
      const formatted = data.prices.map(([timestamp, price]) => ({
        date: timestamp,
        price: price,
        // Format date label based on time range
        label: days <= 1
          ? new Date(timestamp).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
          : days <= 7
            ? new Date(timestamp).toLocaleDateString('en-US', { weekday: 'short', hour: '2-digit' })
            : days <= 90
              ? new Date(timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
              : new Date(timestamp).toLocaleDateString('en-US', { month: 'short', year: '2-digit' }),
      }));

      setChartData(formatted);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [coinId, currency, days]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Expose refetch for manual retry
  const refetch = useCallback(() => {
    fetchData();
  }, [fetchData]);

  return { chartData, loading, error, refetch };
}
