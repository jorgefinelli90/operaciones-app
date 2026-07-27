import type { OrderItemInput } from "@/types/orderItem";
import type { OrderImport } from "@/types/orders";

import { supabase } from "@/lib/supabase/client";

export interface ImportOrdersWithItemsResult {
  inserted: number;
  itemsInserted: number;
}

export async function importOrdersWithItems(
  orders: OrderImport[],
  items: OrderItemInput[],
): Promise<ImportOrdersWithItemsResult> {
  const { data, error } = await supabase.rpc("import_orders_with_items", {
    p_orders: orders.map((order) => ({
      id: order.id,
      purchase_date: order.purchaseDate,
      customer_firstname: order.customerFirstname,
      customer_lastname: order.customerLastname,
      customer_name: order.customerName,
      customer_phone: order.customerPhone,
      customer_email: order.customerEmail,
      delivery_address: order.deliveryAddress,
      delivery_city: order.deliveryCity,
      delivery_province: order.deliveryProvince,
      payment_method: order.paymentMethod,
      payment_cc_owner: order.paymentOwner,
      payment_cc_type: order.paymentType,
      payment_reference: order.paymentReference,
      payment_additional_information: order.paymentAdditionalInformation,
      shipping_method: order.shippingMethod,
      shipping_description: order.shippingDescription,
      magento_status: order.magentoStatus,
      warehouse_status: order.warehouseStatus,
      grand_total: order.grandTotal,
      ...(order.trackingNumber !== undefined && {
        tracking_number: order.trackingNumber,
      }),
      ...(order.billingRequested !== undefined && {
        billing_requested: order.billingRequested,
      }),
      ...(order.billingBusinessName !== undefined && {
        billing_business_name: order.billingBusinessName,
      }),
      ...(order.billingCuit !== undefined && {
        billing_cuit: order.billingCuit,
      }),
    })),
    p_items: items.map((item) => ({
      order_id: item.orderId,
      sku: item.sku,
      product_name: item.productName,
      qty: item.qty,
      price: item.price,
      product_type: item.productType,
    })),
  });

  if (error) {
    throw new Error(
      `${error.code} - ${error.message} - ${error.details} - ${error.hint}`,
    );
  }

  return {
    inserted: Number(data?.orders ?? orders.length),
    itemsInserted: Number(data?.items ?? items.length),
  };
}
