import { useState, useEffect } from 'react';

const FEAR_GREED_URL = 'https://api.alternative.me/fng/?limit=1';

/**
 * Custom hook to fetch the Crypto Fear & Greed Index.
 * Data from alternative.me — updates daily.
 * 
 * @returns {{ data: { value, classification, timestamp }, loading, error }}
 */
export function useFearGreed() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function fetchData() {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch(FEAR_GREED_URL);
        if (!res.ok) throw new Error('Failed to fetch Fear & Greed Index');
        const json = await res.json();
        if (!cancelled && json?.data?.[0]) {
          setData({
            value: parseInt(json.data[0].value, 10),
            classification: json.data[0].value_classification,
            timestamp: json.data[0].timestamp * 1000,
          });
        }
      } catch (err) {
        if (!cancelled) setError(err.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchData();
    return () => { cancelled = true; };
  }, []);

  return { data, loading, error };
}
