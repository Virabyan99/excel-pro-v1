// components/app-header.tsx
import { BrandTabler } from 'tabler-icons-react';
import OnlineStatus from './online-status';

export default function AppHeader() {
  return (
    <header className="flex items-center justify-between p-4 border-b">
      <div className="flex items-center gap-2">
        <BrandTabler size={24} aria-hidden />
        <span className="font-semibold text-lg">EdgeSheet</span>
        <OnlineStatus />
      </div>
    </header>
  );
}