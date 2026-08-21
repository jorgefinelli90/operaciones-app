"use client";

import { useState } from "react";

import { ChevronDown } from "lucide-react";

import { AssigneeSelect } from "./AssigneeSelect";

interface Props {
  loading: boolean;
  onSubmit: (
    payload: Record<string, unknown>,
  ) => Promise<void>;
}

const STORES = [
  {
    id: "arcos",
    name: "Arcos",
  },
  {
    id: "gurruchaga",
    name: "Gurruchaga",
  },
  {
    id: "alcorta",
    name: "Alcorta",
  },
  {
    id: "unicenter",
    name: "Unicenter",
  },
  {
    id: "mar-del-plata",
    name: "Mar del Plata",
  },
];

export function RequestStoreForm({
  loading,
  onSubmit,
}: Props) {
  const [storeId, setStoreId] =
    useState("");

  const [assignedTo, setAssignedTo] =
    useState("");

  const [comment, setComment] =
    useState("");

  const [storesOpen, setStoresOpen] =
    useState(false);

  const selectedStore =
    STORES.find(
      (store) =>
        store.id === storeId,
    );

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    if (!storeId || !assignedTo) {
      return;
    }

    await onSubmit({
      storeId,
      assignedTo,
      comment: comment.trim(),
    });
  }

  function handleSelectStore(
    id: string,
  ) {
    setStoreId(id);
    setStoresOpen(false);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4"
    >
      {/* SUCURSAL */}

      <div className="relative">
        <label className="mb-2 block text-xs font-medium uppercase tracking-wide text-muted-foreground">
          Sucursal
          <span className="ml-1 text-destructive">
            *
          </span>
        </label>

        <button
          type="button"
          disabled={loading}
          onClick={() =>
            setStoresOpen(
              (current) => !current,
            )
          }
          className="flex w-full items-center justify-between rounded-lg border border-border bg-background px-3 py-2.5 text-left text-sm transition hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50"
        >
          <span
            className={
              selectedStore
                ? "text-foreground"
                : "text-muted-foreground"
            }
          >
            {selectedStore
              ? selectedStore.name
              : "Seleccionar sucursal"}
          </span>

          <ChevronDown
            size={16}
            className={`transition-transform ${
              storesOpen
                ? "rotate-180"
                : ""
            }`}
          />
        </button>

        {storesOpen && (
          <div className="absolute left-0 right-0 top-full z-[100] mt-1 overflow-hidden rounded-lg border border-border bg-background shadow-2xl">
            {STORES.map((store) => {
              const isSelected =
                store.id === storeId;

              return (
                <button
                  key={store.id}
                  type="button"
                  onClick={() =>
                    handleSelectStore(
                      store.id,
                    )
                  }
                  className={`block w-full px-3 py-2.5 text-left text-sm transition hover:bg-muted ${
                    isSelected
                      ? "bg-muted font-medium"
                      : ""
                  }`}
                >
                  {store.name}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* RESPONSABLE */}

      <AssigneeSelect
        role="DEPOT"
        value={assignedTo}
        onChange={setAssignedTo}
        loading={loading}
        required
      />

      {/* COMENTARIO */}

      <div>
        <label
          htmlFor="request-store-comment"
          className="mb-2 block text-xs font-medium uppercase tracking-wide text-muted-foreground"
        >
          Comentario
          <span className="ml-1 normal-case font-normal">
            (opcional)
          </span>
        </label>

        <textarea
          id="request-store-comment"
          value={comment}
          disabled={loading}
          onChange={(event) =>
            setComment(
              event.target.value,
            )
          }
          placeholder="Ej.: Buscar talle 42 y confirmar disponibilidad."
          rows={3}
          className="w-full resize-none rounded-lg border border-border bg-background px-3 py-2.5 text-sm outline-none transition focus:border-primary disabled:cursor-not-allowed disabled:opacity-50"
        />
      </div>

      {/* BOTÓN */}

      <div className="flex justify-end border-t border-border pt-4">
        <button
          type="submit"
          disabled={
            loading ||
            !storeId ||
            !assignedTo
          }
          className="inline-flex h-10 items-center rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading
            ? "Enviando..."
            : "Solicitar"}
        </button>
      </div>
    </form>
  );
}