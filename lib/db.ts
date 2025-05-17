// lib/db.ts
import Dexie, { Table } from 'dexie';
import type { Sheet } from '@/lib/schema/sheet';

export interface SheetRecord extends Sheet {}

class EdgeSheetDB extends Dexie {
  sheets!: Table<SheetRecord, string>;

  constructor() {
    super('EdgeSheetDB');
    this.version(1).stores({
      sheets: 'id, name, updatedAt',
    });
  }
}

export const db = new EdgeSheetDB();