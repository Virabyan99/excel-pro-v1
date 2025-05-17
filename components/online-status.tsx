'use client';
import { useEffect, useState } from 'react';

export default function OnlineStatus() {
  const [mounted, setMounted] = useState(false);
  const [online, setOnline] = useState(true); // Default value, updated on mount

  useEffect(() => {
    setMounted(true);
    setOnline(navigator.onLine); // Set initial online status
    const onUp = () => setOnline(true);
    const onDown = () => setOnline(false);
    window.addEventListener('online', onUp);
    window.addEventListener('offline', onDown);
    return () => {
      window.removeEventListener('online', onUp);
      window.removeEventListener('offline', onDown);
    };
  }, []);

  if (!mounted) {
    return null; // Prevents server from rendering dynamic content
  }

  return (
    <span
      className={`ml-2 inline-block w-3 h-3 rounded-full ${online ? 'bg-emerald-500' : 'bg-red-500'}`}
      title={online ? 'Online' : 'Offline'}
      aria-label={online ? 'Online' : 'Offline'}
    />
  );
}