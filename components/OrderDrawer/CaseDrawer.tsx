"use client";

import { CaseActions } from "./CaseActions";

import type { OrderCase } from "@/lib/cases/repository";
import { CaseTimeline } from "./CaseTimeline";
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

export function CaseDrawer({
  open,
  onClose,
  item,
}: Props) {
  if (!open || !item) return null;

  return (
    <>
      <div
        className="fixed inset-0 z-40 bg-black/40"
        onClick={onClose}
      />

      <aside className="fixed right-0 top-0 z-50 flex h-screen w-[650px] flex-col border-l bg-white shadow-xl">
        <header className="flex items-center justify-between border-b p-5">
          <div>
            <h2 className="text-lg font-semibold">
              Caso #{item.id}
            </h2>

            <p className="text-sm text-neutral-500">
              {item.type}
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

        <div className="flex-1 space-y-8 overflow-y-auto p-6">
          <section>
            <h3 className="mb-3 font-semibold">
              Estado
            </h3>

            <span
              className={`rounded-full px-3 py-1 text-sm font-medium ${STATUS_COLORS[item.status]}`}
            >
              {item.status.replaceAll("_", " ")}
            </span>
          </section>

          <section>
            <h3 className="mb-3 font-semibold">
              Título
            </h3>

            <p>{item.title || "-"}</p>
          </section>

          <section>
            <h3 className="mb-3 font-semibold">
              Descripción
            </h3>

            <p className="whitespace-pre-wrap">
              {item.description || "-"}
            </p>
          </section>

          <section>
            <h3 className="mb-3 font-semibold">
              Timeline
            </h3>

            <CaseTimeline
    caseId={item.id}
/>
          </section>

          <section>
            <h3 className="mb-3 font-semibold">
              Comentarios
            </h3>

            <div className="rounded-lg border border-dashed p-5 text-sm text-neutral-500">
              Próximamente podrán agregarse comentarios.
            </div>
          </section>

          <section>
            <h3 className="mb-3 font-semibold">
              Acciones disponibles
            </h3>

            <CaseActions
              item={item}
              onExecuted={() => {
                window.location.reload();
              }}
            />
          </section>
        </div>
      </aside>
    </>
  );
}