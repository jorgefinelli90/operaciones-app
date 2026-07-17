export interface InvoiceRequest {
  id?: number;

  order_id: string;

  requested: boolean;

  cuit: string | null;

  business_name: string | null;

  tax_address: string | null;

  status: string;

  created_at?: string;

  updated_at?: string;
}