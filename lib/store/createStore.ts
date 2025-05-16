// lib/store/createStore.ts
import { create } from 'zustand';
import { devtools, subscribeWithSelector } from 'zustand/middleware';
import { produce } from 'immer';
import type { Sheet, Row } from '@/lib/schema/sheet';

// Store interface
export interface SheetStore {
  sheet: Sheet;
  columnWidths: Record<number, number>;
  sort: { id: number; desc: boolean } | null;
  undoStack: Sheet[];
  addRow: (row: Row) => void;
  addMultipleRows: (rows: Row[]) => void; // New action
  updateCell: (rowIdx: number, cellIdx: number, value: Sheet['rows'][number][number]) => void;
  removeRow: (rowIdx: number) => void;
  setColumnWidth: (idx: number, px: number) => void;
  setSort: (sort: SheetStore['sort']) => void;
  pushUndo: () => void;
  undo: () => void;
  reset: () => void;
}

// Initial state
const initialState: Sheet & { columnWidths: Record<number, number>; sort: SheetStore['sort']; undoStack: Sheet[] } = {
  id: crypto.randomUUID(),
  name: 'Untitled',
  rows: [],
  createdAt: new Date(),
  updatedAt: new Date(),
  columnWidths: {},
  sort: null,
  undoStack: [], // Initialize undoStack
};

// Create the store
export const useSheetStore = create<SheetStore>()(
  subscribeWithSelector(
    devtools(
      (set, get) => ({
        sheet: initialState,
        columnWidths: initialState.columnWidths,
        sort: initialState.sort,
        undoStack: initialState.undoStack,

        addRow: (row) =>
          set(
            produce<SheetStore>((draft) => {
              draft.sheet.rows.push(row);
              draft.sheet.updatedAt = new Date();
            }),
            false,
            'addRow',
          ),

        addMultipleRows: (rows) =>
          set(
            produce<SheetStore>((draft) => {
              draft.sheet.rows.push(...rows);
              draft.sheet.updatedAt = new Date();
            }),
            false,
            'addMultipleRows',
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

        pushUndo: () =>
          set(
            produce<SheetStore>((draft) => {
              draft.undoStack.push(structuredClone(draft.sheet));
              if (draft.undoStack.length > 20) draft.undoStack.shift(); // Cap at 20 states
            }),
            false,
            'pushUndo',
          ),

        undo: () =>
          set(
            produce<SheetStore>((draft) => {
              const prev = draft.undoStack.pop();
              if (prev) draft.sheet = prev;
            }),
            false,
            'undo',
          ),

        reset: () =>
          set(
            () => ({ sheet: initialState, columnWidths: {}, sort: null, undoStack: [] }),
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