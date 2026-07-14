"use client";

import { useState } from "react";

import { parseCSV } from "@/lib/csv/parser";
import { validateCSV } from "@/lib/csv/validator";
import { mapOrders } from "@/lib/csv/ordersMapper";
import { mapOrderItems } from "@/lib/csv/orderItemsMapper";

import { importOrders } from "@/lib/csv/importer";
import { importOrderItems } from "@/lib/supabase/importOrderItems";

import type { OrderImport } from "@/types/orders";
import type { OrderItem } from "@/types/orderItem";

import { CSVDropzone } from "./CSVDropzone";
import { CSVPreview } from "./CSVPreview";
import { CSVActions } from "./CSVActions";
import { CSVError } from "./CSVError";

interface CSVUploaderProps {
  onImportFinished?: () => void;
}

export function CSVUploader({
  onImportFinished,
}: CSVUploaderProps) {
  const [orders, setOrders] = useState<OrderImport[]>([]);
  const [items, setItems] = useState<OrderItem[]>([]);

  const [fileName, setFileName] = useState("");

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState<string | null>(null);

  async function handleFile(file: File) {
    setError(null);

    try {
      console.log("========== CSV ==========");
      console.log("Archivo:", file.name);

      const rows = await parseCSV(file);
      console.log("ROWS", rows);

      const validation = validateCSV(rows);
      console.log("VALIDATION", validation);

      if (!validation.valid) {
        setError(
          `Faltan columnas obligatorias: ${validation.missingColumns.join(", ")}`
        );
        return;
      }

      const mappedOrders = mapOrders(rows);
      console.log("ORDERS", mappedOrders);

      const mappedItems = mapOrderItems(rows);
      console.log("ITEMS", mappedItems);

      setOrders(mappedOrders);
      setItems(mappedItems);
      setFileName(file.name);

      console.log("Preview generado correctamente.");
    } catch (err) {
      console.error("ERROR IMPORTANDO CSV");
      console.error(err);

      setError(
        err instanceof Error
          ? err.message
          : "Error procesando archivo."
      );
    }
  }

  async function handleUpload() {
    try {
      setLoading(true);

      console.log("Subiendo Orders...");
      await importOrders(orders);

      console.log("Subiendo OrderItems...");
      await importOrderItems(items);

      console.log("IMPORTACION FINALIZADA");

      alert(`✅ Importación finalizada

Pedidos: ${orders.length}

Productos: ${items.length}`);

      reset();

      onImportFinished?.();
    } catch (err) {
      console.error("ERROR SUBIENDO A SUPABASE");
      console.error(err);

      setError(
        err instanceof Error
          ? err.message
          : "Error subiendo información."
      );
    } finally {
      setLoading(false);
    }
  }

  function reset() {
    setOrders([]);
    setItems([]);
    setFileName("");
    setError(null);
  }

  return (
    <div className="space-y-6">
      <CSVDropzone onFileSelected={handleFile} />

      {error && (
        <CSVError
          message={error}
          onClose={() => setError(null)}
        />
      )}

      {orders.length > 0 && (
        <>
          <CSVPreview
            fileName={fileName}
            orders={orders}
            items={items}
          />

          <CSVActions
            loading={loading}
            onUpload={handleUpload}
            onCancel={reset}
          />
        </>
      )}
    </div>
  );
}