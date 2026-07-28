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

    <div className="mt-4 flex justify-end">

      <button
        type="button"
        onClick={() => onOpen?.(item)}
        className="text-sm font-medium text-primary hover:underline"
      >
        + Más información
      </button>

    </div>

  </div>
);
}