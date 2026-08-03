"use client";

import { useState } from "react";

import type {
  OrderCaseWithProduct,
} from "@/lib/cases/repository";

interface Props {
  item: OrderCaseWithProduct;

  onOpen?: (
    item: OrderCaseWithProduct,
  ) => void;
}

const STATUS_COLORS = {
  OPEN: "bg-yellow-100 text-yellow-800",
  WAITING_STORE: "bg-orange-100 text-orange-800",
  WAITING_CUSTOMER: "bg-blue-100 text-blue-800",
  IN_PROGRESS: "bg-indigo-100 text-indigo-800",
  RESOLVED: "bg-green-100 text-green-800",
  CANCELLED: "bg-red-100 text-red-800",
} as const;

const TYPE_LABELS = {
  NO_STOCK: "Sin stock",
  CHANGE: "Cambio",
  RETURN: "Devolución",
  INVOICE: "Factura",
  CHARGEBACK: "Chargeback",
  CLAIM: "Reclamo",
} as const;

export function CaseCard({
  item,
  onOpen,
}: Props) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="rounded-xl border bg-card p-5 transition hover:border-primary/40">

      <div className="flex items-start justify-between">

        <div className="flex-1">

          <div className="font-semibold text-base">
            {item.product_name}
          </div>

          <div className="mt-1 text-xs uppercase text-neutral-500">
            {TYPE_LABELS[item.type]}
          </div>

        </div>

        <span
          className={`ml-4 rounded-full px-3 py-1 text-xs font-medium ${STATUS_COLORS[item.status]}`}
        >
          {item.status.replaceAll("_", " ")}
        </span>

      </div>

      <div
        className={`overflow-hidden transition-all duration-300 ${
          expanded ? "max-h-[500px] mt-5" : "max-h-0"
        }`}
      >
        <div className="rounded-lg border bg-background p-3">

          <div className="text-xs text-neutral-500">
            SKU ORIGINAL
          </div>

          <div className="font-mono font-semibold">
            {item.original_sku}
          </div>

          {item.title && (
            <>
              <div className="my-3 text-center text-neutral-400">
                ↓
              </div>

              <div className="text-xs text-neutral-500">
                SKU REEMPLAZO
              </div>

              <div className="font-mono font-semibold text-emerald-600">
                {item.title}
              </div>
            </>
          )}

        </div>

        {item.description && (
          <div className="mt-4 rounded-lg bg-muted p-3 text-sm">
            {item.description}
          </div>
        )}

        <div className="mt-4 flex items-center justify-between border-t pt-4">

          <span className="text-xs text-neutral-500">
            {new Date(item.created_at).toLocaleDateString("es-AR")}
          </span>

          <button
            type="button"
            onClick={() => onOpen?.(item)}
            className="rounded-md border px-3 py-2 text-sm font-medium hover:bg-muted"
          >
            Ver detalle
          </button>

        </div>
      </div>

      <div className="mt-4 flex justify-end">

        <button
          type="button"
          onClick={() => setExpanded(!expanded)}
          className="text-sm font-medium text-primary hover:underline"
        >
          {expanded
            ? "− Menos información"
            : "+ Más información"}
        </button>

      </div>

    </div>
  );
}