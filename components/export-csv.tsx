// components/export-csv.tsx
'use client';

import { Button } from '@/components/ui/button';
import Papa from 'papaparse';
import { useSheetStore } from '@/lib/store/createStore';

export default function ExportCSV() {
  const rows = useSheetStore((s) => s.sheet.rows);

  function download() {
    const csv = Papa.unparse(rows);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'edgesheet.csv';
    link.click();
    URL.revokeObjectURL(url);
  }

  return (
    <Button variant="outline" onClick={download}>
      Export CSV
    </Button>
  );
}