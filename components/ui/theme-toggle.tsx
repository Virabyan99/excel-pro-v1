'use client';

import { Button } from '@/components/ui/button';
import { Sun, Moon } from 'tabler-icons-react';
import { useTheme } from '@/components/theme-provider';

export function ThemeToggle() {
  const { theme, toggle } = useTheme();
  return (
    <Button
      variant="ghost"
      aria-label="Toggle theme"
      onClick={toggle}
      className="p-2"
    >
      {theme === 'light' ? <Sun size={20} /> : <Moon size={20} />}
    </Button>
  );
}