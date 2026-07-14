import { supabase } from "@/lib/supabase/client";
import type { OrderImport } from "@/types/orders";

export interface ImportResult {
  inserted: number;
  updated: number;
}

export async function importOrders(
  orders: OrderImport[],
): Promise<ImportResult> {
  const { error } = await supabase.from("orders").upsert(
    orders.map((order) => ({
      id: order.id,

      purchase_date: order.purchaseDate,

      customer_firstname: order.customerFirstname,
      customer_lastname: order.customerLastname,
      customer_phone: order.customerPhone,
      customer_email: order.customerEmail,

      delivery_city: order.deliveryCity,
      delivery_province: order.deliveryProvince,

      payment_method: order.paymentMethod,
      payment_cc_owner: order.paymentOwner,
      payment_cc_type: order.paymentType,
      payment_reference: order.paymentReference,
      payment_additional_information:
        order.paymentAdditionalInformation,

      magento_status: order.magentoStatus,
      warehouse_status: order.warehouseStatus,

      grand_total: order.grandTotal,

      tracking_number: order.trackingNumber,

      billing_requested: order.billingRequested,
      billing_business_name: order.billingBusinessName,
      billing_cuit: order.billingCuit,
    })),
    {
      onConflict: "id",
    },
  );

  if (error) {
    throw new Error(error.message);
  }

  return {
    inserted: orders.length,
    updated: 0,
  };
}