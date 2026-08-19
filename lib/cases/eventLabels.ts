import type { CaseAction, CaseEventAction } from "./types";

export const EVENT_LABELS: Record<
  CaseAction | CaseEventAction,
  string
> = {
  CASE_CREATED: "Caso creado",
  STATUS_CHANGED: "Estado actualizado",
  COMMENT_ADDED: "Comentario agregado",
  ASSIGNED: "Caso asignado",
  ACTION_EXECUTED: "Acción ejecutada",

  REQUEST_STORE: "Solicitar stock",
  STORE_HAS_STOCK: "Stock encontrado",
  STORE_NO_STOCK: "Sin stock",
  OFFER_ALTERNATIVE: "Alternativa ofrecida",
  CUSTOMER_ACCEPTS: "Cliente aceptó",
  CUSTOMER_REJECTS: "Cliente rechazó",
  RESERVE_PRODUCT: "Producto reservado",
  SHIP_PRODUCT: "Producto despachado",
  CLOSE_CASE: "Caso cerrado",
  CANCEL_CASE: "Caso cancelado",
  REOPEN_CASE: "Caso reabierto",
  DOCUMENT_ADDED: "Comprobante agregado",
};