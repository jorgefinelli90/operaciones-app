"use client";

import { ChevronRight } from "lucide-react";
import type { Order } from "@/types/orders";
import { formatDate } from "@/lib/utils/date";
import { getShippingInfo } from "./shipping";
import { OrderRow } from "./OrderRow";
interface OrdersTableProps {
  orders: Order[];

  onOrderClick?: (order: Order) => void;
}

const statusColors = {
  pendiente: "bg-yellow-500/10 text-yellow-400",
  despachado: "bg-blue-500/10 text-blue-400",
  enviado: "bg-green-500/10 text-green-400",
  producto_faltante: "bg-red-500/10 text-red-400",
  devuelto: "bg-orange-500/10 text-orange-400",
  cambio: "bg-purple-500/10 text-purple-400",
};



export function OrdersTable({
  orders,
  onOrderClick,
}: OrdersTableProps) {
  return (
    <div className="rounded-lg border border-border bg-card overflow-hidden">
      <div className="sticky top-0 z-10 border-b border-border bg-secondary/60 backdrop-blur overflow-x-auto lg:overflow-x-visible">
        <div className="grid grid-cols-[170px_2fr_110px_2fr_200px_40px] gap-4 px-6 py-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground min-w-max lg:min-w-full">
          <div>Pedido</div>
          <div>Cliente</div>
          <div>Fecha</div>
          <div>Envío</div>
          <div>Estado</div>
          <div className="text-right">Importe</div>
          <div />
        </div>
      </div>

      <div className="divide-y divide-border overflow-x-auto lg:overflow-x-visible">
        {orders.map((order) => (
  <OrderRow
    key={order.id}
    order={order}
    onClick={() => onOrderClick?.(order)}
/>
))}
      </div>
    </div>
  );
}
