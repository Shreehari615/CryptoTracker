import { useState, useEffect, useCallback, useRef } from 'react';
import { fetchGlobalData } from '../services/api';

/**
 * Custom hook for fetching global cryptocurrency market data
 * 
 * Returns: total coins, exchanges, market cap, 24h volume,
 * BTC/ETH dominance percentages.
 * Auto-refreshes every 90 seconds (staggered from coins refresh).
 */
export function useGlobalData() {
  const [globalData, setGlobalData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const intervalRef = useRef(null);

  const fetchData = useCallback(async (showLoading = false) => {
    try {
      if (showLoading) setLoading(true);
      setError(null);

      const data = await fetchGlobalData();
      setGlobalData(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // Delayed initial fetch — stagger 1s after coins request
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchData(true);
    }, 1000);
    return () => clearTimeout(timer);
  }, [fetchData]);

  // Auto-refresh every 90 seconds (offset from coins to reduce rate limit pressure)
  useEffect(() => {
    intervalRef.current = setInterval(() => {
      fetchData(false);
    }, 90000);

    return () => clearInterval(intervalRef.current);
  }, [fetchData]);

  return { globalData, loading, error };
}
