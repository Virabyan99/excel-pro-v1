import { z } from 'zod';
import { Result, FormError } from './result';

export const CellSchema = z.union([
  z.number(),
  z.string().max(16384), // 16 kB max
  z.boolean(),
  z.null(),
]);

export const RowSchema = z.array(CellSchema).max(10000); // Max 10,000 cells

export const SheetSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1).max(128),
  rows: z.array(RowSchema).max(100000), // Max 100,000 rows
  createdAt: z.coerce.date(), // Converts ISO strings to Date
  updatedAt: z.coerce.date(),
});

export type Cell = z.infer<typeof CellSchema>;
export type Row = z.infer<typeof RowSchema>;
export type Sheet = z.infer<typeof SheetSchema>;

export function parseSheet(json: unknown): Result<Sheet, FormError[]> {
  const parsed = SheetSchema.safeParse(json);
  if (parsed.success) return { ok: true, value: parsed.data };

  const errors = parsed.error.issues.map<FormError>((issue) => ({
    path: issue.path.join('.'),
    message: issue.message,
  }));
  return { ok: false, error: errors };
}