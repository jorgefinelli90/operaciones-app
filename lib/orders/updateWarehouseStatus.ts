import { supabase } from "@/lib/supabase/client";

export async function updateWarehouseStatus(
  orderId: string,
  warehouseStatus: string,
) {
  const { data, error } = await supabase
    .from("orders")
    .update({
      warehouse_status: warehouseStatus,
    })
    .eq("id", orderId)
    .select();

  console.log("UPDATE RESULT:", data);
  console.log("UPDATE ERROR:", error);

  if (error) {
    throw error;
  }
}