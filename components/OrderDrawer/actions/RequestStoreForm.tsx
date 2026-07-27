"use client";

interface RequestStoreFormProps {
  loading: boolean;
  onSubmit: (payload: { storeId: string }) => Promise<void>;
}

export function RequestStoreForm({
  loading,
  onSubmit,
}: RequestStoreFormProps) {
  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const storeId = String(formData.get("storeId") ?? "").trim();

    if (!storeId) {
      alert("Debe seleccionar un local.");
      return;
    }

    await onSubmit({ storeId });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label
          htmlFor="storeId"
          className="mb-1 block text-sm font-medium"
        >
          Local o depósito
        </label>
        <input
          id="storeId"
          name="storeId"
          required
          disabled={loading}
          className="w-full rounded border border-border bg-background px-3 py-2"
          placeholder="Identificador del local"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="rounded bg-black px-4 py-2 text-white disabled:opacity-50"
      >
        {loading ? "Enviando..." : "Enviar solicitud"}
      </button>
    </form>
  );
}
