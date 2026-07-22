"use client";

import { useEffect, useMemo, useState } from "react";
import { GripVertical } from "lucide-react";

import type { Order } from "@/types/orders";

import { OrderRow } from "./OrderRow";

export type OrderColumnId =
  | "order"
  | "customer"
  | "date"
  | "shipping"
  | "address"
  | "status"
  | "amount";

interface OrdersTableProps {
  orders: Order[];
  onOrderClick?: (order: Order) => void;
}

const STORAGE_KEY = "orders-table-column-order";

const DEFAULT_COLUMN_ORDER: OrderColumnId[] = [
  "order",
  "customer",
  "date",
  "shipping",
  "address",
  "status",
  "amount",
];

const COLUMN_LABELS: Record<OrderColumnId, string> = {
  order: "Pedido",
  customer: "Cliente",
  date: "Fecha",
  shipping: "Envío",
  address: "Dirección",
  status: "Estado",
  amount: "Importe",
};

const COLUMN_WIDTHS: Record<OrderColumnId, string> = {
  order: "minmax(125px, 1.05fr)",
  customer: "minmax(150px, 1.35fr)",
  date: "minmax(90px, 0.8fr)",
  shipping: "minmax(135px, 1.15fr)",
  address: "minmax(135px, 1.2fr)",
  status: "minmax(115px, 0.95fr)",
  amount: "minmax(130px, 1fr)",
};

function isValidColumnOrder(value: unknown): value is OrderColumnId[] {
  return (
    Array.isArray(value) &&
    value.length === DEFAULT_COLUMN_ORDER.length &&
    DEFAULT_COLUMN_ORDER.every((column) => value.includes(column))
  );
}

export function OrdersTable({ orders, onOrderClick }: OrdersTableProps) {
  const [columnOrder, setColumnOrder] =
    useState<OrderColumnId[]>(DEFAULT_COLUMN_ORDER);
  const [draggedColumn, setDraggedColumn] = useState<OrderColumnId | null>(null);
  const [dropTarget, setDropTarget] = useState<OrderColumnId | null>(null);

  useEffect(() => {
    try {
      const savedOrder = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "null");

      if (isValidColumnOrder(savedOrder)) {
        setColumnOrder(savedOrder);
      }
    } catch {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  const gridTemplateColumns = useMemo(
    () => columnOrder.map((column) => COLUMN_WIDTHS[column]).join(" "),
    [columnOrder],
  );

  function moveColumn(
    sourceColumn: OrderColumnId,
    targetColumn: OrderColumnId,
  ) {
    if (sourceColumn === targetColumn) return;

    setColumnOrder((currentOrder) => {
      const nextOrder = [...currentOrder];
      const sourceIndex = nextOrder.indexOf(sourceColumn);
      const targetIndex = nextOrder.indexOf(targetColumn);

      if (sourceIndex === -1 || targetIndex === -1) return currentOrder;

      nextOrder.splice(sourceIndex, 1);
      nextOrder.splice(targetIndex, 0, sourceColumn);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(nextOrder));

      return nextOrder;
    });
  }

  return (
    <div className="overflow-hidden rounded-lg border border-border bg-card">
      <div className="overflow-x-auto">
        <div className="w-full min-w-[920px]">
          <div className="sticky top-0 z-10 border-b border-border bg-secondary/60 backdrop-blur">
            <div
              className="grid w-full items-center px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground"
              style={{ gridTemplateColumns }}
            >
              {columnOrder.map((column) => (
                <div
                  key={column}
                  data-column={column}
                  draggable
                  onDragStart={(event) => {
                    setDraggedColumn(column);
                    event.dataTransfer.effectAllowed = "move";
                    event.dataTransfer.setData("text/plain", column);
                  }}
                  onDragEnter={() => setDropTarget(column)}
                  onDragOver={(event) => {
                    event.preventDefault();
                    event.dataTransfer.dropEffect = "move";
                  }}
                  onDrop={(event) => {
                    event.preventDefault();
                    const sourceColumn = event.dataTransfer.getData(
                      "text/plain",
                    ) as OrderColumnId;
                    moveColumn(sourceColumn, column);
                    setDropTarget(null);
                  }}
                  onDragEnd={() => {
                    setDraggedColumn(null);
                    setDropTarget(null);
                  }}
                  className={`flex min-w-0 cursor-grab items-center gap-1.5 rounded px-2 py-1.5 transition-colors active:cursor-grabbing ${
                    column === dropTarget && column !== draggedColumn
                      ? "bg-primary/10 text-foreground"
                      : ""
                  } ${column === "amount" ? "justify-end" : ""}`}
                  title={`Arrastrar para mover ${COLUMN_LABELS[column]}`}
                >
                  <GripVertical aria-hidden="true" className="size-3.5 shrink-0" />
                  <span className="truncate">{COLUMN_LABELS[column]}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="divide-y divide-border">
            {orders.map((order) => (
              <OrderRow
                key={order.id}
                order={order}
                columnOrder={columnOrder}
                gridTemplateColumns={gridTemplateColumns}
                onClick={() => onOrderClick?.(order)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
