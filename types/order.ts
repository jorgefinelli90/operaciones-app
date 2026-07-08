export interface Order {
  id: string;
  purchase_date: string;
  customer_name: string;
  customer_email: string;
  shipping_method: string;
  payment_method: string;
  magento_status: string;
  warehouse_status: string;
  tracking_number: string | null;
  grand_total: number;
  delivery_address: string;
  delivery_city: string;
  delivery_province: string;
  created_at: string;
  updated_at: string;
}
