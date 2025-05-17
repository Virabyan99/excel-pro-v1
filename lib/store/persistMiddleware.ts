// lib/store/persistMiddleware.ts
import { StateCreator } from 'zustand';
import { throttle } from 'lodash-es';
import { db } from '@/lib/db';
import type { SheetStore } from './createStore';

export const persistMiddleware =
  (config: StateCreator<SheetStore>): StateCreator<SheetStore> =>
  (set, get, api) => {
    const wrapped = config(
      (args) => {
        set(args);
        throttledSave(get().sheet);
      },
      get,
      api,
    );
    return wrapped;
  };

const throttledSave = throttle(async (sheet) => {
  try {
    await db.sheets.put(sheet);
  } catch (e) {
    console.error('IndexedDB write failed', e);
  }
}, 1000);