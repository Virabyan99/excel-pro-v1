'use client';

import { FixedSizeList as List, ListChildComponentProps } from 'react-window';
import { useSheetStore } from '@/lib/store/createStore';
import { memo, useCallback, useRef, useState, useEffect } from 'react';
import { useSheetTable } from '@/lib/table/useSheetTable';
import './DataGrid.css';

const ROW_HEIGHT = 32;

export default function DataGrid() {
  const [isClient, setIsClient] = useState(false);
  const table = useSheetTable();
  const widthMapRef = useRef<Record<number, number>>({});
  const setColumnWidth = useSheetStore((s) => s.setColumnWidth);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const onResize = useCallback(
    (idx: number, delta: number) => {
      widthMapRef.current[idx] = (widthMapRef.current[idx] ?? 10) + delta;
      setColumnWidth(idx, widthMapRef.current[idx]);
    },
    [setColumnWidth],
  );

  const totalWidth = table.getVisibleLeafColumns().reduce(
    (acc, col) => acc + (widthMapRef.current[Number(col.id)] ?? col.getSize()),
    0,
  );

  const Row = memo(({ index, style }: ListChildComponentProps) => {
    const row = table.getRowModel().rows[index];
    return (
      <div
        role="row"
        style={style}
        className={`row ${index % 2 ? 'row-even' : ''}`}
      >
        {row.getVisibleCells().map((cell) => (
          <div
            role="cell"
            key={cell.id}
            className="cell"
            style={{ width: cell.column.getSize() }}
          >
            {cell.getValue() as string}
          </div>
        ))}
      </div>
    );
  });

  if (!isClient) {
    return null;
  }

  return (
    <div role="grid" className="data-grid-container">
      <div role="rowgroup" className="header-row">
        {table.getHeaderGroups()[0].headers.map((header) => (
          <div
            role="columnheader"
            key={header.id}
            className="header-cell"
            style={{ width: header.getSize() }}
            onMouseDown={(e) => {
              const startX = e.pageX;
              const startWidth = header.getSize();
              function onMove(ev: MouseEvent) {
                const delta = ev.pageX - startX;
                onResize(Number(header.id), delta);
              }
              function onUp() {
                document.removeEventListener('mousemove', onMove);
                document.removeEventListener('mouseup', onUp);
              }
              document.addEventListener('mousemove', onMove);
              document.addEventListener('mouseup', onUp);
            }}
          >
            {header.isPlaceholder ? null : (
              typeof header.column.columnDef.header === 'function'
                ? header.column.columnDef.header(header)
                : header.column.columnDef.header
            )}
          </div>
        ))}
      </div>
      <div role="rowgroup">
        <List
          height={ROW_HEIGHT * 15}
          itemCount={table.getRowModel().rows.length}
          itemSize={ROW_HEIGHT}
          width={totalWidth}
        >
          {Row}
        </List>
      </div>
    </div>
  );
}