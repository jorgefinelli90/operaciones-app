"use client";

interface OrdersToolbarProps {
  title: string;
  subtitle: string;
  showCSVUploader: boolean;
  onToggleCSVUploader: () => void;
}

export function OrdersToolbar({
  title,
  subtitle,
  showCSVUploader,
  onToggleCSVUploader,
}: OrdersToolbarProps) {
  return (
    <div className="mb-6 flex items-center justify-between">

      <div>
        <h1 className="text-3xl font-bold text-foreground">
          {title}
        </h1>

        <p className="mt-1 text-muted-foreground">
          {subtitle}
        </p>
      </div>

      <button
        onClick={onToggleCSVUploader}
        className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
      >
        {showCSVUploader ? "Cancelar" : "Cargar CSV"}
      </button>

    </div>
  );
}
