import type { CaseAction, CaseStatus } from "./types";

export const transitions: Record<CaseAction, CaseStatus> = {
  REQUEST_STORE: "WAITING_STORE",

  STORE_HAS_STOCK: "IN_PROGRESS",

  STORE_NO_STOCK: "WAITING_CUSTOMER",

  OFFER_ALTERNATIVE: "WAITING_CUSTOMER",

  CUSTOMER_ACCEPTS: "IN_PROGRESS",

  CUSTOMER_REJECTS: "OPEN",

  RESERVE_PRODUCT: "IN_PROGRESS",

  SHIP_PRODUCT: "RESOLVED",

  CLOSE_CASE: "RESOLVED",

  CANCEL_CASE: "CANCELLED",
};

export function getNextStatus(action: CaseAction): CaseStatus {
  return transitions[action];
}