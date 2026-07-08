import type { OrderImport } from "@/lib/types/orders";
import { parsePurchaseDate } from "@/lib/utils/date";

function parseCurrency(value: string): number {
    if (!value) return 0;
  
    return parseFloat(
      value
        .replace("$", "")
        .replace(/,/g, "")
        .trim()
    );
  }
  


export function mapOrders(rows: Record<string, string>[]): OrderImport[] {
  return rows.map((row) => ({
    id: row["ID"]?.trim(),

    purchaseDate: parsePurchaseDate(row["Purchase Date"]),

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