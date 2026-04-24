import React, { useState, useCallback, useRef, useEffect } from 'react';

/**
 * SearchBar Component
 * 
 * Provides instant client-side search with debouncing.
 * Features search icon, clear button, and keyboard shortcut hint.
 */
const SearchBar = React.memo(function SearchBar({ onSearch, placeholder = 'Search coins...' }) {
  const [query, setQuery] = useState('');
  const debounceRef = useRef(null);
  const inputRef = useRef(null);

  // Debounced search — waits 300ms after typing stops before firing
  const handleChange = useCallback((e) => {
    const value = e.target.value;
    setQuery(value);

    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {
      onSearch(value.trim().toLowerCase());
    }, 300);
  }, [onSearch]);

  // Clear search input
  const handleClear = useCallback(() => {
    setQuery('');
    onSearch('');
    inputRef.current?.focus();
  }, [onSearch]);

  // Keyboard shortcut: Ctrl/Cmd + K to focus search
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
      }
      // Escape to clear and blur
      if (e.key === 'Escape' && document.activeElement === inputRef.current) {
        handleClear();
        inputRef.current?.blur();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleClear]);

  // Cleanup debounce on unmount
  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  return (
    <div className="relative w-full max-w-sm">
      {/* Search Icon */}
      <svg
        className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>

      <input
        ref={inputRef}
        type="text"
        value={query}
        onChange={handleChange}
        placeholder={placeholder}
        className="w-full pl-10 pr-16 py-2.5 text-sm rounded-xl 
                   bg-gray-100 dark:bg-gray-800/80 
                   text-gray-900 dark:text-gray-100
                   placeholder:text-gray-400 dark:placeholder:text-gray-500
                   border border-gray-200 dark:border-gray-700
                   focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500
                   transition-all duration-200"
        aria-label="Search cryptocurrencies"
        id="search-bar"
      />

      {/* Right side: Clear button or keyboard shortcut hint */}
      {query ? (
        <button
          onClick={handleClear}
          className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 rounded 
                     text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          aria-label="Clear search"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      ) : (
        <kbd className="absolute right-3 top-1/2 -translate-y-1/2 hidden sm:inline-flex 
                        px-1.5 py-0.5 text-[10px] font-medium text-gray-400 dark:text-gray-500
                        bg-gray-200 dark:bg-gray-700 rounded border border-gray-300 dark:border-gray-600">
          Ctrl+K
        </kbd>
      )}
    </div>
  );
});

export default SearchBar;
