"use client";

import { useState } from "react";

interface Props {
  loading: boolean;
  onSubmit: (payload: {
    sku: string;
    observations: string;
  }) => Promise<void>;
}

export function AlternativeForm({
  loading,
  onSubmit,
}: Props) {
  const [sku, setSku] = useState("");
  const [observations, setObservations] =
    useState("");

  async function handleSubmit(
    e: React.FormEvent,
  ) {
    e.preventDefault();

    if (!sku.trim()) {
      alert("Ingresá un SKU");
      return;
    }

    await onSubmit({
      sku: sku.trim().toUpperCase(),
      observations,
    });
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4"
    >
      <div>
        <label className="block text-sm font-medium mb-1">
          SKU alternativo
        </label>

        <input
          autoFocus
          value={sku}
          onChange={(e) =>
            setSku(e.target.value)
          }
          className="w-full rounded border px-3 py-2"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">
          Observaciones
        </label>

        <textarea
          rows={3}
          value={observations}
          onChange={(e) =>
            setObservations(e.target.value)
          }
          className="w-full rounded border px-3 py-2"
        />
      </div>

      <button
        disabled={loading}
        className="rounded bg-black px-4 py-2 text-white disabled:opacity-50"
      >
        Guardar
      </button>
    </form>
  );
}