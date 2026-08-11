"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

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

const STATUS_LABELS = {
  OPEN: "Abierto",
  WAITING_STORE: "Esperando tienda",
  WAITING_CUSTOMER: "Esperando cliente",
  IN_PROGRESS: "En proceso",
  RESOLVED: "Resuelto",
  CANCELLED: "Cancelado",
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

  const statusLabel =
    STATUS_LABELS[item.status] ??
    item.status.replaceAll("_", " ");

  const typeLabel =
    TYPE_LABELS[item.type] ??
    item.type.replaceAll("_", " ");

  function handleToggle() {
    setExpanded((value) => !value);
  }

  function handleOpenDetail() {
    onOpen?.(item);
  }

  return (
    <div className="rounded-xl border bg-card transition-colors hover:border-primary/40">

      {/* HEADER / RESUMEN */}

      <div className="p-5">

        <div className="flex items-start justify-between gap-4">

          <div className="min-w-0 flex-1">

            <div className="font-semibold text-base">
              {item.product_name}
            </div>

            <div className="mt-1 text-xs uppercase text-neutral-500">
              {typeLabel}
            </div>

          </div>

          <span
            className={`shrink-0 rounded-full px-3 py-1 text-xs font-medium ${
              STATUS_COLORS[item.status]
            }`}
          >
            {statusLabel}
          </span>

        </div>

        <div className="mt-4 flex justify-end">

          <button
            type="button"
            onClick={handleToggle}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-primary transition hover:opacity-80"
          >
            {expanded ? (
              <>
                Menos información
                <ChevronUp size={16} />
              </>
            ) : (
              <>
                Más información
                <ChevronDown size={16} />
              </>
            )}
          </button>

        </div>

      </div>

      {/* INFORMACIÓN EXPANDIDA */}

      <div
        className={`grid transition-all duration-300 ease-in-out ${
          expanded
            ? "grid-rows-[1fr] opacity-100"
            : "grid-rows-[0fr] opacity-0"
        }`}
      >

        <div className="overflow-hidden">

          <div className="border-t px-5 pb-5 pt-5">

            {/* SKU */}

            <div className="rounded-lg border bg-background p-4">

              <div className="text-xs font-medium text-neutral-500">
                SKU ORIGINAL
              </div>

              <div className="mt-1 font-mono font-semibold">
                {item.original_sku}
              </div>

              {item.title && (
                <>
                  <div className="my-3 flex items-center justify-center text-neutral-400">
                    ↓
                  </div>

                  <div className="text-xs font-medium text-neutral-500">
                    SKU REEMPLAZO
                  </div>

                  <div className="mt-1 font-mono font-semibold text-emerald-600">
                    {item.title}
                  </div>
                </>
              )}

            </div>

            {/* DESCRIPCIÓN */}

            {item.description && (
              <div className="mt-4">

                <div className="mb-2 text-xs font-medium uppercase tracking-wide text-neutral-500">
                  Descripción
                </div>

                <div className="rounded-lg bg-muted p-3 text-sm whitespace-pre-wrap">
                  {item.description}
                </div>

              </div>
            )}

            {/* FOOTER */}

            <div className="mt-5 flex items-center justify-between border-t pt-4">

              <span className="text-xs text-neutral-500">
                Creado el{" "}
                {new Date(
                  item.created_at,
                ).toLocaleDateString("es-AR")}
              </span>

              <button
                type="button"
                onClick={handleOpenDetail}
                className="rounded-lg border border-border px-3 py-2 text-sm font-medium transition hover:bg-muted"
              >
                Ver detalle
              </button>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}