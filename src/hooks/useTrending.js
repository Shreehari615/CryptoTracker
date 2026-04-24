import { useState, useEffect, useCallback, useRef } from 'react';
import { fetchTrendingCoins } from '../services/api';

/**
 * Custom hook for fetching trending cryptocurrencies
 * 
 * Returns top 15 trending coins by search popularity (last 24h).
 * Auto-refreshes every 5 minutes (CoinGecko trending data updates every 10 min).
 * Initial fetch staggered 2s after page load to avoid rate limit.
 */
export function useTrending() {
  const [trending, setTrending] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const intervalRef = useRef(null);

  const fetchData = useCallback(async (showLoading = false) => {
    try {
      if (showLoading) setLoading(true);
      setError(null);

      const data = await fetchTrendingCoins();
      const coins = data.coins?.map(item => item.item) || [];
      setTrending(coins);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // Delayed initial fetch — stagger 2s after coins request
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchData(true);
    }, 2000);
    return () => clearTimeout(timer);
  }, [fetchData]);

  // Auto-refresh every 5 minutes
  useEffect(() => {
    intervalRef.current = setInterval(() => {
      fetchData(false);
    }, 300000);

    return () => clearInterval(intervalRef.current);
  }, [fetchData]);

  return { trending, loading, error };
}
