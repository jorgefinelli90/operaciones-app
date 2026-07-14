"use client";

import { AlertCircle, X } from "lucide-react";

interface CSVErrorProps {
  message: string;
  onClose: () => void;
}

export function CSVError({
  message,
  onClose,
}: CSVErrorProps) {
  return (
    <div
      className="
        flex
        items-start
        justify-between
        gap-4
        rounded-xl
        border
        border-red-500/30
        bg-red-500/10
        p-4
      "
    >
      <div className="flex gap-3">

        <AlertCircle className="mt-0.5 h-5 w-5 text-red-500" />

        <div>

          <p className="font-semibold text-red-500">
            Error de importación
          </p>

          <p className="mt-1 text-sm text-muted-foreground">
            {message}
          </p>

        </div>

      </div>

      <button
        onClick={onClose}
        className="
          rounded-md
          p-1
          transition
          hover:bg-red-500/20
        "
      >
        <X className="h-4 w-4 text-red-500" />
      </button>
    </div>
  );
}