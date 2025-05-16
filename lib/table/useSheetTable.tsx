// lib/table/useSheetTable.tsx
import { useMemo } from 'react';
import {
  ColumnDef,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { useSheetStore } from '@/lib/store/createStore';

export function useSheetTable() {
  const sheet = useSheetStore((s) => s.sheet);
  const columnWidths = useSheetStore((s) => s.columnWidths);
  const sort = useSheetStore((s) => s.sort);
  const setSort = useSheetStore((s) => s.setSort);

  const columns = useMemo<ColumnDef<(typeof sheet.rows)[number]>[]>(() => {
    const count = sheet.rows[0]?.length ?? 0;
    return Array.from({ length: count }, (_, i) => ({
      id: String(i),
      header: () => (
        <button
          className="w-full text-left font-medium"
          onClick={() =>
            setSort(
              sort?.id === i
                ? sort.desc
                  ? null
                  : { id: i, desc: true }
                : { id: i, desc: false }
            )
          }
        >
          {String.fromCharCode(65 + i)}{' '}
          {sort?.id === i ? (sort.desc ? '⬇︎' : '⬆︎') : ''}
        </button>
      ),
      cell: (ctx) => String(ctx.getValue()),
      accessorFn: (row) => row[i],
      size: columnWidths[i] ?? 120,
    }));
  }, [sheet.rows, columnWidths, sort, setSort]);

  return useReactTable({
    data: sheet.rows,
    columns,
    state: { sorting: sort ? [{ id: String(sort.id), desc: sort.desc }] : [] },
    onSortingChange: () => {}, // Handled manually via setSort
    columnResizeMode: 'onChange',
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    debugTable: false,
  });
}