/**
 * CoinGecko API Service Layer
 * 
 * Centralizes all API calls to the CoinGecko API.
 * Supports both free (demo key) and no-key modes.
 * Includes retry logic with exponential backoff.
 * 
 * IMPORTANT: CoinGecko's free API now requires a Demo API key.
 * Get one free at: https://www.coingecko.com/en/api/pricing
 * Set it in .env as VITE_COINGECKO_API_KEY=your_key
 */

const BASE_URL = 'https://api.coingecko.com/api/v3';

// Read API key from environment variable (Vite exposes VITE_ prefixed vars)
const API_KEY = import.meta.env.VITE_COINGECKO_API_KEY || '';

/**
 * Delay helper for retry backoff
 */
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Generic fetch wrapper with retry logic and error handling.
 * Retries up to 3 times with exponential backoff on failure.
 */
async function fetchFromAPI(endpoint, params = {}, retries = 3) {
  const url = new URL(`${BASE_URL}${endpoint}`);
  
  // Append query parameters
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      url.searchParams.append(key, value);
    }
  });

  // Append API key as query parameter if available
  if (API_KEY && API_KEY !== 'CG-api_key_here') {
    url.searchParams.append('x_cg_demo_api_key', API_KEY);
  }

  let lastError;

  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      // Add delay between retries (exponential backoff: 0, 3s, 6s)
      if (attempt > 0) {
        await delay(attempt * 3000);
      }

      const response = await fetch(url.toString(), {
        headers: {
          'Accept': 'application/json',
        },
      });

      // Handle rate limiting — wait and retry
      if (response.status === 429) {
        lastError = new Error('API rate limit exceeded. Please wait a moment and try again.');
        await delay(5000); // Extra wait for rate limit
        continue;
      }

      if (!response.ok) {
        lastError = new Error(`API Error: ${response.status} ${response.statusText}`);
        continue;
      }

      return await response.json();
    } catch (err) {
      lastError = err;
    }
  }

  throw lastError || new Error('Failed to fetch data after multiple attempts');
}

/**
 * Fetch top cryptocurrencies by market cap
 */
export async function fetchCoinsMarkets(currency = 'usd', page = 1, perPage = 100) {
  return fetchFromAPI('/coins/markets', {
    vs_currency: currency,
    order: 'market_cap_desc',
    per_page: perPage,
    page: page,
    sparkline: true,
    price_change_percentage: '1h,24h,7d',
  });
}

/**
 * Fetch global cryptocurrency market data
 */
export async function fetchGlobalData() {
  const data = await fetchFromAPI('/global');
  return data.data;
}

/**
 * Fetch trending coins (top 15 by search popularity in last 24h)
 */
export async function fetchTrendingCoins() {
  return fetchFromAPI('/search/trending');
}

/**
 * Fetch historical price chart data for a specific coin
 */
export async function fetchCoinChart(coinId, currency = 'usd', days = 7) {
  return fetchFromAPI(`/coins/${coinId}/market_chart`, {
    vs_currency: currency,
    days: days,
  });
}
