import { supabase } from "@/lib/supabase/client";
import type { Order } from "@/types/orders";
import { mapOrderRow } from "@/lib/orders/mapOrder";

export async function getOrders(limit = 50): Promise<Order[]> {
  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .order("purchase_date", { ascending: false })
    .limit(limit);

  if (error) {
    throw error;
  }

  return (data ?? []).map(mapOrderRow);
}
