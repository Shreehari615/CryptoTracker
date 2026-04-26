import { useState, useCallback, useEffect } from 'react';

const STORAGE_KEY = 'cryptotracker_watchlist';

/**
 * Custom hook for managing a coin watchlist with localStorage persistence.
 * 
 * @returns {{ watchlist, toggleWatchlist, isWatchlisted, clearWatchlist }}
 */
export function useWatchlist() {
  const [watchlist, setWatchlist] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // Sync to localStorage whenever watchlist changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(watchlist));
    } catch { /* ignore quota errors */ }
  }, [watchlist]);

  const toggleWatchlist = useCallback((coinId) => {
    setWatchlist((prev) =>
      prev.includes(coinId)
        ? prev.filter((id) => id !== coinId)
        : [...prev, coinId]
    );
  }, []);

  const isWatchlisted = useCallback(
    (coinId) => watchlist.includes(coinId),
    [watchlist]
  );

  const clearWatchlist = useCallback(() => {
    setWatchlist([]);
  }, []);

  return { watchlist, toggleWatchlist, isWatchlisted, clearWatchlist };
}
