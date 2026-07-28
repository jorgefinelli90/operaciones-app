"use client";

import { useEffect, useState } from "react";

import { getOrderItems } from "@/lib/orders/getOrderItems";

import { CasesSection } from "@/components/OrderDrawer/CasesSection";
import { MissingProductsRow } from "@/components/MissingProducts/MissingProductsRow";
import type { Order } from "@/types/orders";
import type { OrderItem } from "@/types/orderItem";

interface Props {
  order: Order;
}

export function MissingProductsSection({ order }: Props) {
  const [items, setItems] = useState<OrderItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const data = await getOrderItems(order.id);

      setItems(data);

      setLoading(false);
    }

    load();
  }, [order]);

  if (loading) {
    return <>Cargando...</>;
  }

  return (
    <div className="space-y-4">

      {items.map(item => (
    <MissingProductsRow
        key={item.id}
        item={item}
    />
))}

    </div>
  );
}