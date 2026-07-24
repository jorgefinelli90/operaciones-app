import type { OrderItemInput } from "@/types/orderItem";

function parseNumber(value?: string): number {
  if (!value) return 0;

  const number = Number(
    value.replace(/,/g, "").trim()
  );

  return Number.isNaN(number) ? 0 : number;
}

export function mapOrderItems(
  rows: Record<string, string>[]
): OrderItemInput[] {

  const items: OrderItemInput[] = [];

  let currentOrderId = "";

  for (const row of rows) {

    if (row["increment_id"]?.trim()) {
      currentOrderId = row["increment_id"].trim();
    }

    const productType =
      row["sales_order_item.product_type"]
        ?.trim()
        .toLowerCase();

    if (productType !== "configurable") {
      continue;
    }

    items.push({
      orderId: currentOrderId,

      sku:
        row["sales_order_item.sku"]?.trim() || "",

      productName:
        row["sales_order_item.name"]?.trim() || "",

      qty: parseNumber(
        row["sales_order_item.qty_ordered"]
      ),

      price: parseNumber(
        row["sales_order_item.price"]
      ),

      productType: "configurable",
    });

  }

  return items.filter(
    item =>
      item.orderId !== "" &&
      item.sku !== ""
  );
}
