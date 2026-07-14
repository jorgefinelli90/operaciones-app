"use client";

interface OrdersToolbarProps {
  showCSVUploader: boolean;
  onToggleCSVUploader: () => void;
}

export function OrdersToolbar({
  showCSVUploader,
  onToggleCSVUploader,
}: OrdersToolbarProps) {
  return (
    <div className="mb-6 flex items-center justify-between">

      <div>
        <h1 className="text-3xl font-bold text-foreground">
          Pedidos
        </h1>

        <p className="mt-1 text-muted-foreground">
          Gestiona y realiza el seguimiento de todos los pedidos
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