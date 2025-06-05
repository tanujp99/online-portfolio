'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export default function ThemeSwitcher() {
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window !== 'undefined') {
      return (localStorage.getItem('theme') as 'light' | 'dark') || 'light';
    }
    return 'light';
  });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [theme]);

  if (!mounted) return null;

  return (
    <button
      aria-label="Toggle theme"
      onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
      className="fixed bottom-6 left-6 z-50 w-12 h-12 rounded-full bg-white dark:bg-neutral-900 shadow-lg flex items-center justify-center border border-neutral-200 dark:border-neutral-700 transition-colors hover:bg-gray-100 dark:hover:bg-neutral-800"
    >
      <motion.span
        key={theme}
        initial={{ rotate: 0, scale: 1 }}
        animate={{ rotate: 180, scale: [1, 1.2, 0.9, 1] }}
        transition={{ type: 'spring', stiffness: 400, damping: 20, duration: 0.6 }}
        style={{ display: 'flex' }}
      >
        {theme === 'light' ? (
          // Improved sun icon
          <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <circle cx="12" cy="12" r="5" fill="currentColor" />
            <g stroke="currentColor" strokeLinecap="round" strokeWidth="2">
              <line x1="12" y1="1" x2="12" y2="3" />
              <line x1="12" y1="21" x2="12" y2="23" />
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
              <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
              <line x1="1" y1="12" x2="3" y2="12" />
              <line x1="21" y1="12" x2="23" y2="12" />
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
              <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
            </g>
          </svg>
        ) : (
          // Crescent moon icon
          <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7 text-blue-400 transform rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" d="M21 12.79A9 9 0 1111.21 3a7 7 0 109.79 9.79z" fill="currentColor" />
          </svg>
        )}
      </motion.span>
    </button>
  );
} 