"use client";

import { OrdersContent } from "@/components/orders/OrdersContent";
import { getOrders } from "@/lib/orders/getOrders";

export default function OrdersPage() {
  return (
    <OrdersContent
      loader={() => getOrders(50)}
      title="Órdenes"
      subtitle="Últimos pedidos"
    />
  );
}
