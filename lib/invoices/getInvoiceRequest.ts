import { supabase } from "@/lib/supabase/client";
import type { InvoiceRequest } from "@/lib/invoices/types/invoice";

export async function getInvoiceRequest(
  orderId: string,
): Promise<InvoiceRequest | null> {
  const { data, error } = await supabase
    .from("invoice_requests")
    .select("*")
    .eq("order_id", orderId)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return data;
}