import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import '@/app/globals.css';
import IntlProvider from '@/components/intl-provider';
import { ThemeProvider } from '@/components/theme-provider';
import AppHeader from '@/components/app-header';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'EdgeSheet',
  description: 'A lightweight Excel-like application',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-background text-foreground`}
      >
        <IntlProvider>
          <ThemeProvider>
            <AppHeader />
            <main>{children}</main>
          </ThemeProvider>
        </IntlProvider>
      </body>
    </html>
  );
}