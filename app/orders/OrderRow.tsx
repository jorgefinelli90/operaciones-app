"use client";

import { ChevronRight } from "lucide-react";

import type { Order } from "@/types/orders";

import { formatDate } from "@/lib/utils/date";

import { getShippingInfo } from "./shipping";

interface OrderRowProps {
  order: Order;
  onClick?: () => void;
}

const statusColors = {
  pendiente: "bg-yellow-500/10 text-yellow-400",
  despachado: "bg-blue-500/10 text-blue-400",
  enviado: "bg-green-500/10 text-green-400",
  producto_faltante: "bg-red-500/10 text-red-400",
  devuelto: "bg-orange-500/10 text-orange-400",
  cambio: "bg-purple-500/10 text-purple-400",
};

export function OrderRow({
  order,
  onClick,
}: OrderRowProps) {
  const shipping = getShippingInfo(
    order.shippingDescription
  );

  return (
    <div
  onClick={onClick}
  className="grid grid-cols-[170px_2fr_110px_2fr_200px_40px] gap-4 items-start border-l-4 border-l-transparent px-6 py-2 transition-all hover:border-l-primary hover:bg-secondary/40 cursor-pointer min-w-max lg:min-w-full"
>
      <div className="flex items-center gap-2">
        <p className="font-semibold text-primary">
          {order.id}
        </p>
        <ChevronRight className="h-5 w-5 text-primary flex-shrink-0" />
      </div>

      <div className="min-w-0">
        <p className="truncate font-semibold">
          {order.customer_firstname} {order.customer_lastname}
        </p>

        <p className="truncate text-xs text-muted-foreground">
          {order.customer_email}
        </p>
      </div>

      <div>
        <p className="font-medium">
          {formatDate(order.purchase_date).split(" ")[0]}
        </p>

        <p className="text-xs text-muted-foreground">
          {formatDate(order.purchase_date).split(" ")[1]}
        </p>
      </div>

      <div>
        <p className="font-medium">
          {shipping.title}
        </p>

        <p className="truncate text-xs text-muted-foreground">
          {shipping.subtitle}
        </p>
      </div>

      <div>
        <span
          className={`inline-flex rounded-md px-3 py-1 text-xs font-semibold ${
            statusColors[
              order.warehouse_status.toLowerCase() as keyof typeof statusColors
            ]
          }`}
        >
          {order.warehouse_status}
        </span>
      </div>

      <div className="text-right font-semibold tabular-nums whitespace-nowrap overflow-hidden">
        {new Intl.NumberFormat("es-AR", {
          style: "currency",
          currency: "ARS",
        }).format(order.grand_total)}
      </div>

      <div />

    </div>
  );
}
