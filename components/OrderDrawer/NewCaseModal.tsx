"use client";

import { useState } from "react";

import { createCase } from "@/lib/cases/repository";
import type { CaseType } from "@/lib/cases/types";

interface Props {
  open: boolean;
  onClose: () => void;
  onCreated: () => void;

  orderId: string;
  orderItemId: number;
}

export function NewCaseModal({
  open,
  onClose,
  onCreated,
  orderId,
  orderItemId,
}: Props) {
  const [loading, setLoading] = useState(false);

  const [type, setType] = useState<CaseType>("NO_STOCK");

  const [title, setTitle] = useState("");

  const [description, setDescription] = useState("");

  if (!open) return null;

  async function handleSave() {
    try {
      setLoading(true);

      await createCase({
        orderId,
        orderItemId,

        type,

        title,

        description,
      });

      setTitle("");
      setDescription("");
      setType("NO_STOCK");

      onCreated();
      onClose();
    } catch (err) {
      console.error(err);
      alert("No se pudo crear el caso.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">

      <div className="w-full max-w-lg rounded-xl bg-white p-6">

        <h2 className="mb-5 text-lg font-semibold">
          Nuevo caso
        </h2>

        <div className="space-y-4">

          <div>

            <label className="mb-1 block text-sm font-medium">
              Tipo
            </label>

            <select
              value={type}
              onChange={(e) =>
                setType(e.target.value as CaseType)
              }
              className="w-full rounded border px-3 py-2"
            >
              <option value="NO_STOCK">
                Sin stock
              </option>

              <option value="CHANGE">
                Cambio
              </option>

            </select>

          </div>

          <div>

            <label className="mb-1 block text-sm font-medium">
              Título
            </label>

            <input
              value={title}
              onChange={(e) =>
                setTitle(e.target.value)
              }
              className="w-full rounded border px-3 py-2"
            />

          </div>

          <div>

            <label className="mb-1 block text-sm font-medium">
              Descripción
            </label>

            <textarea
              rows={4}
              value={description}
              onChange={(e) =>
                setDescription(e.target.value)
              }
              className="w-full rounded border px-3 py-2"
            />

          </div>

        </div>

        <div className="mt-6 flex justify-end gap-2">

          <button
            onClick={onClose}
            className="rounded border px-4 py-2"
          >
            Cancelar
          </button>

          <button
            disabled={loading}
            onClick={handleSave}
            className="rounded bg-black px-4 py-2 text-white disabled:opacity-50"
          >
            {loading ? "Guardando..." : "Crear"}
          </button>

        </div>

      </div>

    </div>
  );
}