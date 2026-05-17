'use client';

import { useState, useEffect } from 'react';
import { Sun, Moon } from 'lucide-react';

export default function ThemeToggle() {
  const [dark, setDark] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setDark(document.documentElement.classList.contains('dark'));
  }, []);

  function toggle() {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle('dark', next);
    try {
      localStorage.setItem('theme', next ? 'dark' : 'light');
    } catch {}
  }

  if (!mounted) {
    return <div className="w-9 h-9" />;
  }

  return (
    <button
      onClick={toggle}
      aria-label="Toggle dark mode"
      className="w-9 h-9 inline-flex items-center justify-center rounded-full text-slate-500 hover:text-brand-600 dark:text-slate-400 dark:hover:text-brand-400 hover:bg-slate-100 dark:hover:bg-white/10 transition"
    >
      {dark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
    </button>
  );
}
