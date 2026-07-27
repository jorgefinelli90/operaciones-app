import { getAvailableActions as getRegisteredActions } from "./registry";
import type { CaseAction, CaseStatus, CaseType } from "./types";

export interface WorkflowState {
  actions: CaseAction[];
}

/**
 * Devuelve las acciones disponibles
 * para un tipo y estado determinados.
 */
export function getAvailableActions(
  type: CaseType,
  status: CaseStatus,
): CaseAction[] {
  return getRegisteredActions(type, status);
}

/**
 * Indica si una acción puede ejecutarse
 * desde el estado actual.
 */
export function canExecuteAction(
  type: CaseType,
  status: CaseStatus,
  action: CaseAction,
): boolean {
  return getAvailableActions(type, status).includes(
    action,
  );
}

/**
 * Obtiene toda la definición del estado.
 */
export function getWorkflowState(
  type: CaseType,
  status: CaseStatus,
): WorkflowState {
  return {
    actions: getAvailableActions(type, status),
  };
}
