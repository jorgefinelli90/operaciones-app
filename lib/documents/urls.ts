import type { OrderDocumentType } from "./types";

const STOCK_INTELIGENTE_BASE_URL =
  "https://burgues.stockinteligente.com";

export function getDocumentUrl(
  type: OrderDocumentType,
  number: string,
) {
  const cleanNumber =
    String(number).trim();

  if (!cleanNumber) {
    return null;
  }

  switch (type) {
    case "INVOICE":
      return `${STOCK_INTELIGENTE_BASE_URL}/imprimir_facturaventa.php?codigo=${encodeURIComponent(
        cleanNumber,
      )}`;

    case "CREDIT_NOTE":
      return `${STOCK_INTELIGENTE_BASE_URL}/imprimir_notacredito_venta.php?codigo=${encodeURIComponent(
        cleanNumber,
      )}`;

    default:
      return null;
  }
}