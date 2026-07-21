import {
  Building2,
  CheckCircle2,
  CircleX,
  PackageCheck,
  PackageSearch,
  RefreshCcw,
  Store,
  UserCheck,
  UserX,
} from "lucide-react";

import type { CaseAction } from "./types";

export interface ActionDefinition {
  label: string;
  description: string;

  color:
    | "gray"
    | "blue"
    | "green"
    | "orange"
    | "red";

  variant:
    | "primary"
    | "secondary"
    | "danger";

  icon: typeof Building2;

  confirm: boolean;

  confirmTitle?: string;
  confirmDescription?: string;
}

export const ACTION_REGISTRY: Record<
  CaseAction,
  ActionDefinition
> = {
  REQUEST_STORE: {
    label: "Solicitar al depósito",
    description:
      "Solicita la búsqueda del producto.",

    color: "orange",
    variant: "primary",

    icon: Building2,

    confirm: true,

    confirmDescription:
      "¿Enviar el caso al depósito?",
  },

  STORE_HAS_STOCK: {
    label: "Depósito encontró stock",

    description:
      "El depósito confirmó disponibilidad.",

    color: "green",
    variant: "primary",

    icon: Store,

    confirm: true,
  },

  STORE_NO_STOCK: {
    label: "Depósito sin stock",

    description:
      "El depósito confirmó faltante.",

    color: "red",
    variant: "danger",

    icon: CircleX,

    confirm: true,
  },

  OFFER_ALTERNATIVE: {
    label: "Ofrecer alternativa",

    description:
      "Registrar un SKU alternativo.",

    color: "blue",
    variant: "primary",

    icon: RefreshCcw,

    confirm: false,
  },

  CUSTOMER_ACCEPTS: {
    label: "Cliente acepta",

    description:
      "El cliente acepta la propuesta.",

    color: "green",
    variant: "primary",

    icon: UserCheck,

    confirm: true,
  },

  CUSTOMER_REJECTS: {
    label: "Cliente rechaza",

    description:
      "El cliente rechazó la propuesta.",

    color: "red",
    variant: "danger",

    icon: UserX,

    confirm: true,
  },

  RESERVE_PRODUCT: {
    label: "Reservar producto",

    description:
      "Reservar una unidad.",

    color: "blue",
    variant: "primary",

    icon: PackageSearch,

    confirm: true,
  },

  SHIP_PRODUCT: {
    label: "Despachar producto",

    description:
      "Marcar el producto como despachado.",

    color: "green",
    variant: "primary",

    icon: PackageCheck,

    confirm: true,
  },

  CLOSE_CASE: {
    label: "Cerrar caso",

    description:
      "Finalizar definitivamente el caso.",

    color: "green",
    variant: "primary",

    icon: CheckCircle2,

    confirm: true,
  },

  CANCEL_CASE: {
    label: "Cancelar caso",

    description:
      "Cancelar el caso.",

    color: "red",
    variant: "danger",

    icon: CircleX,

    confirm: true,
  },
};