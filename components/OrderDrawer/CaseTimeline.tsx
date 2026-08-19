"use client";

import { useEffect, useState } from "react";

import {
  CheckCircle2,
  Circle,
  Clock3,
  ExternalLink,
  FileText,
  MessageSquare,
  PackageCheck,
  RefreshCcw,
  UserRound,
} from "lucide-react";

import {
  getEvents,
  type OrderCaseEvent,
} from "@/lib/cases/repository";

import { EVENT_LABELS } from "@/lib/cases/eventLabels";
import { STATUS_LABELS } from "@/lib/cases/statusLabels";

import type {
  CaseAction,
  CaseEventAction,
  CaseStatus,
} from "@/lib/cases/types";

interface Props {
  caseId: number;
}

function getEventIcon(
  action: CaseAction | CaseEventAction,
) {
  const actionName = String(action);

  switch (actionName) {
    case "CASE_CREATED":
      return Circle;

    case "STATUS_CHANGED":
      return RefreshCcw;

    case "PRIORITY_CHANGED":
      return RefreshCcw;

    case "ASSIGNMENT_CHANGED":
      return UserRound;

    case "PRODUCT_RESERVED":
    case "PRODUCT_SHIPPED":
      return PackageCheck;

    case "COMMENT_ADDED":
      return MessageSquare;

    case "DOCUMENT_ADDED":
      return FileText;

    case "CASE_RESOLVED":
      return CheckCircle2;

    default:
      return Circle;
  }
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat(
    "es-AR",
    {
      dateStyle: "short",
      timeStyle: "short",
    },
  ).format(new Date(value));
}

