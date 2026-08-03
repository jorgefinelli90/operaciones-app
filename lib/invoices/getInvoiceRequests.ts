import { supabase } from "@/lib/supabase/client";
import type { PaymentStatus } from "@/lib/invoices/types/invoice";

export interface InvoiceRequestRow {
  order_id: string;

  business_name: string | null;

  cuit: string | null;

  status: string;

  payment_status: PaymentStatus | null;

  created_at: string;

  orders: {
    customer_firstname: string | null;
    customer_lastname: string | null;
    customer_email: string | null;
  } | null;
}

export async function getInvoiceRequests() {
  const { data, error } = await supabase
    .from("invoice_requests")
    .select(`
      order_id,
      business_name,
      cuit,
      status,
      payment_status,
      created_at,
      orders (
        customer_firstname,
        customer_lastname,
        customer_email
      )
    `)
    .order("created_at", {
      ascending: false,
    });

  if (error) throw error;

  return (data ?? []).map((row) => ({
    ...row,
    orders: Array.isArray(row.orders)
      ? row.orders[0] ?? null
      : row.orders,
  })) as InvoiceRequestRow[];
}