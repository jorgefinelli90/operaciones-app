"use client";

import { useEffect, useState } from "react";
import {
  CheckCircle2,
  CircleDot,
} from "lucide-react";

import { CaseActions } from "@/components/OrderDrawer/CaseActions";

import {
  getCases,
  type OrderCase,
} from "@/lib/cases/repository";

import { STATUS_LABELS } from "@/lib/cases/statusLabels";

interface Props {
  orderItemId: number;
}

export function ActionsSection({
  orderItemId,
}: Props) {
  const [item, setItem] =
    useState<OrderCase | null>(null);

  const [loading, setLoading] =
    useState(true);

  async function load() {
    try {
      const cases =
        await getCases(orderItemId);

      setItem(cases[0] ?? null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, [orderItemId]);

  if (loading) {
    return (
      <div className="rounded-xl border p-5 text-sm text-muted-foreground">
        Cargando acciones...
      </div>
    );
  }

  if (!item) return null;

  return (
    <section className="space-y-6">

      <div>

        <div className="mb-5 flex items-center gap-2">

          <CheckCircle2
            size={18}
            className="text-emerald-600"
          />

          <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Resolver caso
          </h2>

        </div>

        <div className="rounded-xl border bg-card p-5">

          <div className="flex items-center gap-3">

            <CircleDot
              size={14}
              className="text-yellow-500"
            />

            <div>

              <div className="text-xs uppercase tracking-wide text-muted-foreground">
                Estado actual
              </div>

              <div className="mt-1 text-lg font-semibold">
                {STATUS_LABELS[item.status]}
              </div>

            </div>

          </div>

        </div>

      </div>

      <div>

        <div className="mb-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Acciones disponibles
        </div>

        <CaseActions
          item={item}
          onExecuted={load}
        />

      </div>

    </section>
  );
}