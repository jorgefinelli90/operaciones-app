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

  if (error) {
    throw error;
  }

  return (data ?? []).map((item) => ({
    id: Number(item.id),

    orderId: item.order_id,

    sku: item.sku,

    productName: item.product_name,

    qty: Number(item.qty),

    price: Number(item.price),

    productType: item.product_type,
  }));
}