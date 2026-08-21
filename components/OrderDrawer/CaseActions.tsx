"use client";

import { useState } from "react";
import { toast } from "sonner";

import {
  updateCasePriority,
  updateCaseAssignment,
} from "@/lib/cases/repository";

import { ACTION_REGISTRY } from "@/lib/cases/actionRegistry";
import { getAvailableActions } from "@/lib/cases/workflow";

import { useAuth } from "@/lib/auth/AuthContext";

import { ActionModal } from "./actions/ActionModal";
import { RequestStoreForm } from "./actions/RequestStoreForm";

import type { CaseAction } from "@/lib/cases/types";

import type {
  CasePriority,
  OrderCase,
} from "@/lib/cases/repository";

interface Props {
  item: OrderCase;
  onExecuted: () =>
    Promise<void> | void;
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
  /*
   * ============================================================
   * AUTH / PERMISSIONS
   * ============================================================
   */

  const {
    user,
    can,
  } = useAuth();

  /*
   * ============================================================
   * ACTIONS DISPONIBLES SEGÚN WORKFLOW
   * ============================================================
   */

  const workflowActions =
    getAvailableActions(
      item.type,
      item.status,
    );

  /*
   * ============================================================
   * FILTRAR ACCIONES SEGÚN PERMISOS
   *
   * ADMIN pasa siempre porque can() ya contempla
   * el bypass del rol ADMIN.
   * ============================================================
   */

  const actions =
    workflowActions.filter(
      (action) => {
        /*
         * Si no hay usuario autenticado,
         * no mostramos acciones.
         */

        if (!user || !user.active) {
          return false;
        }

        /*
         * ------------------------------------------------------
         * REQUEST_STORE
         * ------------------------------------------------------
         */

        if (
          action ===
          "REQUEST_STORE"
        ) {
          return can(
            "cases.request_store",
          );
        }

        /*
         * ------------------------------------------------------
         * CANCEL_CASE
         * ------------------------------------------------------
         */

        if (
          action ===
          "CANCEL_CASE"
        ) {
          return can(
            "cases.cancel",
          );
        }

        /*
         * ------------------------------------------------------
         * REOPEN_CASE
         * ------------------------------------------------------
         */

        if (
          action ===
          "REOPEN_CASE"
        ) {
          return can(
            "cases.reopen",
          );
        }

        /*
         * ------------------------------------------------------
         * RESTO DE ACCIONES
         *
         * Las acciones operativas pasan por:
         *
         * cases.execute
         *
         * ------------------------------------------------------
         */

        return can(
          "cases.execute",
        );
      },
    );

  /*
   * ============================================================
   * STATE
   * ============================================================
   */

  const [selectedAction, setSelectedAction] =
    useState<CaseAction | null>(null);

  const [requestStoreOpen, setRequestStoreOpen] =
    useState(false);

  const [savingRequestStore, setSavingRequestStore] =
    useState(false);

  /*
   * ============================================================
   * SIMPLE ACTION
   * ============================================================
   */

  async function executeSimpleAction(
    action: CaseAction,
  ) {
    /*
     * Segunda protección en frontend.
     *
     * El executor también deberá validar esto
     * posteriormente.
     */

    if (!canExecuteAction(action)) {
      toast.error(
        "No tenés permisos para ejecutar esta acción.",
      );

      return;
    }

    try {
      const { executeAction } =
        await import(
          "@/lib/cases/executor"
        );

      const result =
        await executeAction({
          caseId: item.id,
          action,
          payload: {},
        });

      if (!result.success) {
        toast.error(
          result.error ||
            "No se pudo ejecutar la acción.",
        );

        return;
      }

      await onExecuted();

      toast.success(
        "Acción ejecutada correctamente.",
      );
    } catch (error) {
      console.error(
        "Error ejecutando acción:",
        error,
      );

      toast.error(
        "No se pudo ejecutar la acción.",
      );
    }
  }

  /*
   * ============================================================
   * REQUEST STORE
   * ============================================================
   */

  async function handleRequestStore(
    payload: Record<string, unknown>,
  ) {
    if (
      !can(
        "cases.request_store",
      )
    ) {
      toast.error(
        "No tenés permisos para solicitar stock.",
      );

      return;
    }

    try {
      setSavingRequestStore(true);

      const { executeAction } =
        await import(
          "@/lib/cases/executor"
        );

      const result =
        await executeAction({
          caseId: item.id,
          action:
            "REQUEST_STORE",
          payload,
        });

      if (!result.success) {
        toast.error(
          result.error ||
            "No se pudo solicitar la búsqueda.",
        );

        return;
      }

      await onExecuted();

      setRequestStoreOpen(false);

      toast.success(
        "Solicitud enviada correctamente.",
      );
    } catch (error) {
      console.error(
        "Error ejecutando REQUEST_STORE:",
        error,
      );

      toast.error(
        "No se pudo enviar la solicitud.",
      );
    } finally {
      setSavingRequestStore(false);
    }
  }

