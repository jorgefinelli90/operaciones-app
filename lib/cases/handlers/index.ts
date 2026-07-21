import type { CaseAction } from "../types";

import { DefaultHandler } from "./DefaultHandler";
import { OfferAlternativeHandler } from "./OfferAlternativeHandler";

import type { ActionHandler } from "./types";

export const ACTION_HANDLERS: Record<
  CaseAction,
  ActionHandler
> = {
  REQUEST_STORE: new DefaultHandler(),

  STORE_HAS_STOCK: new DefaultHandler(),

  STORE_NO_STOCK: new DefaultHandler(),

  OFFER_ALTERNATIVE:
    new OfferAlternativeHandler(),

  CUSTOMER_ACCEPTS:
    new DefaultHandler(),

  CUSTOMER_REJECTS:
    new DefaultHandler(),

  RESERVE_PRODUCT:
    new DefaultHandler(),

  SHIP_PRODUCT:
    new DefaultHandler(),

  CLOSE_CASE:
    new DefaultHandler(),

  CANCEL_CASE:
    new DefaultHandler(),
};