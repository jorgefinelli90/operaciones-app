import type { Order } from "@/types/orders";

type OrderRow = Omit<Order, "shippingDescription"> & {
  shipping_description?: string;
  shippingDescription?: string;
};

export function mapOrderRow(row: OrderRow): Order {
  const { shipping_description, shippingDescription, ...rest } = row;

  return {
    ...rest,
    shippingDescription: shippingDescription ?? shipping_description ?? "",
  };
}
