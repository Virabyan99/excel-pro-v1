export function extractDeps(expr: string): string[] {
  const refs = expr.match(/[A-Z]+\d+/g);
  return refs ?? [];
}