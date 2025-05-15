'use client';

import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';

export default function SideDrawer() {
  const t = useTranslations();
  return (
    <nav
      aria-label="Primary"
      className="flex flex-col gap-6 p-6 w-64 h-full bg-background"
    >
      <a href="#" className="text-lg font-medium">
        {t('nav.sheet')}
      </a>

      <Button
        variant="outline"
        className="mt-auto md:hidden"
        aria-label={t('nav.close')}
        data-close-sheet
      >
        {t('nav.close')}
      </Button>
    </nav>
  );
}