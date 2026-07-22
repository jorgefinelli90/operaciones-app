"use client";

import { useEffect, useState } from "react";
import {
  Clock3,
  Circle,
  MessageSquare,
} from "lucide-react";

import {
  getEvents,
  type OrderCaseEvent,
} from "@/lib/cases/repository";

interface Props {
  caseId: number;
}

function formatAction(action: string) {
  return action
    .replaceAll("_", " ")
    .toLowerCase()
    .replace(/\b\w/g, (l) => l.toUpperCase());
}

function formatStatus(status: string | null) {
  if (!status) return "-";

  return status
    .replaceAll("_", " ")
    .toLowerCase()
    .replace(/\b\w/g, (l) => l.toUpperCase());
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

      {events.map((event, index) => (
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
                {formatAction(event.action)}
              </div>

              <div className="flex items-center gap-1 text-xs text-neutral-500">

                <Clock3 size={14} />

                {new Date(
                  event.created_at,
                ).toLocaleString("es-AR")}

              </div>

            </div>

            {(event.from_status ||
              event.to_status) && (
              <div className="mt-2 text-sm text-neutral-600">

                <strong>
                  Estado:
                </strong>{" "}

                {formatStatus(
                  event.from_status,
                )}

                {" → "}

                {formatStatus(
                  event.to_status,
                )}

              </div>
            )}

            {event.payload && (
              <div className="mt-3 rounded bg-card p-3">

                <div className="mb-2 flex items-center gap-2 text-xs font-medium text-neutral-500">

                  <MessageSquare size={14} />

                  Payload

                </div>

                <pre className="overflow-x-auto text-xs">
                  {JSON.stringify(
                    event.payload,
                    null,
                    2,
                  )}
                </pre>

              </div>
            )}

          </div>

        </div>
      ))}

    </div>
  );
}
