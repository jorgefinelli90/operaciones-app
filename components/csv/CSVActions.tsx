"use client";

import { Loader2, Upload, X } from "lucide-react";

interface CSVActionsProps {
  loading: boolean;
  onUpload: () => void;
  onCancel: () => void;
}

export function CSVActions({
  loading,
  onUpload,
  onCancel,
}: CSVActionsProps) {
  return (
    <div className="flex items-center justify-end gap-3 rounded-xl border border-border bg-card p-4">

      <button
        type="button"
        onClick={onCancel}
        disabled={loading}
        className="
          inline-flex
          items-center
          gap-2
          rounded-lg
          border
          border-border
          px-4
          py-2
          text-sm
          font-medium
          transition
          hover:bg-secondary
          disabled:cursor-not-allowed
          disabled:opacity-50
        "
      >
        <X className="h-4 w-4" />
        Cancelar
      </button>

      <button
        type="button"
        onClick={onUpload}
        disabled={loading}
        className="
          inline-flex
          items-center
          gap-2
          rounded-lg
          bg-primary
          px-5
          py-2
          text-sm
          font-medium
          text-primary-foreground
          transition
          hover:bg-primary/90
          disabled:cursor-not-allowed
          disabled:opacity-60
        "
      >
        {loading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Importando...
          </>
        ) : (
          <>
            <Upload className="h-4 w-4" />
            UPLOAD
          </>
        )}
      </button>

    </div>
  );
}