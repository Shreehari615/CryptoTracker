/**
 * Formatting Utilities
 * 
 * Provides consistent number, currency, and date formatting
 * throughout the application.
 */

// Currency symbols and locale mappings
const CURRENCY_CONFIG = {
  usd: { symbol: '$', locale: 'en-US' },
  inr: { symbol: '₹', locale: 'en-IN' },
  eur: { symbol: '€', locale: 'de-DE' },
};

/**
 * Format a number as currency with proper symbol and locale
 * @param {number} value - The numeric value
 * @param {string} currency - Currency code (usd, inr, eur)
 * @param {number} maxDecimals - Maximum decimal places (auto-detected if not provided)
 * @returns {string} Formatted currency string (e.g., "$1,234.56")
 */
export function formatCurrency(value, currency = 'usd', maxDecimals) {
  if (value === null || value === undefined) return '—';

  const config = CURRENCY_CONFIG[currency] || CURRENCY_CONFIG.usd;
  
  // Auto-detect decimal places based on value magnitude
  let decimals = maxDecimals;
  if (decimals === undefined) {
    if (Math.abs(value) < 0.01) decimals = 6;
    else if (Math.abs(value) < 1) decimals = 4;
    else if (Math.abs(value) < 100) decimals = 2;
    else decimals = 2;
  }

  return new Intl.NumberFormat(config.locale, {
    style: 'currency',
    currency: currency.toUpperCase(),
    minimumFractionDigits: 2,
    maximumFractionDigits: decimals,
  }).format(value);
}

/**
 * Format large numbers with abbreviations (T, B, M, K)
 * Used for market cap, volume, etc.
 * @param {number} value - The numeric value
 * @param {string} currency - Currency code for symbol prefix
 * @returns {string} Formatted string (e.g., "$1.23T")
 */
export function formatLargeNumber(value, currency = 'usd') {
  if (value === null || value === undefined) return '—';

  const config = CURRENCY_CONFIG[currency] || CURRENCY_CONFIG.usd;
  const symbol = config.symbol;

  const absValue = Math.abs(value);
  const sign = value < 0 ? '-' : '';

  if (absValue >= 1e12) {
    return `${sign}${symbol}${(absValue / 1e12).toFixed(2)}T`;
  }
  if (absValue >= 1e9) {
    return `${sign}${symbol}${(absValue / 1e9).toFixed(2)}B`;
  }
  if (absValue >= 1e6) {
    return `${sign}${symbol}${(absValue / 1e6).toFixed(2)}M`;
  }
  if (absValue >= 1e3) {
    return `${sign}${symbol}${(absValue / 1e3).toFixed(2)}K`;
  }
  return `${sign}${symbol}${absValue.toFixed(2)}`;
}

/**
 * Format a percentage value with sign and color indication
 * @param {number} value - The percentage value
 * @returns {string} Formatted percentage (e.g., "+2.45%" or "-1.23%")
 */
export function formatPercentage(value) {
  if (value === null || value === undefined) return '—';
  const sign = value >= 0 ? '+' : '';
  return `${sign}${value.toFixed(2)}%`;
}

/**
 * Format a timestamp into a readable date string
 * @param {number} timestamp - Unix timestamp in milliseconds
 * @returns {string} Formatted date (e.g., "Apr 21, 3:45 PM")
 */
export function formatDate(timestamp) {
  if (!timestamp) return '—';
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  }).format(new Date(timestamp));
}

/**
 * Format a full date with year
 * @param {string|number} date - Date string or timestamp
 * @returns {string} Formatted date (e.g., "Apr 21, 2026")
 */
export function formatFullDate(date) {
  if (!date) return '—';
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(date));
}

/**
 * Get the time elapsed since a given timestamp
 * @param {Date} date - The reference date
 * @returns {string} Human-readable time ago (e.g., "5s ago", "2m ago")
 */
export function timeAgo(date) {
  if (!date) return '';
  const seconds = Math.floor((new Date() - date) / 1000);
  
  if (seconds < 5) return 'just now';
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  return `${hours}h ago`;
}
