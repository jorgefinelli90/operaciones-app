import type { Order } from "@/types/orders";

import { Field } from "@/components/ui/Field";
import { SectionCard } from "@/components/ui/SectionCard";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { StatusBadge } from "@/components/ui/StatusBadge";

interface CustomerSectionProps {
  order: Order | null;
}

function formatDate(date: string | null | undefined) {
  if (!date) return "-";

  const d = new Date(date);

  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();

  const hours = String(d.getHours()).padStart(2, "0");
  const minutes = String(d.getMinutes()).padStart(2, "0");

  return `${day}-${month}-${year} ${hours}:${minutes}`;
}

export function CustomerSection({
  order,
}: CustomerSectionProps) {
  if (!order) return null;

  return (
    <SectionCard>
      <SectionTitle
        icon="👤"
        title="Informacion de Cliente"
      />

      <div className="space-y-6">

        <div className="grid grid-cols-2 gap-6">

          <Field
            label="Pedido"
            value={order.id}
          />

          <Field
            label="Fecha de compra"
            value={formatDate(order.purchase_date)}
          />

        </div>

        <div className="grid grid-cols-2 gap-6">

          <Field
            label="Nombre"
            value={`${order.customer_firstname} ${order.customer_lastname}`}
          />

          <Field
            label="Email"
            value={order.customer_email}
          />

          <Field
            label="Teléfono"
            value={order.customer_phone}
          />

          <Field
            label="Estado"
            value={
              <StatusBadge
                status={order.warehouse_status}
              />
            }
          />

        </div>

        

      </div>
    </SectionCard>
  );
}
