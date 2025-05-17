// lib/store/createStore.ts
import { create } from 'zustand';
import { devtools, subscribeWithSelector } from 'zustand/middleware';
import { produce } from 'immer';
import type { Sheet, Row } from '@/lib/schema/sheet';
import { computeFormula } from '@/lib/formula';
import { extractDeps } from '@/lib/formula/graph';
import { persistMiddleware } from './persistMiddleware';

// Initial sheet
const initialSheet: Sheet = {
  id: crypto.randomUUID(),
  name: 'Untitled',
  rows: [],
  createdAt: new Date(),
  updatedAt: new Date(),
};

// Store interface
export interface SheetStore {
  sheet: Sheet;
  columnWidths: Record<number, number>;
  sort: { id: number; desc: boolean } | null;
  undoStack: Sheet[];
  computed: Record<string, number | string>;
  addRow: (row: Row) => void;
  addMultipleRows: (rows: Row[]) => void;
  updateCell: (rowIdx: number, cellIdx: number, value: Sheet['rows'][number][number]) => void;
  removeRow: (rowIdx: number) => void;
  setColumnWidth: (idx: number, px: number) => void;
  setSort: (sort: SheetStore['sort']) => void;
  pushUndo: () => void;
  undo: () => void;
  reset: () => void;
  setCellExpression: (row: number, col: number, expr: string) => void;
}

// Create the store
export const useSheetStore = create<SheetStore>()(
  subscribeWithSelector(
    devtools(
      persistMiddleware(
        (set, get) => ({
          sheet: initialSheet,
          columnWidths: {},
          sort: null,
          undoStack: [],
          computed: {},
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
                if (draft.undoStack.length > 20) draft.undoStack.shift();
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
              () => ({
                sheet: { ...initialSheet, id: crypto.randomUUID(), createdAt: new Date(), updatedAt: new Date() },
                columnWidths: {},
                sort: null,
                undoStack: [],
                computed: {},
              }),
              false,
              'reset',
            ),
          setCellExpression: (row, col, expr) =>
            set(
              produce<SheetStore>((draft) => {
                if (!draft.sheet.rows[row]) return;
                draft.sheet.rows[row][col] = expr;
                draft.sheet.updatedAt = new Date();
              }),
              false,
              'setCellExpression',
            ),
        }),
      ),
      { name: 'EdgeSheet' },
    ),
  ),
);

// Subscription for formula computation (only on client)
if (typeof window !== 'undefined') {
  useSheetStore.subscribe(
    async (state) => {
      const deps: Record<string, string[]> = {};
      for (let r = 0; r < state.sheet.rows.length; r++) {
        for (let c = 0; c < state.sheet.rows[r].length; c++) {
          const cellId = `${String.fromCharCode(65 + c)}${r + 1}`;
          const val = state.sheet.rows[r][c];
          if (typeof val === 'string' && val.startsWith('=')) {
            deps[cellId] = extractDeps(val);
          }
        }
      }
      for (let r = 0; r < state.sheet.rows.length; r++) {
        for (let c = 0; c < state.sheet.rows[r].length; c++) {
          const cellId = `${String.fromCharCode(65 + c)}${r + 1}`;
          const val = state.sheet.rows[r][c];
          if (typeof val === 'string' && val.startsWith('=')) {
            const result = await computeFormula(cellId, val, state.sheet.rows, deps);
            useSheetStore.setState(
              produce<SheetStore>((draft) => {
                draft.computed[cellId] = result;
              }),
            );
          }
        }
      }
    },
    (state) => state.sheet,
    { equalityFn: () => false },
  );
}

// Seed test data in development mode
if (process.env.NODE_ENV === 'development') {
  initialSheet.rows = Array.from({ length: 1000 }, () =>
    Array.from({ length: 30 }, () => Math.random()),
  );
}