'use client';


import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useTranslations } from 'next-intl';
import { BrandTabler } from 'tabler-icons-react';
import SideDrawer from './side-drawer';

export default function AppHeader() {
  const t = useTranslations();
  return (
    <header className="flex items-center justify-between p-4 border-b">
      <div className="flex items-center gap-2">
        <BrandTabler size={24} aria-hidden />
        <span className="font-semibold text-lg">{t('app.title')}</span>
      </div>

      {/* Mobile navigation */}
      <Sheet>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            aria-label={t('nav.open')}
            className="md:hidden"
          >
            <svg width="24" height="24" viewBox="0 0 24 24">
              <path
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0">
          <SideDrawer />
        </SheetContent>
      </Sheet>

      {/* Desktop navigation */}
      <nav className="hidden md:flex gap-4">
        <a href="#" className="hover:underline">
          {t('nav.sheet')}
        </a>
      </nav>
    </header>
  );
}