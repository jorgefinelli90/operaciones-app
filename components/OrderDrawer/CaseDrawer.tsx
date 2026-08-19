"use client";

import { useState } from "react";

import { Accordion } from "@/components/ui/Accordion";

import { CaseActions } from "./CaseActions";
import { CaseComments } from "./CaseComments";
import { CaseTimeline } from "./CaseTimeline";
import { CaseDocumentsSection } from "./CaseDocumentsSection";

import type { OrderCase } from "@/lib/cases/repository";

interface Props {
  open: boolean;
  onClose: () => void;
  item: OrderCase | null;
  onUpdated?: () => Promise<void> | void;
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

export function CaseDrawer({
  open,
  onClose,
  item,
  onUpdated,
}: Props) {
  /*
   * Versión del Timeline.
   *
   * Cada vez que se crea un comprobante,
   * incrementamos este valor para forzar
   * que CaseTimeline vuelva a consultar
   * los eventos del caso.
   */
  const [timelineVersion, setTimelineVersion] =
    useState(0);

  if (!open || !item) {
    return null;
  }

  const statusLabel =
    STATUS_LABELS[item.status] ??
    item.status.replaceAll(
      "_",
      " ",
    );

  const typeLabel =
    TYPE_LABELS[item.type] ??
    item.type.replaceAll(
      "_",
      " ",
    );

  return (
    <>
      {/* OVERLAY */}

      <div
        className="fixed inset-0 z-40 bg-black/40"
        onClick={onClose}
      />

      {/* DRAWER */}

      <aside className="fixed right-0 top-0 z-50 flex h-screen w-[650px] flex-col border-l border-border bg-background shadow-xl">
        {/* HEADER */}

        <header className="flex items-center justify-between border-b border-border p-5">
          <div>
            <h2 className="text-lg font-semibold">
              Caso #{item.id}
            </h2>

            <p className="text-sm text-neutral-500">
              {typeLabel}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="text-2xl leading-none"
          >
            ×
          </button>
        </header>

        {/* CONTENT */}

        <div className="flex-1 space-y-4 overflow-y-auto p-6">
          {/* RESUMEN */}

          <section className="rounded-xl border border-border p-5">
            <div className="flex items-center justify-between gap-4">
              <div className="min-w-0">
                <h2 className="text-xl font-semibold">
                  {item.title || "Caso"}
                </h2>

                <p className="mt-1 text-sm text-neutral-500">
                  {typeLabel}
                </p>
              </div>

              <span
                className={`shrink-0 rounded-full px-3 py-1 text-sm font-medium ${
                  STATUS_COLORS[item.status]
                }`}
              >
                {statusLabel}
              </span>
            </div>

            {item.description && (
              <p className="mt-4 whitespace-pre-wrap text-sm text-neutral-600">
                {item.description}
              </p>
            )}
          </section>

          {/* ACCIONES */}

          <Accordion
            title="Acciones disponibles"
            defaultOpen
          >
            <CaseActions
              item={item}
              onExecuted={async () => {
                await onUpdated?.();
              }}
            />
          </Accordion>

          {/* COMPROBANTES */}

          <CaseDocumentsSection
            item={item}
            onDocumentCreated={() => {
              /*
               * El comprobante ya fue guardado
               * y DOCUMENT_ADDED ya existe en Supabase.
               *
               * Incrementamos la versión para que
               * CaseTimeline se monte nuevamente
               * y vuelva a ejecutar getEvents().
               */
              setTimelineVersion(
                (value) => value + 1,
              );
            }}
          />

          {/* HISTORIAL */}

          <Accordion title="Línea de tiempo">
            <CaseTimeline
              key={`timeline-${item.id}-${timelineVersion}`}
              caseId={item.id}
            />
          </Accordion>

          {/* COMENTARIOS */}

          <Accordion
            title="Comentarios"
            right={
              <span
                className="flex h-3 w-3 animate-pulse rounded-full bg-red-500"
                title="Hay comentarios"
              />
            }
          >
            <CaseComments
              caseId={item.id}
            />
          </Accordion>
        </div>
      </aside>
    </>
  );
}