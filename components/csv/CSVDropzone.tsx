"use client";

import { useState } from "react";
import { Upload } from "lucide-react";

interface CSVDropzoneProps {
  onFileSelected: (file: File) => void;
}

export function CSVDropzone({
  onFileSelected,
}: CSVDropzoneProps) {
  const [dragging, setDragging] = useState(false);

  function handleDrop(
    e: React.DragEvent<HTMLDivElement>,
  ) {
    e.preventDefault();
    setDragging(false);

    const file = e.dataTransfer.files[0];

    if (!file) return;

    onFileSelected(file);
  }

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement>,
  ) {
    const file = e.target.files?.[0];

    if (!file) return;

    onFileSelected(file);
  }

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={handleDrop}
      className={`
        rounded-xl
        border-2
        border-dashed
        p-10
        transition-all

        ${
          dragging
            ? "border-primary bg-primary/5"
            : "border-border"
        }
      `}
    >
      <div className="flex flex-col items-center gap-4">

        <Upload className="h-10 w-10 text-primary" />

        <div className="text-center">

          <h3 className="font-semibold text-lg">
            Importar pedidos
          </h3>

          <p className="text-sm text-muted-foreground mt-1">
            Arrastrá el CSV aquí o seleccioná un archivo.
          </p>

        </div>

        <input
          id="csv-file"
          type="file"
          accept=".csv"
          className="hidden"
          onChange={handleChange}
        />

        <label
          htmlFor="csv-file"
          className="
            cursor-pointer
            rounded-lg
            bg-primary
            px-5
            py-2.5
            text-sm
            font-medium
            text-primary-foreground
            hover:bg-primary/90
            transition
          "
        >
          Seleccionar archivo
        </label>

      </div>
    </div>
  );
}