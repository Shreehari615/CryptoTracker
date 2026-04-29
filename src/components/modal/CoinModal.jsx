import React, { useState, useEffect, useCallback } from 'react';
import { fetchCoinDetail } from '../../services/api';
import { X, TrendingUp, TrendingDown, Crown, BarChart3, Coins, Activity, Info, Globe, ExternalLink } from 'lucide-react';
import PriceChart from './PriceChart';
import { formatCurrency, formatLargeNumber, formatPercentage, formatFullDate } from '../../utils/formatters';

/**
 * Curated descriptions for popular cryptocurrencies.
 * These provide users context about what each project does.
 */
const coinDescriptions = {
  bitcoin: {
    description: "Bitcoin is the first and most well-known cryptocurrency, created in 2009 by the pseudonymous Satoshi Nakamoto. It operates on a decentralized peer-to-peer network using blockchain technology, enabling secure transactions without intermediaries. Bitcoin uses a Proof-of-Work consensus mechanism and has a hard cap of 21 million coins, making it inherently deflationary.",
    category: "Store of Value / Digital Gold",
    consensus: "Proof of Work (PoW)",
    launchYear: 2009,
    website: "https://bitcoin.org",
  },
  ethereum: {
    description: "Ethereum is a decentralized, open-source blockchain platform that enables smart contracts and decentralized applications (dApps). Founded by Vitalik Buterin in 2015, it introduced programmable blockchain technology. Ethereum transitioned to Proof-of-Stake with 'The Merge' in 2022, significantly reducing energy consumption.",
    category: "Smart Contract Platform",
    consensus: "Proof of Stake (PoS)",
    launchYear: 2015,
    website: "https://ethereum.org",
  },
  tether: {
    description: "Tether (USDT) is the largest stablecoin by market capitalization, pegged 1:1 to the US Dollar. It provides traders and investors a way to hold a stable-value digital asset on the blockchain without converting back to fiat currency. Tether is widely used for trading pairs across major exchanges.",
    category: "Stablecoin",
    consensus: "N/A (Token)",
    launchYear: 2014,
    website: "https://tether.to",
  },
  binancecoin: {
    description: "BNB is the native cryptocurrency of the BNB Chain ecosystem, originally launched as Binance Coin for the Binance exchange. It's used for trading fee discounts, transaction fees on BNB Chain, and participating in token sales. BNB employs a quarterly token burn mechanism to reduce total supply over time.",
    category: "Exchange / Ecosystem Token",
    consensus: "Proof of Staked Authority (PoSA)",
    launchYear: 2017,
    website: "https://www.bnbchain.org",
  },
  solana: {
    description: "Solana is a high-performance blockchain known for its exceptional speed and low transaction costs. It uses a unique Proof-of-History (PoH) consensus combined with Proof-of-Stake, enabling processing of thousands of transactions per second. Solana has become a popular platform for DeFi, NFTs, and Web3 applications.",
    category: "Smart Contract Platform",
    consensus: "Proof of History (PoH) + PoS",
    launchYear: 2020,
    website: "https://solana.com",
  },
  ripple: {
    description: "XRP is the native digital asset of the XRP Ledger, designed for fast, low-cost international money transfers. Created by Ripple Labs, it aims to bridge traditional financial systems with blockchain technology. XRP transactions settle in 3-5 seconds with minimal fees.",
    category: "Payments / Cross-border Transfers",
    consensus: "XRP Ledger Consensus Protocol",
    launchYear: 2012,
    website: "https://ripple.com",
  },
  'usd-coin': {
    description: "USD Coin (USDC) is a fully-reserved stablecoin pegged to the US Dollar, issued by Circle and Coinbase. Each USDC is backed by $1 held in reserve, with regular attestations from independent accounting firms. It's widely used in DeFi protocols and as a stable trading pair.",
    category: "Stablecoin",
    consensus: "N/A (Token)",
    launchYear: 2018,
    website: "https://www.circle.com",
  },
  cardano: {
    description: "Cardano is a proof-of-stake blockchain platform founded by Charles Hoskinson, an Ethereum co-founder. It's built through peer-reviewed research and evidence-based methods, emphasizing sustainability, scalability, and transparency. Cardano supports smart contracts through its Plutus platform.",
    category: "Smart Contract Platform",
    consensus: "Ouroboros Proof of Stake",
    launchYear: 2017,
    website: "https://cardano.org",
  },
  dogecoin: {
    description: "Dogecoin started as a lighthearted cryptocurrency in 2013, featuring the Shiba Inu meme as its mascot. Despite its humorous origins, it has grown into a widely-used digital currency with a strong community. Dogecoin has no maximum supply and is popular for tipping and charitable donations.",
    category: "Meme / Payment Currency",
    consensus: "Proof of Work (Scrypt)",
    launchYear: 2013,
    website: "https://dogecoin.com",
  },
  'staked-ether': {
    description: "Lido Staked Ether (stETH) is a liquid staking token representing staked ETH on the Ethereum Beacon Chain through Lido Finance. It allows users to earn staking rewards while maintaining liquidity, as stETH can be used in DeFi protocols while the underlying ETH continues to accrue staking rewards.",
    category: "Liquid Staking Derivative",
    consensus: "N/A (Token)",
    launchYear: 2020,
    website: "https://lido.fi",
  },
  polkadot: {
    description: "Polkadot is a multi-chain protocol that enables different blockchains to interoperate and share security. Created by Ethereum co-founder Gavin Wood, it uses a relay chain architecture with parachains to achieve scalability and cross-chain communication.",
    category: "Interoperability / Multi-chain",
    consensus: "Nominated Proof of Stake (NPoS)",
    launchYear: 2020,
    website: "https://polkadot.network",
  },
  avalanche: {
    description: "Avalanche is a blazingly fast, low-cost platform for building decentralized applications. It uses a novel consensus protocol that achieves near-instant finality. Avalanche supports multiple subnets, allowing developers to create customized blockchain networks.",
    category: "Smart Contract Platform",
    consensus: "Avalanche Consensus",
    launchYear: 2020,
    website: "https://www.avax.network",
  },
  chainlink: {
    description: "Chainlink is a decentralized oracle network that provides real-world data to smart contracts on the blockchain. It acts as a bridge between blockchain applications and external data sources, APIs, and payment systems, enabling smart contracts to interact with off-chain data securely.",
    category: "Oracle Network",
    consensus: "N/A (Token)",
    launchYear: 2017,
    website: "https://chain.link",
  },
  'matic-network': {
    description: "Polygon (formerly Matic Network) is a Layer 2 scaling solution for Ethereum that provides faster and cheaper transactions. It uses a combination of Plasma framework and Proof-of-Stake sidechains to achieve high throughput while maintaining Ethereum's security.",
    category: "Layer 2 / Scaling Solution",
    consensus: "Proof of Stake (PoS)",
    launchYear: 2017,
    website: "https://polygon.technology",
  },
  litecoin: {
    description: "Litecoin is a peer-to-peer cryptocurrency created by Charlie Lee in 2011 as a 'lighter' version of Bitcoin. It features faster block generation times (2.5 minutes vs Bitcoin's 10) and uses the Scrypt hashing algorithm, making it suitable for everyday transactions.",
    category: "Payment Currency",
    consensus: "Proof of Work (Scrypt)",
    launchYear: 2011,
    website: "https://litecoin.org",
  },
  tron: {
    description: "TRON is a blockchain-based platform focused on decentralizing the internet and building a free, global digital content entertainment system. It supports smart contracts, DeFi applications, and is one of the largest networks for USDT (Tether) transfers due to its low fees.",
    category: "Smart Contract Platform",
    consensus: "Delegated Proof of Stake (DPoS)",
    launchYear: 2017,
    website: "https://tron.network",
  },
  uniswap: {
    description: "Uniswap is the leading decentralized exchange (DEX) protocol built on Ethereum. It pioneered the Automated Market Maker (AMM) model, allowing anyone to swap tokens or provide liquidity without intermediaries. UNI is the governance token for the Uniswap protocol.",
    category: "Decentralized Exchange (DEX)",
    consensus: "N/A (Token)",
    launchYear: 2018,
    website: "https://uniswap.org",
  },
  'shiba-inu': {
    description: "Shiba Inu is an Ethereum-based meme token that has evolved into a vibrant ecosystem. Dubbed the 'Dogecoin Killer', it features its own DEX (ShibaSwap), NFT collection, and is developing Shibarium, a Layer 2 solution. SHIB has one of the largest and most active communities in crypto.",
    category: "Meme / Ecosystem Token",
    consensus: "N/A (ERC-20 Token)",
    launchYear: 2020,
    website: "https://shibatoken.com",
  },
  cosmos: {
    description: "Cosmos is an ecosystem of interconnected blockchains designed to solve blockchain interoperability. Its Inter-Blockchain Communication (IBC) protocol enables seamless data and value transfer between independent chains. ATOM is the native staking and governance token.",
    category: "Interoperability / Multi-chain",
    consensus: "Tendermint BFT + PoS",
    launchYear: 2019,
    website: "https://cosmos.network",
  },
  stellar: {
    description: "Stellar is an open-source payment network designed for fast, low-cost cross-border transactions. Founded by Jed McCaleb (Ripple co-founder), it focuses on connecting financial institutions and reducing the cost of money transfers, particularly for the unbanked population.",
    category: "Payments / Cross-border Transfers",
    consensus: "Stellar Consensus Protocol (SCP)",
    launchYear: 2014,
    website: "https://stellar.org",
  },
};

