import { supabase } from "@/lib/supabase/client";
import type { InvoiceRequest } from "@/lib/invoices/types/invoice";

export async function saveInvoiceRequest(
  invoice: InvoiceRequest,
) {
  console.log("Invoice a guardar:", invoice);

  const result = await supabase
    .from("invoice_requests")
    .upsert(invoice, {
      onConflict: "order_id",
    })
    .select();

  console.log("Resultado completo:", result);

  if (result.error) {
    throw result.error;
  }

  return result.data;
}