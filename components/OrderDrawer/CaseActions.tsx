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
  gray: "border-gray-300 bg-white hover:bg-gray-50",

  blue: "border-blue-300 bg-blue-50 hover:bg-blue-100",

  green: "border-green-300 bg-green-50 hover:bg-green-100",

  orange: "border-orange-300 bg-orange-50 hover:bg-orange-100",

  red: "border-red-300 bg-red-50 hover:bg-red-100",
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
            className={`flex items-start gap-3 rounded-lg border p-4 text-left transition ${COLOR_CLASSES[config.color]}`}
          >
            ...
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