export interface OrderImport {
  id: string;

  purchaseDate: string | null;

  customerFirstname: string;
  customerLastname: string;
  customerPhone: string;
  customerEmail: string;

  deliveryCity: string;
  deliveryProvince: string;

  // NUEVO
  shippingMethod: string;
  shippingDescription: string;

  paymentMethod: string;
  paymentOwner: string;
  paymentType: string;
  paymentReference: string;

  magentoStatus: string;
  warehouseStatus: string;

  grandTotal: number;

  trackingNumber: string | null;

  billingRequested: boolean;
  billingBusinessName: string;
  billingCuit: string;
}

export interface Order {
  id: string;

  purchase_date: string;
  customer_name: string;
  shipping_method: string;
  shippingDescription: string;
  delivery_address: string;
  customer_firstname: string;
  customer_lastname: string;
  customer_phone: string;
  customer_email: string;

  delivery_city: string;
  delivery_province: string;

  payment_method: string;
  payment_cc_owner: string;
  payment_cc_type: string;
  payment_reference: string;
  payment_additional_information: string;

  magento_status: string;
  warehouse_status: string;

  grand_total: number;

  tracking_number: string | null;

  billing_requested: boolean;
  billing_business_name: string;
  billing_cuit: string;

  imported_at: string;
  created_at: string;
  updated_at: string;
}
