"use client";

import type { Order } from "@/types/orders";
import { useEffect, useState } from "react";
import type { OrderItem } from "@/types/orderItem";
import { getOrderItems } from "@/lib/orders/getOrderItems";

interface OrderDrawerProps {
  order: Order | null;

  open: boolean;

  onClose: () => void;
}

export function OrderDrawer({
  order,
  open,
  onClose,
}: OrderDrawerProps) {
  const [items, setItems] = useState<OrderItem[]>([]);
  const [loadingItems, setLoadingItems] = useState(false);

  useEffect(() => {
    async function loadItems() {
      if (!order) {
        setItems([]);
        return;
      }

      setLoadingItems(true);

      try {
        const data = await getOrderItems(order.id);

        setItems(data);
      } finally {
        setLoadingItems(false);
      }
    }

    if (open) {
      loadItems();
    } else {
      setItems([]);
    }
  }, [open, order]);

  return (
    <>
      {open && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/40"
        />
      )}

      <aside
        className={`fixed right-0 top-0 z-50 h-screen w-[420px] border-l border-border bg-background shadow-xl transition-transform duration-300 ${
          open
            ? "translate-x-0"
            : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-border p-6">

          <h2 className="text-xl font-bold">
            Pedido
          </h2>

          <button
            onClick={onClose}
            className="rounded-md px-3 py-2 hover:bg-secondary"
          >
            ✕
          </button>

        </div>

        <div className="space-y-5 p-6">

          <div>

            <p className="text-xs text-muted-foreground">
              Pedido
            </p>

            <p className="font-semibold">
              {order?.id}
            </p>

          </div>

          <div>

            <p className="text-xs text-muted-foreground">
              Cliente
            </p>

            <p className="font-semibold">
              {order?.customer_firstname}{" "}
              {order?.customer_lastname}
            </p>

          </div>

          <div>

            <p className="text-xs text-muted-foreground">
              Email
            </p>

            <p>
              {order?.customer_email}
            </p>

          </div>

          <hr className="border-border" />

<div>

  <p className="mb-3 text-sm font-semibold">
    Productos
  </p>

  {loadingItems ? (

    <p className="text-sm text-muted-foreground">
      Cargando...
    </p>

  ) : (

    <div className="space-y-3">

      {items.map((item) => (

        <div
          key={`${item.orderId}-${item.sku}`}
          className="rounded-lg border border-border p-3"
        >

          <p className="font-medium">
            {item.productName}
          </p>

          <p className="text-xs text-muted-foreground">
            {item.sku}
          </p>

          <div className="mt-2 flex justify-between text-sm">

            <span>

              Cantidad: {item.qty}

            </span>

            <span>

              ${item.price.toLocaleString("es-AR")}

            </span>

          </div>

        </div>

      ))}

    </div>

  )}

</div>

        </div>

      </aside>
    </>
  );
}