function formatDocumentDate(
  value: string,
) {
  if (!value) {
    return "-";
  }

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

function formatAmount(
  value: number,
) {
  return new Intl.NumberFormat(
    "es-AR",
    {
      style: "currency",
      currency: "ARS",
    },
  ).format(value);
}

function getEventLabel(
  action: CaseAction | CaseEventAction,
) {
  const labels: Record<
    string,
    string
  > = {
    CASE_CREATED:
      "Caso creado",

    STATUS_CHANGED:
      "Estado cambiado",

    PRIORITY_CHANGED:
      "Prioridad cambiada",

    ASSIGNMENT_CHANGED:
      "Asignación cambiada",

    COMMENT_ADDED:
      "Comentario agregado",

    PRODUCT_RESERVED:
      "Producto reservado",

    PRODUCT_SHIPPED:
      "Producto despachado",

    DOCUMENT_ADDED:
      "Comprobante cargado",

    CASE_RESOLVED:
      "Caso resuelto",
  };

  return (
    labels[action] ??
    EVENT_LABELS[action] ??
    action
      .replaceAll("_", " ")
      .toLowerCase()
      .replace(
        /^./,
        (char) =>
          char.toUpperCase(),
      )
  );
}

function getStatusLabel(
  status: string | null,
) {
  if (!status) {
    return null;
  }

  return (
    STATUS_LABELS[
      status as CaseStatus
    ] ??
    status.replaceAll(
      "_",
      " ",
    )
  );
}

export function CaseTimeline({
  caseId,
}: Props) {
  const [events, setEvents] =
    useState<OrderCaseEvent[]>([]);

  const [loading, setLoading] =
    useState(true);

  async function loadEvents() {
    try {
      setLoading(true);

      const data =
        await getEvents(caseId);

      setEvents(data);
    } catch (error) {
      console.error(
        "Error cargando historial:",
        error,
      );

      setEvents([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadEvents();
  }, [caseId]);

  if (loading) {
    return (
      <div className="flex items-center gap-2 py-4 text-sm text-muted-foreground">
        <Clock3
          size={15}
          className="animate-pulse"
        />

        Cargando historial...
      </div>
    );
  }

  if (!events.length) {
    return (
      <div className="rounded-lg border border-dashed p-4 text-sm text-muted-foreground">
        Todavía no hay movimientos registrados.
      </div>
    );
  }

  return (
    <div className="relative">
      {events.map(
        (event, index) => {
          const Icon =
            getEventIcon(
              event.action,
            );

          const fromStatus =
            getStatusLabel(
              event.from_status,
            );

          const toStatus =
            getStatusLabel(
              event.to_status,
            );

          const isLast =
            index ===
            events.length - 1;

          const action =
            String(
              event.action,
            );

          return (
            <div
              key={event.id}
              className="relative flex gap-3"
            >
              {/* LÍNEA */}

              {!isLast && (
                <div className="absolute left-[13px] top-7 bottom-0 w-px bg-border" />
              )}

              {/* ICONO */}

              <div className="relative z-10 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border bg-background text-muted-foreground">
                <Icon size={13} />
              </div>

              {/* EVENTO */}

              <div
                className={`min-w-0 flex-1 ${
                  isLast
                    ? "pb-0"
                    : "pb-5"
                }`}
              >
                <div className="rounded-lg border bg-card px-3 py-3">
                  {/* HEADER */}

                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="text-sm font-medium">
                        {getEventLabel(
                          event.action,
                        )}
                      </div>
                    </div>

                    <div className="flex shrink-0 items-center gap-1 text-[11px] text-muted-foreground">
                      <Clock3 size={12} />

                      {formatDate(
                        event.created_at,
                      )}
                    </div>
                  </div>

                  {/* CAMBIO DE ESTADO */}

                  {fromStatus &&
                    toStatus && (
                      <div className="mt-2 flex items-center gap-2 text-xs">
                        <span className="rounded-md bg-muted px-2 py-1">
                          {fromStatus}
                        </span>

                        <span className="text-muted-foreground">
                          →
                        </span>

                        <span className="rounded-md bg-muted px-2 py-1">
                          {toStatus}
                        </span>
                      </div>
                    )}

                  {/* COMENTARIO */}

                  {action ===
                    "COMMENT_ADDED" &&
                    typeof event
                      .payload
                      ?.comment ===
                      "string" && (
                      <div className="mt-3 rounded-lg bg-muted/60 p-3">
                        <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                          <MessageSquare
                            size={13}
                          />

                          Comentario
                        </div>

                        <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed">
                          {
                            event
                              .payload
                              .comment
                          }
                        </p>
                      </div>
                    )}

                  {/* COMPROBANTE */}

                  {action ===
                    "DOCUMENT_ADDED" && (
                    <DocumentEvent
                      payload={
                        event.payload
                      }
                    />
                  )}

                  {/* PAYLOAD GENERAL */}

                  {action !==
                    "DOCUMENT_ADDED" &&
                    event.payload &&
                    Object.keys(
                      event.payload,
                    ).length > 0 && (
                      <EventPayload
                        payload={
                          event.payload
                        }
                        action={action}
                      />
                    )}
                </div>
              </div>
            </div>
          );
        },
      )}
    </div>
  );
}

function DocumentEvent({
  payload,
}: {
  payload: Record<
    string,
    unknown
  >;
}) {
  const documentType =
    payload.documentType ===
    "CREDIT_NOTE"
      ? "NOTA DE CRÉDIT"
      : "FACTURA";

  const number =
    typeof payload.number ===
    "string"
      ? payload.number
      : "-";

  const url =
    typeof payload.documentUrl ===
    "string"
      ? payload.documentUrl
      : null;

  const amount =
    typeof payload.amount ===
    "number"
      ? payload.amount
      : typeof payload.amount ===
          "string"
        ? Number(
            payload.amount,
          )
        : null;

  const date =
    typeof payload.documentDate ===
    "string"
      ? payload.documentDate
      : null;

  const reason =
    typeof payload.reason ===
    "string"
      ? payload.reason
      : null;

  const comment =
    typeof payload.comment ===
    "string"
      ? payload.comment
      : null;

  const isCreditNote =
    payload.documentType ===
    "CREDIT_NOTE";

  return (
    <div
      className={`mt-3 rounded-xl border p-4 ${
        isCreditNote
          ? "border-orange-900/60 bg-orange-950/20"
          : "border-blue-900/60 bg-blue-950/20"
      }`}
    >
      {/* CABECERA */}

      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <FileText
            size={15}
            className={
              isCreditNote
                ? "text-orange-400"
                : "text-blue-400"
            }
          />

          <span className="text-xs font-semibold tracking-wide">
            {documentType}
          </span>
        </div>

        {url && (
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-md border border-border bg-background px-2.5 py-1.5 text-xs font-medium transition hover:bg-secondary"
          >
            Ver comprobante

            <ExternalLink
              size={12}
            />
          </a>
        )}
      </div>

      {/* INFORMACIÓN */}

      <div className="mt-4 grid grid-cols-2 gap-x-6 gap-y-3">
        <div>
          <div className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
            Número
          </div>

          <div className="mt-1 font-mono text-sm font-semibold">
            {number}
          </div>
        </div>

        {date && (
          <div>
            <div className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
              Fecha
            </div>

            <div className="mt-1 text-sm">
              {formatDocumentDate(
                date,
              )}
            </div>
          </div>
        )}

        {amount !== null &&
          Number.isFinite(
            amount,
          ) && (
            <div>
              <div className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
                Importe
              </div>

              <div className="mt-1 text-sm font-semibold">
                {formatAmount(
                  amount,
                )}
              </div>
            </div>
          )}

        {reason && (
          <div>
            <div className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
              Motivo
            </div>

            <div className="mt-1 text-sm">
              {reason}
            </div>
          </div>
        )}
      </div>

      {/* COMENTARIO */}

      {comment && (
        <div className="mt-4 border-t border-border/60 pt-3">
          <div className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
            Comentario
          </div>

          <p className="mt-1 whitespace-pre-wrap text-sm leading-relaxed">
            {comment}
          </p>
        </div>
      )}
    </div>
  );
}

function EventPayload({
  payload,
  action,
}: {
  payload: Record<
    string,
    unknown
  >;
  action: string;
}) {
  const entries =
    Object.entries(
      payload,
    ).filter(
      ([key, value]) => {
        if (
          value === null ||
          value === undefined
        ) {
          return false;
        }

        // El comentario ya tiene
        // su bloque visual propio.
        if (
          action ===
            "COMMENT_ADDED" &&
          key === "comment"
        ) {
          return false;
        }

        return true;
      },
    );

  if (!entries.length) {
    return null;
  }

  return (
    <div className="mt-2 space-y-1">
      {entries.map(
        ([key, value]) => (
          <div
            key={key}
            className="text-xs text-muted-foreground"
          >
            <span className="font-medium text-foreground">
              {formatPayloadKey(
                key,
              )}
              :
            </span>{" "}
            {formatPayloadValue(
              value,
            )}
          </div>
        ),
      )}
    </div>
  );
}

function formatPayloadKey(
  key: string,
) {
  const labels: Record<
    string,
    string
  > = {
    from: "Anterior",

    to: "Nuevo",

    priority:
      "Prioridad",

    assigned_to:
      "Asignado a",

    from_priority:
      "Prioridad anterior",

    to_priority:
      "Nueva prioridad",

    from_assignment:
      "Asignación anterior",

    to_assignment:
      "Nueva asignación",

    local_pickup:
      "Local",

    store:
      "Sucursal",

    sku:
      "SKU",

    replacement_sku:
      "SKU reemplazo",

    product_name:
      "Producto",

    comment:
      "Comentario",

    reason:
      "Motivo",
  };

  return (
    labels[key] ??
    key
      .replaceAll(
        "_",
        " ",
      )
      .replace(
        /^./,
        (char) =>
          char.toUpperCase(),
      )
  );
}

function formatPayloadValue(
  value: unknown,
) {
  const labels: Record<
    string,
    string
  > = {
    LOW: "Baja",

    NORMAL: "Normal",

    HIGH: "Alta",

    URGENT: "Urgente",

    OPEN: "Abierto",

    WAITING_STORE:
      "Esperando tienda",

    WAITING_CUSTOMER:
      "Esperando cliente",

    IN_PROGRESS:
      "En proceso",

    RESOLVED:
      "Resuelto",

    CANCELLED:
      "Cancelado",
  };

  if (
    typeof value ===
      "string" &&
    labels[value]
  ) {
    return labels[value];
  }

  if (
    typeof value ===
    "boolean"
  ) {
    return value
      ? "Sí"
      : "No";
  }

  if (
    typeof value ===
      "object" &&
    value !== null
  ) {
    return JSON.stringify(
      value,
    );
  }

  return String(value);
}