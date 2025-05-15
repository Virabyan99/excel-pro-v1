'use client';

import { IntlProvider as NextIntlProvider } from 'next-intl';
import { ReactNode } from 'react';
import en from '@/i18n/en.json';

export default function IntlProvider({ children }: { children: ReactNode }) {
  return (
    <NextIntlProvider locale="en" messages={en}>
      {children}
    </NextIntlProvider>
  );
}