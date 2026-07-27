"use client";

import { useEffect, useState } from "react";

import {
  addComment,
  getComments,
  type OrderCaseComment,
} from "@/lib/cases/repository";

interface Props {
  caseId: number;

  onCommentAdded?: () => void;
}

export function CaseComments({
  caseId,
  onCommentAdded,
}: Props) {
  const [comments, setComments] =
    useState<OrderCaseComment[]>([]);

  const [text, setText] = useState("");

  const [loading, setLoading] = useState(true);

  const [saving, setSaving] = useState(false);

  async function load() {
    try {
      setLoading(true);

      const data = await getComments(caseId);

      setComments(data);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, [caseId]);

  async function save() {
    if (!text.trim()) return;

    try {
      setSaving(true);

      await addComment({
        caseId,
        comment: text,
        createdBy: "jorge",
      });

      setText("");

      await load();

      onCommentAdded?.();
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-5">

      <div className="space-y-3">

        <textarea
          rows={4}
          value={text}
          onChange={(e) =>
            setText(e.target.value)
          }
          placeholder="Escribí un comentario interno..."
          className="w-full rounded-lg border bg-background p-3 text-sm"
        />

        <div className="flex justify-end">

          <button
            onClick={save}
            disabled={saving}
            className="rounded-lg bg-primary px-4 py-2 text-sm text-white disabled:opacity-50"
          >
            {saving
              ? "Guardando..."
              : "Guardar comentario"}
          </button>

        </div>

      </div>

      <div className="space-y-3">

        {loading && (
          <div className="text-sm text-neutral-500">
            Cargando comentarios...
          </div>
        )}

        {!loading &&
          comments.map((comment) => (
            <div
              key={comment.id}
              className="rounded-lg border p-4"
            >
              <div className="flex items-center justify-between">

                <strong>
                  {comment.created_by ??
                    "Sistema"}
                </strong>

                <span className="text-xs text-neutral-500">
                  {new Date(
                    comment.created_at,
                  ).toLocaleString("es-AR")}
                </span>

              </div>

              <p className="mt-2 whitespace-pre-wrap text-sm">
                {comment.comment}
              </p>

            </div>
          ))}

      </div>

    </div>
  );
}