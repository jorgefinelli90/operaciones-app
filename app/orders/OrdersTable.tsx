"use client";

import { ChevronRight } from "lucide-react";
import type { Order } from "@/types/orders";
import { formatDate } from "@/lib/utils/date";

interface OrdersTableProps {
  orders: Order[];
}

const statusColors = {
  pendiente: "bg-yellow-500/10 text-yellow-400",
  despachado: "bg-blue-500/10 text-blue-400",
  enviado: "bg-green-500/10 text-green-400",
  producto_faltante: "bg-red-500/10 text-red-400",
  devuelto: "bg-orange-500/10 text-orange-400",
  cambio: "bg-purple-500/10 text-purple-400",
};

function shortShipping(shippingDescription: string) {
  if (!shippingDescription) {
    return {
      title: "-",
      subtitle: "",
    };
  }

  const shipping = shippingDescription.trim();

  // ==========================
  // RETIRO PICKUP
  // ==========================
  if (shipping.startsWith("amt - Retiro en tienda")) {
    const parts = shipping.split(" - ");

    return {
      title: "Retiro PickUp",
      subtitle: parts.length >= 3 ? parts[2] : "",
    };
  }

  // ==========================
  // ANDREANI DOMICILIO
  // ==========================
  if (shipping.startsWith("Andreani - Envio a domicilio")) {
    return {
      title: "Andreani Domicilio",
      subtitle: "Envío a domicilio",
    };
  }

  // ==========================
  // ANDREANI SUCURSAL
  // ==========================
  if (shipping.startsWith("Andreani - Retiro en sucursal")) {
    return {
      title: "Andreani Sucursal",
      subtitle: "Retiro en sucursal",
    };
  }

  // ==========================
  // DEFAULT
  // ==========================
  return {
    title: shipping,
    subtitle: "",
  };
}

export function OrdersTable({ orders }: OrdersTableProps) {
  return (
    <div className="rounded-lg border border-border bg-card overflow-hidden">
      <div className="sticky top-0 z-10 border-b border-border bg-secondary/60 backdrop-blur">
        <div className="grid grid-cols-[170px_2fr_110px_2fr_130px_140px_40px] gap-4 px-6 py-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          <div>Pedido</div>
          <div>Cliente</div>
          <div>Fecha</div>
          <div>Envío</div>
          <div>Dirección</div>
          <div>Estado</div>
          <div className="text-right">Importe</div>
          <div />
        </div>
      </div>

      <div className="divide-y divide-border max-h-96 overflow-y-auto">
        {orders.map((order) => (
          <div
            key={order.id}
            className="grid grid-cols-[170px_2fr_110px_2fr_130px_140px_40px] gap-4 items-center border-l-4 border-l-transparent px-6 py-5 transition-all hover:border-l-primary hover:bg-secondary/40"
          >
            <div>
              <p className="font-semibold text-primary">{order.id}</p>
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
                {shortShipping(order.shipping_description).title}
              </p>

              <p className="truncate text-xs text-muted-foreground">
                {shortShipping(order.shipping_description).subtitle}
              </p>
            </div>

            <div className="min-w-0">
              <p className="truncate font-medium">{order.delivery_address}</p>

              <p className="truncate text-xs text-muted-foreground">
                {order.delivery_city}
              </p>

              <p className="truncate text-xs text-muted-foreground">
                {order.delivery_province}
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

            <div className="text-right font-semibold tabular-nums">
              {new Intl.NumberFormat("es-AR", {
                style: "currency",
                currency: "ARS",
              }).format(order.grand_total)}
            </div>

            <div className="flex justify-center">
              <ChevronRight className="h-5 w-5 text-primary" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
