import { parse, format } from "date-fns";

/**
 * Convierte la fecha del CSV de Magento:
 *
 * Jul 6, 2026 02:35:34 AM
 *
 * a:
 *
 * 2026-07-06 02:35:34
 *
 * (Formato ideal para guardar en PostgreSQL)
 */
export function parsePurchaseDate(value: string): string | null {
  if (!value) return null;

  try {
    const date = parse(
      value,
      "MMM d, yyyy hh:mm:ss a",
      new Date()
    );

    return format(date, "yyyy-MM-dd HH:mm:ss");
  } catch {
    return null;
  }
}

/**
 * Formato para mostrar en TODA la aplicación.
 *
 * Ejemplo:
 *
 * 06-07-26 02:35
 */
export function formatDate(date: string | Date | null): string {
  if (!date) return "-";

  try {
    return format(new Date(date), "dd-MM-yy HH:mm");
  } catch {
    return "-";
  }
}