interface InvoiceStatusBadgeProps {
  status?: string;
}

export function InvoiceStatusBadge({
  status,
}: InvoiceStatusBadgeProps) {
  switch (status) {
    case "pending":
      return (
        <span className="rounded-full bg-yellow-100 px-3 py-1 text-xs font-semibold text-yellow-700">
          Pendiente
        </span>
      );

    case "approved":
      return (
        <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
          Facturada
        </span>
      );

    case "rejected":
      return (
        <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-700">
          Rechazada
        </span>
      );

    default:
      return (
        <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-600">
          Sin Solicitud
        </span>
      );
  }
}
