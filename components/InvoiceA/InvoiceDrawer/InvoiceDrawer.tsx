"use client";

import { useEffect, useState } from "react";

import { Drawer } from "@/components/ui/Drawer";
import { InvoiceForm } from "@/components/OrderDrawer/InvoiceForm";

import { Header } from "./Header";
import { PaymentSection } from "./PaymentSection";

import { getInvoiceRequest } from "@/lib/invoices/getInvoiceRequest";
import type { InvoiceRequest } from "@/lib/invoices/types/invoice";

interface Props {
  open: boolean;
  orderId: string | null;
  onClose: () => void;
}

export function InvoiceDrawer({
  open,
  orderId,
  onClose,
}: Props) {
  const [invoice, setInvoice] =
    useState<InvoiceRequest | null>(null);

  const [loading, setLoading] =
    useState(true);

  async function loadInvoice() {
    if (!orderId) return;

    try {
      setLoading(true);

      const data =
        await getInvoiceRequest(orderId);

      setInvoice(data);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (open) {
      loadInvoice();
    }
  }, [open, orderId]);

  return (
    <Drawer
      open={open}
      onClose={onClose}
      title="Factura A"
      size="xl"
    >
      {!orderId ? null : (
        <div className="space-y-6 p-6">

          <Header
            orderId={orderId}
            invoice={invoice}
          />

          {loading ? (
            <div className="rounded-xl border p-6 text-sm text-muted-foreground">
              Cargando solicitud...
            </div>
          ) : invoice ? (
            <>
              <PaymentSection
                invoice={invoice}
                onUpdated={loadInvoice}
              />

              <InvoiceForm
                orderId={orderId}
              />
            </>
          ) : (
            <div className="rounded-xl border border-dashed p-6 text-sm text-muted-foreground">
              No existe una solicitud para este pedido.
            </div>
          )}

        </div>
      )}
    </Drawer>
  );
}
