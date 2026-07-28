"use client";

import type { Order } from "@/types/orders";
import { Package, Truck, User } from "lucide-react";

interface Props {
  order: Order;
  productsCount: number;
}

export function Header({
  order,
  productsCount,
}: Props) {
  return (
    <div className="border-b border-border px-6 py-6">

      <div className="flex items-start justify-between">

        <div>

          <div className="text-2xl font-bold">
            Pedido #{order.id}
          </div>

          <div className="mt-1 flex items-center gap-2 text-muted-foreground">
            <User size={15} />

            {order.customer_firstname}{" "}
            {order.customer_lastname}
          </div>

        </div>

      </div>

      <div className="mt-5 grid grid-cols-2 gap-4">

        <div className="flex items-center gap-3 rounded-lg border p-3">

          <Package
            size={18}
            className="text-muted-foreground"
          />

          <div>

            <div className="text-xs uppercase text-muted-foreground">
              Productos
            </div>

            <div className="font-semibold">
              {productsCount}
            </div>

          </div>

        </div>

        <div className="flex items-center gap-3 rounded-lg border p-3">

          <Truck
            size={18}
            className="text-muted-foreground"
          />

          <div>

            <div className="text-xs uppercase text-muted-foreground">
              Envío
            </div>

            <div className="text-sm">
              {order.shippingDescription}
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}