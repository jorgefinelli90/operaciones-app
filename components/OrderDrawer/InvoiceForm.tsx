"use client";

import { useEffect, useState } from "react";

import { getInvoiceRequest } from "@/lib/invoices/getInvoiceRequest";
import { saveInvoiceRequest } from "@/lib/invoices/saveInvoiceRequest";
import type { InvoiceRequest } from "@/lib/invoices/types/invoice";

import { InvoiceStatusBadge } from "@/components/ui/InvoiceStatusBadge";
import { PrimaryButton } from "@/components/ui/PrimaryButton";

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

  const [businessName, setBusinessName] =
    useState("");

  const [taxAddress, setTaxAddress] =
    useState("");

  useEffect(() => {
    async function load() {
      try {
        const invoice =
          await getInvoiceRequest(orderId);

        if (invoice) {
          setRequested(invoice.requested);

          setStatus(invoice.status);

          setCuit(invoice.cuit ?? "");

          setBusinessName(
            invoice.business_name ?? "",
          );

          setTaxAddress(
            invoice.tax_address ?? "",
          );
        }
      }  catch (err: any) {
  console.error("ERROR COMPLETO:");
  console.error(err);

  console.error("message:", err?.message);
  console.error("details:", err?.details);
  console.error("hint:", err?.hint);
  console.error("code:", err?.code);

  alert("No se pudo guardar.");
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [orderId]);

  async function handleSave() {
    if (requested) {
      if (!cuit.trim()) {
        alert("Ingrese el CUIT");
        return;
      }

      const clean = cuit.replace(/\D/g, "");

      if (clean.length !== 11) {
        alert("CUIT inválido");
        return;
      }

      if (!businessName.trim()) {
        alert("Ingrese la Razón Social");
        return;
      }

      if (!taxAddress.trim()) {
        alert("Ingrese el Domicilio Fiscal");
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

        status: "pending",
      };

      await saveInvoiceRequest(invoice);

      setStatus("pending");

      alert("Solicitud guardada correctamente");
    } catch (err) {
      console.error(JSON.stringify(err, null, 2));
console.error(err);

      alert("No se pudo guardar.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="border-t border-border pt-5">
        Cargando...
      </div>
    );
  }

  return (
    <div className="border-t border-border pt-5 space-y-5">

      <div className="flex items-center justify-between">

        <span className="font-semibold">
          Facturación
        </span>

        <InvoiceStatusBadge
          status={status}
        />

      </div>

      <label className="flex items-center gap-3 cursor-pointer">

        <input
          type="checkbox"
          checked={requested}
          onChange={(e) =>
            setRequested(e.target.checked)
          }
        />

        <span className="font-medium">
          Solicita Factura A
        </span>

      </label>

      {requested && (
        <>
          <div>
            <label className="mb-2 block text-sm font-medium">
              CUIT
            </label>

            <input
              value={cuit}
              onChange={(e) =>
                setCuit(e.target.value)
              }
              placeholder="30-12345678-9"
              className="w-full rounded-lg border border-border bg-background px-3 py-2"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              Razón Social
            </label>

            <input
              value={businessName}
              onChange={(e) =>
                setBusinessName(e.target.value)
              }
              placeholder="Empresa S.A."
              className="w-full rounded-lg border border-border bg-background px-3 py-2"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              Domicilio Fiscal
            </label>

            <textarea
              rows={3}
              value={taxAddress}
              onChange={(e) =>
                setTaxAddress(e.target.value)
              }
              className="w-full rounded-lg border border-border bg-background px-3 py-2"
            />
          </div>

          <PrimaryButton
            onClick={handleSave}
            disabled={saving}
          >
            {saving
              ? "Guardando..."
              : "Guardar Solicitud"}
          </PrimaryButton>
        </>
      )}
    </div>
  );
}