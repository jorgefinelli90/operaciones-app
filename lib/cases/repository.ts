import { supabase } from "@/lib/supabase/client";

import type {
  CaseAction,
  CaseEventAction,
  CaseStatus,
  CaseType,
} from "./types";

export type CasePriority =
  | "LOW"
  | "NORMAL"
  | "HIGH"
  | "URGENT";

export interface OrderCase {
  id: number;

  order_id: string;

  order_item_id: number;

  type: CaseType;

  status: CaseStatus;

  priority: string;

  title: string | null;

  description: string | null;

  assigned_to: string | null;

  created_by: string | null;

  created_at: string;

  updated_at: string;

  closed_at: string | null;
}

export interface OrderCaseWithProduct
  extends OrderCase {
  original_sku: string;
  product_name: string;
}

export interface OrderCaseEvent {
  id: number;

  case_id: number;

  action:
    | CaseAction
    | CaseEventAction;

  from_status: string | null;

  to_status: string | null;

  payload: Record<
    string,
    unknown
  >;

  created_by: string | null;

  created_at: string;
}

export interface OrderCaseComment {
  id: number;

  case_id: number;

  comment: string;

  internal: boolean;

  created_by: string | null;

  created_at: string;
}

export async function getCases(
  orderItemId: number,
) {
  const { data, error } =
    await supabase
      .from("order_cases")
      .select("*")
      .eq(
        "order_item_id",
        orderItemId,
      )
      .order("created_at", {
        ascending: false,
      });

  if (error) throw error;

  return data as OrderCase[];
}

export async function getCasesWithProduct(
  orderId: string,
) {
  const { data, error } =
    await supabase
      .from("order_cases")
      .select(`
        *,
        order_items!inner(
          id,
          sku,
          product_name,
          qty,
          price
        )
      `)
      .eq(
        "order_id",
        orderId,
      )
      .order("created_at", {
        ascending: false,
      });

  if (error) throw error;

  return (data ?? []).map(
    (item: any) => ({
      ...item,

      order_item_id:
        item.order_items.id,

      original_sku:
        item.order_items.sku,

      product_name:
        item.order_items.product_name,

      qty:
        item.order_items.qty,

      price:
        item.order_items.price,
    }),
  );
}

export async function getCase(
  caseId: number,
) {
  const { data, error } =
    await supabase
      .from("order_cases")
      .select("*")
      .eq("id", caseId)
      .single();

  if (error) throw error;

  return data as OrderCase;
}

export async function createCase(
  input: {
    orderId: string;

    orderItemId: number;

    type: CaseType;

    priority: CasePriority;

    title?: string;

    description?: string;

    createdBy?: string;
  },
) {
  const { data, error } =
    await supabase
      .from("order_cases")
      .insert({
        order_id:
          input.orderId,

        order_item_id:
          input.orderItemId,

        type: input.type,

        priority:
          input.priority ??
          "NORMAL",

        title:
          input.title ?? null,

        description:
          input.description ??
          null,

        created_by:
          input.createdBy ??
          null,
      })
      .select()
      .single();

  if (error) throw error;

  const newCase =
    data as OrderCase;

  await createEvent({
    caseId: newCase.id,

    action:
      "CASE_CREATED",

    createdBy:
      input.createdBy,
  });

  return newCase;
}

export async function updateCaseStatus(
  caseId: number,
  status: CaseStatus,
  createdBy?: string,
) {
  const currentCase =
    await getCase(caseId);

  const values: Record<
    string,
    unknown
  > = {
    status,
  };

  /*
   * Un caso RESOLVED queda cerrado.
   */
  if (status === "RESOLVED") {
    values.closed_at =
      new Date().toISOString();
  }

  /*
   * Si el caso vuelve a OPEN,
   * también debe volver a estar
   * abierto a nivel de datos.
   *
   * Esto es fundamental para
   * REOPEN_CASE.
   */
  if (status === "OPEN") {
    values.closed_at = null;
  }

  const { data, error } =
    await supabase
      .from("order_cases")
      .update(values)
      .eq("id", caseId)
      .select()
      .single();

  if (error) throw error;

  await createEvent({
    caseId,

    action:
      "STATUS_CHANGED",

    fromStatus:
      currentCase.status,

    toStatus:
      status,

    createdBy,
  });

  return data as OrderCase;
}

export async function updateCasePriority(
  caseId: number,
  priority: CasePriority,
  createdBy?: string,
) {
  const currentCase =
    await getCase(caseId);

  const { data, error } =
    await supabase
      .from("order_cases")
      .update({
        priority,
      })
      .eq("id", caseId)
      .select()
      .single();

  if (error) throw error;

  await createEvent({
    caseId,

    action:
      "PRIORITY_CHANGED" as CaseAction,

    payload: {
      from:
        currentCase.priority,

      to:
        priority,
    },

    createdBy,
  });

  return data as OrderCase;
}

export async function updateCaseAssignment(
  caseId: number,
  assignedTo: string | null,
  createdBy?: string,
) {
  const currentCase =
    await getCase(caseId);

  const { data, error } =
    await supabase
      .from("order_cases")
      .update({
        assigned_to:
          assignedTo,
      })
      .eq("id", caseId)
      .select()
      .single();

  if (error) throw error;

  await createEvent({
    caseId,

    action:
      "ASSIGNMENT_CHANGED" as CaseAction,

    payload: {
      from:
        currentCase.assigned_to,

      to:
        assignedTo,
    },

    createdBy,
  });

  return data as OrderCase;
}

export async function createEvent(
  input: {
    caseId: number;

    action:
      | CaseAction
      | CaseEventAction;

    fromStatus?: string;

    toStatus?: string;

    payload?: Record<
      string,
      unknown
    >;

    createdBy?: string;
  },
) {
  const { data, error } =
    await supabase
      .from("order_case_events")
      .insert({
        case_id:
          input.caseId,

        action:
          input.action,

        from_status:
          input.fromStatus ??
          null,

        to_status:
          input.toStatus ??
          null,

        payload:
          input.payload ?? {},

        created_by:
          input.createdBy ??
          null,
      })
      .select()
      .single();

  if (error) throw error;

  return data as OrderCaseEvent;
}

export async function getEvents(
  caseId: number,
) {
  const { data, error } =
    await supabase
      .from("order_case_events")
      .select("*")
      .eq(
        "case_id",
        caseId,
      )
      .order("created_at");

  if (error) throw error;

  return data as OrderCaseEvent[];
}

export async function addComment(
  input: {
    caseId: number;

    comment: string;

    internal?: boolean;

    createdBy?: string;
  },
) {
  const { data, error } =
    await supabase
      .from(
        "order_case_comments",
      )
      .insert({
        case_id:
          input.caseId,

        comment:
          input.comment,

        internal:
          input.internal ?? true,

        created_by:
          input.createdBy ??
          null,
      })
      .select()
      .single();

  if (error) throw error;

  await createEvent({
    caseId:
      input.caseId,

    action:
      "COMMENT_ADDED",

    payload: {
      comment:
        input.comment,
    },

    createdBy:
      input.createdBy,
  });

  return data as OrderCaseComment;
}

export async function getComments(
  caseId: number,
) {
  const { data, error } =
    await supabase
      .from(
        "order_case_comments",
      )
      .select("*")
      .eq(
        "case_id",
        caseId,
      )
      .order("created_at");

  if (error) throw error;

  return data as OrderCaseComment[];
}