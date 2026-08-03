"use client";

import type { InvoiceRequest } from "@/lib/invoices/types/invoice";

interface Props {
  orderId: string;
  invoice: InvoiceRequest | null;
}

export function Header({
  orderId,
  invoice,
}: Props) {
  return (
    <div className="rounded-xl border bg-card p-6">

      <div className="flex items-start justify-between">

        <div>

          <p className="text-xs uppercase tracking-wide text-muted-foreground">
            Pedido
          </p>

          <h2 className="mt-1 text-2xl font-bold">
            {orderId}
          </h2>

        </div>

        <span className="rounded-full bg-yellow-500/15 px-3 py-1 text-xs font-medium text-yellow-400">
          {invoice?.status ?? "PENDIENTE"}
        </span>

      </div>

      <div className="mt-6 grid grid-cols-2 gap-6">

        <div>

          <div className="text-xs uppercase text-muted-foreground">
            Razón Social
          </div>

          <div className="mt-1 font-medium">
            {invoice?.business_name || "-"}
          </div>

        </div>

        <div>

          <div className="text-xs uppercase text-muted-foreground">
            CUIT
          </div>

          <div className="mt-1 font-medium">
            {invoice?.cuit || "-"}
          </div>

        </div>

        <div>

          <div className="text-xs uppercase text-muted-foreground">
            Fecha solicitud
          </div>

          <div className="mt-1 font-medium">
            {invoice?.created_at
              ? new Date(invoice.created_at).toLocaleDateString("es-AR")
              : "-"}
          </div>

        </div>

      </div>

    </div>
  );
}