/**
 * Generate a description for coins not in the curated list
 */
function getCoinDescription(coin) {
  const curated = coinDescriptions[coin.id];
  if (curated) return curated;

  // Generate a generic but informative description
  const rankText = coin.market_cap_rank ? `Ranked #${coin.market_cap_rank} by market capitalization` : 'A cryptocurrency';
  const supplyText = coin.max_supply
    ? `It has a maximum supply of ${coin.max_supply.toLocaleString()} ${coin.symbol?.toUpperCase()} coins`
    : coin.total_supply
      ? `It has a total supply of ${coin.total_supply.toLocaleString()} ${coin.symbol?.toUpperCase()} coins`
      : '';

  return {
    description: `${rankText}, ${coin.name} (${coin.symbol?.toUpperCase()}) is a digital asset in the cryptocurrency market. ${supplyText ? supplyText + '.' : ''} As with all cryptocurrencies, its value is determined by market supply and demand dynamics.`,
    category: null,
    consensus: null,
    launchYear: null,
    website: null,
  };
}

/**
 * CoinModal Component
 * 
 * Slide-in drawer showing detailed information about a selected coin.
 * Desktop: slides in from the right
 * Mobile: slides up from the bottom
 * 
 * Enhanced with:
 * - Market Cap Rank badge in header
 * - Prominent 1h / 24h / 7d change badges with icons
 * - ATH & ATL dates clearly displayed
 * - Fully diluted valuation
 * - Volume/Market Cap ratio
 * - About section with coin descriptions
 */
