import { create } from 'zustand';
import { devtools, subscribeWithSelector } from 'zustand/middleware';
import { produce } from 'immer';
import type { Sheet, Row } from '@/lib/schema/sheet';

// Store interface
export interface SheetStore {
  sheet: Sheet;
  addRow: (row: Row) => void;
  updateCell: (rowIdx: number, cellIdx: number, value: Sheet['rows'][number][number]) => void;
  removeRow: (rowIdx: number) => void;
  reset: () => void; // Added for testing convenience
}

// Initial state
const initialState: Sheet = {
  id: crypto.randomUUID(),
  name: 'Untitled',
  rows: [],
  createdAt: new Date(),
  updatedAt: new Date(),
};

// Create the store
export const useSheetStore = create<SheetStore>()(
  subscribeWithSelector(
    devtools(
      (set) => ({
        sheet: initialState,

        addRow: (row) =>
          set(
            produce<SheetStore>((draft) => {
              draft.sheet.rows.push(row);
              draft.sheet.updatedAt = new Date();
            }),
            false,
            'addRow',
          ),

        updateCell: (rowIdx, cellIdx, value) =>
          set(
            produce<SheetStore>((draft) => {
              if (!draft.sheet.rows[rowIdx]) return;
              draft.sheet.rows[rowIdx][cellIdx] = value;
              draft.sheet.updatedAt = new Date();
            }),
            false,
            'updateCell',
          ),

        removeRow: (rowIdx) =>
          set(
            produce<SheetStore>((draft) => {
              draft.sheet.rows.splice(rowIdx, 1);
              draft.sheet.updatedAt = new Date();
            }),
            false,
            'removeRow',
          ),

        reset: () =>
          set(() => ({ sheet: initialState }), false, 'reset'),
      }),
      { name: 'EdgeSheet' },
    ),
  ),
);