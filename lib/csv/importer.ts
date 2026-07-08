import { supabase } from "@/lib/supabase/client";
import type { OrderImport } from "@/lib/types/orders";

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
      customer_name: order.customerName,
      customer_email: order.customerEmail,
      shipping_method: order.shippingMethod,
      payment_method: order.paymentMethod,
      magento_status: order.magentoStatus,
      warehouse_status: order.warehouseStatus,
      tracking_number: order.trackingNumber,
      grand_total: order.grandTotal,
      delivery_address: order.deliveryAddress,
      delivery_city: order.deliveryCity,
      delivery_province: order.deliveryProvince,
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
