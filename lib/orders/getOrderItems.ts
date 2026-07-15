import { supabase } from "@/lib/supabase/client";

import type { OrderItem } from "@/types/orderItem";

export async function getOrderItems(
  orderId: string,
): Promise<OrderItem[]> {
  const { data, error } = await supabase
    .from("order_items")
    .select("*")
    .eq("order_id", orderId)
    .order("id");

  console.log("ORDER ID:", orderId);
  console.log("DATA:", data);
  console.log("ERROR:", error);

  if (error) {
    throw error;
  }

  return (data ?? []).map((item) => ({
    orderId: item.order_id,

    sku: item.sku,

    productName: item.product_name,

    qty: Number(item.qty),

    price: Number(item.price),

    productType: item.product_type,
  }));
}
