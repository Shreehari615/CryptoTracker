import { createContext, useContext, useState, useEffect, useCallback } from 'react';

/**
 * Theme Context
 * 
 * Provides dark/light mode toggle with localStorage persistence.
 * The theme class is applied to the <html> element for Tailwind's
 * `dark:` variant to work correctly.
 */

const ThemeContext = createContext();

/**
 * Reads the saved theme from localStorage, defaults to 'dark'
 * @returns {string} 'dark' or 'light'
 */
function getInitialTheme() {
  const saved = localStorage.getItem('crypto-dashboard-theme');
  if (saved === 'light' || saved === 'dark') return saved;
  
  // Respect OS preference if no saved preference
  if (window.matchMedia('(prefers-color-scheme: light)').matches) {
    return 'light';
  }
  return 'dark'; // Default to dark mode for crypto dashboards
}

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(getInitialTheme);

  // Apply theme class to <html> element whenever theme changes
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.classList.remove('dark');
      root.classList.add('light');
    }
    localStorage.setItem('crypto-dashboard-theme', theme);
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

/**
 * Custom hook to consume the theme context
 * @returns {{ theme: string, toggleTheme: () => void }}
 */
export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
