"use client";

import { useEffect, useState } from "react";

import { getOrderItems } from "@/lib/orders/getOrderItems";

import type { Order } from "@/types/orders";
import type { OrderItem } from "@/types/orderItem";

interface ProductsSectionProps {
  order: Order | null;
}

export function ProductsSection({
  order,
}: ProductsSectionProps) {
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

    loadItems();
  }, [order]);

  return (
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

              <button
                className="mt-3 text-sm text-blue-600 hover:underline"
              >
                Solicitar cambio
              </button>

            </div>

          ))}

        </div>

      )}

    </div>
  );
}