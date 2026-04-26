import React, { useState } from 'react';
import { ArrowLeftRight, GitCompareArrows, Calculator, TrendingUp, CalendarClock } from 'lucide-react';
import CryptoConverter from './CryptoConverter';
import CoinComparison from './CoinComparison';
import ProfitCalculator from './ProfitCalculator';
import InvestmentProjection from './InvestmentProjection';
import SIPCalculator from './SIPCalculator';

/**
 * ToolsSection — Container for all crypto tools.
 */
const ToolsSection = React.memo(function ToolsSection({ coins, currency }) {
  const [activeTool, setActiveTool] = useState('converter');

  const tools = [
    { id: 'converter', label: 'Converter', icon: <ArrowLeftRight size={14} /> },
    { id: 'comparison', label: 'Compare', icon: <GitCompareArrows size={14} /> },
    { id: 'calculator', label: 'P/L Calculator', icon: <Calculator size={14} /> },
    { id: 'projection', label: 'Projection', icon: <TrendingUp size={14} /> },
    { id: 'sip', label: 'SIP / DCA', icon: <CalendarClock size={14} /> },
  ];

  return (
    <div className="space-y-4">
      {/* Tool Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide pb-1">
        {tools.map((tool) => (
          <button
            key={tool.id}
            onClick={() => setActiveTool(tool.id)}
            className={`inline-flex items-center gap-1.5 px-4 py-2 text-sm font-semibold rounded-xl whitespace-nowrap transition-all duration-200 ${
              activeTool === tool.id
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
                : 'bg-white dark:bg-surface-900 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-800 hover:border-indigo-300 dark:hover:border-indigo-700'
            }`}
          >
            {tool.icon}
            {tool.label}
          </button>
        ))}
      </div>

      {/* Active Tool */}
      <div className="bg-white dark:bg-surface-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
        {activeTool === 'converter' && <CryptoConverter coins={coins} currency={currency} />}
        {activeTool === 'comparison' && <CoinComparison coins={coins} currency={currency} />}
        {activeTool === 'calculator' && <ProfitCalculator coins={coins} currency={currency} />}
        {activeTool === 'projection' && <InvestmentProjection coins={coins} currency={currency} />}
        {activeTool === 'sip' && <SIPCalculator coins={coins} currency={currency} />}
      </div>
    </div>
  );
});

export default ToolsSection;
