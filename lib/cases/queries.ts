import { supabase } from "@/lib/supabase/client";

import type { Order } from "@/types/orders";
import { mapOrderRow } from "@/lib/orders/mapOrder";

export async function getOrdersWithCases(): Promise<Order[]> {
  // Traer todos los casos abiertos
  const { data: cases, error: casesError } = await supabase
    .from("order_cases")
    .select("order_id")
    .not("status", "in", '("RESOLVED","CANCELLED")');

  if (casesError) throw casesError;

  // Eliminar duplicados
  const orderIds = [...new Set(cases.map((c) => c.order_id))];

  if (!orderIds.length) {
    return [];
  }

  // Buscar los pedidos correspondientes
  const { data: orders, error: ordersError } = await supabase
    .from("orders")
    .select("*")
    .in("id", orderIds)
    .order("purchase_date", {
      ascending: false,
    });

  if (ordersError) throw ordersError;

  return (orders ?? []).map(mapOrderRow);
}
