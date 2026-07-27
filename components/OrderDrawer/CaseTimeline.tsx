"use client";

import { useEffect, useState } from "react";
import {
  Clock3,
  Circle,
} from "lucide-react";

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
  const [events, setEvents] = useState<OrderCaseEvent[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    try {
      setLoading(true);

      const data = await getEvents(caseId);

      setEvents(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, [caseId]);

  if (loading) {
    return (
      <div className="rounded-lg border p-5 text-sm text-neutral-500">
        Cargando historial...
      </div>
    );
  }

  if (!events.length) {
    return (
      <div className="rounded-lg border border-dashed p-5 text-sm text-neutral-500">
        Todavía no hay eventos registrados.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {events.map((event, index) => {
        const fromStatus = event.from_status as CaseStatus | null;
        const toStatus = event.to_status as CaseStatus | null;

        return (
          <div
            key={event.id}
            className="flex gap-4"
          >
            <div className="flex flex-col items-center">
              <Circle
                size={12}
                className="mt-1 fill-current"
              />

              {index !== events.length - 1 && (
                <div className="mt-2 h-full w-px bg-neutral-300" />
              )}
            </div>

            <div className="flex-1 rounded-lg border bg-[#262626] p-4">

              <div className="flex items-center justify-between">

                <div className="font-medium">
                  {EVENT_LABELS[event.action]}
                </div>

                <div className="flex items-center gap-1 text-xs text-neutral-500">
                  <Clock3 size={14} />

                  {new Date(
                    event.created_at,
                  ).toLocaleString("es-AR")}
                </div>

              </div>

              {fromStatus && toStatus && (
                <div className="mt-2 text-sm text-neutral-500">

                  <strong>
                    Estado:
                  </strong>{" "}

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
  );
}