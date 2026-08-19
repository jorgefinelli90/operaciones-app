"use client";

import { useEffect, useState } from "react";

import {
  ExternalLink,
  FileText,
  Loader2,
  Plus,
  X,
} from "lucide-react";

import { toast } from "sonner";

import {
  createOrderDocument,
  getCaseDocuments,
} from "@/lib/documents/repository";

import type {
  OrderDocument,
  OrderDocumentType,
} from "@/lib/documents/types";

import type { OrderCase } from "@/lib/cases/repository";

interface Props {
  item: OrderCase;
}

const DOCUMENT_TYPE_LABELS: Record<
  OrderDocumentType,
  string
> = {
  INVOICE: "Factura",
  CREDIT_NOTE: "Nota de crédito",
};

const DOCUMENT_TYPE_COLORS: Record<
  OrderDocumentType,
  string
> = {
  INVOICE:
    "border-blue-800 bg-blue-950/30 text-blue-300",

  CREDIT_NOTE:
    "border-orange-800 bg-orange-950/30 text-orange-300",
};

const REASONS = [
  "Cambio de producto",
  "Falta de stock",
  "Devolución",
  "Reclamo",
  "Error de facturación",
  "Otro",
];

function formatAmount(
  amount: number,
) {
  return new Intl.NumberFormat(
    "es-AR",
    {
      style: "currency",
      currency: "ARS",
    },
  ).format(amount);
}

function formatDate(
  value: string,
) {
  if (!value) return "-";

  return new Intl.DateTimeFormat(
    "es-AR",
    {
      dateStyle: "short",
    },
  ).format(
    new Date(
      `${value}T12:00:00`,
    ),
  );
}

