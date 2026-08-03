import { supabase } from "@/lib/supabase/client";
import type { InvoiceRequest } from "@/lib/invoices/types/invoice";

export async function saveInvoiceRequest(
  invoice: InvoiceRequest,
) {
  const {
    id,
    created_at,
    updated_at,
    ...payload
  } = invoice;

  const { data, error } = await supabase
    .from("invoice_requests")
    .upsert(payload, {
      onConflict: "order_id",
    })
    .select()
    .single();

  if (error) throw error;

  return data;
}