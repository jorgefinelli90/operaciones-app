import { BaseHandler } from "./BaseHandler";

import type { ActionHandlerContext } from "./types";

export class OfferAlternativeHandler extends BaseHandler {
  protected override async beforeExecute(
    context: ActionHandlerContext,
  ) {
    const sku = context.payload.sku;

    if (
      typeof sku !== "string" ||
      sku.trim() === ""
    ) {
      throw new Error(
        "Debe ingresar un SKU.",
      );
    }
  }
}