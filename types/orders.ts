export interface OrderImport {
  id: string;

  purchaseDate: string | null;

  customerFirstname: string;
  customerLastname: string;
  customerPhone: string;
  customerEmail: string;

  deliveryCity: string;
  deliveryProvince: string;

  paymentMethod: string;
  paymentOwner: string;
  paymentType: string;
  paymentReference: string;
  paymentAdditionalInformation: string;

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
  customer_email: string;
  shipping_method: string;
  delivery_address: string;
  delivery_city: string;
  delivery_province: string;
  warehouse_status: string;
  magento_status: string;
  grand_total: number;
  tracking_number: string | null;
}
