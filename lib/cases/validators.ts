import type { CaseAction } from "./types";

export interface ValidationResult {
  valid: boolean;
  error?: string;
}

export function validateAction(
  action: CaseAction,
  payload: Record<string, unknown>,
): ValidationResult {
  switch (action) {
    case "REQUEST_STORE":
      if (!payload.storeId) {
        return {
          valid: false,
          error: "Debe seleccionar un local.",
        };
      }
      break;

    case "OFFER_ALTERNATIVE":
      if (!payload.sku) {
        return {
          valid: false,
          error: "Debe seleccionar un producto.",
        };
      }
      break;

    default:
      break;
  }

  return {
    valid: true,
  };
}