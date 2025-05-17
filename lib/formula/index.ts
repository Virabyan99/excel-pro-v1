// lib/formula/index.ts

let formulaWorker: Worker | undefined;

// Only create the worker if we're in a browser environment
if (typeof window !== 'undefined') {
  formulaWorker = new Worker(new URL('../../workers/formula.ts', import.meta.url), {
    type: 'module',
  });
}

export function computeFormula(
  cellId: string,
  expression: string,
  grid: (string | number | boolean | null)[][],
  deps: Record<string, string[]>,
): Promise<number | string> {
  if (!formulaWorker) {
    throw new Error('Worker not available');
  }

  return new Promise((resolve) => {
    formulaWorker.onmessage = (event: MessageEvent<{ result: number | string }>) => {
      resolve(event.data.result);
    };
    formulaWorker.postMessage({ type: 'compute', cellId, expression, grid, deps });
  });
}