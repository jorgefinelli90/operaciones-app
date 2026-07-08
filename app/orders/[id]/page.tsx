import { getOrder } from "@/lib/orders/getOrder";

interface Props {
  params: Promise<{
    id: string;
  }>;
}

function Info({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="flex justify-between gap-6 border-b border-border pb-2">
      <span className="text-sm text-muted-foreground">
        {label}
      </span>

      <span className="text-sm font-medium text-right">
        {value}
      </span>
    </div>
  );
}
export default async function OrderDetailPage({ params }: Props) {
  const { id } = await params;

  const order = await getOrder(id);

  if (!order) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold">Pedido no encontrado</h1>
      </div>
    );
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">
        Pedido {order.id}
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

  <section className="rounded-lg border border-border bg-card p-6">
    <h2 className="mb-4 text-lg font-semibold">Información general</h2>

    <div className="space-y-3">
      <Info label="Pedido" value={order.id} />
      <Info label="Estado" value={order.warehouse_status} />
      <Info label="Estado Magento" value={order.magento_status} />
      <Info label="Fecha" value={order.purchase_date} />
      <Info
        label="Total"
        value={new Intl.NumberFormat("es-AR", {
          style: "currency",
          currency: "ARS",
        }).format(order.grand_total)}
      />
    </div>
  </section>

  <section className="rounded-lg border border-border bg-card p-6">
    <h2 className="mb-4 text-lg font-semibold">Cliente</h2>

    <div className="space-y-3">
      <Info label="Nombre" value={order.customer_name} />
      <Info label="Mail" value={order.customer_email} />
      <Info label="Teléfono" value="-" />
    </div>
  </section>

  <section className="rounded-lg border border-border bg-card p-6">
    <h2 className="mb-4 text-lg font-semibold">Entrega</h2>

    <div className="space-y-3">
      <Info label="Método" value={order.shipping_method} />
      <Info label="Dirección" value={order.delivery_address} />
      <Info label="Ciudad" value={order.delivery_city} />
      <Info label="Provincia" value={order.delivery_province} />
    </div>
  </section>

  <section className="rounded-lg border border-border bg-card p-6">
    <h2 className="mb-4 text-lg font-semibold">Operación</h2>

    <div className="space-y-3">
      <Info label="Tracking" value={order.tracking_number ?? "-"} />
      <Info label="Courier" value={order.shipping_method} />
      <Info label="Responsable" value="-" />
      <Info label="Observaciones" value="-" />
    </div>
  </section>

</div>
    </div>
  );
}