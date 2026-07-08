export type { Order } from "@/types/order";

export interface OrderImport {
  id: string;
  purchaseDate: string | null;
  customerName: string;
  customerEmail: string;
  shippingMethod: string;
  paymentMethod: string;
  magentoStatus: string;
  warehouseStatus: string;
  trackingNumber: string | null;
  grandTotal: number;
}
