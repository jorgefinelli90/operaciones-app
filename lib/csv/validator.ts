export const REQUIRED_COLUMNS = [
  "increment_id",
  "created_at",

  "sales_order_item.product_type",
  "sales_order_item.sku",
  "sales_order_item.name",
  "sales_order_item.qty_ordered",
  "sales_order_item.price",

  "sales_order_grid.status",
  "sales_order_grid.grand_total",

  "sales_order_shipping_address.firstname",
  "sales_order_shipping_address.lastname",
  "sales_order_shipping_address.telephone",
  "sales_order_shipping_address.email",
  "sales_order_shipping_address.city",
  "sales_order_shipping_address.region",

  "sales_order_payment.method",
  "sales_order_payment.cc_owner",
  "sales_order_payment.cc_type",
  "sales_order_payment.po_number",
  "sales_order_payment.additional_information",
];

export interface ValidationResult {
  valid: boolean;
  missingColumns: string[];
}

export function validateCSV(
  rows: Record<string, string>[]
): ValidationResult {
  if (rows.length === 0) {
    return {
      valid: false,
      missingColumns: ["El archivo está vacío"],
    };
  }

  const headers = Object.keys(rows[0]);

  const missingColumns = REQUIRED_COLUMNS.filter(
    (column) => !headers.includes(column)
  );

  return {
    valid: missingColumns.length === 0,
    missingColumns,
  };
}