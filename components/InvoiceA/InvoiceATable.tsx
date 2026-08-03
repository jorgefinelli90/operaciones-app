"use client";

import type { InvoiceRequestRow } from "@/lib/invoices/getInvoiceRequests";

import { InvoiceARow } from "./InvoiceARow";

interface Props {
  rows: InvoiceRequestRow[];
  loading: boolean;
  onOpen: (orderId: string) => void;
}

export function InvoiceATable({
  rows,
  loading,
  onOpen,
}: Props) {
  if (loading) {
    return (
      <div className="rounded-lg border p-8 text-center text-muted-foreground">
        Cargando solicitudes...
      </div>
    );
  }

  if (!rows.length) {
    return (
      <div className="rounded-lg border p-8 text-center text-muted-foreground">
        No hay solicitudes de Factura A.
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-lg border border-border bg-card">

      <table className="w-full">

        <thead className="bg-secondary/60">

          <tr>

            <th className="px-4 py-3 text-left text-xs uppercase">
              Pedido
            </th>

            <th className="px-4 py-3 text-left text-xs uppercase">
              Cliente
            </th>

            <th className="px-4 py-3 text-left text-xs uppercase">
              Razón Social
            </th>

            <th className="px-4 py-3 text-left text-xs uppercase">
              CUIT
            </th>

            <th className="px-4 py-3 text-left text-xs uppercase">
              Estado
            </th>

          </tr>

        </thead>

        <tbody>

          {rows.map((row) => (
            <InvoiceARow
              key={row.order_id}
              row={row}
              onOpen={onOpen}
            />
          ))}

        </tbody>

      </table>

    </div>
  );
}