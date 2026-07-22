"use client";

import type { OrderCase } from "@/lib/cases/repository";

interface Props {
  item: OrderCase;

  onOpen?: (item: OrderCase) => void;
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
} as const;

export function CaseCard({
  item,
  onOpen,
}: Props) {
  return (
    <button
      type="button"
      onClick={() => onOpen?.(item)}
      className="w-full rounded-lg border border-border bg-card p-4 text-left transition hover:border-border/80 hover:shadow-sm"
    >
      <div className="flex items-start justify-between">

        <div>

          <div className="font-medium">
            {TYPE_LABELS[item.type] ?? item.type}
          </div>

          {item.title && (
            <div className="mt-1 text-sm text-neutral-500">
              {item.title}
            </div>
          )}

        </div>

        <span
          className={`rounded-full px-2 py-1 text-xs font-medium ${
            STATUS_COLORS[item.status]
          }`}
        >
          {item.status.replaceAll("_", " ")}
        </span>

      </div>

      {item.description && (
        <p className="mt-3 text-sm text-neutral-600">
          {item.description}
        </p>
      )}

      <div className="mt-3 flex items-center justify-between text-xs text-neutral-400">

        <span>
          #{item.id}
        </span>

        <span>
          {new Date(item.created_at).toLocaleDateString("es-AR")}
        </span>

      </div>

    </button>
  );
}
