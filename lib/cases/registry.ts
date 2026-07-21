import type { CaseAction, CaseStatus, CaseType } from "./types";

type Registry = Record<
  CaseType,
  Record<CaseStatus, CaseAction[]>
>;

export const registry: Registry = {
  NO_STOCK: {
    OPEN: [
      "REQUEST_STORE",
      "OFFER_ALTERNATIVE",
      "CANCEL_CASE",
    ],

    WAITING_STORE: [
      "STORE_HAS_STOCK",
      "STORE_NO_STOCK",
      "CANCEL_CASE",
    ],

    WAITING_CUSTOMER: [
      "CUSTOMER_ACCEPTS",
      "CUSTOMER_REJECTS",
      "CANCEL_CASE",
    ],

    IN_PROGRESS: [
      "RESERVE_PRODUCT",
      "SHIP_PRODUCT",
      "CLOSE_CASE",
    ],

    RESOLVED: [],

    CANCELLED: [],
  },

  CHANGE: {
    OPEN: [
      "RESERVE_PRODUCT",
      "CANCEL_CASE",
    ],

    WAITING_STORE: [],

    WAITING_CUSTOMER: [
      "CUSTOMER_ACCEPTS",
      "CUSTOMER_REJECTS",
    ],

    IN_PROGRESS: [
      "SHIP_PRODUCT",
      "CLOSE_CASE",
    ],

    RESOLVED: [],

    CANCELLED: [],
  },
};

export function getAvailableActions(
  type: CaseType,
  status: CaseStatus,
): CaseAction[] {
  return registry[type][status];
}