const CoinModal = React.memo(function CoinModal({ coin, currency, onClose }) {
  // --- Coin detail data (fetched from /coins/{id} for homepage, description, etc.) ---
  const [coinDetail, setCoinDetail] = useState(null);

  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden'; // Prevent background scroll
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  // Fetch detailed coin data (homepage link, description, etc.)
  useEffect(() => {
    if (!coin?.id) return;
    setCoinDetail(null);
    let cancelled = false;
    fetchCoinDetail(coin.id)
      .then((data) => { if (!cancelled) setCoinDetail(data); })
      .catch(() => { /* silently fail — curated data is the fallback */ });
    return () => { cancelled = true; };
  }, [coin?.id]);

  // Prevent click inside modal from closing it
  const handleModalClick = useCallback((e) => {
    e.stopPropagation();
  }, []);

  if (!coin) return null;

  const priceChange24h = coin.price_change_percentage_24h_in_currency;
  const isPositive = (priceChange24h ?? 0) >= 0;

  // Calculate 24h High/Low bar position
  const highLowRange = (coin.high_24h || 0) - (coin.low_24h || 0);
  const currentPosition = highLowRange > 0
    ? ((coin.current_price - (coin.low_24h || 0)) / highLowRange) * 100
    : 50;

  // Price changes data with icons
  const priceChanges = [
    { label: '1h', value: coin.price_change_percentage_1h_in_currency },
    { label: '24h', value: coin.price_change_percentage_24h_in_currency },
    { label: '7d', value: coin.price_change_percentage_7d_in_currency },
  ];

  // Volume/Market Cap ratio
  const volMcapRatio = coin.market_cap > 0
    ? ((coin.total_volume / coin.market_cap) * 100).toFixed(2)
    : null;

  // Get coin description info (curated first, then API fallback)
  const coinInfo = getCoinDescription(coin);

  // Live website URL: prefer API data, fall back to curated
  const websiteUrl = coinDetail?.links?.homepage?.find(u => u) || coinInfo.website;

  // Live description: use API if available and no curated description, or if curated is generic
  const liveDescription = coinDetail?.description?.en;
  const displayDescription = coinDescriptions[coin.id]
    ? coinInfo.description
    : (liveDescription
        ? liveDescription.replace(/<[^>]*>/g, '').slice(0, 500) + (liveDescription.length > 500 ? '…' : '')
        : coinInfo.description);

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="coin-modal-title"
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-fade-in" />

      {/* Drawer Panel */}
      <div
        onClick={handleModalClick}
        className="relative w-full max-w-lg h-full bg-white dark:bg-surface-900 shadow-2xl 
                   overflow-y-auto animate-slide-in-right
                   md:rounded-l-2xl
                   max-md:absolute max-md:bottom-0 max-md:left-0 max-md:right-0 
                   max-md:max-w-none max-md:h-[90vh] max-md:rounded-t-2xl max-md:animate-slide-up"
      >
        {/* Header */}
        <div className="sticky top-0 z-10 bg-white/90 dark:bg-surface-900/90 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img
                src={coin.image}
                alt={coin.name}
                className="w-10 h-10 rounded-full"
                width={40}
                height={40}
              />
              <div>
                <h2 id="coin-modal-title" className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  {coin.name}
                  <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded">
                    {coin.symbol}
                  </span>
                </h2>
                <div className="flex items-center gap-2 mt-0.5">
                  {/* Market Cap Rank Badge */}
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-100 dark:bg-indigo-900/30 px-1.5 py-0.5 rounded-full">
                    <Crown size={10} />
                    Rank #{coin.market_cap_rank}
                  </span>
                </div>
              </div>
            </div>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label="Close modal"
              id="close-modal-btn"
            >
              <X size={20} className="text-gray-500" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="px-6 py-5 space-y-6">
          {/* Current Price */}
          <div>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">
              {formatCurrency(coin.current_price, currency)}
            </p>
            <div className="flex items-center gap-2 mt-1">
              <span
                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${
                  isPositive
                    ? 'bg-crypto-green/10 text-crypto-green'
                    : 'bg-crypto-red/10 text-crypto-red'
                }`}
              >
                {isPositive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                {formatPercentage(priceChange24h)}
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400">24h</span>
            </div>
          </div>

          {/* Price Change Badges — 1h / 24h / 7d */}
          <div className="grid grid-cols-3 gap-3">
            {priceChanges.map((item) => {
              const val = item.value;
              const pos = val !== null && val !== undefined && val >= 0;
              const Icon = pos ? TrendingUp : TrendingDown;
              return (
                <div
                  key={item.label}
                  className={`p-3 rounded-xl text-center border ${
                    val === null || val === undefined
                      ? 'border-gray-200 dark:border-gray-700'
                      : pos
                        ? 'border-crypto-green/20 bg-crypto-green/5'
                        : 'border-crypto-red/20 bg-crypto-red/5'
                  }`}
                >
                  <p className="text-[10px] uppercase font-semibold text-gray-500 dark:text-gray-400 mb-1">
                    {item.label}
                  </p>
                  <div className="flex items-center justify-center gap-1">
                    {val !== null && val !== undefined && (
                      <Icon size={12} className={pos ? 'text-crypto-green' : 'text-crypto-red'} />
                    )}
                    <p
                      className={`text-sm font-bold ${
                        val === null || val === undefined
                          ? 'text-gray-400'
                          : pos
                            ? 'text-crypto-green'
                            : 'text-crypto-red'
                      }`}
                    >
                      {val !== null && val !== undefined ? formatPercentage(val) : '—'}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* About Section */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Info size={14} className="text-indigo-500" />
              About {coin.name}
            </h3>
            <div className="bg-gradient-to-br from-indigo-50/50 to-purple-50/50 dark:from-indigo-950/20 dark:to-purple-950/20 rounded-xl p-4 border border-indigo-100 dark:border-indigo-900/30">
              <p className="text-xs leading-relaxed text-gray-700 dark:text-gray-300">
                {displayDescription}
              </p>
              
              {/* Metadata tags */}
              <div className="flex flex-wrap gap-2 mt-3">
                {(coinDetail?.categories?.[0] || coinInfo.category) && (
                  <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-1 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400">
                    📂 {coinDetail?.categories?.[0] || coinInfo.category}
                  </span>
                )}
                {coinInfo.consensus && (
                  <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-1 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400">
                    ⛓️ {coinInfo.consensus}
                  </span>
                )}
                {(coinDetail?.genesis_date || coinInfo.launchYear) && (
                  <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400">
                    🚀 {coinInfo.launchYear ? `Launched ${coinInfo.launchYear}` : `Genesis ${coinDetail.genesis_date}`}
                  </span>
                )}
              </div>

              {/* Official Website link */}
              {websiteUrl ? (
                <a
                  href={websiteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 mt-3 px-3 py-1.5 text-[11px] font-semibold rounded-lg
                             bg-indigo-600 hover:bg-indigo-700 text-white transition-colors shadow-sm"
                >
                  <Globe size={12} />
                  Official Website
                  <ExternalLink size={10} />
                </a>
              ) : !coinDetail && (
                <div className="mt-3 flex items-center gap-1.5 text-[10px] text-gray-400 dark:text-gray-500">
                  <div className="w-3 h-3 rounded-full border-2 border-gray-300 dark:border-gray-600 border-t-transparent animate-spin" />
                  Loading website info…
                </div>
              )}
            </div>
          </div>
          <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4">
            <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-2">
              <span>24h Low</span>
              <span>24h High</span>
            </div>
            <div className="relative h-2 rounded-full bg-gradient-to-r from-crypto-red via-yellow-400 to-crypto-green overflow-hidden">
              <div
                className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-white dark:bg-gray-200 border-2 border-gray-800 dark:border-white shadow-md"
                style={{ left: `calc(${Math.min(Math.max(currentPosition, 3), 97)}% - 6px)` }}
              />
            </div>
            <div className="flex justify-between text-xs font-semibold text-gray-900 dark:text-white mt-2">
              <span>{formatCurrency(coin.low_24h, currency)}</span>
              <span>{formatCurrency(coin.high_24h, currency)}</span>
            </div>
          </div>

          {/* Market Stats */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <BarChart3 size={14} className="text-indigo-500" />
              Market Stats
            </h3>
            
            <StatRow
              label="Market Cap Rank"
              value={`#${coin.market_cap_rank}`}
            />
            <StatRow
              label="Market Cap"
              value={formatLargeNumber(coin.market_cap, currency)}
            />
            <StatRow
              label="24h Trading Volume"
              value={formatLargeNumber(coin.total_volume, currency)}
            />
            {volMcapRatio && (
              <StatRow
                label="Volume / Market Cap"
                value={`${volMcapRatio}%`}
              />
            )}
            {coin.fully_diluted_valuation && (
              <StatRow
                label="Fully Diluted Valuation"
                value={formatLargeNumber(coin.fully_diluted_valuation, currency)}
              />
            )}
          </div>

          {/* Supply Info */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Coins size={14} className="text-indigo-500" />
              Supply
            </h3>

            <StatRow
              label="Circulating Supply"
              value={coin.circulating_supply
                ? `${coin.circulating_supply.toLocaleString()} ${coin.symbol?.toUpperCase()}`
                : '—'
              }
            />
            {coin.total_supply && (
              <StatRow
                label="Total Supply"
                value={`${coin.total_supply.toLocaleString()} ${coin.symbol?.toUpperCase()}`}
              />
            )}
            {coin.max_supply && (
              <StatRow
                label="Max Supply"
                value={`${coin.max_supply.toLocaleString()} ${coin.symbol?.toUpperCase()}`}
              />
            )}
            
            {/* Supply progress bar */}
            {coin.circulating_supply && coin.max_supply && (
              <div className="pt-1">
                <div className="flex justify-between text-[10px] text-gray-500 dark:text-gray-400 mb-1">
                  <span>Circulating</span>
                  <span>{((coin.circulating_supply / coin.max_supply) * 100).toFixed(1)}%</span>
                </div>
                <div className="h-1.5 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-indigo-500"
                    style={{ width: `${(coin.circulating_supply / coin.max_supply) * 100}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* All-Time High / Low */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Activity size={14} className="text-indigo-500" />
              All-Time Records
            </h3>
            
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-crypto-green/5 border border-crypto-green/20 rounded-xl p-3">
                <div className="flex items-center gap-1 mb-2">
                  <TrendingUp size={12} className="text-crypto-green" />
                  <p className="text-[10px] uppercase font-semibold text-gray-500 dark:text-gray-400">
                    All-Time High
                  </p>
                </div>
                <p className="text-sm font-bold text-crypto-green">
                  {formatCurrency(coin.ath, currency)}
                </p>
                <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-1 flex items-center gap-1">
                  📅 {formatFullDate(coin.ath_date)}
                </p>
                <p className="text-[10px] font-semibold text-crypto-red mt-0.5">
                  {coin.ath_change_percentage?.toFixed(1)}% from ATH
                </p>
              </div>
              <div className="bg-crypto-red/5 border border-crypto-red/20 rounded-xl p-3">
                <div className="flex items-center gap-1 mb-2">
                  <TrendingDown size={12} className="text-crypto-red" />
                  <p className="text-[10px] uppercase font-semibold text-gray-500 dark:text-gray-400">
                    All-Time Low
                  </p>
                </div>
                <p className="text-sm font-bold text-crypto-red">
                  {formatCurrency(coin.atl, currency)}
                </p>
                <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-1 flex items-center gap-1">
                  📅 {formatFullDate(coin.atl_date)}
                </p>
                <p className="text-[10px] font-semibold text-crypto-green mt-0.5">
                  +{coin.atl_change_percentage?.toFixed(1)}% from ATL
                </p>
              </div>
            </div>
          </div>

          {/* Price Chart */}
          <div>
            <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-3">
              Price Chart
            </h3>
            <PriceChart coinId={coin.id} currency={currency} />
          </div>
        </div>
      </div>
    </div>
  );
});

/**
 * StatRow — helper component for market stats key-value pairs
 */
function StatRow({ label, value }) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-800/50 last:border-0">
      <span className="text-xs text-gray-500 dark:text-gray-400">{label}</span>
      <span className="text-xs font-semibold text-gray-900 dark:text-white">{value}</span>
    </div>
  );
}

export default CoinModal;
