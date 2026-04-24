import React, { useState, useMemo, useCallback } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { useCoinsMarket } from './hooks/useCoinsMarket';
import { useGlobalData } from './hooks/useGlobalData';
import { useTrending } from './hooks/useTrending';

// Components
import GlobalStatsBar from './components/dashboard/GlobalStatsBar';
import SearchBar from './components/common/SearchBar';
import ThemeToggle from './components/common/ThemeToggle';
import TrendingCoins from './components/dashboard/TrendingCoins';
import GainersLosers from './components/dashboard/GainersLosers';
import CoinTable from './components/dashboard/CoinTable';
import CoinModal from './components/modal/CoinModal';

/**
 * App Component
 * 
 * Root application component that orchestrates the entire dashboard.
 * Manages global state: currency selection, search query, selected coin.
 * Delegates data fetching to custom hooks.
 */
function App() {
  return (
    <ThemeProvider>
      <Dashboard />
    </ThemeProvider>
  );
}

/**
 * Dashboard Component
 * 
 * Main dashboard layout and state management.
 * Separated from App to ensure ThemeProvider is available.
 */
function Dashboard() {
  // --- State ---
  const [currency, setCurrency] = useState('usd');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCoin, setSelectedCoin] = useState(null);

  // --- Data Fetching via Custom Hooks ---
  const { coins, loading: coinsLoading, error: coinsError, lastUpdated, refresh } = useCoinsMarket(currency);
  const { globalData, loading: globalLoading } = useGlobalData();
  const { trending, loading: trendingLoading } = useTrending();

  // --- Memoized Filtered Coins ---
  // Client-side search by name or symbol — O(n) filter with memoization
  const filteredCoins = useMemo(() => {
    if (!searchQuery) return coins;

    return coins.filter((coin) =>
      coin.name.toLowerCase().includes(searchQuery) ||
      coin.symbol.toLowerCase().includes(searchQuery)
    );
  }, [coins, searchQuery]);

  // --- Callbacks ---
  const handleSearch = useCallback((query) => {
    setSearchQuery(query);
  }, []);

  const handleSelectCoin = useCallback((coin) => {
    setSelectedCoin(coin);
  }, []);

  const handleCloseModal = useCallback(() => {
    setSelectedCoin(null);
  }, []);

  const handleCurrencyChange = useCallback((e) => {
    setCurrency(e.target.value);
  }, []);

  // Currency display labels
  const currencyOptions = [
    { value: 'usd', label: 'USD ($)', symbol: '$' },
    { value: 'inr', label: 'INR (₹)', symbol: '₹' },
    { value: 'eur', label: 'EUR (€)', symbol: '€' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-surface-950 transition-colors duration-300">
      {/* Global Stats Bar */}
      <GlobalStatsBar
        globalData={globalData}
        loading={globalLoading}
        currency={currency}
      />

      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/80 dark:bg-surface-900/80 backdrop-blur-xl border-b border-gray-200 dark:border-gray-800/50">
        <div className="max-w-[1600px] mx-auto px-4 md:px-6 py-3">
          <div className="flex items-center justify-between gap-4">
            {/* Logo + Title */}
            <div className="flex items-center gap-3 flex-shrink-0">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
                <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <div className="hidden sm:block">
                <h1 className="text-lg font-bold text-gray-900 dark:text-white leading-tight">
                  CryptoTracker
                </h1>
                <p className="text-[10px] text-gray-500 dark:text-gray-500 font-medium">
                  Real-time Market Data
                </p>
              </div>
            </div>

            {/* Search Bar */}
            <div className="flex-1 max-w-sm mx-4 hidden md:block">
              <SearchBar onSearch={handleSearch} placeholder="Search coins by name or symbol..." />
            </div>

            {/* Right Controls */}
            <div className="flex items-center gap-3">
              {/* Currency Selector */}
              <select
                value={currency}
                onChange={handleCurrencyChange}
                className="px-3 py-2.5 text-xs font-semibold rounded-xl 
                           bg-gray-100 dark:bg-gray-800 
                           text-gray-700 dark:text-gray-300
                           border border-gray-200 dark:border-gray-700
                           focus:outline-none focus:ring-2 focus:ring-indigo-500/50
                           cursor-pointer transition-all"
                aria-label="Select currency"
                id="currency-selector"
              >
                {currencyOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>

              {/* Theme Toggle */}
              <ThemeToggle />
            </div>
          </div>

          {/* Mobile Search Bar */}
          <div className="md:hidden mt-3">
            <SearchBar onSearch={handleSearch} placeholder="Search coins..." />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-[1600px] mx-auto px-4 md:px-6 py-6 space-y-6">
        {/* Trending Coins Section */}
        <TrendingCoins trending={trending} loading={trendingLoading} />

        {/* Gainers & Losers */}
        <GainersLosers coins={coins} currency={currency} />

        {/* Main Coin Table */}
        <CoinTable
          coins={filteredCoins}
          loading={coinsLoading}
          error={coinsError}
          currency={currency}
          lastUpdated={lastUpdated}
          onRefresh={refresh}
          onSelectCoin={handleSelectCoin}
          searchQuery={searchQuery}
        />
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 dark:border-gray-800/50 py-6 mt-8">
        <div className="max-w-[1600px] mx-auto px-4 md:px-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-xs text-gray-500 dark:text-gray-500">
              Data provided by{' '}
              <a
                href="https://www.coingecko.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-indigo-600 dark:text-indigo-400 hover:underline font-medium"
              >
                CoinGecko API
              </a>
            </p>
            <p className="text-xs text-gray-400 dark:text-gray-600">
              Auto-refreshes every 60 seconds • Built with React + Tailwind CSS
            </p>
          </div>
        </div>
      </footer>

      {/* Coin Detail Modal */}
      {selectedCoin && (
        <CoinModal
          coin={selectedCoin}
          currency={currency}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
}

export default App;
