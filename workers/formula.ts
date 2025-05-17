import { create, all } from 'mathjs';

const math = create(all, { number: 'number' });

// Convert cell reference (e.g., "A1") to grid coordinates
function colRow(cell: string): [number, number] {
  const [, col, row] = /^([A-Z]+)(\d+)$/i.exec(cell) || [];
  const colIdx = col
    .split('')
    .reduce((acc, c) => acc * 26 + (c.toUpperCase().charCodeAt(0) - 64), 0) - 1;
  return [colIdx, Number(row) - 1];
}

// Evaluate a single expression
function evaluate(
  cellId: string,
  expression: string,
  grid: (string | number | boolean | null)[][],
): number | string {
  if (!expression.startsWith('=')) return expression;

  const formula = expression.slice(1);
  const substituted = formula.replace(/[A-Z]+\d+/g, (ref) => {
    const [c, r] = colRow(ref);
    const v = grid[r]?.[c];
    if (typeof v === 'number') return String(v);
    if (typeof v === 'string' && /^[+-]?\d+(\.\d+)?$/.test(v)) return v;
    return '0'; // Default to 0 for invalid references
  });

  try {
    return math.evaluate(substituted);
  } catch {
    return '#ERR!'; // Error for invalid formulas
  }
}

// Detect circular references using DFS
function detectCycles(
  start: string,
  deps: Record<string, Set<string>>,
  visiting: Set<string> = new Set(),
): boolean {
  if (visiting.has(start)) return true;
  visiting.add(start);
  for (const next of deps[start] || []) {
    if (detectCycles(next, deps, visiting)) return true;
  }
  visiting.delete(start);
  return false;
}

// Worker message handler
self.onmessage = (event) => {
  const { type, cellId, expression, grid, deps } = event.data;
  if (type === 'compute') {
    const depSets: Record<string, Set<string>> = {};
    for (const key in deps) {
      depSets[key] = new Set(deps[key]);
    }
    const result = detectCycles(cellId, depSets) ? '#CIRC!' : evaluate(cellId, expression, grid);
    self.postMessage({ result });
  }
};