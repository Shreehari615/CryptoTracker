import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

/**
 * ThemeToggle Component
 * 
 * Animated sun/moon icon toggle using lucide-react icons.
 * Uses the ThemeContext for state management with localStorage persistence.
 */
const ThemeToggle = React.memo(function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <button
      onClick={toggleTheme}
      className="relative p-2.5 rounded-xl 
                 bg-gray-100 dark:bg-gray-800 
                 hover:bg-gray-200 dark:hover:bg-gray-700
                 border border-gray-200 dark:border-gray-700
                 transition-all duration-300 ease-in-out
                 focus:outline-none focus:ring-2 focus:ring-indigo-500/50
                 group overflow-hidden"
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      title={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      id="theme-toggle"
    >
      {/* Sun Icon (shown in dark mode — click to go light) */}
      <Sun
        size={20}
        className={`transition-all duration-300 ${
          isDark
            ? 'text-amber-400 rotate-0 scale-100 opacity-100'
            : 'text-amber-400 rotate-90 scale-0 opacity-0 absolute inset-0 m-auto'
        }`}
      />

      {/* Moon Icon (shown in light mode — click to go dark) */}
      <Moon
        size={20}
        className={`transition-all duration-300 ${
          !isDark
            ? 'text-indigo-600 rotate-0 scale-100 opacity-100'
            : 'text-indigo-400 -rotate-90 scale-0 opacity-0 absolute inset-0 m-auto'
        }`}
      />
    </button>
  );
});

export default ThemeToggle;
