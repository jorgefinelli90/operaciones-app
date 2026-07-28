"use client";

import { useEffect, useState } from "react";

import {
  getComments,
  addComment,
  type OrderCaseComment,
} from "@/lib/cases/repository";

interface Props {
  caseId: number;
}

export function CaseComments({ caseId }: Props) {
  const [comments, setComments] = useState<OrderCaseComment[]>([]);

  const [text, setText] = useState("");

  const [loading, setLoading] = useState(true);

  async function load() {
    try {
      const data = await getComments(caseId);
      setComments(data);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, [caseId]);

  async function handleSend() {
    if (!text.trim()) return;

    await addComment({
      caseId,
      comment: text,
    });

    setText("");
    load();
  }

  return (
    <div>
      <h3 className="mb-5 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
        Comentarios
      </h3>

      <div className="space-y-5">
        {loading && (
          <div className="text-sm text-muted-foreground">Cargando...</div>
        )}

        {!loading &&
          comments.map((comment) => (
            <div key={comment.id} className="border-b pb-4 last:border-b-0">
              <div className="mb-2 flex items-center justify-between">
                <div className="font-medium">{comment.created_by}</div>

                <div className="text-xs text-muted-foreground">
                  {new Date(comment.created_at).toLocaleString("es-AR", {
                    day: "2-digit",
                    month: "2-digit",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
              </div>

              <div className="whitespace-pre-wrap text-sm leading-6">
                {comment.comment}
              </div>
            </div>
          ))}
      </div>

      <div className="mt-6">
        <textarea
          rows={3}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Agregar comentario..."
          className="w-full rounded-lg border p-3 text-sm"
        />

        <div className="mt-3 flex justify-end">
          <button
            onClick={handleSend}
            className="rounded-lg bg-black px-4 py-2 text-sm font-medium text-white transition hover:opacity-90"
          >
            Enviar comentario
          </button>
        </div>
      </div>
    </div>
  );
}
