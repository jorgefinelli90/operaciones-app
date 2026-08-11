"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";

import {
  updateCasePriority,
  updateCaseAssignment,
} from "@/lib/cases/repository";

import { ACTION_REGISTRY } from "@/lib/cases/actionRegistry";
import { getAvailableActions } from "@/lib/cases/workflow";
import { ActionModal } from "./actions/ActionModal";

import type { CaseAction } from "@/lib/cases/types";
import type {
  CasePriority,
  OrderCase,
} from "@/lib/cases/repository";

interface Props {
  item: OrderCase;
  onExecuted: () => Promise<void> | void;
}

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

const COLOR_CLASSES = {
  gray:
    "border-neutral-700 bg-neutral-900 hover:bg-neutral-800 text-white",

  blue:
    "border-blue-800 bg-blue-950/40 hover:bg-blue-900/50 text-white",

  green:
    "border-emerald-800 bg-emerald-950/40 hover:bg-emerald-900/50 text-white",

  orange:
    "border-amber-800 bg-amber-950/40 hover:bg-amber-900/50 text-white",

  red:
    "border-red-800 bg-red-950/40 hover:bg-red-900/50 text-white",
};

export function CaseActions({
  item,
  onExecuted,
}: Props) {
  const actions = getAvailableActions(
    item.type,
    item.status,
  );

  const [selectedAction, setSelectedAction] =
    useState<CaseAction | null>(null);

  const [savingPriority, setSavingPriority] =
    useState(false);

  const [savingAssignment, setSavingAssignment] =
    useState(false);

  async function handlePriorityChange(
    value: CasePriority,
  ) {
    if (value === item.priority) {
      return;
    }

    try {
      setSavingPriority(true);

      await updateCasePriority(
        item.id,
        value,
      );

      await onExecuted();
    } catch (error) {
      console.error(error);
    } finally {
      setSavingPriority(false);
    }
  }

  async function handleAssignmentChange(
    value: string,
  ) {
    const normalizedValue =
      value.trim() || null;

    if (
      normalizedValue ===
      (item.assigned_to ?? null)
    ) {
      return;
    }

    try {
      setSavingAssignment(true);

      await updateCaseAssignment(
        item.id,
        normalizedValue,
      );

      await onExecuted();
    } catch (error) {
      console.error(error);
    } finally {
      setSavingAssignment(false);
    }
  }

  function handleAction(
    action: CaseAction,
  ) {
    const config = ACTION_REGISTRY[action];

    if (!config.confirm) {
      setSelectedAction(action);
      return;
    }

    if (
      window.confirm(
        config.confirmDescription ??
          "¿Continuar?",
      )
    ) {
      setSelectedAction(action);
    }
  }

  return (
    <>
      <div className="space-y-5">

        {/* ACCIONES DEL WORKFLOW */}

        {actions.length > 0 ? (
          <div className="grid gap-3">

            {actions.map((action) => {
              const config =
                ACTION_REGISTRY[action];

              const Icon = config.icon;

              return (
                <button
                  key={action}
                  type="button"
                  onClick={() =>
                    handleAction(action)
                  }
                  className={`
                    group
                    rounded-xl
                    border
                    p-4
                    text-left
                    transition-all
                    duration-200
                    ${COLOR_CLASSES[config.color]}
                  `}
                >
                  <div className="flex items-start gap-4">

                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-black/20 ring-1 ring-white/10">

                      <Icon size={18} />

                    </div>

                    <div className="flex-1">

                      <div className="font-medium text-white">
                        {config.label}
                      </div>

                      {config.description && (
                        <p className="mt-1 text-sm text-neutral-400">
                          {config.description}
                        </p>
                      )}

                    </div>

                  </div>
                </button>
              );
            })}

          </div>
        ) : (
          <div className="rounded-lg border border-dashed p-4 text-sm text-neutral-500">
            No hay acciones disponibles.
          </div>
        )}

        {/* PRIORIDAD */}

        <div className="rounded-xl border p-4">

          <label
            htmlFor={`priority-${item.id}`}
            className="mb-2 block text-sm font-medium"
          >
            Prioridad
          </label>

          <div className="relative">

            <select
              id={`priority-${item.id}`}
              value={
                (item.priority as CasePriority) ||
                "NORMAL"
              }
              disabled={savingPriority}
              onChange={(event) =>
                handlePriorityChange(
                  event.target.value as CasePriority,
                )
              }
              className="w-full appearance-none rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none transition focus:border-primary"
            >
              {PRIORITIES.map((priority) => (
                <option
                  key={priority.value}
                  value={priority.value}
                >
                  {priority.label}
                </option>
              ))}
            </select>

            {savingPriority && (
              <Loader2
                size={16}
                className="absolute right-3 top-1/2 -translate-y-1/2 animate-spin text-muted-foreground"
              />
            )}

          </div>

        </div>

        {/* ASIGNACIÓN */}

        <div className="rounded-xl border p-4">

          <label
            htmlFor={`assigned-${item.id}`}
            className="mb-2 block text-sm font-medium"
          >
            Asignado a
          </label>

          <div className="relative">

            <input
              id={`assigned-${item.id}`}
              type="text"
              defaultValue={
                item.assigned_to ?? ""
              }
              disabled={savingAssignment}
              placeholder="Usuario o responsable"
              onBlur={(event) =>
                handleAssignmentChange(
                  event.target.value,
                )
              }
              className="w-full rounded-lg border border-border bg-background px-3 py-2 pr-10 text-sm outline-none transition focus:border-primary"
            />

            {savingAssignment && (
              <Loader2
                size={16}
                className="absolute right-3 top-1/2 -translate-y-1/2 animate-spin text-muted-foreground"
              />
            )}

          </div>

          <p className="mt-2 text-xs text-muted-foreground">
            Se guarda al salir del campo.
          </p>

        </div>

        

      </div>

      {selectedAction && (
        <ActionModal
          open
          action={selectedAction}
          caseId={item.id}
          onExecuted={onExecuted}
          onClose={() =>
            setSelectedAction(null)
          }
        />
      )}
    </>
  );
}