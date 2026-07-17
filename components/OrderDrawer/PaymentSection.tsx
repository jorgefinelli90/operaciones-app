"use client";

import type { Order } from "@/types/orders";

import { Field } from "@/components/ui/Field";
import { SectionCard } from "@/components/ui/SectionCard";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { InvoiceForm } from "./InvoiceForm";
interface PaymentSectionProps {
  order: Order | null;
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    minimumFractionDigits: 2,
  }).format(value);
}

function translatePayment(method?: string) {
  if (!method) return "-";

  const payment = method.toLowerCase();

  if (payment.includes("mercadopago")) return "Mercado Pago";

  if (payment.includes("talopay")) return "TaloPay";

  if (payment.includes("bank")) return "Transferencia";

  return method;
}

function translateMagentoStatus(status?: string) {
  if (!status) return "-";

  switch (status.toLowerCase()) {
    case "pending":
      return "Pendiente";

    case "processing":
      return "Procesando";

    case "complete":
      return "Completado";

    case "closed":
      return "Cerrado";

    case "canceled":
      return "Cancelado";

    case "readytopickup":
      return "Listo para retirar";

    default:
      return status;
  }
}

export function PaymentSection({ order }: PaymentSectionProps) {
  if (!order) return null;

  return (
    <SectionCard>
      <SectionTitle icon="💳" title="Pago" />

      <div className="space-y-5">
        <Field
          label="Medio de Pago"
          value={translatePayment(order.payment_method)}
        />

        <Field label="Total" value={formatCurrency(order.grand_total)} />

        <Field
          label="Estado Magento"
          value={translateMagentoStatus(order.magento_status)}
        />
      </div>
      <InvoiceForm orderId={order.id} />
    </SectionCard>
  );
}
