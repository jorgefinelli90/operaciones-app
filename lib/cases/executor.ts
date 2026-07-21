import { getCase } from "./repository";
import { validateAction } from "./validators";

import { ACTION_HANDLERS } from "./handlers";
import { canExecuteAction } from "./workflow";

import type {
  CaseAction,
  CaseStatus,
} from "./types";

export interface ExecuteActionInput {
  caseId: number;

  action: CaseAction;

  payload?: Record<string, unknown>;

  createdBy?: string;
}

export interface ExecuteActionResult {
  success: boolean;

  status?: CaseStatus;

  error?: string;
}

export async function executeAction({
  caseId,
  action,
  payload = {},
  createdBy,
}: ExecuteActionInput): Promise<ExecuteActionResult> {
  try {
    // Obtener el caso actual
    const currentCase = await getCase(caseId);

    // Validar que la acción pueda ejecutarse
    if (
      !canExecuteAction(
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

    // Validar el payload de la acción
    const validation = validateAction(
      action,
      payload,
    );

    if (!validation.valid) {
      return {
        success: false,
        error: validation.error,
      };
    }

    // Ejecutar el handler correspondiente
    await ACTION_HANDLERS[action].execute({
      caseId,
      action,
      payload,
      createdBy,
    });

    return {
      success: true,
      status: currentCase.status,
    };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Error ejecutando acción.",
    };
  }
}