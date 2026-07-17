"use client";

import { useEffect, useState } from "react";

import type { Order } from "@/types/orders";

import { Field } from "@/components/ui/Field";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { SectionCard } from "@/components/ui/SectionCard";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { TimelineStatus } from "@/components/ui/TimelineStatus";
import { updateWarehouseStatus } from "@/lib/orders/updateWarehouseStatus";

interface ShippingSectionProps {
  order: Order | null;
  onWarehouseStatusUpdated: (orderId: string, newStatus: string) => void;
}

const warehouseStatuses = [
  "Pendiente",
  "Picking",
  "Embalado",
  "Facturado",
  "Despachado",
  "En PickUp",
  "Entregado",
];

export function ShippingSection({
  order,
  onWarehouseStatusUpdated,
}: ShippingSectionProps) {
  const [status, setStatus] = useState(order?.warehouse_status ?? "Pendiente");

  useEffect(() => {
    setStatus(order?.warehouse_status ?? "Pendiente");
  }, [order?.warehouse_status]);

  const shippingDescription = (order?.shippingDescription ?? "").toLowerCase();
  const isPickup = shippingDescription.startsWith("amt - retiro en tienda");

  const steps = isPickup
    ? [
        { id: "Pendiente", label: "Pend." },
        { id: "Picking", label: "Picking" },
        { id: "Embalado", label: "Embalado" },
        { id: "Facturado", label: "Facturado" },
        { id: "Despachado", label: "Despachado" },
        { id: "En PickUp", label: "En PickUp" },
        { id: "Entregado", label: "Entregado" },
      ]
    : [
        { id: "Pendiente", label: "Pend." },
        { id: "Picking", label: "Picking" },
        { id: "Embalado", label: "Embalado" },
        { id: "Facturado", label: "Facturado" },
        { id: "Despachado", label: "Despachado" },
        { id: "Entregado", label: "Entregado" },
      ];

  if (!order) return null;

  const handleSave = async () => {
    try {
      await updateWarehouseStatus(order.id, status);
      onWarehouseStatusUpdated(order.id, status);
      alert("Estado actualizado correctamente.");
    } catch (error) {
      console.error(error);
      alert("Error al actualizar el estado.");
    }
  };


  return (
    <SectionCard>
      <SectionTitle icon="📦" title="Envío" />

      <div className="space-y-5">
        <Field label="Descripción" value={order.shippingDescription || "-"} />

        <Field label="Dirección" value={order.delivery_address || "-"} />

        <div className="grid grid-cols-2 gap-5">
          <Field label="Ciudad" value={order.delivery_city || "-"} />

          <Field label="Provincia" value={order.delivery_province || "-"} />
        </div>

        <TimelineStatus value={status} steps={steps} onChange={setStatus} />

        <PrimaryButton onClick={handleSave}>Guardar Estado</PrimaryButton>
      </div>
    </SectionCard>
  );
}
