"use client";

import { useState } from "react";
import {
  Check,
  ChevronDown,
  ChevronUp,
  Loader2,
  Pencil,
  X,
} from "lucide-react";

import {
  updateCaseAssignment,
  updateCasePriority,
} from "@/lib/cases/repository";

import type {
  CasePriority,
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
  WAITING_STORE:
    "bg-orange-100 text-orange-800",
  WAITING_CUSTOMER:
    "bg-blue-100 text-blue-800",
  IN_PROGRESS:
    "bg-indigo-100 text-indigo-800",
  RESOLVED:
    "bg-green-100 text-green-800",
  CANCELLED:
    "bg-red-100 text-red-800",
} as const;

const STATUS_LABELS = {
  OPEN: "Abierto",
  WAITING_STORE:
    "Esperando tienda",
  WAITING_CUSTOMER:
    "Esperando cliente",
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

const PRIORITIES: {
  value: CasePriority;
  label: string;
}[] = [
  {
    value: "LOW",
    label: "Baja",
  },
  {
    value: "NORMAL",
    label: "Normal",
  },
  {
    value: "HIGH",
    label: "Alta",
  },
  {
    value: "URGENT",
    label: "Urgente",
  },
];

const PRIORITY_COLORS = {
  LOW: "text-neutral-500",
  NORMAL: "text-neutral-400",
  HIGH: "text-orange-500",
  URGENT: "text-red-500",
} as const;

export function CaseCard({
  item,
  onOpen,
}: Props) {
  const [expanded, setExpanded] =
    useState(false);

  const [priority, setPriority] =
    useState<CasePriority>(
      (item.priority as CasePriority) ||
        "NORMAL",
    );

  const [assignedTo, setAssignedTo] =
    useState(
      item.assigned_to ?? "",
    );

  const [
    editingPriority,
    setEditingPriority,
  ] = useState(false);

  const [
    editingAssignment,
    setEditingAssignment,
  ] = useState(false);

  const [
    savingPriority,
    setSavingPriority,
  ] = useState(false);

  const [
    savingAssignment,
    setSavingAssignment,
  ] = useState(false);

  const [
    assignmentValue,
    setAssignmentValue,
  ] = useState(
    item.assigned_to ?? "",
  );

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

  const priorityLabel =
    PRIORITIES.find(
      (value) =>
        value.value === priority,
    )?.label ?? "Normal";

  const priorityColor =
    PRIORITY_COLORS[priority];

  async function handlePriorityChange(
    value: CasePriority,
  ) {
    if (value === priority) {
      setEditingPriority(false);
      return;
    }

    try {
      setSavingPriority(true);

      await updateCasePriority(
        item.id,
        value,
      );

      setPriority(value);
      setEditingPriority(false);
    } catch (error) {
      console.error(
        "Error actualizando prioridad:",
        error,
      );
    } finally {
      setSavingPriority(false);
    }
  }

  async function saveAssignment() {
    const value =
      assignmentValue.trim();

    if (value === assignedTo) {
      setEditingAssignment(false);
      return;
    }

    try {
      setSavingAssignment(true);

      await updateCaseAssignment(
        item.id,
        value || null,
      );

      setAssignedTo(value);
      setAssignmentValue(value);
      setEditingAssignment(false);
    } catch (error) {
      console.error(
        "Error actualizando asignación:",
        error,
      );
    } finally {
      setSavingAssignment(false);
    }
  }

  function cancelAssignment() {
    setAssignmentValue(
      assignedTo,
    );

    setEditingAssignment(false);
  }

  return (
    <div className="rounded-xl border bg-card transition-colors hover:border-primary/40">

      {/* HEADER */}

      <div className="p-5">

        <div className="flex items-start justify-between gap-4">

          <div className="min-w-0 flex-1">

            <div className="font-semibold text-base">
              {item.product_name}
            </div>

            <div className="mt-1 text-xs uppercase text-neutral-500">
              {typeLabel}
            </div>

          </div>

          <span
            className={`shrink-0 rounded-full px-3 py-1 text-xs font-medium ${
              STATUS_COLORS[
                item.status
              ]
            }`}
          >
            {statusLabel}
          </span>

        </div>

        {/* INFORMACIÓN OPERATIVA */}

        <div className="mt-4 grid grid-cols-3 gap-3">

          {/* SKU */}

          <div className="rounded-lg bg-muted/50 px-3 py-2">

            <div className="text-[10px] uppercase tracking-wide text-muted-foreground">
              SKU
            </div>

            <div className="mt-1 truncate font-mono text-xs font-medium">
              {item.original_sku}
            </div>

          </div>

          {/* PRIORIDAD */}

          <div className="rounded-lg bg-muted/50 px-3 py-2">

            <div className="flex items-center justify-between">

              <div className="text-[10px] uppercase tracking-wide text-muted-foreground">
                Prioridad
              </div>

              {!editingPriority && (
                <button
                  type="button"
                  onClick={() =>
                    setEditingPriority(
                      true,
                    )
                  }
                  className="text-muted-foreground transition hover:text-foreground"
                  title="Cambiar prioridad"
                >
                  <Pencil size={12} />
                </button>
              )}

            </div>

            {editingPriority ? (
              <div className="mt-1 flex items-center gap-1">

                <select
                  autoFocus
                  value={priority}
                  disabled={
                    savingPriority
                  }
                  onChange={(event) =>
                    handlePriorityChange(
                      event.target
                        .value as CasePriority,
                    )
                  }
                  className="w-full rounded border border-border bg-background px-1.5 py-1 text-xs outline-none"
                >
                  {PRIORITIES.map(
                    (option) => (
                      <option
                        key={
                          option.value
                        }
                        value={
                          option.value
                        }
                      >
                        {
                          option.label
                        }
                      </option>
                    ),
                  )}
                </select>

                {savingPriority && (
                  <Loader2
                    size={13}
                    className="shrink-0 animate-spin"
                  />
                )}

              </div>
            ) : (
              <button
                type="button"
                onClick={() =>
                  setEditingPriority(
                    true,
                  )
                }
                className={`mt-1 text-left text-xs font-medium ${priorityColor}`}
              >
                {priorityLabel}
              </button>
            )}

          </div>

          {/* ASIGNACIÓN */}

          <div className="rounded-lg bg-muted/50 px-3 py-2">

            <div className="flex items-center justify-between">

              <div className="text-[10px] uppercase tracking-wide text-muted-foreground">
                Asignado
              </div>

              {!editingAssignment && (
                <button
                  type="button"
                  onClick={() =>
                    setEditingAssignment(
                      true,
                    )
                  }
                  className="text-muted-foreground transition hover:text-foreground"
                  title="Cambiar asignación"
                >
                  <Pencil size={12} />
                </button>
              )}

            </div>

            {editingAssignment ? (
              <div className="mt-1 flex items-center gap-1">

                <input
                  autoFocus
                  value={
                    assignmentValue
                  }
                  disabled={
                    savingAssignment
                  }
                  onChange={(event) =>
                    setAssignmentValue(
                      event.target
                        .value,
                    )
                  }
                  onKeyDown={(
                    event,
                  ) => {
                    if (
                      event.key ===
                      "Enter"
                    ) {
                      event.preventDefault();
                      saveAssignment();
                    }

                    if (
                      event.key ===
                      "Escape"
                    ) {
                      event.preventDefault();
                      cancelAssignment();
                    }
                  }}
                  placeholder="Asignar..."
                  className="min-w-0 w-full rounded border border-border bg-background px-1.5 py-1 text-xs outline-none"
                />

                {savingAssignment ? (
                  <Loader2
                    size={13}
                    className="shrink-0 animate-spin"
                  />
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={
                        saveAssignment
                      }
                      className="text-emerald-500 hover:text-emerald-400"
                      title="Guardar"
                    >
                      <Check
                        size={14}
                      />
                    </button>

                    <button
                      type="button"
                      onClick={
                        cancelAssignment
                      }
                      className="text-red-500 hover:text-red-400"
                      title="Cancelar"
                    >
                      <X size={14} />
                    </button>
                  </>
                )}

              </div>
            ) : (
              <button
                type="button"
                onClick={() =>
                  setEditingAssignment(
                    true,
                  )
                }
                className="mt-1 block max-w-full truncate text-left text-xs font-medium"
              >
                {assignedTo ||
                  "Sin asignar"}
              </button>
            )}

          </div>

        </div>

        {/* TOGGLE */}

        <div className="mt-4 flex justify-end">

          <button
            type="button"
            onClick={() =>
              setExpanded(
                (value) => !value,
              )
            }
            className="inline-flex items-center gap-1.5 text-sm font-medium text-primary transition hover:opacity-80"
          >
            {expanded ? (
              <>
                Menos información
                <ChevronUp size={16} />
              </>
            ) : (
              <>
                Más información
                <ChevronDown size={16} />
              </>
            )}
          </button>

        </div>

      </div>

      {/* INFORMACIÓN EXPANDIDA */}

      <div
        className={`grid transition-all duration-300 ease-in-out ${
          expanded
            ? "grid-rows-[1fr] opacity-100"
            : "grid-rows-[0fr] opacity-0"
        }`}
      >

        <div className="overflow-hidden">

          <div className="border-t px-5 pb-5 pt-5">

            <div className="rounded-lg border bg-background p-4">

              <div className="text-xs font-medium text-neutral-500">
                SKU ORIGINAL
              </div>

              <div className="mt-1 font-mono font-semibold">
                {item.original_sku}
              </div>

              {item.title && (
                <>
                  <div className="my-3 flex justify-center text-neutral-400">
                    ↓
                  </div>

                  <div className="text-xs font-medium text-neutral-500">
                    SKU REEMPLAZO
                  </div>

                  <div className="mt-1 font-mono font-semibold text-emerald-600">
                    {item.title}
                  </div>
                </>
              )}

            </div>

            {item.description && (
              <div className="mt-4">

                <div className="mb-2 text-xs font-medium uppercase tracking-wide text-neutral-500">
                  Descripción
                </div>

                <div className="rounded-lg bg-muted p-3 text-sm whitespace-pre-wrap">
                  {item.description}
                </div>

              </div>
            )}

            <div className="mt-5 flex items-center justify-between border-t pt-4">

              <span className="text-xs text-neutral-500">
                Creado el{" "}
                {new Date(
                  item.created_at,
                ).toLocaleDateString(
                  "es-AR",
                )}
              </span>

              <button
                type="button"
                onClick={() =>
                  onOpen?.(item)
                }
                className="rounded-lg border border-border px-3 py-2 text-sm font-medium transition hover:bg-muted"
              >
                Ver detalle
              </button>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}