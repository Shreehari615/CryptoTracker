import { useState, useCallback, useEffect, useMemo } from 'react';

const STORAGE_KEY = 'cryptotracker_portfolio';

/**
 * Custom hook for managing a cryptocurrency portfolio with localStorage persistence.
 * 
 * Each entry: { id, coinId, name, symbol, image, buyPrice, quantity, date }
 * 
 * @param {Array} coins - Live market coins data for current price lookup
 * @returns {{ portfolio, addEntry, removeEntry, clearPortfolio, getPortfolioStats }}
 */
export function usePortfolio(coins = []) {
  const [portfolio, setPortfolio] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(portfolio));
    } catch { /* ignore quota errors */ }
  }, [portfolio]);

  const addEntry = useCallback((entry) => {
    setPortfolio((prev) => [
      ...prev,
      {
        ...entry,
        id: Date.now().toString(36) + Math.random().toString(36).slice(2, 7),
        date: entry.date || new Date().toISOString().split('T')[0],
      },
    ]);
  }, []);

  const removeEntry = useCallback((entryId) => {
    setPortfolio((prev) => prev.filter((e) => e.id !== entryId));
  }, []);

  const clearPortfolio = useCallback(() => {
    setPortfolio([]);
  }, []);

  // Compute portfolio statistics using live prices
  const stats = useMemo(() => {
    if (portfolio.length === 0) {
      return {
        totalInvested: 0,
        currentValue: 0,
        totalPnL: 0,
        totalPnLPercent: 0,
        holdings: [],
        allocation: [],
      };
    }

    // Group by coinId and compute per-coin stats
    const grouped = {};
    portfolio.forEach((entry) => {
      if (!grouped[entry.coinId]) {
        grouped[entry.coinId] = {
          coinId: entry.coinId,
          name: entry.name,
          symbol: entry.symbol,
          image: entry.image,
          entries: [],
          totalQuantity: 0,
          totalInvested: 0,
        };
      }
      const g = grouped[entry.coinId];
      g.entries.push(entry);
      g.totalQuantity += parseFloat(entry.quantity) || 0;
      g.totalInvested += (parseFloat(entry.buyPrice) || 0) * (parseFloat(entry.quantity) || 0);
    });

    let totalInvested = 0;
    let currentValue = 0;
    const holdings = [];

    Object.values(grouped).forEach((g) => {
      const liveCoin = coins.find((c) => c.id === g.coinId);
      const livePrice = liveCoin?.current_price || 0;
      const value = g.totalQuantity * livePrice;
      const avgBuyPrice = g.totalQuantity > 0 ? g.totalInvested / g.totalQuantity : 0;
      const pnl = value - g.totalInvested;
      const pnlPercent = g.totalInvested > 0 ? (pnl / g.totalInvested) * 100 : 0;

      totalInvested += g.totalInvested;
      currentValue += value;

      holdings.push({
        coinId: g.coinId,
        name: g.name,
        symbol: g.symbol,
        image: g.image,
        quantity: g.totalQuantity,
        avgBuyPrice,
        currentPrice: livePrice,
        invested: g.totalInvested,
        currentValue: value,
        pnl,
        pnlPercent,
        entries: g.entries,
      });
    });

    // Sort by current value descending
    holdings.sort((a, b) => b.currentValue - a.currentValue);

    // Allocation percentages
    const allocation = holdings.map((h) => ({
      name: h.symbol.toUpperCase(),
      value: currentValue > 0 ? (h.currentValue / currentValue) * 100 : 0,
      coinId: h.coinId,
      color: null, // will be assigned in component
    }));

    const totalPnL = currentValue - totalInvested;
    const totalPnLPercent = totalInvested > 0 ? (totalPnL / totalInvested) * 100 : 0;

    return { totalInvested, currentValue, totalPnL, totalPnLPercent, holdings, allocation };
  }, [portfolio, coins]);

  return { portfolio, addEntry, removeEntry, clearPortfolio, stats };
}
