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

function parseShippingAddress(value: string) {
  const lines = value
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  if (lines.length === 0) {
    return { address: "", city: "", province: "" };
  }

  const lastLine = lines[lines.length - 1];
  const parts = lastLine
    .split(",")
    .map((part) => part.trim())
    .filter(Boolean);

  return {
    address: lines[0] || "",
    city: parts[1] || "",
    province: parts[2] || "",
  };
}

export function mapOrders(rows: Record<string, string>[]): OrderImport[] {
  return rows.map((row) => {
    const shippingAddress = parseShippingAddress(row["Shipping Address"] || "");

    return {
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

      deliveryAddress: shippingAddress.address,
      deliveryCity: shippingAddress.city,
      deliveryProvince: shippingAddress.province,
    };
  });
}