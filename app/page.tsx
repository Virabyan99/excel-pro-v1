"use client";
// app/page.tsx
import DataGrid from '@/components/data-grid';
import ImportDialog from '@/components/import-dialog';
import ExportCSV from '@/components/export-csv';
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';
import { db } from '@/lib/db';
import { useSheetStore } from '@/lib/store/createStore';

export default function HomePage() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    (async () => {
      const rows = await db.sheets.toArray();
      if (rows.length) {
        useSheetStore.setState((state) => ({ ...state, sheet: rows[0] }));
      }
    })();
  }, []);

  return (
    <main className="p-6 space-y-4">
      <h1 className="text-xl font-bold mb-4">EdgeSheet – Playground</h1>
      <div className="flex gap-2">
        <Button onClick={() => setOpen(true)}>Import CSV</Button>
        <ExportCSV />
      </div>
      <DataGrid />
      <ImportDialog open={open} onOpenChange={setOpen} />
    </main>
  );
}