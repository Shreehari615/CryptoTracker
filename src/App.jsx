import React, { useState, useMemo, useCallback } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { useCoinsMarket } from './hooks/useCoinsMarket';
import { useGlobalData } from './hooks/useGlobalData';
import { useTrending } from './hooks/useTrending';
import { useWatchlist } from './hooks/useWatchlist';
import { useFearGreed } from './hooks/useFearGreed';
import { usePortfolio } from './hooks/usePortfolio';
import { BarChart3, Star, Wrench, Briefcase } from 'lucide-react';

// Components
import GlobalStatsBar from './components/dashboard/GlobalStatsBar';
import SearchBar from './components/common/SearchBar';
import ThemeToggle from './components/common/ThemeToggle';
import TrendingCoins from './components/dashboard/TrendingCoins';
import GainersLosers from './components/dashboard/GainersLosers';
import CoinTable from './components/dashboard/CoinTable';
import CoinModal from './components/modal/CoinModal';
import ToolsSection from './components/tools/ToolsSection';
import FearGreedIndex from './components/dashboard/FearGreedIndex';

import PortfolioTracker from './components/portfolio/PortfolioTracker';

function App() {
  return (
    <ThemeProvider>
      <Dashboard />
    </ThemeProvider>
  );
}

function Dashboard() {
  // --- State ---
  const [currency, setCurrency] = useState('usd');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCoin, setSelectedCoin] = useState(null);
  const [activeTab, setActiveTab] = useState('market'); // 'market' | 'watchlist' | 'portfolio' | 'tools'

  // --- Data Fetching ---
  const { coins, loading: coinsLoading, error: coinsError, lastUpdated, refresh } = useCoinsMarket(currency);
  const { globalData, loading: globalLoading } = useGlobalData();
  const { trending, loading: trendingLoading } = useTrending();
  const { watchlist, toggleWatchlist, isWatchlisted } = useWatchlist();
  const { data: fearGreedData, loading: fearGreedLoading } = useFearGreed();
  const { portfolio, addEntry, removeEntry, clearPortfolio, stats: portfolioStats } = usePortfolio(coins);

  // --- Filtered Coins ---
  const filteredCoins = useMemo(() => {
    let filtered = coins;

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter((coin) =>
        coin.name.toLowerCase().includes(searchQuery) ||
        coin.symbol.toLowerCase().includes(searchQuery)
      );
    }

    // Apply watchlist filter
    if (activeTab === 'watchlist') {
      filtered = filtered.filter((coin) => watchlist.includes(coin.id));
    }

    return filtered;
  }, [coins, searchQuery, activeTab, watchlist]);

  // --- Callbacks ---
  const handleSearch = useCallback((query) => setSearchQuery(query), []);
  const handleSelectCoin = useCallback((coin) => setSelectedCoin(coin), []);
  const handleCloseModal = useCallback(() => setSelectedCoin(null), []);
  const handleCurrencyChange = useCallback((e) => setCurrency(e.target.value), []);

  const currencyOptions = [
    { value: 'usd', label: 'USD ($)' },
    { value: 'inr', label: 'INR (₹)' },
    { value: 'eur', label: 'EUR (€)' },
  ];

  const tabs = [
    { id: 'market', label: 'Market', icon: <BarChart3 size={14} /> },
    { id: 'watchlist', label: 'Watchlist', icon: <Star size={14} />, count: watchlist.length },
    { id: 'portfolio', label: 'Portfolio', icon: <Briefcase size={14} />, count: portfolio.length },
    { id: 'tools', label: 'Tools', icon: <Wrench size={14} /> },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-surface-950 transition-colors duration-300">
      {/* Global Stats Bar */}
      <GlobalStatsBar globalData={globalData} loading={globalLoading} currency={currency} />

      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/80 dark:bg-surface-900/80 backdrop-blur-xl border-b border-gray-200 dark:border-gray-800/50">
        <div className="px-4 md:px-6 lg:px-8 py-3">
          <div className="flex items-center justify-between gap-3">
            {/* Logo + Title */}
            <div className="flex items-center gap-2.5 flex-shrink-0">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
                <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <div>
                <h1 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white leading-tight">CryptoTracker</h1>
                <p className="text-[10px] text-gray-500 font-medium hidden sm:block">Real-time Market Data</p>
              </div>
            </div>

            {/* Search Bar — desktop */}
            <div className="flex-1 max-w-sm mx-4 hidden md:block">
              <SearchBar onSearch={handleSearch} placeholder="Search coins by name or symbol..." />
            </div>

            {/* Right Controls */}
            <div className="flex items-center gap-2 sm:gap-3">
              <select
                value={currency}
                onChange={handleCurrencyChange}
                className="px-2.5 py-2 text-xs font-semibold rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 cursor-pointer"
                aria-label="Select currency"
              >
                {currencyOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
              <ThemeToggle />
            </div>
          </div>

          {/* Mobile Search */}
          <div className="md:hidden mt-2.5">
            <SearchBar onSearch={handleSearch} placeholder="Search coins..." />
          </div>

          {/* Tab Navigation */}
          <div className="flex items-center gap-1 mt-3 -mb-3 overflow-x-auto scrollbar-hide">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`inline-flex items-center gap-1.5 px-4 py-2.5 text-xs font-semibold rounded-t-lg whitespace-nowrap transition-all border-b-2 ${
                  activeTab === tab.id
                    ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 dark:border-indigo-400 bg-indigo-50/50 dark:bg-indigo-950/20'
                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300'
                }`}
              >
                {tab.icon}
                {tab.label}
                {tab.count > 0 && (
                  <span className="ml-0.5 px-1.5 py-0.5 text-[10px] font-bold rounded-full bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400">
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-4 md:px-6 lg:px-8 py-6 space-y-6">
        {/* Market Tab */}
        {activeTab === 'market' && (
          <>
            {/* Trending + Fear & Greed Row */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-5">
              <div className="lg:col-span-3">
                <TrendingCoins trending={trending} loading={trendingLoading} onSelectCoin={handleSelectCoin} coins={coins} />
              </div>
              <div className="lg:col-span-1">
                <FearGreedIndex data={fearGreedData} loading={fearGreedLoading} />
              </div>
            </div>

            <GainersLosers coins={coins} currency={currency} onSelectCoin={handleSelectCoin} />



            <CoinTable
              coins={filteredCoins}
              loading={coinsLoading}
              error={coinsError}
              currency={currency}
              lastUpdated={lastUpdated}
              onRefresh={refresh}
              onSelectCoin={handleSelectCoin}
              searchQuery={searchQuery}
              isWatchlisted={isWatchlisted}
              onToggleWatchlist={toggleWatchlist}
            />
          </>
        )}

        {/* Watchlist Tab */}
        {activeTab === 'watchlist' && (
          <>
            {watchlist.length === 0 ? (
              <div className="bg-white dark:bg-surface-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-12 text-center">
                <div className="w-16 h-16 rounded-full bg-yellow-100 dark:bg-yellow-900/20 flex items-center justify-center mx-auto mb-4">
                  <Star size={28} className="text-yellow-500" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">No coins in your watchlist</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 max-w-md mx-auto">
                  Click the ☆ star icon next to any coin in the Market tab to add it to your watchlist.
                </p>
                <button
                  onClick={() => setActiveTab('market')}
                  className="mt-4 px-5 py-2.5 text-sm font-semibold bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl transition-colors"
                >
                  Browse Market
                </button>
              </div>
            ) : (
              <CoinTable
                coins={filteredCoins}
                loading={coinsLoading}
                error={coinsError}
                currency={currency}
                lastUpdated={lastUpdated}
                onRefresh={refresh}
                onSelectCoin={handleSelectCoin}
                searchQuery={searchQuery}
                isWatchlisted={isWatchlisted}
                onToggleWatchlist={toggleWatchlist}
              />
            )}
          </>
        )}

        {/* Portfolio Tab */}
        {activeTab === 'portfolio' && (
          <PortfolioTracker
            coins={coins}
            currency={currency}
            portfolio={portfolio}
            addEntry={addEntry}
            removeEntry={removeEntry}
            clearPortfolio={clearPortfolio}
            stats={portfolioStats}
          />
        )}

        {/* Tools Tab */}
        {activeTab === 'tools' && (
          <ToolsSection coins={coins} currency={currency} />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 dark:border-gray-800/50 py-6 mt-8">
        <div className="max-w-[1920px] mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-xs text-gray-500 dark:text-gray-500">
              Data provided by{' '}
              <a href="https://www.coingecko.com/" target="_blank" rel="noopener noreferrer" className="text-indigo-600 dark:text-indigo-400 hover:underline font-medium">
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
        <CoinModal coin={selectedCoin} currency={currency} onClose={handleCloseModal} />
      )}
    </div>
  );
}

export default App;
