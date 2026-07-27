"use client";

import { useEffect, useState } from "react";

import type { Order } from "@/types/orders";

import { getOrdersWithCases } from "@/lib/cases/queries";

import { MissingProductsTable } from "./MissingProductsTable";

export function MissingProductsPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    try {
      setLoading(true);

      const data = await getOrdersWithCases();

      setOrders(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="space-y-6">

      <div>

        <h1 className="text-2xl font-semibold">
          Productos faltantes
        </h1>

        <p className="text-sm text-neutral-500">
          Pedidos que tienen al menos un caso abierto.
        </p>

      </div>

      <MissingProductsTable
        orders={orders}
        loading={loading}
      />

    </div>
  );
}