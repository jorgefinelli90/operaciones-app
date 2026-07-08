export interface OrderImport {
  id: string;
  purchaseDate: string | null;
  customerName: string;
  customerEmail: string;
  shippingMethod: string;
  paymentMethod: string;
  magentoStatus: string;
  warehouseStatus: string;
  trackingNumber: string | null;
  grandTotal: number;
}

function parseCurrency(value: string): number {
  if (!value) return 0;

  return Number(
    value
      .replace(/\$/g, "")
      .replace(/\./g, "")
      .replace(",", ".")
      .trim()
  );
}

export function mapOrders(rows: Record<string, string>[]): OrderImport[] {
  return rows.map((row) => ({
    id: row["ID"]?.trim(),

    purchaseDate: row["Purchase Date"] || null,

    customerName: row["Customer Name"]?.trim() || "",

    customerEmail: row["Customer Email"]?.trim() || "",

    shippingMethod: row["Shipping Information"]?.trim() || "",

    paymentMethod: row["Payment Method"]?.trim() || "",

    magentoStatus: row["Status"]?.trim() || "",

    warehouseStatus: "PENDIENTE",

    trackingNumber: null,

    grandTotal: parseCurrency(
      row["Grand Total (Purchased)"] || "0"
    ),
  }));
}