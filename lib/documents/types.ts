export type OrderDocumentType =
  | "INVOICE"
  | "CREDIT_NOTE";

export interface OrderDocument {
  id: number;

  order_id: string;

  case_id: number | null;

  order_item_id: number | null;

  type: OrderDocumentType;

  /**
   * Número fiscal visible en el comprobante.
   *
   * Ejemplo:
   * 0024-00093180
   */
  number: string;

  /**
   * URL completa al comprobante
   * en Stock Inteligente.
   */
  document_url: string;

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

  /**
   * Número fiscal visible.
   *
   * Ejemplo:
   * 0024-00093180
   */
  number: string;

  /**
   * URL completa del comprobante.
   */
  documentUrl: string;

  documentDate: string;

  amount: number;

  reason?: string | null;

  comment?: string | null;

  createdBy?: string | null;
}