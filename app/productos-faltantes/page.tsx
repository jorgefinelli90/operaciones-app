"use client";

import { OrdersContent } from "@/components/orders/OrdersContent";
import { getOrdersWithCases } from "@/lib/cases/queries";

export default function MissingProductsPage() {
  return (
    <OrdersContent
      loader={getOrdersWithCases}
      title="Productos faltantes"
      subtitle="Pedidos que tienen al menos un caso abierto"
    />
  );
}
