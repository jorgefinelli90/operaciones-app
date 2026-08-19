"use client";

import type { Order } from "@/types/orders";
import { OrdersTable } from "@/components/orders/OrdersTable";

interface Props {
  orders: Order[];
  loading: boolean;
  onOrderClick?: (order: Order) => void;
}

export function MissingProductsTable({
  orders,
  loading,
  onOrderClick,
}: Props) {
  if (loading) {
    return (
      <div className="rounded-lg border p-8 text-center text-muted-foreground">
        Cargando pedidos...
      </div>
    );
  }

  if (!orders.length) {
    return (
      <div className="rounded-lg border p-8 text-center text-muted-foreground">
        No hay pedidos con casos abiertos.
      </div>
    );
  }

  return (
    <OrdersTable
      orders={orders}
      onOrderClick={onOrderClick}
    />
  );
}