"use client";

import { useState } from "react";

import {
  saveInvoiceRequest,
} from "@/lib/invoices/saveInvoiceRequest";

import type {
  InvoiceRequest,
  PaymentStatus,
} from "@/lib/invoices/types/invoice";

interface Props {
  invoice: InvoiceRequest;
  onUpdated: () => void;
}

const PAYMENT_STATUS: {
  value: PaymentStatus;
  label: string;
}[] = [
  {
    value: "PENDING_AMOUNT",
    label: "Pendiente importe",
  },
  {
    value: "SEND_PAYMENT_LINK",
    label: "Enviar link de pago",
  },
  {
    value: "PAYMENT_LINK_SENT",
    label: "Link enviado al cliente",
  },
  {
    value: "PAID",
    label: "Pago realizado",
  },
  {
    value: "NO_PAYMENT",
    label: "No requiere pago",
  },
  {
    value: "ERROR",
    label: "Error",
  },
];

interface Props {
  invoice: InvoiceRequest;
  onUpdated: () => void;
}

export function PaymentSection({
  invoice,
  onUpdated,
}: Props) {
  const [amount, setAmount] = useState<string>(
    invoice.payment_amount?.toString() ?? "",
  );

  const [status, setStatus] =
    useState<PaymentStatus>(
      invoice.payment_status ??
        "PENDING_AMOUNT",
    );

  const [saving, setSaving] =
    useState(false);

  async function handleSave() {
    try {
      setSaving(true);

      await saveInvoiceRequest({
        ...invoice,

        payment_amount:
          amount === ""
            ? null
            : Number(amount),

        payment_status: status,
      });

      onUpdated();
    } catch (e: any) {
  console.error("ERROR COMPLETO:", e);

  if (e?.message) {
    console.error("MESSAGE:", e.message);
  }

  if (e?.details) {
    console.error("DETAILS:", e.details);
  }

  if (e?.hint) {
    console.error("HINT:", e.hint);
  }

  if (e?.code) {
    console.error("CODE:", e.code);
  }

    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="rounded-xl border bg-card p-6">

      <h3 className="text-lg font-semibold">
        Pago adicional
      </h3>

      <div className="mt-5 grid grid-cols-2 gap-5">

        <div>

          <label className="mb-2 block text-sm font-medium">
            Importe
          </label>

          <input
            type="number"
            value={amount}
            onChange={(e) =>
              setAmount(e.target.value)
            }
            placeholder="0"
            className="w-full rounded-lg border bg-background px-3 py-2"
          />

        </div>

        <div>

          <label className="mb-2 block text-sm font-medium">
            Estado del pago
          </label>

          <select
            value={status}
            onChange={(e) =>
              setStatus(
                e.target
                  .value as PaymentStatus,
              )
            }
            className="w-full rounded-lg border bg-background px-3 py-2"
          >
            {PAYMENT_STATUS.map(
              (option) => (
                <option
                  key={option.value}
                  value={option.value}
                >
                  {option.label}
                </option>
              ),
            )}
          </select>

        </div>

      </div>

      <div className="mt-6 flex justify-end">

        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="rounded-lg bg-primary px-5 py-2 text-sm font-medium text-primary-foreground transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {saving
            ? "Guardando..."
            : "Guardar"}
        </button>

      </div>

    </div>
  );
}