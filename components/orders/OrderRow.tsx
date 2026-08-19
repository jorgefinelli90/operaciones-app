"use client";

import { ChevronRight } from "lucide-react";

import type { Order } from "@/types/orders";
import { formatDate } from "@/lib/utils/date";

import type { OrderColumnId } from "./OrdersTable";
import { getShippingInfo } from "./shipping";

interface OrderRowProps {
  order: Order;
  columnOrder: OrderColumnId[];
  gridTemplateColumns: string;
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
  columnOrder,
  gridTemplateColumns,
  onClick,
}: OrderRowProps) {
  const shipping = getShippingInfo(order.shippingDescription);
  const [date, time] = formatDate(order.purchase_date).split(" ");
  const amount = new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
  }).format(order.grand_total);

  function renderCell(column: OrderColumnId) {
    switch (column) {
      case "order":
        return (
          <div className="flex min-w-0 items-center gap-2">
            <p className="truncate font-semibold text-primary">{order.id}</p>
            <ChevronRight aria-hidden="true" className="size-5 shrink-0 text-primary" />
          </div>
        );
      case "customer":
        return (
          <div className="min-w-0">
            <p className="truncate font-semibold">
              {order.customer_firstname} {order.customer_lastname}
            </p>
            <p className="truncate text-xs text-muted-foreground">
              {order.customer_email}
            </p>
          </div>
        );
      case "date":
        return (
          <div className="min-w-0 whitespace-nowrap">
            <p className="font-medium">{date}</p>
            <p className="text-xs text-muted-foreground">{time}</p>
          </div>
        );
      case "shipping":
        return (
          <div className="min-w-0">
            <p className="truncate font-medium">{shipping.title}</p>
            <p className="truncate text-xs text-muted-foreground">
              {shipping.subtitle}
            </p>
          </div>
        );
      case "address":
        return (
          <div className="min-w-0">
            <p className="truncate font-medium">{order.delivery_address || "—"}</p>
            <p className="truncate text-xs text-muted-foreground">
              {[order.delivery_city, order.delivery_province]
                .filter(Boolean)
                .join(", ") || "—"}
            </p>
          </div>
        );
      case "status":
        return (
          <div className="min-w-0">
            <span
              className={`inline-flex max-w-full truncate rounded-md px-2.5 py-1 text-xs font-semibold ${
                statusColors[
                  order.warehouse_status.toLowerCase() as keyof typeof statusColors
                ] ?? "bg-secondary text-secondary-foreground"
              }`}
            >
              {order.warehouse_status}
            </span>
          </div>
        );
      case "amount":
        return (
          <div className="min-w-0 whitespace-nowrap text-center font-semibold tabular-nums text-xs">
            {amount}
          </div>
        );
    }
  }

  return (
    <div
      onClick={onClick}
      className="grid w-full cursor-pointer items-center border-l-4 border-l-transparent px-4 py-2.5 transition-colors hover:border-l-primary hover:bg-secondary/40"
      style={{ gridTemplateColumns }}
    >
      {columnOrder.map((column) => (
        <div key={column} className="min-w-0 px-2">
          {renderCell(column)}
        </div>
      ))}
    </div>
  );
}
