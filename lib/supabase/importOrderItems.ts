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

  const { error } = await supabase
    .from("order_items")
    .upsert(items, {
      onConflict: "order_id,sku",
    });

  if (error) {
    throw error;
  }

  return {
    inserted: items.length,
  };
}