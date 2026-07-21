import {
  createEvent,
  getCase,
  updateCaseStatus,
} from "../repository";

import { getNextStatus } from "../transitions";

import type {
  ActionHandler,
  ActionHandlerContext,
} from "./types";

export abstract class BaseHandler
  implements ActionHandler
{
  async execute(
    context: ActionHandlerContext,
  ): Promise<void> {
    const currentCase = await getCase(
      context.caseId,
    );

    const nextStatus = getNextStatus(
      context.action,
    );

    await this.beforeExecute(context);

    await updateCaseStatus(
      context.caseId,
      nextStatus,
    );

    await createEvent({
      caseId: context.caseId,

      action: context.action,

      fromStatus: currentCase.status,

      toStatus: nextStatus,

      payload: context.payload,

      createdBy: context.createdBy,
    });

    await this.afterExecute(context);
  }

  protected async beforeExecute(
    _context: ActionHandlerContext,
  ) {}

  protected async afterExecute(
    _context: ActionHandlerContext,
  ) {}
}