"use client";

import { useState } from "react";

import { Dialog } from "@/components/ui/Dialog";
import { AlternativeForm } from "./AlternativeForm";

import { executeAction } from "@/lib/cases/executor";
import type { CaseAction } from "@/lib/cases/types";

interface Props {
  open: boolean;
  onClose: () => void;

  caseId: number;
  action: CaseAction;

  onExecuted: () => Promise<void> | void;
}

export function ActionModal({
  open,
  onClose,
  caseId,
  action,
  onExecuted,
}: Props) {
  const [loading, setLoading] = useState(false);

  async function execute(
    payload: Record<string, unknown> = {},
  ) {
    try {
      setLoading(true);

      const result = await executeAction({
        caseId,
        action,
        payload,
      });

      if (!result.success) {
        alert(result.error);
        return;
      }

      await onExecuted();

      onClose();
    } catch (e) {
      console.error(e);
      alert("No se pudo ejecutar la acción.");
    } finally {
      setLoading(false);
    }
  }

  switch (action) {
    case "OFFER_ALTERNATIVE":
      return (
        <Dialog
          open={open}
          onOpenChange={(v) => !v && onClose()}
          title="Ofrecer alternativa"
        >
          <AlternativeForm
            loading={loading}
            onSubmit={execute}
          />
        </Dialog>
      );

    default:
      return (
        <Dialog
          open={open}
          onOpenChange={(v) => !v && onClose()}
          title="Confirmar acción"
        >
          <div className="space-y-4">

            <p>
              ¿Deseás ejecutar esta acción?
            </p>

            <button
              disabled={loading}
              onClick={() => execute()}
              className="rounded bg-black px-4 py-2 text-white"
            >
              Confirmar
            </button>

          </div>
        </Dialog>
      );
  }
}