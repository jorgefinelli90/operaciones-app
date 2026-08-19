export type OrderDocumentType =
  | "INVOICE"
  | "CREDIT_NOTE";

export interface OrderDocument {
  id: number;

  order_id: string;

  case_id: number | null;

  order_item_id: number | null;

  type: OrderDocumentType;

  number: string;

  document_date: string;

  amount: number;

  reason: string | null;

  comment: string | null;

  created_by: string | null;

  created_at: string;
}

export interface CreateOrderDocumentInput {
  orderId: string;

  caseId?: number | null;

  orderItemId?: number | null;

  type: OrderDocumentType;

  number: string;

  documentDate: string;

  amount: number;

  reason?: string | null;

  comment?: string | null;

  createdBy?: string | null;
}