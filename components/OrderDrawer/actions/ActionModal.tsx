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
          <div className="space-y-6">
            <p className="text-sm leading-6 text-neutral-300">
              ¿Deseás ejecutar esta acción?
              <br />
              Esta operación no podrá deshacerse.
            </p>

            <div className="flex justify-end gap-3 border-t border-neutral-800 pt-5">
              <button
                type="button"
                onClick={onClose}
                className="
                  h-10
                  rounded-lg
                  border
                  border-neutral-700
                  px-5
                  text-sm
                  font-medium
                  text-neutral-300
                  transition-colors
                  hover:bg-neutral-800
                "
              >
                Cancelar
              </button>

              <button
                type="button"
                disabled={loading}
                onClick={() => execute()}
                className="
                  h-10
                  rounded-lg
                  bg-black
                  px-5
                  text-sm
                  font-medium
                  text-white
                  transition-colors
                  hover:bg-neutral-800
                  disabled:cursor-not-allowed
                  disabled:opacity-50
                "
              >
                {loading ? "Ejecutando..." : "Confirmar"}
              </button>
            </div>
          </div>
        </Dialog>
      );
  }
}