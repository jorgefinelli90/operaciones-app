"use client";

import type { InvoiceRequestRow } from "@/lib/invoices/getInvoiceRequests";

interface Props {
  row: InvoiceRequestRow;
  onOpen: (orderId: string) => void;
}

function paymentStatusLabel(status: InvoiceRequestRow["payment_status"]) {
  switch (status) {
    case "PENDING_AMOUNT":
      return "Pendiente importe";

    case "SEND_PAYMENT_LINK":
      return "Enviar link";

    case "PAYMENT_LINK_SENT":
      return "Link enviado";

    case "PAID":
      return "Pago realizado";

    case "NO_PAYMENT":
      return "No requiere pago";

    case "ERROR":
      return "Error";

    default:
      return "-";
  }
}

function paymentStatusColor(status: InvoiceRequestRow["payment_status"]) {
  switch (status) {
    case "PAID":
      return "bg-green-100 text-green-700";

    case "PAYMENT_LINK_SENT":
      return "bg-blue-100 text-blue-700";

    case "SEND_PAYMENT_LINK":
      return "bg-yellow-100 text-yellow-700";

    case "NO_PAYMENT":
      return "bg-gray-100 text-gray-700";

    case "ERROR":
      return "bg-red-100 text-red-700";

    default:
      return "bg-orange-100 text-orange-700";
  }
}

export function InvoiceARow({
  row,
  onOpen,
}: Props) {
  return (
    <tr
      onClick={() => onOpen(row.order_id)}
      className="cursor-pointer border-b transition-colors hover:bg-secondary/40"
    >
      <td className="px-4 py-3 font-semibold text-primary">
        {row.order_id}
      </td>

      <td className="px-4 py-3">
        <div>
          <p className="font-medium">
            {row.orders
              ? `${row.orders.customer_firstname} ${row.orders.customer_lastname}`
              : "-"}
          </p>

          <p className="text-xs text-muted-foreground">
            {row.orders?.customer_email}
          </p>
        </div>
      </td>

      <td className="px-4 py-3">
        {row.business_name || "-"}
      </td>

      <td className="px-4 py-3 font-mono">
        {row.cuit || "-"}
      </td>

      <td className="px-4 py-3">
        <span
          className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${paymentStatusColor(
            row.payment_status,
          )}`}
        >
          {paymentStatusLabel(row.payment_status)}
        </span>
      </td>
    </tr>
  );
}