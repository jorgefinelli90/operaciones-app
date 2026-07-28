"use client";

import { useState } from "react";

import { Accordion } from "@/components/ui/Accordion";

import { CaseActions } from "./CaseActions";
import { CaseComments } from "./CaseComments";
import { CaseTimeline } from "./CaseTimeline";

import type { OrderCase } from "@/lib/cases/repository";

interface Props {
  open: boolean;
  onClose: () => void;
  item: OrderCase | null;
}

const STATUS_COLORS = {
  OPEN: "bg-yellow-100 text-yellow-800",
  WAITING_STORE: "bg-orange-100 text-orange-800",
  WAITING_CUSTOMER: "bg-blue-100 text-blue-800",
  IN_PROGRESS: "bg-indigo-100 text-indigo-800",
  RESOLVED: "bg-green-100 text-green-800",
  CANCELLED: "bg-red-100 text-red-800",
} as const;

export function CaseDrawer({ open, onClose, item }: Props) {
  const [refreshKey, setRefreshKey] = useState(0);

  if (!open || !item) return null;

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/40" onClick={onClose} />

      <aside className="fixed right-0 top-0 z-50 flex h-screen w-[650px] flex-col border-l border-border bg-background shadow-xl">
        <header className="flex items-center justify-between border-b border-border p-5">
          <div>
            <h2 className="text-lg font-semibold">Caso #{item.id}</h2>

            <p className="text-sm text-neutral-500">{item.type}</p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="text-2xl leading-none"
          >
            ×
          </button>
        </header>

        <div className="flex-1 space-y-4 overflow-y-auto p-6">
          <section className="rounded-xl border border-border p-5">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold">
                  {item.title || "Caso"}
                </h2>

                <p className="mt-1 text-sm text-neutral-500">
                  {item.type.replaceAll("_", " ")}
                </p>
              </div>

              <span
                className={`rounded-full px-3 py-1 text-sm font-medium ${STATUS_COLORS[item.status]}`}
              >
                {item.status.replaceAll("_", " ")}
              </span>
            </div>

            {item.description && (
              <p className="mt-4 whitespace-pre-wrap text-sm text-neutral-600">
                {item.description}
              </p>
            )}
          </section>

          <Accordion title="Acciones disponibles" defaultOpen>
            <CaseActions
              item={item}
              onExecuted={() => window.location.reload()}
            />
          </Accordion>

          <Accordion title="Linea de Tiempo:">
            <CaseTimeline key={refreshKey} caseId={item.id} />
          </Accordion>

          <Accordion
            title="Comentarios"
            right={
              <span
                className="flex h-3 w-3 animate-pulse rounded-full bg-red-500"
                title="Hay comentarios"
              />
            }
          >
            <CaseComments caseId={item.id} />
          </Accordion>
        </div>
      </aside>
    </>
  );
}
