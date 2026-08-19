import { supabase } from "@/lib/supabase/client";

import type { Order } from "@/types/orders";
import { mapOrderRow } from "@/lib/orders/mapOrder";

function escapeIlike(value: string) {
  return value
    .replace(/\\/g, "\\\\")
    .replace(/%/g, "\\%")
    .replace(/_/g, "\\_");
}

export async function getOrdersWithCases(
  limit = 50,
  search = "",
): Promise<Order[]> {
  const cleanSearch =
    search.trim();

  /*
   * ============================================================
   * 1. TRAER PEDIDOS QUE TIENEN CASOS ABIERTOS
   * ============================================================
   *
   * RESOLVED y CANCELLED quedan afuera.
   */

  const {
    data: cases,
    error: casesError,
  } = await supabase
    .from("order_cases")
    .select("order_id")
    .not(
      "status",
      "in",
      '("RESOLVED","CANCELLED")',
    );

  if (casesError) {
    throw casesError;
  }

  /*
   * Eliminar pedidos duplicados.
   */

  const orderIds = [
    ...new Set(
      (cases ?? []).map(
        (item) => item.order_id,
      ),
    ),
  ];

  if (!orderIds.length) {
    return [];
  }

  /*
   * ============================================================
   * 2. BUSCAR LOS PEDIDOS
   * ============================================================
   */

  let ordersQuery = supabase
    .from("orders")
    .select("*")
    .in("id", orderIds);

  /*
   * Sin búsqueda:
   *
   * → últimos pedidos con casos abiertos.
   */

  if (!cleanSearch) {
    ordersQuery = ordersQuery
      .order("purchase_date", {
        ascending: false,
      })
      .limit(limit);
  }

  /*
   * Con búsqueda:
   *
   * → buscar dentro de los pedidos que
   *   ya sabemos que tienen casos abiertos.
   */

  if (cleanSearch) {
    const escapedSearch =
      escapeIlike(cleanSearch);

    ordersQuery = ordersQuery
      .ilike(
        "id",
        `%${escapedSearch}%`,
      )
      .limit(limit);
  }

  const {
    data: orders,
    error: ordersError,
  } = await ordersQuery;

  if (ordersError) {
    throw ordersError;
  }

  if (!orders?.length) {
    return [];
  }

  /*
   * ============================================================
   * 3. MAPEAR PEDIDOS
   * ============================================================
   */

  const mappedOrders =
    orders.map(mapOrderRow);

  /*
   * ============================================================
   * 4. COINCIDENCIA EXACTA PRIMERO
   * ============================================================
   *
   * Ejemplo:
   *
   * Buscar: 194488
   *
   * Resultado:
   *
   * 194488
   * 194488-01
   * 194488-02
   */

  if (cleanSearch) {
    mappedOrders.sort(
      (a, b) => {
        const aExact =
          a.id === cleanSearch;

        const bExact =
          b.id === cleanSearch;

        if (
          aExact &&
          !bExact
        ) {
          return -1;
        }

        if (
          !aExact &&
          bExact
        ) {
          return 1;
        }

        /*
         * Si ninguno es exacto,
         * mostrar primero los más recientes.
         */

        const aDate =
          new Date(
            a.purchase_date,
          ).getTime();

        const bDate =
          new Date(
            b.purchase_date,
          ).getTime();

        return bDate - aDate;
      },
    );
  }

  return mappedOrders;
}