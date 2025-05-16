'use client';
import { useSheetStore } from '@/lib/store/createStore';

export default function DataGridPlaceholder() {
  const sheet = useSheetStore((s) => s.sheet);
  return (
    <pre className="p-4 border rounded max-w-full overflow-x-auto">
      {JSON.stringify(sheet.rows, null, 2)}
    </pre>
  );
}