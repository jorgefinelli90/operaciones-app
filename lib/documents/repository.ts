import { supabase } from "@/lib/supabase/client";

import type {
  CreateOrderDocumentInput,
  OrderDocument,
} from "./types";

export async function getOrderDocuments(
  orderId: string,
): Promise<OrderDocument[]> {
  const { data, error } =
    await supabase
      .from("order_documents")
      .select("*")
      .eq("order_id", orderId)
      .order("document_date", {
        ascending: false,
      })
      .order("created_at", {
        ascending: false,
      });

  if (error) {
    throw error;
  }

  return (data ?? []) as OrderDocument[];
}

export async function getCaseDocuments(
  caseId: number,
): Promise<OrderDocument[]> {
  const { data, error } =
    await supabase
      .from("order_documents")
      .select("*")
      .eq("case_id", caseId)
      .order("document_date", {
        ascending: false,
      })
      .order("created_at", {
        ascending: false,
      });

  if (error) {
    throw error;
  }

  return (data ?? []) as OrderDocument[];
}

export async function createOrderDocument(
  input: CreateOrderDocumentInput,
): Promise<OrderDocument> {
  const number =
    input.number.trim();

  const documentUrl =
    input.documentUrl.trim();

  if (!number) {
    throw new Error(
      "El número de comprobante es obligatorio.",
    );
  }

  if (!documentUrl) {
    throw new Error(
      "La URL del comprobante es obligatoria.",
    );
  }

  if (!input.orderId) {
    throw new Error(
      "El pedido es obligatorio.",
    );
  }

  if (!input.documentDate) {
    throw new Error(
      "La fecha del comprobante es obligatoria.",
    );
  }

  if (
    !Number.isFinite(input.amount) ||
    input.amount < 0
  ) {
    throw new Error(
      "El importe no es válido.",
    );
  }

  try {
    new URL(documentUrl);
  } catch {
    throw new Error(
      "La URL del comprobante no es válida.",
    );
  }

  const { data, error } =
    await supabase
      .from("order_documents")
      .insert({
        order_id:
          input.orderId,

        case_id:
          input.caseId ?? null,

        order_item_id:
          input.orderItemId ?? null,

        type:
          input.type,

        number,

        document_url:
          documentUrl,

        document_date:
          input.documentDate,

        amount:
          input.amount,

        reason:
          input.reason?.trim() ||
          null,

        comment:
          input.comment?.trim() ||
          null,

        created_by:
          input.createdBy ?? null,
      })
      .select()
      .single();

  if (error) {
    throw error;
  }

  return data as OrderDocument;
}

export async function deleteOrderDocument(
  documentId: number,
) {
  const { error } =
    await supabase
      .from("order_documents")
      .delete()
      .eq("id", documentId);

  if (error) {
    throw error;
  }
}