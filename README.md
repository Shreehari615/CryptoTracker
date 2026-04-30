# CryptoTracker — Live Crypto Market Dashboard

A production-grade cryptocurrency market dashboard built with **React 18**, **Vite**, **Tailwind CSS 3**, and **Recharts**. Displays real-time market data for the top 100 cryptocurrencies using the [CoinGecko API](https://www.coingecko.com/).

![Dashboard Preview](https://img.shields.io/badge/Status-Production_Ready-16c784?style=for-the-badge)
![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react)
![Tailwind](https://img.shields.io/badge/Tailwind_CSS-3-38BDF8?style=for-the-badge&logo=tailwindcss)

---

## ✨ Features

### Core
- **Top 100 Cryptocurrencies** — Sorted by market cap, with live prices
- **Multi-Currency Support** — Switch between USD ($), INR (₹), and EUR (€)
- **Instant Search** — Client-side search by coin name or symbol (debounced, lag-free)
- **Responsive Design** — Fully optimized for Mobile, Tablet, and Desktop
- **Global Market Stats Bar** — Coins, Exchanges, Market Cap, 24h Volume, BTC/ETH Dominance

### Dashboard Widgets
- **🔥 Trending Coins** — Top trending cryptocurrencies with left/right navigation arrows
- **🚀 Top Gainers** — 5 best performers by 24h change, clickable to open detail view
- **📉 Top Losers** — 5 worst performers by 24h change, clickable to open detail view
- **😱 Fear & Greed Index** — Real-time market sentiment gauge (0–100) with SVG needle, color-coded scale, sourced from [alternative.me](https://alternative.me/crypto/fear-and-greed-index/)

> All widget cards open the same rich detail modal — including coins ranked above #100.

### Data Table
CoinGecko-style market table with sortable columns:
- Star (watchlist), Rank, Logo, Name + Symbol (inline)
- Current Price (multi-currency, bold)
- 1h / 24h / 7d Price Change (color-coded green/red with arrows)
- 24h Trading Volume (sortable)
- Market Capitalization (sortable)
- 7-day Sparkline Chart
- Long coin names wrap naturally (no truncation)
- Sticky columns (Star, Rank, Coin) on horizontal scroll
- **Sort indicators always visible** — All sortable columns show ↕ arrows by default

### ⭐ Watchlist
- **Add/Remove coins** — Click the star icon on any coin to watchlist it
- **Persistent storage** — Watchlist saved to `localStorage`, persists across sessions
- **Dedicated tab** — View only watchlisted coins in the "Watchlist" tab
- **Empty state** — Friendly message with "Browse Market" call-to-action

### 💼 Portfolio Tracker
A full investment tracker accessible via the "Portfolio" tab:
- **Add holdings** — Select any coin, enter buy price, quantity, and purchase date
- **Summary cards** — Current Value, Total Invested, Total Profit/Loss with percentage
- **Allocation donut chart** — SVG pie chart showing portfolio distribution
- **Holdings list** — Expandable rows with per-coin P/L and individual buy entries
- **Live P&L calculation** — Uses real-time market prices to compute gains/losses
- **Persistent** — All data saved to `localStorage` across sessions
- **Entry management** — Remove individual entries or clear entire portfolio

### 🛠 Tools Section
A suite of crypto financial calculators accessible via the "Tools" tab:

#### 💱 Crypto Converter
- Convert between any two cryptocurrencies
- Real-time conversion rates from live market data
- Swap button to quickly reverse conversion

#### 📊 Coin Comparison
- Side-by-side comparison of two cryptocurrencies
- Compare price, market cap, volume, supply, and price changes
- Visual comparison cards with color-coded differences

#### 📈 Profit/Loss Calculator
- Enter coin, buy price, and quantity to calculate P/L
- **Auto-filled current market price** from live API data
- Shows: Total Invested, Current Value, Profit/Loss, Return %
- Green/red themed results for profit/loss visualization

#### 🔮 Investment Projection
- Project future portfolio value based on initial investment
- Uses recent 7-day market trend to extrapolate returns
- Time horizons: 1 month, 3 months, 6 months, 1 year, 2 years

#### 📅 SIP / DCA Calculator
- Simulate systematic monthly investments (Dollar-Cost Averaging)
- Durations: 3 months, 6 months, 1 year, 2 years, 5 years
- Shows: Total invested, coins accumulated, projected value, gain %

### Coin Detail Modal
Click any coin (from market table, trending cards, gainers, or losers) to view:
- Current price with 24h change badge
- 1h / 24h / 7d price change badges with icons
- **📖 About Section** — Curated descriptions for top 20 cryptocurrencies + live descriptions from CoinGecko API for all other coins
  - Category, consensus mechanism, and launch year tags
  - **🌐 Official Website link** — Fetched dynamically from CoinGecko `/coins/{id}` endpoint
- 24h High/Low with visual position bar
- Market Cap, Volume, FDV, Volume/Market Cap ratio
- Circulating/Total/Max Supply with progress bar
- All-Time High / All-Time Low with dates
- Interactive price chart with 7D / 30D / 90D toggles

### UI/UX
- **Dark/Light Mode** — Toggle with localStorage persistence
- **Auto-Refresh** — 60-second polling with live countdown indicator
- **Skeleton Loaders** — Beautiful loading states for all sections
- **Error Handling** — Friendly error messages with retry buttons
- **Keyboard Shortcuts** — Ctrl+K to search, Escape to close modals
- **Full-width Layout** — Edge-to-edge content, no wasted space

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 18 (functional components + hooks) |
| Build Tool | Vite |
| Styling | Tailwind CSS 3 |
| Charts | Recharts |
| Icons | Lucide React |
| HTTP | Native Fetch API |
| State | React Context + Hooks |
| Storage | localStorage (watchlist, theme, portfolio) |

---

## 📁 Project Structure

```
src/
├── components/
│   ├── common/           # Skeleton, ErrorState, SearchBar, ThemeToggle
│   ├── dashboard/        # GlobalStatsBar, CoinTable, CoinTableRow, SparklineChart,
│   │                     # TrendingCoins, GainersLosers, FearGreedIndex
│   ├── modal/            # CoinModal (with About section), PriceChart
│   ├── portfolio/        # PortfolioTracker
│   └── tools/            # ToolsSection, CryptoConverter, CoinComparison,
│                         # ProfitCalculator, InvestmentProjection, SIPCalculator
├── context/
│   └── ThemeContext.jsx   # Dark/Light mode context + provider
├── hooks/
│   ├── useCoinsMarket.js  # Coins market data + auto-refresh
│   ├── useGlobalData.js   # Global market stats
│   ├── useTrending.js     # Trending coins
│   ├── useCoinChart.js    # Historical chart data
│   ├── useFearGreed.js    # Fear & Greed Index data
│   ├── usePortfolio.js    # Portfolio management with localStorage
│   └── useWatchlist.js    # Watchlist with localStorage persistence
├── services/
│   └── api.js             # Centralized CoinGecko API calls
├── utils/
│   └── formatters.js      # Currency, number, date formatters
├── App.jsx                # Root component + tab navigation + layout
├── main.jsx               # Entry point
└── index.css              # Tailwind directives + global styles
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 16+ and npm

### Installation

```bash
# Clone the repository
git clone <repo-url>
cd Crypto-Currency

# Install dependencies
npm install

# Start the development server
npm run dev
```

The app will be available at `http://localhost:5173`

### Production Build

```bash
npm run build
npm run preview
```

---

## ⚡ Performance Optimizations

| Technique | Application |
|---|---|
| `React.memo` | CoinTableRow, SparklineChart, all section components |
| `useMemo` | Filtered coin list, gainers/losers, sorted coins, portfolio stats |
| `useCallback` | Event handlers, search callback, watchlist toggle |
| Debounced Search | 300ms debounce on search input |
| Data Sampling | Sparkline data sampled (168 → 50 points) |
| Lazy Image Loading | `loading="lazy"` on all coin logos |
| Proper Keys | `coin.id` used as keys throughout |
| Tab-based Rendering | Only active tab content is rendered |
| Cancelled Fetches | Coin detail API calls cancelled on modal close |

---

## 📊 API Reference

All data comes from the [CoinGecko Free API](https://www.coingecko.com/en/api) and [Alternative.me](https://alternative.me/crypto/fear-and-greed-index/):

| Endpoint | Source | Purpose |
|---|---|---|
| `/coins/markets` | CoinGecko | Top 100 coins with prices, sparkline, % changes |
| `/global` | CoinGecko | Total market cap, volume, dominance |
| `/search/trending` | CoinGecko | Trending coins (last 24h) |
| `/coins/{id}/market_chart` | CoinGecko | Historical price data for charts |
| `/coins/{id}` | CoinGecko | Detailed coin info (homepage, description, categories) |
| `/fng/?limit=1` | Alternative.me | Crypto Fear & Greed Index |

---

## 🗂 Navigation

The dashboard has 4 main tabs:

| Tab | Description |
|---|---|
| **Market** | Trending coins, Fear & Greed gauge, Gainers/Losers, full market table |
| **Watchlist** | Your starred coins in a filtered table view |
| **Portfolio** | Investment tracker with allocation chart and P/L monitoring |
| **Tools** | Financial calculators (Converter, Compare, P/L, Projection, SIP) |

---

## 📝 License

MIT License — feel free to use this project for learning, portfolios, or production.
