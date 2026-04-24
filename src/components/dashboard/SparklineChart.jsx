import React, { useMemo } from 'react';

/**
 * SparklineChart Component (SVG Polyline)
 * 
 * Renders a compact 7-day price sparkline using a lightweight SVG polyline.
 * No chart library dependency — pure SVG for maximum performance.
 * Line color is green if 7d change is positive, red if negative.
 */
const SparklineChart = React.memo(function SparklineChart({ data, isPositive }) {
  // Generate SVG polyline points from sparkline data
  const points = useMemo(() => {
    if (!data || data.length === 0) return '';

    // Sample data to ~50 points for performance
    const sampleRate = Math.max(1, Math.floor(data.length / 50));
    const sampled = data.filter((_, i) => i % sampleRate === 0);

    // Calculate min/max for normalization
    const min = Math.min(...sampled);
    const max = Math.max(...sampled);
    const range = max - min || 1; // Avoid division by zero

    const width = 112; // SVG viewBox width
    const height = 40;  // SVG viewBox height
    const padding = 2;  // Padding to prevent clipping

    return sampled
      .map((price, i) => {
        const x = (i / (sampled.length - 1)) * width;
        // Invert Y axis (SVG y=0 is top) and apply padding
        const y = padding + ((max - price) / range) * (height - padding * 2);
        return `${x.toFixed(1)},${y.toFixed(1)}`;
      })
      .join(' ');
  }, [data]);

  if (!data || data.length === 0) {
    return <div className="w-28 h-10" />;
  }

  const strokeColor = isPositive ? '#16c784' : '#ea3943';

  return (
    <div className="w-28 h-10">
      <svg
        viewBox="0 0 112 40"
        className="w-full h-full"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <polyline
          points={points}
          fill="none"
          stroke={strokeColor}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
});

export default SparklineChart;
