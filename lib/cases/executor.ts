import { getCurrentUser } from "@/lib/auth/getCurrentUser";
import { can } from "@/lib/auth/permissions";

import { getCase } from "./repository";
import { validateAction } from "./validators";
import {
  ACTION_HANDLERS,
} from "./handlers";

import {
  canExecuteAction as canExecuteWorkflowAction,
} from "./workflow";

import type {
  CaseAction,
  CaseStatus,
} from "./types";

export interface ExecuteActionInput {
  caseId: number;

  action: CaseAction;

  payload?: Record<string, unknown>;
}

export interface ExecuteActionResult {
  success: boolean;

  status?: CaseStatus;

  error?: string;
}

/*
 * ============================================================
 * MAPEO DE ACCIONES → PERMISOS
 * ============================================================
 *
 * Usamos exclusivamente los permisos que existen
 * actualmente en Supabase.
 */

function getRequiredPermission(
  action: CaseAction,
): string {
  switch (action) {
    case "REQUEST_STORE":
      return "cases.request_store";

    case "CANCEL_CASE":
      return "cases.cancel";

    case "REOPEN_CASE":
      return "cases.reopen";

    default:
      return "cases.execute";
  }
}

/*
 * ============================================================
 * EXECUTE ACTION
 * ============================================================
 */

export async function executeAction({
  caseId,
  action,
  payload = {},
}: ExecuteActionInput): Promise<ExecuteActionResult> {
  try {
    /*
     * ========================================================
     * 1. OBTENER USUARIO AUTENTICADO
     * ========================================================
     *
     * Nunca confiamos en createdBy enviado desde el frontend.
     */

    const user =
      await getCurrentUser();

    if (!user) {
      return {
        success: false,
        error:
          "No hay un usuario autenticado.",
      };
    }

    /*
     * ========================================================
     * 2. VALIDAR USUARIO ACTIVO
     * ========================================================
     */

    if (!user.active) {
      return {
        success: false,
        error:
          "El usuario está desactivado.",
      };
    }

    /*
     * ========================================================
     * 3. DETERMINAR PERMISO NECESARIO
     * ========================================================
     */

    const requiredPermission =
      getRequiredPermission(action);

    /*
     * ========================================================
     * 4. VALIDAR PERMISO
     * ========================================================
     */

    if (
      !can(
        user,
        requiredPermission,
      )
    ) {
      return {
        success: false,
        error:
          "No tenés permisos para ejecutar esta acción.",
      };
    }

    /*
     * ========================================================
     * 5. OBTENER CASO
     * ========================================================
     */

    const currentCase =
      await getCase(caseId);

    /*
     * ========================================================
     * 6. VALIDAR WORKFLOW
     * ========================================================
     */

    if (
      !canExecuteWorkflowAction(
        currentCase.type,
        currentCase.status,
        action,
      )
    ) {
      return {
        success: false,
        error:
          "La acción no está permitida para el estado actual.",
      };
    }

    /*
     * ========================================================
     * 7. VALIDAR PAYLOAD
     * ========================================================
     */

    const validation =
      validateAction(
        action,
        payload,
      );

    if (!validation.valid) {
      return {
        success: false,
        error:
          validation.error ||
          "Los datos de la acción no son válidos.",
      };
    }

    /*
     * ========================================================
     * 8. OBTENER HANDLER
     * ========================================================
     */

    const handler =
      ACTION_HANDLERS[action];

    if (!handler) {
      return {
        success: false,
        error:
          "No existe un handler configurado para esta acción.",
      };
    }

    /*
     * ========================================================
     * 9. EJECUTAR
     * ========================================================
     *
     * createdBy sale SIEMPRE del usuario autenticado.
     */

    await handler.execute({
      caseId,

      action,

      payload,

      createdBy:
        user.id,
    });

    /*
     * ========================================================
     * 10. RESULTADO
     * ========================================================
     */

    return {
      success: true,

      status:
        currentCase.status,
    };
  } catch (error) {
    console.error(
      "Error ejecutando acción:",
      error,
    );

    return {
      success: false,

      error:
        error instanceof Error
          ? error.message
          : "Error ejecutando acción.",
    };
  }
}