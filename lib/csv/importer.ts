import { supabase } from "@/lib/supabase/client";
import type { OrderImport } from "@/types/orders";

export interface ImportResult {
  inserted: number;
  updated: number;
}

export async function importOrders(
  orders: OrderImport[],
): Promise<ImportResult> {
  console.log("========== IMPORT ORDERS ==========");
  console.log("Cantidad:", orders.length);

  console.log(
    orders.slice(0, 5).map((o) => ({
      id: o.id,
      purchaseDate: o.purchaseDate,
      customerFirstname: o.customerFirstname,
      customerLastname: o.customerLastname,
    })),
  );

  const rows = orders.map((order) => ({
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
    shipping_method: order.shippingMethod,
    shipping_description: order.shippingDescription,
    magento_status: order.magentoStatus,
    warehouse_status: order.warehouseStatus,

    grand_total: order.grandTotal,

    tracking_number: order.trackingNumber,

    billing_requested: order.billingRequested,
    billing_business_name: order.billingBusinessName,
    billing_cuit: order.billingCuit,
  }));

  console.log("Primer registro a insertar:");
  console.log(rows[0]);

  const { error } = await supabase.from("orders").upsert(rows, {
    onConflict: "id",
  });

  if (error) {
    console.error("ERROR IMPORTANDO ORDERS");
    console.error(JSON.stringify(error, null, 2));
    throw new Error(error.message);
  }

  console.log("ORDERS IMPORTADOS CORRECTAMENTE");

  return {
    inserted: orders.length,
    updated: 0,
  };
}