  /*
   * ============================================================
   * PRIORITY
   *
   * Por ahora no agregamos un permiso nuevo porque
   * no existe en nuestra tabla permissions.
   *
   * Se mantiene el comportamiento actual.
   * ============================================================
   */

  async function handlePriorityChange(
    value: CasePriority,
  ) {
    if (value === item.priority) {
      return;
    }

    try {
      await updateCasePriority(
        item.id,
        value,
      );

      await onExecuted();

      toast.success(
        "Prioridad actualizada.",
      );
    } catch (error) {
      console.error(error);

      toast.error(
        "No se pudo actualizar la prioridad.",
      );
    }
  }

  /*
   * ============================================================
   * ASSIGNMENT
   *
   * Igual que prioridad: todavía no tenemos un permiso
   * específico para asignación.
   * ============================================================
   */

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
      await updateCaseAssignment(
        item.id,
        normalizedValue,
      );

      await onExecuted();

      toast.success(
        "Asignación actualizada.",
      );
    } catch (error) {
      console.error(error);

      toast.error(
        "No se pudo actualizar la asignación.",
      );
    }
  }

  /*
   * ============================================================
   * ACTION PERMISSION HELPER
   * ============================================================
   */

  function canExecuteAction(
    action: CaseAction,
  ) {
    if (
      action ===
      "REQUEST_STORE"
    ) {
      return can(
        "cases.request_store",
      );
    }

    if (
      action ===
      "CANCEL_CASE"
    ) {
      return can(
        "cases.cancel",
      );
    }

    if (
      action ===
      "REOPEN_CASE"
    ) {
      return can(
        "cases.reopen",
      );
    }

    return can(
      "cases.execute",
    );
  }

  /*
   * ============================================================
   * HANDLE ACTION
   * ============================================================
   */

  function handleAction(
    action: CaseAction,
  ) {
    /*
     * Protección antes de abrir cualquier
     * formulario/modal.
     */

    if (!canExecuteAction(action)) {
      toast.error(
        "No tenés permisos para ejecutar esta acción.",
      );

      return;
    }

    /*
     * REQUEST_STORE tiene formulario propio.
     */

    if (
      action ===
      "REQUEST_STORE"
    ) {
      setRequestStoreOpen(
        (current) => !current,
      );

      return;
    }

    const config =
      ACTION_REGISTRY[action];

    /*
     * OFFER_ALTERNATIVE
     */

    if (
      action ===
      "OFFER_ALTERNATIVE"
    ) {
      setSelectedAction(action);

      return;
    }

    /*
     * Acciones con confirmación.
     */

    if (config.confirm) {
      toast(
        config.confirmDescription ??
          "¿Deseás ejecutar esta acción?",
        {
          duration: 6000,

          action: {
            label: "Confirmar",

            onClick: () => {
              void executeSimpleAction(
                action,
              );
            },
          },
        },
      );

      return;
    }

    /*
     * Modal estándar.
     */

    setSelectedAction(action);
  }

  /*
   * ============================================================
   * RENDER
   * ============================================================
   */

  return (
    <>
      <div className="space-y-3">
        {actions.length > 0 ? (
          <div className="space-y-3">
            {actions.map(
              (action) => {
                const config =
                  ACTION_REGISTRY[
                    action
                  ];

                const Icon =
                  config.icon;

                const isRequestStore =
                  action ===
                  "REQUEST_STORE";

                return (
                  <div
                    key={action}
                    className="space-y-2"
                  >
                    <button
                      type="button"
                      onClick={() =>
                        handleAction(
                          action,
                        )
                      }
                      className={`
                        group
                        w-full
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
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-black/20 ring-1 ring-white/10">
                          <Icon size={18} />
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="font-medium text-white">
                            {config.label}
                          </div>

                          {config.description && (
                            <p className="mt-1 text-sm text-neutral-400">
                              {
                                config.description
                              }
                            </p>
                          )}
                        </div>

                        {isRequestStore && (
                          <span className="text-lg text-neutral-400">
                            {requestStoreOpen
                              ? "−"
                              : "+"}
                          </span>
                        )}
                      </div>
                    </button>

                    {isRequestStore &&
                      requestStoreOpen && (
                        <div className="rounded-xl border border-border bg-background p-4">
                          <RequestStoreForm
                            loading={
                              savingRequestStore
                            }
                            onSubmit={
                              handleRequestStore
                            }
                          />
                        </div>
                      )}
                  </div>
                );
              },
            )}
          </div>
        ) : (
          <div className="rounded-lg border border-dashed p-4 text-sm text-neutral-500">
            No hay acciones disponibles.
          </div>
        )}
      </div>

      {selectedAction && (
        <ActionModal
          open
          action={
            selectedAction
          }
          caseId={item.id}
          onExecuted={
            onExecuted
          }
          onClose={() =>
            setSelectedAction(
              null,
            )
          }
        />
      )}
    </>
  );
}