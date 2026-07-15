import { supabase } from "@/lib/supabase/client";
import type { Order } from "@/types/orders";
import { mapOrderRow } from "@/lib/orders/mapOrder";

export async function getOrder(id: string): Promise<Order | null> {
  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error(error);
    return null;
  }

  return data ? mapOrderRow(data) : null;
}
