// lib/store/createStore.ts
import { create } from 'zustand';
import { devtools, subscribeWithSelector } from 'zustand/middleware';
import { produce } from 'immer';
import type { Sheet, Row } from '@/lib/schema/sheet';

// Store interface
export interface SheetStore {
  sheet: Sheet;
  columnWidths: Record<number, number>; // index → px
  sort: { id: number; desc: boolean } | null;
  addRow: (row: Row) => void;
  updateCell: (rowIdx: number, cellIdx: number, value: Sheet['rows'][number][number]) => void;
  removeRow: (rowIdx: number) => void;
  setColumnWidth: (idx: number, px: number) => void;
  setSort: (sort: SheetStore['sort']) => void;
  reset: () => void;
}

// Initial state
const initialState: Sheet & { columnWidths: Record<number, number>; sort: SheetStore['sort'] } = {
  id: crypto.randomUUID(),
  name: 'Untitled',
  rows: [],
  createdAt: new Date(),
  updatedAt: new Date(),
  columnWidths: {},
  sort: null,
};

// Create the store
export const useSheetStore = create<SheetStore>()(
  subscribeWithSelector(
    devtools(
      (set) => ({
        sheet: initialState,
        columnWidths: initialState.columnWidths,
        sort: initialState.sort,

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

        setColumnWidth: (idx, px) =>
          set(
            produce<SheetStore>((draft) => {
              draft.columnWidths[idx] = px;
            }),
            false,
            'setColumnWidth',
          ),

        setSort: (sort) =>
          set(
            produce<SheetStore>((draft) => {
              draft.sort = sort;
            }),
            false,
            'setSort',
          ),

        reset: () =>
          set(
            () => ({ sheet: initialState, columnWidths: {}, sort: null }),
            false,
            'reset',
          ),
      }),
      { name: 'EdgeSheet' },
    ),
  ),
);

// Seed test data in development mode
if (process.env.NODE_ENV === 'development') {
  initialState.rows = Array.from({ length: 1000 }, () =>
    Array.from({ length: 30 }, () => Math.random()),
  );
}