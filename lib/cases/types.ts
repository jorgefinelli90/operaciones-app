export type CaseType =
  | "NO_STOCK"
  | "CHANGE"
  | "RETURN"
  | "INVOICE"
  | "CHARGEBACK"
  | "CLAIM";

export type CaseStatus =
  | "OPEN"
  | "WAITING_STORE"
  | "WAITING_CUSTOMER"
  | "IN_PROGRESS"
  | "RESOLVED"
  | "CANCELLED";

export type CaseAction =
  | "REQUEST_STORE"
  | "STORE_HAS_STOCK"
  | "STORE_NO_STOCK"
  | "OFFER_ALTERNATIVE"
  | "CUSTOMER_ACCEPTS"
  | "CUSTOMER_REJECTS"
  | "RESERVE_PRODUCT"
  | "SHIP_PRODUCT"
  | "CLOSE_CASE"
  | "CANCEL_CASE";

  export type CaseEventAction =
  | "CASE_CREATED"
  | "STATUS_CHANGED"
  | "COMMENT_ADDED"
  | "ASSIGNED"
  | "ACTION_EXECUTED";