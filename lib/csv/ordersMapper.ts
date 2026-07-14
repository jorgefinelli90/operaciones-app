import type { OrderImport } from "@/types/orders";
import { parsePurchaseDate } from "@/lib/utils/date";

function parseCurrency(value: string): number {
  if (!value) return 0;

  return parseFloat(value.replace(/,/g, "").trim());
}

const STATUS_MAP: Record<string, string> = {
  processing: "PROCESSING",
  complete: "DESPACHADO",
  pickedup: "RETIRADO",
  readytopickup: "LISTO PARA RETIRAR",
  canceled: "CANCELADO",
  approved_clearsale: "APROBADO CLEARSALE",
  analyzing_clearsale: "EN REVISIÓN CLEARSALE",
  fraud: "FRAUDE",
  pending: "PENDIENTE DE PAGO",
  holded: "RETENIDO",
  denied_clearsale: "RECHAZADO CLEARSALE",
  closed: "CERRADO",
};

function getWarehouseStatus(status: string) {
  return STATUS_MAP[status.toLowerCase()] ?? status;
}

export function mapOrders(
  rows: Record<string, string>[]
): OrderImport[] {
  const orders = new Map<string, OrderImport>();

  for (const row of rows) {
    const id = row["increment_id"]?.trim();

    if (!id) continue;

    if (orders.has(id)) {
      continue;
    }

    const magentoStatus =
      row["sales_order_grid.status"]?.trim() || "";

    orders.set(id, {
      id,

      purchaseDate: parsePurchaseDate(
        row["created_at"] || ""
      ),

      customerFirstname:
        row["sales_order_shipping_address.firstname"]?.trim() || "",

      customerLastname:
        row["sales_order_shipping_address.lastname"]?.trim() || "",

      customerPhone:
        row["sales_order_shipping_address.telephone"]?.trim() || "",

      customerEmail:
        row["sales_order_shipping_address.email"]?.trim() || "",

      deliveryCity:
        row["sales_order_shipping_address.city"]?.trim() || "",

      deliveryProvince:
        row["sales_order_shipping_address.region"]?.trim() || "",

      paymentMethod:
        row["sales_order_payment.method"]?.trim() || "",

      paymentOwner:
        row["sales_order_payment.cc_owner"]?.trim() || "",

      paymentType:
        row["sales_order_payment.cc_type"]?.trim() || "",

      paymentReference:
        row["sales_order_payment.po_number"]?.trim() || "",

      paymentAdditionalInformation:
        row["sales_order_payment.additional_information"]?.trim() || "",

      magentoStatus,

      warehouseStatus:
        getWarehouseStatus(magentoStatus),

      grandTotal: parseCurrency(
        row["sales_order_grid.grand_total"] || "0"
      ),

      trackingNumber: null,

      billingRequested: false,
      billingBusinessName: "",
      billingCuit: "",
    });
  }

  return [...orders.values()];
}