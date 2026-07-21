import type { CaseAction } from "../types";

export interface ActionHandlerContext {
  caseId: number;
  action: CaseAction;
  payload: Record<string, unknown>;
  createdBy?: string;
}

export interface ActionHandler {
  execute(
    context: ActionHandlerContext,
  ): Promise<void>;
}