"use client";

import { useEffect, useState } from "react";

import { toast } from "sonner";

import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { InvoiceStatusBadge } from "@/components/ui/InvoiceStatusBadge";

import { getInvoiceRequest } from "@/lib/invoices/getInvoiceRequest";
import { saveInvoiceRequest } from "@/lib/invoices/saveInvoiceRequest";

import type { InvoiceRequest } from "@/lib/invoices/types/invoice";

interface InvoiceFormProps {
  orderId: string;
}

export function InvoiceForm({
  orderId,
}: InvoiceFormProps) {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [status, setStatus] = useState<string>();

  const [requested, setRequested] = useState(false);

  const [cuit, setCuit] = useState("");

  const [businessName, setBusinessName] = useState("");

  const [taxAddress, setTaxAddress] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const invoice = await getInvoiceRequest(orderId);

        if (invoice) {
          setRequested(invoice.requested);
          setStatus(invoice.status);
          setCuit(invoice.cuit ?? "");
          setBusinessName(invoice.business_name ?? "");
          setTaxAddress(invoice.tax_address ?? "");
        }
      } catch (err: any) {
        console.error(err);

        toast.error(
          "No se pudo cargar la solicitud de Factura A."
        );
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [orderId]);

  async function handleSave() {
    if (requested) {
      if (!cuit.trim()) {
        toast.warning("Ingrese el CUIT.");
        return;
      }

      const clean = cuit.replace(/\D/g, "");

      if (clean.length !== 11) {
        toast.warning("El CUIT no es válido.");
        return;
      }

      if (!businessName.trim()) {
        toast.warning("Ingrese la Razón Social.");
        return;
      }

      if (!taxAddress.trim()) {
        toast.warning("Ingrese el Domicilio Fiscal.");
        return;
      }
    }

    try {
      setSaving(true);

      const invoice: InvoiceRequest = {
        order_id: orderId,
        requested,
        cuit,
        business_name: businessName,
        tax_address: taxAddress,
        status: requested ? "pending" : "",
      };

      await saveInvoiceRequest(invoice);

      if (requested) {
        setStatus("pending");
      } else {
        setStatus(undefined);
      }

      toast.success("Solicitud guardada.");
    } catch (err) {
      console.error(err);

      toast.error("No se pudo guardar.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="border-t border-border pt-6 text-sm text-muted-foreground">
        Cargando facturación...
      </div>
    );
  }

  return (
    <div className="mt-8 border-t border-border pt-6">

      <div className="flex items-center justify-between gap-4">

        <div>

          <h3 className="text-lg font-semibold">
            Facturación
          </h3>

          <p className="mt-1 text-sm text-muted-foreground">
            Datos fiscales del cliente.
          </p>

        </div>

        {requested && (
          <InvoiceStatusBadge status={status} />
        )}

      </div>

      <div className="mt-6 rounded-lg border border-border/50 bg-muted/20 p-4 transition-colors hover:bg-muted/30">

        <label className="flex cursor-pointer items-center justify-between gap-4">

          <div className="flex-1">

            <div className="font-medium text-foreground">
              Solicita Factura A
            </div>

            <div className="mt-1 text-sm text-muted-foreground">
              Si está activado, se solicitarán los datos fiscales.
            </div>

          </div>

          <input
            type="checkbox"
            checked={requested}
            onChange={(e) =>
              setRequested(e.target.checked)
            }
            className="h-5 w-5 cursor-pointer accent-primary"
          />

        </label>

      </div>

      {requested && (

        <div className="mt-6 rounded-lg border border-border/50 bg-muted/10 p-6 transition-all">

          <div className="grid gap-6 md:grid-cols-2">

            <div>

              <label className="mb-3 block text-sm font-medium text-foreground">
                CUIT
              </label>

              <input
                value={cuit}
                onChange={(e) =>
                  setCuit(e.target.value)
                }
                placeholder="30-12345678-9"
                className="w-full rounded-lg border border-border/50 bg-background px-4 py-2 text-sm transition-colors placeholder:text-muted-foreground/50 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/20"
              />

            </div>

            <div>

              <label className="mb-3 block text-sm font-medium text-foreground">
                Razón Social
              </label>

              <input
                value={businessName}
                onChange={(e) =>
                  setBusinessName(
                    e.target.value,
                  )
                }
                className="w-full rounded-lg border border-border/50 bg-background px-4 py-2 text-sm transition-colors placeholder:text-muted-foreground/50 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/20"
              />

            </div>

          </div>

          <div className="mt-6">

            <label className="mb-3 block text-sm font-medium text-foreground">
              Domicilio Fiscal
            </label>

            <textarea
              rows={3}
              value={taxAddress}
              onChange={(e) =>
                setTaxAddress(
                  e.target.value,
                )
              }
              className="w-full rounded-lg border border-border/50 bg-background px-4 py-2 text-sm transition-colors placeholder:text-muted-foreground/50 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/20"
            />

          </div>

          <div className="mt-6 flex justify-end">

            <PrimaryButton
              onClick={handleSave}
              disabled={saving}
            >
              {saving
                ? "Guardando..."
                : "Guardar cambios"}
            </PrimaryButton>

          </div>

        </div>

      )}

    </div>
  );
}
