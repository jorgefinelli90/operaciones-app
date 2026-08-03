export type InvoiceStatus =
  | "PENDING"
  | "IN_PROGRESS"
  | "GENERATED"
  | "ERROR";

export type PaymentStatus =
  | "NO_PAYMENT"
  | "PENDING_AMOUNT"
  | "SEND_PAYMENT_LINK"
  | "PAYMENT_LINK_SENT"
  | "PAID"
  | "ERROR";

export interface InvoiceRequest {
  id?: number;

  order_id: string;

  requested: boolean;

  cuit: string | null;

  business_name: string | null;

  tax_address: string | null;

  status: InvoiceStatus;

  payment_status: PaymentStatus | null;

  payment_amount: number | null;

  invoice_url: string | null;

  created_at?: string;

  updated_at?: string;
}