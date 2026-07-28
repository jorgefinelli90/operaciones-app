"use client";

import { useEffect, useState } from "react";

import { CaseComments } from "@/components/OrderDrawer/CaseComments";

import {
  getCases,
  type OrderCase,
} from "@/lib/cases/repository";

interface Props {
  orderItemId: number;
}

export function CommentsSection({
  orderItemId,
}: Props) {
  const [item, setItem] = useState<OrderCase | null>(null);
  const [loading, setLoading] = useState(true);

  async function load() {
    try {
      const cases = await getCases(orderItemId);
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
      <div className="rounded-lg border p-4 text-sm text-neutral-500">
        Cargando comentarios...
      </div>
    );
  }

  if (!item) return null;

  return <CaseComments caseId={item.id} />;
}