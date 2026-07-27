import type { CaseStatus } from "./types";

export const STATUS_LABELS: Record<CaseStatus, string> = {
  OPEN: "Abierto",
  WAITING_STORE: "Esperando tienda",
  WAITING_CUSTOMER: "Esperando cliente",
  IN_PROGRESS: "En progreso",
  RESOLVED: "Resuelto",
  CANCELLED: "Cancelado",
};