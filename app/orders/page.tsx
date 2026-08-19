"use client";

import { OrdersContent } from "@/components/orders/OrdersContent";
import { getOrders } from "@/lib/orders/getOrders";

export default function OrdersPage() {
  return (
    <OrdersContent
      loader={getOrders}
      title="Pedidos"
      subtitle="Gestión y seguimiento de pedidos"
    />
  );
}