export function CaseDocumentsSection({
  item,
}: Props) {
  const [documents, setDocuments] =
    useState<OrderDocument[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [formOpen, setFormOpen] =
    useState(false);

  const [saving, setSaving] =
    useState(false);

  const [type, setType] =
    useState<OrderDocumentType>(
      "CREDIT_NOTE",
    );

  const [number, setNumber] =
    useState("");

  const [documentUrl, setDocumentUrl] =
    useState("");

  const [documentDate, setDocumentDate] =
    useState(
      new Date()
        .toISOString()
        .slice(0, 10),
    );

  const [amount, setAmount] =
    useState("");

  const [reason, setReason] =
    useState("");

  const [comment, setComment] =
    useState("");

  async function loadDocuments() {
    try {
      setLoading(true);

      const data =
        await getCaseDocuments(
          item.id,
        );

      setDocuments(data);
    } catch (error) {
      console.error(
        "Error cargando comprobantes:",
        error,
      );

      toast.error(
        "No se pudieron cargar los comprobantes.",
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadDocuments();
  }, [item.id]);

  function resetForm() {
    setType("CREDIT_NOTE");
    setNumber("");
    setDocumentUrl("");

    setDocumentDate(
      new Date()
        .toISOString()
        .slice(0, 10),
    );

    setAmount("");
    setReason("");
    setComment("");
  }

  function handleCancel() {
    setFormOpen(false);
    resetForm();
  }

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    const cleanNumber =
      number.trim();

    const cleanUrl =
      documentUrl.trim();

    const parsedAmount =
      Number(
        amount.replace(",", "."),
      );

    if (!cleanNumber) {
      toast.error(
        "Ingresá el número del comprobante.",
      );

      return;
    }

    if (!cleanUrl) {
      toast.error(
        "Ingresá la URL del comprobante.",
      );

      return;
    }

    try {
      new URL(cleanUrl);
    } catch {
      toast.error(
        "La URL ingresada no es válida.",
      );

      return;
    }

    if (!documentDate) {
      toast.error(
        "Seleccioná la fecha del comprobante.",
      );

      return;
    }

    if (
      !Number.isFinite(
        parsedAmount,
      ) ||
      parsedAmount < 0
    ) {
      toast.error(
        "Ingresá un importe válido.",
      );

      return;
    }

    if (!reason) {
      toast.error(
        "Seleccioná el motivo.",
      );

      return;
    }

    if (
      reason === "Otro" &&
      !comment.trim()
    ) {
      toast.error(
        "Indicá el motivo en el comentario.",
      );

      return;
    }

    try {
      setSaving(true);

      await createOrderDocument({
        orderId:
          item.order_id,

        caseId:
          item.id,

        orderItemId:
          item.order_item_id,

        type,

        number:
          cleanNumber,

        documentUrl:
          cleanUrl,

        documentDate,

        amount:
          parsedAmount,

        reason,

        comment:
          comment.trim() ||
          null,
      });

      toast.success(
        `${DOCUMENT_TYPE_LABELS[type]} cargada correctamente.`,
      );

      handleCancel();

      await loadDocuments();
    } catch (error) {
      console.error(
        "Error guardando comprobante:",
        error,
      );

      toast.error(
        error instanceof Error
          ? error.message
          : "No se pudo guardar el comprobante.",
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="rounded-xl border border-border bg-card p-5">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <h3 className="font-semibold">
            Comprobantes
          </h3>

          <p className="mt-1 text-xs text-muted-foreground">
            Facturas y notas de crédito relacionadas con este caso.
          </p>
        </div>

        {!formOpen && (
          <button
            type="button"
            onClick={() =>
              setFormOpen(true)
            }
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-3 py-2 text-sm font-medium text-primary-foreground transition hover:bg-primary/90"
          >
            <Plus size={15} />

            Cargar comprobante
          </button>
        )}
      </div>

      {formOpen && (
        <form
          onSubmit={handleSubmit}
          className="mb-5 space-y-4 rounded-xl border border-border bg-background p-4"
        >
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">
                Nuevo comprobante
              </h4>

              <p className="mt-1 text-xs text-muted-foreground">
                El comprobante quedará asociado al pedido, caso y producto.
              </p>
            </div>

            <button
              type="button"
              onClick={handleCancel}
              className="rounded-lg p-2 text-muted-foreground transition hover:bg-secondary hover:text-foreground"
              aria-label="Cerrar formulario"
            >
              <X size={16} />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <label className="space-y-1.5">
              <span className="text-xs font-medium text-muted-foreground">
                Tipo
              </span>

              <select
                value={type}
                onChange={(event) =>
                  setType(
                    event.target.value as OrderDocumentType,
                  )
                }
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
              >
                <option value="CREDIT_NOTE">
                  Nota de crédito
                </option>

                <option value="INVOICE">
                  Factura
                </option>
              </select>
            </label>

            <label className="space-y-1.5">
              <span className="text-xs font-medium text-muted-foreground">
                Número de comprobante
              </span>

              <input
                value={number}
                onChange={(event) =>
                  setNumber(
                    event.target.value,
                  )
                }
                placeholder="Ej. 0024-00093180"
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
                required
              />
            </label>
          </div>

          <label className="block space-y-1.5">
            <span className="text-xs font-medium text-muted-foreground">
              URL del comprobante
            </span>

            <input
              type="url"
              value={documentUrl}
              onChange={(event) =>
                setDocumentUrl(
                  event.target.value,
                )
              }
              placeholder="https://burgues.stockinteligente.com/..."
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
              required
            />

            <span className="block text-[11px] text-muted-foreground">
              Pegá la URL completa que abre la factura o nota de crédito.
            </span>
          </label>

          <div className="grid grid-cols-2 gap-4">
            <label className="space-y-1.5">
              <span className="text-xs font-medium text-muted-foreground">
                Fecha
              </span>

              <input
                type="date"
                value={documentDate}
                onChange={(event) =>
                  setDocumentDate(
                    event.target.value,
                  )
                }
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
                required
              />
            </label>

            <label className="space-y-1.5">
              <span className="text-xs font-medium text-muted-foreground">
                Importe
              </span>

              <input
                type="text"
                inputMode="decimal"
                value={amount}
                onChange={(event) =>
                  setAmount(
                    event.target.value,
                  )
                }
                placeholder="Ej. 89900"
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
                required
              />
            </label>
          </div>

          <label className="block space-y-1.5">
            <span className="text-xs font-medium text-muted-foreground">
              Motivo
            </span>

            <select
              value={reason}
              onChange={(event) =>
                setReason(
                  event.target.value,
                )
              }
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
              required
            >
              <option value="">
                Seleccionar motivo
              </option>

              {REASONS.map(
                (reasonOption) => (
                  <option
                    key={reasonOption}
                    value={reasonOption}
                  >
                    {reasonOption}
                  </option>
                ),
              )}
            </select>
          </label>

          <label className="block space-y-1.5">
            <span className="text-xs font-medium text-muted-foreground">
              Comentario
            </span>

            <textarea
              value={comment}
              onChange={(event) =>
                setComment(
                  event.target.value,
                )
              }
              placeholder="Agregar información adicional..."
              rows={3}
              className="w-full resize-none rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
            />
          </label>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={handleCancel}
              disabled={saving}
              className="rounded-lg border border-border px-4 py-2 text-sm font-medium transition hover:bg-secondary disabled:opacity-50"
            >
              Cancelar
            </button>

            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {saving && (
                <Loader2
                  size={15}
                  className="animate-spin"
                />
              )}

              {saving
                ? "Guardando..."
                : "Guardar comprobante"}
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <div className="flex items-center gap-2 py-4 text-sm text-muted-foreground">
          <Loader2
            size={15}
            className="animate-spin"
          />

          Cargando comprobantes...
        </div>
      ) : documents.length === 0 ? (
        <div className="rounded-lg border border-dashed border-border p-4 text-sm text-muted-foreground">
          Todavía no hay comprobantes cargados.
        </div>
      ) : (
        <div className="space-y-3">
          {documents.map(
            (document) => (
              <div
                key={document.id}
                className="rounded-xl border border-border bg-background p-4"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex min-w-0 items-start gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-secondary">
                      <FileText
                        size={17}
                      />
                    </div>

                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span
                          className={`rounded-full border px-2 py-0.5 text-[11px] font-medium ${DOCUMENT_TYPE_COLORS[document.type]}`}
                        >
                          {
                            DOCUMENT_TYPE_LABELS[
                              document.type
                            ]
                          }
                        </span>

                        <span className="font-mono text-sm font-semibold">
                          Nº{" "}
                          {
                            document.number
                          }
                        </span>
                      </div>

                      <div className="mt-2 grid grid-cols-2 gap-x-6 gap-y-1 text-xs text-muted-foreground">
                        <span>
                          Fecha:{" "}
                          <strong className="text-foreground">
                            {formatDate(
                              document.document_date,
                            )}
                          </strong>
                        </span>

                        <span>
                          Importe:{" "}
                          <strong className="text-foreground">
                            {formatAmount(
                              document.amount,
                            )}
                          </strong>
                        </span>
                      </div>

                      {document.reason && (
                        <p className="mt-2 text-xs text-muted-foreground">
                          Motivo:{" "}
                          <span className="text-foreground">
                            {
                              document.reason
                            }
                          </span>
                        </p>
                      )}

                      {document.comment && (
                        <p className="mt-1 whitespace-pre-wrap text-xs text-muted-foreground">
                          {
                            document.comment
                          }
                        </p>
                      )}
                    </div>
                  </div>

                  <a
                    href={
                      document.document_url
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-xs font-medium transition hover:bg-secondary"
                  >
                    Ver
                    <ExternalLink
                      size={13}
                    />
                  </a>
                </div>
              </div>
            ),
          )}
        </div>
      )}
    </section>
  );
}