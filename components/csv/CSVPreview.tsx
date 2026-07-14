"use client";

import type { OrderImport } from "@/types/orders";
import type { OrderItem } from "@/types/orderItem";

import { formatDate } from "@/lib/utils/date";

interface CSVPreviewProps {
  fileName: string;
  orders: OrderImport[];
  items: OrderItem[];
}

export function CSVPreview({
  fileName,
  orders,
  items,
}: CSVPreviewProps) {
  return (
    <div className="rounded-xl border border-border bg-card">

      {/* Header */}

      <div className="border-b border-border p-5">

        <h2 className="text-lg font-semibold">
          Vista previa
        </h2>

        <p className="mt-1 text-sm text-muted-foreground">
          {fileName}
        </p>

      </div>

      {/* Información */}

      <div className="grid grid-cols-2 gap-6 border-b border-border p-5">

        <div>

          <p className="text-xs uppercase tracking-wide text-muted-foreground">
            Pedidos encontrados
          </p>

          <p className="mt-1 text-3xl font-bold">
            {orders.length}
          </p>

        </div>

        <div>

          <p className="text-xs uppercase tracking-wide text-muted-foreground">
            Productos configurables
          </p>

          <p className="mt-1 text-3xl font-bold">
            {items.length}
          </p>

        </div>

      </div>

      {/* Tabla */}

      <div className="overflow-auto">

        <table className="w-full">

          <thead className="sticky top-0 bg-card">

            <tr className="border-b border-border">

              <th className="px-4 py-3 text-left text-xs font-semibold uppercase">
                Pedido
              </th>

              <th className="px-4 py-3 text-left text-xs font-semibold uppercase">
                Cliente
              </th>

              <th className="px-4 py-3 text-left text-xs font-semibold uppercase">
                Fecha
              </th>

              <th className="px-4 py-3 text-left text-xs font-semibold uppercase">
                Estado
              </th>

              <th className="px-4 py-3 text-right text-xs font-semibold uppercase">
                Total
              </th>

            </tr>

          </thead>

          <tbody>

            {orders.slice(0, 10).map((order) => (

              <tr
                key={order.id}
                className="border-b border-border hover:bg-secondary/40"
              >

                <td className="px-4 py-3 font-medium text-primary">
                  {order.id}
                </td>

                <td className="px-4 py-3">

                  <p className="font-medium">
                    {order.customerFirstname}{" "}
                    {order.customerLastname}
                  </p>

                  <p className="text-xs text-muted-foreground">
                    {order.customerEmail}
                  </p>

                </td>

                <td className="px-4 py-3 whitespace-nowrap">
                  {formatDate(order.purchaseDate)}
                </td>

                <td className="px-4 py-3">

                  <span className="rounded-md bg-secondary px-2 py-1 text-xs">

                    {order.magentoStatus}

                  </span>

                </td>

                <td className="px-4 py-3 text-right font-semibold">

                  {new Intl.NumberFormat("es-AR", {
                    style: "currency",
                    currency: "ARS",
                  }).format(order.grandTotal)}

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

      <div className="border-t border-border p-4 text-center text-sm text-muted-foreground">

        Mostrando los primeros{" "}
        <strong>{Math.min(10, orders.length)}</strong> pedidos.

      </div>

    </div>
  );
}