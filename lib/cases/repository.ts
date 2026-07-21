import { supabase } from "@/lib/supabase/client";

import type {
  CaseStatus,
  CaseType,
} from "./types";

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

export interface OrderCaseEvent {
  id: number;

  case_id: number;

  action: string;

  from_status: string | null;

  to_status: string | null;

  payload: Record<string, unknown>;

  created_by: string | null;

  created_at: string;
}

export interface OrderCaseComment {
  id: number;

  case_id: number;

  comment: string;

  internal: boolean;

  created_by: string |null;

  created_at: string;
}

export async function getCases(orderItemId: number) {
  const { data, error } = await supabase
    .from("order_cases")
    .select("*")
    .eq("order_item_id", orderItemId)
    .order("created_at", { ascending: false });

  if (error) throw error;

  return data as OrderCase[];
}

export async function getCase(caseId: number) {
  const { data, error } = await supabase
    .from("order_cases")
    .select("*")
    .eq("id", caseId)
    .single();

  if (error) throw error;

  return data as OrderCase;
}

export async function createCase(input: {
  orderId: string;

  orderItemId: number;

  type: CaseType;

  title?: string;

  description?: string;

  createdBy?: string;
}) {
  const { data, error } = await supabase
    .from("order_cases")
    .insert({
      order_id: input.orderId,

      order_item_id: input.orderItemId,

      type: input.type,

      title: input.title ?? null,

      description: input.description ?? null,

      created_by: input.createdBy ?? null,
    })
    .select()
    .single();

  if (error) throw error;

  return data as OrderCase;
}

export async function updateCaseStatus(
  caseId: number,
  status: CaseStatus,
) {
  const values: Record<string, unknown> = {
    status,
  };

  if (status === "RESOLVED") {
    values.closed_at = new Date().toISOString();
  }

  const { data, error } = await supabase
    .from("order_cases")
    .update(values)
    .eq("id", caseId)
    .select()
    .single();

  if (error) throw error;

  return data as OrderCase;
}

export async function createEvent(input: {
  caseId: number;

  action: string;

  fromStatus?: string;

  toStatus?: string;

  payload?: Record<string, unknown>;

  createdBy?: string;
}) {
  const { data, error } = await supabase
    .from("order_case_events")
    .insert({
      case_id: input.caseId,

      action: input.action,

      from_status: input.fromStatus ?? null,

      to_status: input.toStatus ?? null,

      payload: input.payload ?? {},

      created_by: input.createdBy ?? null,
    })
    .select()
    .single();

  if (error) throw error;

  return data as OrderCaseEvent;
}

export async function getEvents(caseId: number) {
  const { data, error } = await supabase
    .from("order_case_events")
    .select("*")
    .eq("case_id", caseId)
    .order("created_at");

  if (error) throw error;

  return data as OrderCaseEvent[];
}

export async function createComment(input: {
  caseId: number;

  comment: string;

  internal?: boolean;

  createdBy?: string;
}) {
  const { data, error } = await supabase
    .from("order_case_comments")
    .insert({
      case_id: input.caseId,

      comment: input.comment,

      internal: input.internal ?? true,

      created_by: input.createdBy ?? null,
    })
    .select()
    .single();

  if (error) throw error;

  return data as OrderCaseComment;
}

export async function getComments(caseId: number) {
  const { data, error } = await supabase
    .from("order_case_comments")
    .select("*")
    .eq("case_id", caseId)
    .order("created_at");

  if (error) throw error;

  return data as OrderCaseComment[];
}