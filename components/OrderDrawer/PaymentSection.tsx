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

export function PaymentSection({
  order,
}: PaymentSectionProps) {
  if (!order) return null;

  return (
    <SectionCard>

      <SectionTitle
        icon="💳"
        title="Pago"
      />

      <div className="mt-6 grid grid-cols-2 gap-x-6 gap-y-6">

        <Field
          label="Medio de Pago"
          value={translatePayment(
            order.payment_method,
          )}
        />

        <Field
          label="Estado Magento"
          value={translateMagentoStatus(
            order.magento_status,
          )}
        />

        <div className="col-span-2 rounded-lg border border-border/50 bg-gradient-to-br from-primary/5 to-primary/10 p-2 shadow-sm">

          <div className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            Total del pedido
          </div>

          <div className="mt-1 text-xl font-bold text-foreground">
            {formatCurrency(
              order.grand_total,
            )}
          </div>

        </div>

        <div className="col-span-2 grid grid-cols-3 gap-6">

          {order.payment_reference && (
            <Field
              label="Cuotas"
              value={
                order.payment_reference
              }
            />
          )}

          <Field
            label="Titular"
            value={
              order.payment_cc_owner
            }
          />

          <Field
            label="Tipo"
            value={
              order.payment_cc_type
            }
          />

        </div>

      </div>

      {order.payment_additional_information &&
        order.payment_additional_information !== "-" && (
          <div className="mt-6 rounded-lg border border-border/50 bg-muted/30 p-4">

            <Field
              label="Información adicional"
              value={
                order.payment_additional_information
              }
            />

          </div>
        )}

      <InvoiceForm
        orderId={order.id}
      />

    </SectionCard>
  );
}
