interface StatusBadgeProps {
  status?: string | null;
}

const STATUS_MAP: Record<
  string,
  {
    label: string;
    className: string;
  }
> = {
  pending: {
    label: "Pendiente",
    className: "bg-yellow-100 text-yellow-800",
  },

  processing: {
    label: "En preparación",
    className: "bg-blue-100 text-blue-800",
  },

  complete: {
    label: "Completado",
    className: "bg-green-100 text-green-800",
  },

  canceled: {
    label: "Cancelado",
    className: "bg-red-100 text-red-800",
  },

  closed: {
    label: "Cerrado",
    className: "bg-gray-200 text-gray-800",
  },

  holded: {
    label: "En espera",
    className: "bg-orange-100 text-orange-800",
  },

  fraud: {
    label: "Fraude",
    className: "bg-red-200 text-red-900",
  },
};

export function StatusBadge({
  status,
}: StatusBadgeProps) {
  const badge = STATUS_MAP[status ?? ""];

  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${
        badge?.className ??
        "bg-gray-100 text-gray-700"
      }`}
    >
      {badge?.label ?? status ?? "-"}
    </span>
  );
}