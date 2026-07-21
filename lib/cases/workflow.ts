import type {
  CaseAction,
  CaseStatus,
} from "./types";

export interface WorkflowState {
  actions: CaseAction[];
}

export const WORKFLOW: Record<
  CaseStatus,
  WorkflowState
> = {
  OPEN: {
    actions: [
      "REQUEST_STORE",
      "CANCEL_CASE",
    ],
  },

  WAITING_STORE: {
    actions: [
      "STORE_HAS_STOCK",
      "STORE_NO_STOCK",
      "CANCEL_CASE",
    ],
  },

  WAITING_CUSTOMER: {
    actions: [
      "CUSTOMER_ACCEPTS",
      "CUSTOMER_REJECTS",
      "OFFER_ALTERNATIVE",
      "CANCEL_CASE",
    ],
  },

  IN_PROGRESS: {
    actions: [
      "RESERVE_PRODUCT",
      "SHIP_PRODUCT",
      "CLOSE_CASE",
      "CANCEL_CASE",
    ],
  },

  RESOLVED: {
    actions: [],
  },

  CANCELLED: {
    actions: [],
  },
};

/**
 * Devuelve las acciones disponibles
 * para un estado determinado.
 */
export function getAvailableActions(
  status: CaseStatus,
): CaseAction[] {
  return WORKFLOW[status]?.actions ?? [];
}

/**
 * Indica si una acción puede ejecutarse
 * desde el estado actual.
 */
export function canExecuteAction(
  status: CaseStatus,
  action: CaseAction,
): boolean {
  return getAvailableActions(status).includes(
    action,
  );
}

/**
 * Obtiene toda la definición del estado.
 */
export function getWorkflowState(
  status: CaseStatus,
): WorkflowState {
  return WORKFLOW[status];
}