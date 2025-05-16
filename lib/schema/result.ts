export interface FormError {
  path: string;          // e.g. "rows[1].cells[3]"
  message: string;       // human readable
}

export type Result<T, E> =
  | { ok: true; value: T }
  | { ok: false; error: E };