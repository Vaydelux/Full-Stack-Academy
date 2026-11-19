'use client';

import { useEffect } from 'react';
import { STORAGE_KEY, useAcademy } from '@/lib/academy/store';

/**
 * Hydrates across routes, mirrors theme tokens and consumes storage events
 * from other tabs on the same origin. Browser storage is still last-write-wins:
 * concurrent edits made before the event arrives can overwrite one another.
 */
export function ProgressStorageSync() {
  const hydrated = useAcademy(s => s.hydrated);
  const hydrate = useAcademy(s => s.hydrate);
  const theme = useAcademy(s => s.progress.theme);

  useEffect(() => { if (!hydrated) hydrate(); }, [hydrate, hydrated]);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle('dark', theme === 'dark');
    root.classList.toggle('light', theme === 'light');
  }, [theme]);

  useEffect(() => {
    const onStorage = (event: StorageEvent) => {
      if (event.storageArea !== window.localStorage) return;
      if (event.key === STORAGE_KEY || event.key === null) {
        useAcademy.getState().hydrate();
      }
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  return null;
}
