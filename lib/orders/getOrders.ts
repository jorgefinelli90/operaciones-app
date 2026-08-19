import { supabase } from "@/lib/supabase/client";
import type { Order } from "@/types/orders";
import { mapOrderRow } from "@/lib/orders/mapOrder";

function escapeIlike(value: string) {
  return value
    .replace(/\\/g, "\\\\")
    .replace(/%/g, "\\%")
    .replace(/_/g, "\\_");
}

export async function getOrders(
  limit = 50,
  search = "",
  offset = 0,
): Promise<Order[]> {
  const cleanSearch = search.trim();

  let ordersQuery = supabase
    .from("orders")
    .select("*");

  /*
   * ============================================================
   * BÚSQUEDA
   * ============================================================
   */

  if (cleanSearch) {
    const escapedSearch =
      escapeIlike(cleanSearch);

    ordersQuery = ordersQuery
      .ilike(
        "id",
        `%${escapedSearch}%`,
      )
      .order("purchase_date", {
        ascending: false,
      })
      .range(
        offset,
        offset + limit - 1,
      );
  } else {
    /*
     * ==========================================================
     * PEDIDOS NORMALES
     * ==========================================================
     *
     * Página 1:
     *   range(0, 49)
     *
     * Página 2:
     *   range(50, 99)
     */

    ordersQuery = ordersQuery
      .order("purchase_date", {
        ascending: false,
      })
      .range(
        offset,
        offset + limit - 1,
      );
  }

  const {
    data: orderRows,
    error: ordersError,
  } = await ordersQuery;

  if (ordersError) {
    throw ordersError;
  }

  if (!orderRows?.length) {
    return [];
  }

  /*
   * ============================================================
   * MAPEAR PEDIDOS
   * ============================================================
   */

  const orders =
    orderRows.map(mapOrderRow);

  /*
   * ============================================================
   * COINCIDENCIA EXACTA PRIMERO
   * ============================================================
   */

  if (cleanSearch) {
    orders.sort((a, b) => {
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

      const aDate =
        new Date(
          a.purchase_date,
        ).getTime();

      const bDate =
        new Date(
          b.purchase_date,
        ).getTime();

      return bDate - aDate;
    });
  }

  /*
   * ============================================================
   * OBTENER IDS
   * ============================================================
   */

  const orderIds =
    orders.map(
      (order) => order.id,
    );

  /*
   * ============================================================
   * COMPROBANTES
   * ============================================================
   */

  const {
    data: documents,
    error: documentsError,
  } = await supabase
    .from("order_documents")
    .select(
      "order_id, type",
    )
    .in(
      "order_id",
      orderIds,
    );

  if (documentsError) {
    throw documentsError;
  }

  /*
   * ============================================================
   * AGRUPAR COMPROBANTES
   * ============================================================
   */

  const documentsByOrder =
    new Map<
      string,
      {
        hasInvoice: boolean;
        hasCreditNote: boolean;
      }
    >();

  for (
    const document of
      documents ?? []
  ) {
    const orderId =
      String(
        document.order_id,
      );

    const current =
      documentsByOrder.get(
        orderId,
      ) ?? {
        hasInvoice: false,
        hasCreditNote: false,
      };

    const type =
      String(
        document.type ?? "",
      )
        .trim()
        .toUpperCase();

    if (
      type === "INVOICE" ||
      type === "FACTURA"
    ) {
      current.hasInvoice =
        true;
    }

    if (
      type === "CREDIT_NOTE" ||
      type === "CREDITNOTE" ||
      type === "NOTA_CREDITO" ||
      type === "NOTA DE CREDITO"
    ) {
      current.hasCreditNote =
        true;
    }

    documentsByOrder.set(
      orderId,
      current,
    );
  }

  /*
   * ============================================================
   * DEVOLVER PEDIDOS
   * ============================================================
   */

  return orders.map((order) => {
    const documents =
      documentsByOrder.get(
        order.id,
      );

    return {
      ...order,

      hasInvoice:
        documents?.hasInvoice ??
        false,

      hasCreditNote:
        documents?.hasCreditNote ??
        false,
    };
  });
}