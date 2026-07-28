"use client";

import { useEffect, useState } from "react";
import { ChevronDown, ChevronUp, Package } from "lucide-react";

import type { OrderItem } from "@/types/orderItem";

import {
  getCases,
  type OrderCase,
} from "@/lib/cases/repository";

import { TimelineSection } from "./MissingProductsDrawer/TimelineSection";
import { CommentsSection } from "./MissingProductsDrawer/CommentsSection";
import { ActionsSection } from "./MissingProductsDrawer/ActionsSection";

interface Props {
  item: OrderItem;
}

const STATUS = {
  OPEN: "bg-yellow-500/20 text-yellow-400",
  WAITING_STORE: "bg-orange-500/20 text-orange-400",
  WAITING_CUSTOMER: "bg-blue-500/20 text-blue-400",
  IN_PROGRESS: "bg-indigo-500/20 text-indigo-400",
  RESOLVED: "bg-green-500/20 text-green-400",
  CANCELLED: "bg-red-500/20 text-red-400",
} as const;

const TYPE: Record<string, string> = {
  CHANGE: "Cambio",
  NO_STOCK: "Sin stock",
  RETURN: "Devolución",
  INVOICE: "Factura",
  CHARGEBACK: "Chargeback",
  CLAIM: "Reclamo",
};

export function MissingProductsRow({
  item,
}: Props) {
  const [open, setOpen] = useState(false);

  const [currentCase, setCurrentCase] =
    useState<OrderCase | null>(null);

  useEffect(() => {
    async function load() {
      const data = await getCases(item.id);

      setCurrentCase(data[0] ?? null);
    }

    load();
  }, [item.id]);

  return (
    <div className="border-b border-border last:border-b-0">

      <button
        onClick={() => setOpen(!open)}
        className="w-full p-5 text-left transition hover:bg-muted/30"
      >

        <div className="flex justify-between gap-6">

          <div className="flex gap-4">

            <div className="mt-1">
              <Package size={18} />
            </div>

            <div>

              <div className="font-semibold text-lg">
                {item.productName}
              </div>

              <div className="mt-4 grid gap-3">

                <div>

                  <div className="text-[11px] uppercase tracking-wide text-muted-foreground">
                    SKU ORIGINAL
                  </div>

                  <div className="font-mono">
                    {item.sku}
                  </div>

                </div>

                {currentCase?.title && (
                  <>

                    <div className="text-center text-neutral-500">
                      ↓
                    </div>

                    <div>

                      <div className="text-[11px] uppercase tracking-wide text-muted-foreground">
                        SKU REEMPLAZO
                      </div>

                      <div className="font-mono font-semibold text-emerald-400">
                        {currentCase.title}
                      </div>

                    </div>

                  </>
                )}

              </div>

            </div>

          </div>

          <div className="flex flex-col items-end gap-3">

            {currentCase && (
              <>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-medium ${
                    STATUS[currentCase.status]
                  }`}
                >
                  {currentCase.status.replaceAll("_", " ")}
                </span>

                <span className="text-sm text-muted-foreground">
                  {TYPE[currentCase.type] ??
                    currentCase.type}
                </span>
              </>
            )}

            {open
              ? <ChevronUp size={18} />
              : <ChevronDown size={18} />}

          </div>

        </div>

      </button>

      {open && (
        <div className="border-t bg-background px-6 py-6 space-y-8">

          <ActionsSection
            orderItemId={item.id}
          />

          <TimelineSection
            orderItemId={item.id}
          />

          <CommentsSection
            orderItemId={item.id}
          />

        </div>
      )}

    </div>
  );
}