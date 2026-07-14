import type { OrderItem } from "@/types/orderItem";

function parseNumber(value: string): number {
  if (!value) return 0;

  return parseFloat(
    value
      .replace(/,/g, "")
      .trim()
  );
}

export function mapOrderItems(
  rows: Record<string, string>[]
): OrderItem[] {
  const items: OrderItem[] = [];

  for (const row of rows) {
    const productType =
      row["sales_order_item.product_type"]?.trim().toLowerCase();

    // Ignorar productos simples
    if (productType !== "configurable") {
      continue;
    }

    items.push({
      orderId: row["increment_id"]?.trim() || "",

      sku: row["sales_order_item.sku"]?.trim() || "",

      productName:
        row["sales_order_item.name"]?.trim() || "",

      qty: parseNumber(
        row["sales_order_item.qty_ordered"] || "0"
      ),

      price: parseNumber(
        row["sales_order_item.price"] || "0"
      ),

      productType,
    });
  }

  return items;
}