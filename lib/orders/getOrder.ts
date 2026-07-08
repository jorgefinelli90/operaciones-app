import { supabase } from "@/lib/supabase/client";
import type { Order } from "@/types/order";

export async function getOrder(id: string): Promise<Order | null> {
  try {
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.error(error);
      return null;
    }

    return data;
  } catch (err) {
    console.error("Error fetching order:", err);
    return null;
  }
}
