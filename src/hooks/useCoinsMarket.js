import { useState, useEffect, useCallback, useRef } from 'react';
import { fetchCoinsMarkets } from '../services/api';

/**
 * Custom hook for fetching and managing coins market data
 * 
 * Features:
 * - Fetches top 100 coins by market cap
 * - Supports currency switching (USD, INR, EUR)
 * - Auto-refreshes every 60 seconds
 * - Tracks loading, error, and last-updated states
 * - Provides manual refresh capability
 */
export function useCoinsMarket(currency = 'usd') {
  const [coins, setCoins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const intervalRef = useRef(null);

  const fetchData = useCallback(async (showLoading = false) => {
    try {
      if (showLoading) setLoading(true);
      setError(null);

      const data = await fetchCoinsMarkets(currency, 1, 100);
      setCoins(data);
      setLastUpdated(new Date());
    } catch (err) {
      setError(err.message);
      // Don't clear existing data on refresh errors — keep stale data visible
    } finally {
      setLoading(false);
    }
  }, [currency]);

  // Initial fetch and refetch when currency changes
  useEffect(() => {
    fetchData(true);
  }, [fetchData]);

  // Auto-refresh polling every 60 seconds
  useEffect(() => {
    intervalRef.current = setInterval(() => {
      fetchData(false); // Silent refresh — no loading spinner
    }, 60000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [fetchData]);

  // Manual refresh function
  const refresh = useCallback(() => {
    fetchData(false);
  }, [fetchData]);

  return { coins, loading, error, lastUpdated, refresh };
}
