import { supabase } from "@/lib/supabase/client";
import type { OrderItem } from "@/types/orderItem";

export interface ImportItemsResult {
  inserted: number;
}

export async function importOrderItems(
  items: OrderItem[],
): Promise<ImportItemsResult> {
  if (items.length === 0) {
    return {
      inserted: 0,
    };
  }

  const rows = items.map((item) => ({
    order_id: item.orderId,
    sku: item.sku,
    product_name: item.productName,
    qty: item.qty,
    price: item.price,
    product_type: item.productType,
  }));
  console.log(rows[0]);
  const { error } = await supabase
    .from("order_items")
    .upsert(rows, {
      onConflict: "order_id,sku",
    });

  if (error) {
  console.log("POSTGREST ERROR");
  console.log(JSON.stringify(error, null, 2));

  throw new Error(
    `${error.code} - ${error.message} - ${error.details} - ${error.hint}`
  );
}

  return {
    inserted: rows.length,
  };
}