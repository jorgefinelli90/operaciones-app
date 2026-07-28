"use client";

import { useEffect, useState } from "react";

import { CaseTimeline } from "@/components/OrderDrawer/CaseTimeline";

import {
  getCases,
  type OrderCase,
} from "@/lib/cases/repository";

interface Props {
  orderItemId: number;
}

export function TimelineSection({
  orderItemId,
}: Props) {
  const [loading, setLoading] = useState(true);
  const [currentCase, setCurrentCase] = useState<OrderCase | null>(null);

  async function load() {
    try {
      const cases = await getCases(orderItemId);

      setCurrentCase(cases[0] ?? null);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, [orderItemId]);

  if (loading) {
    return (
      <div className="rounded-lg border p-4 text-sm text-neutral-500">
        Cargando historial...
      </div>
    );
  }

  if (!currentCase) {
    return (
      <div className="rounded-lg border border-dashed p-4 text-sm text-neutral-500">
        Este producto no tiene casos.
      </div>
    );
  }

  return (
    <CaseTimeline caseId={currentCase.id} />
  );
}