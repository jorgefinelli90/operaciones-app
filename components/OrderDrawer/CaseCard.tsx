"use client";

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
  return (
    <button
      type="button"
      onClick={() => onOpen?.(item)}
      className="w-full rounded-xl border bg-card p-5 text-left transition hover:border-primary/40"
    >
      <div className="flex justify-between items-start">

        <div className="space-y-3 flex-1">

          <div>

            <div className="font-semibold text-base">
              {item.product_name}
            </div>

            <div className="mt-1 text-xs text-neutral-500 uppercase">
              {TYPE_LABELS[item.type]}
            </div>

          </div>

          <div className="rounded-lg border bg-background p-3">

            <div className="text-xs text-neutral-500">
              SKU ORIGINAL
            </div>

            <div className="font-mono font-semibold">
              {item.original_sku}
            </div>

            {item.title && (
              <>
                <div className="my-2 text-center text-neutral-500">
                  ↓
                </div>

                <div className="text-xs text-neutral-500">
                  SKU REEMPLAZO
                </div>

                <div className="font-mono font-semibold text-emerald-500">
                  {item.title}
                </div>
              </>
            )}

          </div>

        </div>

        <span
          className={`ml-4 rounded-full px-3 py-1 text-xs font-medium ${STATUS_COLORS[item.status]}`}
        >
          {item.status.replaceAll("_", " ")}
        </span>

      </div>

      {item.description && (
        <div className="mt-4 rounded-lg bg-muted p-3 text-sm">
          {item.description}
        </div>
      )}

      <div className="mt-4 flex justify-between border-t pt-3 text-xs text-neutral-500">

        <span>#{item.id}</span>

        <span>
          {new Date(
            item.created_at,
          ).toLocaleDateString("es-AR")}
        </span>

      </div>

    </button>
  );
}