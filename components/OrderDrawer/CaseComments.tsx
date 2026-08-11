"use client";

import { useEffect, useState } from "react";
import {
  Loader2,
  MessageSquare,
  Send,
} from "lucide-react";

import {
  addComment,
  getComments,
  type OrderCaseComment,
} from "@/lib/cases/repository";

interface Props {
  caseId: number;
}

export function CaseComments({
  caseId,
}: Props) {
  const [comments, setComments] =
    useState<OrderCaseComment[]>([]);

  const [comment, setComment] =
    useState("");

  const [loading, setLoading] =
    useState(true);

  const [sending, setSending] =
    useState(false);

  async function loadComments() {
    try {
      setLoading(true);

      const data =
        await getComments(caseId);

      setComments(data);
    } catch (error) {
      console.error(
        "Error cargando comentarios:",
        error,
      );

      setComments([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadComments();
  }, [caseId]);

  async function handleSubmit(
    event: React.FormEvent,
  ) {
    event.preventDefault();

    const value =
      comment.trim();

    if (!value || sending) {
      return;
    }

    try {
      setSending(true);

      const newComment =
        await addComment({
          caseId,
          comment: value,
          internal: true,
        });

      setComments((current) => [
        ...current,
        newComment,
      ]);

      setComment("");
    } catch (error) {
      console.error(
        "Error agregando comentario:",
        error,
      );
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="space-y-4">

      {/* LISTA */}

      {loading ? (
        <div className="flex items-center gap-2 py-4 text-sm text-muted-foreground">

          <Loader2
            size={15}
            className="animate-spin"
          />

          Cargando comentarios...

        </div>
      ) : comments.length === 0 ? (
        <div className="rounded-lg border border-dashed p-5 text-center">

          <MessageSquare
            size={20}
            className="mx-auto text-muted-foreground"
          />

          <p className="mt-2 text-sm text-muted-foreground">
            Todavía no hay comentarios.
          </p>

        </div>
      ) : (
        <div className="space-y-3">

          {comments.map((item) => (
            <div
              key={item.id}
              className="rounded-lg border bg-card p-4"
            >

              <div className="flex items-start justify-between gap-3">

                <div className="text-xs font-medium">
                  {item.created_by ||
                    "Usuario"}
                </div>

                <div className="text-[11px] text-muted-foreground">
                  {new Intl.DateTimeFormat(
                    "es-AR",
                    {
                      dateStyle: "short",
                      timeStyle: "short",
                    },
                  ).format(
                    new Date(
                      item.created_at,
                    ),
                  )}
                </div>

              </div>

              <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed">
                {item.comment}
              </p>

              {item.internal && (
                <div className="mt-3">

                  <span className="rounded-md bg-muted px-2 py-1 text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
                    Interno
                  </span>

                </div>
              )}

            </div>
          ))}

        </div>
      )}

      {/* NUEVO COMENTARIO */}

      <form
        onSubmit={handleSubmit}
        className="rounded-xl border bg-card p-3"
      >

        <textarea
          value={comment}
          onChange={(event) =>
            setComment(
              event.target.value,
            )
          }
          disabled={sending}
          placeholder="Escribí un comentario..."
          rows={3}
          className="w-full resize-none bg-transparent text-sm outline-none placeholder:text-muted-foreground"
        />

        <div className="mt-3 flex items-center justify-between border-t pt-3">

          <span className="text-xs text-muted-foreground">
            Comentario interno
          </span>

          <button
            type="submit"
            disabled={
              sending ||
              !comment.trim()
            }
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-3 py-2 text-sm font-medium text-primary-foreground transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          >

            {sending ? (
              <Loader2
                size={15}
                className="animate-spin"
              />
            ) : (
              <Send size={15} />
            )}

            {sending
              ? "Enviando..."
              : "Comentar"}

          </button>

        </div>

      </form>

    </div>
  );
}