"use client";

import { useState } from "react";

import { Field } from "@/components/ui/Field";
import { PrimaryButton } from "@/components/ui/PrimaryButton";

interface InvoiceFormProps {
  initialRequested?: boolean;
  initialCuit?: string;
  initialBusinessName?: string;
  initialTaxAddress?: string;
}

export function InvoiceForm({
  initialRequested = false,
  initialCuit = "",
  initialBusinessName = "",
  initialTaxAddress = "",
}: InvoiceFormProps) {
  const [requested, setRequested] = useState(initialRequested);

  const [cuit, setCuit] = useState(initialCuit);

  const [businessName, setBusinessName] =
    useState(initialBusinessName);

  const [taxAddress, setTaxAddress] =
    useState(initialTaxAddress);

  return (
    <div className="border-t border-border pt-5 space-y-5">

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
            onClick={() =>
              alert("Todavía no implementado")
            }
          >
            Guardar Solicitud
          </PrimaryButton>
        </>
      )}

    </div>
  );
}