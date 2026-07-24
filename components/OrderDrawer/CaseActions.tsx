"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";

import { ACTION_REGISTRY } from "@/lib/cases/actionRegistry";
import { executeAction } from "@/lib/cases/executor";
import { getAvailableActions } from "@/lib/cases/workflow";
import { ActionModal } from "./actions/ActionModal";
import type { CaseAction } from "@/lib/cases/types";
import type { OrderCase } from "@/lib/cases/repository";

interface Props {
  item: OrderCase;
  onExecuted: () => Promise<void> | void;
}

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
  const actions = getAvailableActions(item.status);
  const [selectedAction, setSelectedAction] =
  useState<CaseAction | null>(null);
  const [loading, setLoading] =
    useState<CaseAction | null>(null);

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
        "¿Continuar?"
    )
  ) {
    setSelectedAction(action);
  }
}

  if (!actions.length) {
    return (
      <div className="rounded-lg border border-dashed p-4 text-sm text-neutral-500">
        No hay acciones disponibles.
      </div>
    );
  }

return (
  <>
    <div className="grid gap-3">
      {actions.map((action) => {
        const config = ACTION_REGISTRY[action];
        const Icon = config.icon;

        return (
          <button
            key={action}
            disabled={loading !== null}
            onClick={() => handleAction(action)}
            className={`
              group
              rounded-xl
              border
              p-4
              text-left
              transition-all
              duration-200
              disabled:cursor-not-allowed
              disabled:opacity-50
              ${COLOR_CLASSES[config.color]}
            `}
          >
            <div className="flex items-start gap-4">
              <div
                className="
                  flex
                  h-10
                  w-10
                  items-center
                  justify-center
                  rounded-lg
                  bg-black/20
                  ring-1
                  ring-white/10
                "
              >
                {loading === action ? (
                  <Loader2
                    size={18}
                    className="animate-spin"
                  />
                ) : (
                  <Icon size={18} />
                )}
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

    {selectedAction && (
      <ActionModal
        open
        action={selectedAction}
        caseId={item.id}
        onExecuted={onExecuted}
        onClose={() => setSelectedAction(null)}
      />
    )}
  </>
);
}