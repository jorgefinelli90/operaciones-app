"use client";

import { useEffect, useState } from "react";
import { Circle } from "lucide-react";

import { EVENT_LABELS } from "@/lib/cases/eventLabels";
import { STATUS_LABELS } from "@/lib/cases/statusLabels";

import type { CaseStatus } from "@/lib/cases/types";

import {
  getEvents,
  type OrderCaseEvent,
} from "@/lib/cases/repository";

interface Props {
  caseId: number;
}

export function CaseTimeline({
  caseId,
}: Props) {
  const [events, setEvents] =
    useState<OrderCaseEvent[]>([]);

  const [loading, setLoading] =
    useState(true);

  async function load() {
    try {
      const data =
        await getEvents(caseId);

      setEvents(data);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, [caseId]);

  if (loading) {
    return (
      <div className="text-sm text-muted-foreground">
        Cargando historial...
      </div>
    );
  }

  if (!events.length) {
    return (
      <div className="text-sm text-muted-foreground">
        No hay historial.
      </div>
    );
  }

  return (
    <div>

      <h3 className="mb-5 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
        Historial
      </h3>

      <div className="space-y-0">

        {events.map((event, index) => {

          const fromStatus =
            event.from_status as CaseStatus | null;

          const toStatus =
            event.to_status as CaseStatus | null;

          return (

            <div
              key={event.id}
              className="flex gap-4"
            >

              <div className="flex w-5 flex-col items-center">

                <Circle
                  size={10}
                  className="mt-1 fill-current"
                />

                {index !== events.length - 1 && (
                  <div className="mt-2 w-px flex-1 bg-border" />
                )}

              </div>

              <div className="flex-1 pb-6">

                <div className="flex items-center justify-between">

                  <div className="font-medium">

                    {EVENT_LABELS[event.action]}

                  </div>

                  <div className="text-xs text-muted-foreground">

                    {new Date(
                      event.created_at,
                    ).toLocaleString("es-AR", {
                      day: "2-digit",
                      month: "2-digit",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}

                  </div>

                </div>

                {fromStatus && toStatus && (

                  <div className="mt-1 text-sm text-muted-foreground">

                    {STATUS_LABELS[fromStatus]}

                    {" → "}

                    {STATUS_LABELS[toStatus]}

                  </div>

                )}

              </div>

            </div>

          );
        })}

      </div>

    </div>
  );
}