"use client";

import { useEffect, useState } from "react";

import { getOrderItems } from "@/lib/orders/getOrderItems";
import type { OrderItem } from "@/types/orderItem";

import { MissingProductsRow } from "../MissingProductsRow";

interface Props {
  orderId: string;
}

export function ProductsSection({
  orderId,
}: Props) {
  const [items, setItems] =
    useState<OrderItem[]>([]);

  const [loading, setLoading] =
    useState(true);

  async function load() {
    try {
      setLoading(true);

      const data =
        await getOrderItems(orderId);

      setItems(data);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, [orderId]);

  if (loading) {
    return (
      <div className="rounded-xl border p-6 text-sm text-muted-foreground">
        Cargando productos...
      </div>
    );
  }

  if (!items.length) {
    return (
      <div className="rounded-xl border border-dashed p-6 text-sm text-muted-foreground">
        El pedido no tiene productos.
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border bg-card">

      <div className="border-b bg-muted/30 px-5 py-3">

        <h2 className="font-semibold">
          Productos del pedido
        </h2>

        <p className="mt-1 text-sm text-muted-foreground">
          Seleccioná un producto para gestionar su caso.
        </p>

      </div>

      {items.map((item) => (
        <MissingProductsRow
          key={item.id}
          item={item}
        />
      ))}

    </div>
  );
}