import React from 'react';

/**
 * FearGreedIndex Component
 * 
 * Displays the Crypto Fear & Greed Index as a visually striking gauge.
 * Values range from 0 (Extreme Fear) to 100 (Extreme Greed).
 */

// Color and label mapping based on index value
function getIndexMeta(value) {
  if (value <= 20) return { label: 'Extreme Fear', color: '#ea3943', emoji: '😱', bg: 'from-red-500/10 to-orange-500/10', border: 'border-red-500/30' };
  if (value <= 40) return { label: 'Fear', color: '#ea8c00', emoji: '😟', bg: 'from-orange-500/10 to-yellow-500/10', border: 'border-orange-500/30' };
  if (value <= 60) return { label: 'Neutral', color: '#c9b208', emoji: '😐', bg: 'from-yellow-500/10 to-green-500/10', border: 'border-yellow-500/30' };
  if (value <= 80) return { label: 'Greed', color: '#16c784', emoji: '😀', bg: 'from-green-500/10 to-emerald-500/10', border: 'border-green-500/30' };
  return { label: 'Extreme Greed', color: '#00b7b2', emoji: '🤑', bg: 'from-emerald-500/10 to-teal-500/10', border: 'border-emerald-500/30' };
}

const FearGreedIndex = React.memo(function FearGreedIndex({ data, loading }) {
  if (loading) {
    return (
      <div className="bg-white dark:bg-surface-800 rounded-2xl border border-gray-200 dark:border-gray-800 p-5 animate-pulse">
        <div className="h-4 w-40 bg-gray-200 dark:bg-gray-700 rounded mb-4" />
        <div className="flex items-center justify-center">
          <div className="w-36 h-36 rounded-full bg-gray-200 dark:bg-gray-700" />
        </div>
      </div>
    );
  }

  if (!data) return null;

  const meta = getIndexMeta(data.value);
  const rotation = (data.value / 100) * 180 - 90; // -90 to 90 degrees

  return (
    <div className={`bg-gradient-to-br ${meta.bg} dark:from-surface-800 dark:to-surface-800 rounded-2xl border ${meta.border} dark:border-gray-800 p-5 transition-all duration-300`}>
      <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-1 flex items-center gap-2">
        <span className="text-base">{meta.emoji}</span>
        Fear & Greed Index
      </h3>
      <p className="text-[10px] text-gray-500 dark:text-gray-400 mb-4">
        What emotion is driving the crypto market?
      </p>

      {/* Gauge */}
      <div className="flex flex-col items-center">
        <div className="relative w-44 h-24 overflow-hidden">
          {/* Gauge background arc */}
          <svg viewBox="0 0 200 110" className="w-full h-full">
            <defs>
              <linearGradient id="gaugeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#ea3943" />
                <stop offset="25%" stopColor="#ea8c00" />
                <stop offset="50%" stopColor="#c9b208" />
                <stop offset="75%" stopColor="#16c784" />
                <stop offset="100%" stopColor="#00b7b2" />
              </linearGradient>
            </defs>
            {/* Background track */}
            <path
              d="M 20 100 A 80 80 0 0 1 180 100"
              fill="none"
              stroke="currentColor"
              strokeWidth="12"
              strokeLinecap="round"
              className="text-gray-200 dark:text-gray-700"
            />
            {/* Colored arc */}
            <path
              d="M 20 100 A 80 80 0 0 1 180 100"
              fill="none"
              stroke="url(#gaugeGrad)"
              strokeWidth="12"
              strokeLinecap="round"
            />
            {/* Needle */}
            <g transform={`rotate(${rotation}, 100, 100)`}>
              <line
                x1="100" y1="100" x2="100" y2="30"
                stroke={meta.color}
                strokeWidth="3"
                strokeLinecap="round"
              />
              <circle cx="100" cy="100" r="6" fill={meta.color} />
              <circle cx="100" cy="100" r="3" fill="white" />
            </g>
            {/* Labels */}
            <text x="15" y="108" textAnchor="start" className="text-[10px] fill-gray-400 dark:fill-gray-500" style={{ fontSize: '10px' }}>0</text>
            <text x="185" y="108" textAnchor="end" className="text-[10px] fill-gray-400 dark:fill-gray-500" style={{ fontSize: '10px' }}>100</text>
          </svg>
        </div>

        {/* Value display */}
        <div className="text-center -mt-2">
          <div className="text-3xl font-extrabold" style={{ color: meta.color }}>
            {data.value}
          </div>
          <div
            className="text-xs font-bold mt-0.5 px-3 py-1 rounded-full"
            style={{
              color: meta.color,
              backgroundColor: `${meta.color}18`,
            }}
          >
            {data.classification}
          </div>
        </div>
      </div>

      {/* Scale legend */}
      <div className="flex items-center justify-between mt-4 px-1">
        {[
          { label: 'Extreme Fear', color: '#ea3943' },
          { label: 'Fear', color: '#ea8c00' },
          { label: 'Neutral', color: '#c9b208' },
          { label: 'Greed', color: '#16c784' },
          { label: 'Extreme Greed', color: '#00b7b2' },
        ].map((item) => (
          <div key={item.label} className="flex flex-col items-center gap-0.5">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
            <span className="text-[8px] text-gray-400 dark:text-gray-500 leading-tight text-center max-w-[48px]">
              {item.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
});

export default FearGreedIndex;
