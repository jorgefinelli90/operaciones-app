"use client";

import { useEffect, useState } from "react";
import { CaseDrawer } from "./CaseDrawer";
import { CaseCard } from "./CaseCard";
import { NewCaseModal } from "./NewCaseModal";

import {
  getCases,
  type OrderCase,
} from "@/lib/cases/repository";

interface Props {
  orderId: string;
  orderItemId: number;
}

export function CasesSection({
  orderId,
  orderItemId,
}: Props) {
  const [cases, setCases] = useState<OrderCase[]>([]);
  const [loading, setLoading] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const [selectedCase, setSelectedCase] = useState<OrderCase | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  async function loadCases() {
    setLoading(true);

    try {
      const data = await getCases(orderItemId);
      setCases(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadCases();
  }, [orderItemId]);

 return (
  <>
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold">
          Casos
        </h3>

        <button
          type="button"
          onClick={() => setOpenModal(true)}
          className="rounded bg-black px-3 py-1 text-xs text-white"
        >
          Nuevo caso
        </button>
      </div>

      {loading && (
        <div className="text-sm text-neutral-500">
          Cargando...
        </div>
      )}

      {!loading && cases.length === 0 && (
        <div className="rounded border border-dashed p-4 text-sm text-neutral-500">
          No hay casos para este producto.
        </div>
      )}

      {!loading &&
        cases.map((item) => (
          <CaseCard
            key={item.id}
            item={item}
            onOpen={(item) => {
              setSelectedCase(item);
              setDrawerOpen(true);
            }}
          />
        ))}
    </div>

    <CaseDrawer
      open={drawerOpen}
      item={selectedCase}
      onClose={() => setDrawerOpen(false)}
    />

    <NewCaseModal
      open={openModal}
      onClose={() => setOpenModal(false)}
      onCreated={loadCases}
      orderId={orderId}
      orderItemId={orderItemId}
    />
  </>
);}