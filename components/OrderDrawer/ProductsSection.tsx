"use client";

import { useEffect, useState } from "react";
import {
  AlertTriangle,
  ChevronDown,
  Plus,
} from "lucide-react";

import { getOrderItems } from "@/lib/orders/getOrderItems";
import {
  getCasesWithProduct,
  type OrderCaseWithProduct,
} from "@/lib/cases/repository";

import { CasesSection } from "./CasesSection";

import type { Order } from "@/types/orders";
import type { OrderItem } from "@/types/orderItem";

interface ProductsSectionProps {
  order: Order | null;
}

export function ProductsSection({
  order,
}: ProductsSectionProps) {
  const [items, setItems] =
    useState<OrderItem[]>([]);

  const [cases, setCases] =
    useState<OrderCaseWithProduct[]>(
      [],
    );

  const [loadingItems, setLoadingItems] =
    useState(false);

  const [expandedProducts, setExpandedProducts] =
    useState<Set<number>>(
      new Set(),
    );

  useEffect(() => {
    async function loadData() {
      if (!order) {
        setItems([]);
        setCases([]);
        setExpandedProducts(
          new Set(),
        );
        return;
      }

      setLoadingItems(true);

      try {
        const [itemsData, casesData] =
          await Promise.all([
            getOrderItems(order.id),
            getCasesWithProduct(
              order.id,
            ),
          ]);

        setItems(itemsData);
        setCases(casesData);

        // Todos los productos arrancan minimizados.
        setExpandedProducts(
          new Set(),
        );
      } catch (error) {
        console.error(
          "Error cargando productos:",
          error,
        );

        setItems([]);
        setCases([]);
      } finally {
        setLoadingItems(false);
      }
    }

    loadData();
  }, [order]);

  function toggleProduct(
    itemId: number,
  ) {
    setExpandedProducts(
      (current) => {
        const next = new Set(
          current,
        );

        if (next.has(itemId)) {
          next.delete(itemId);
        } else {
          next.add(itemId);
        }

        return next;
      },
    );
  }

  function getProductCases(
    itemId: number,
  ) {
    return cases.filter(
      (item) =>
        Number(item.order_item_id) ===
        Number(itemId),
    );
  }

  if (!order) {
    return null;
  }

  return (
    <div>
      <p className="mb-3 text-sm font-semibold">
        Productos
      </p>

      {loadingItems ? (
        <p className="text-sm text-muted-foreground">
          Cargando...
        </p>
      ) : (
        <div className="space-y-3">

          {items.map((item) => {
            const isExpanded =
              expandedProducts.has(
                item.id,
              );

            const productCases =
              getProductCases(
                item.id,
              );

            const hasCases =
              productCases.length > 0;

            return (
              <div
                key={`${item.orderId}-${item.sku}`}
                className={`overflow-hidden rounded-lg border transition-colors ${
                  hasCases
                    ? "border-yellow-500/40"
                    : "border-border"
                }`}
              >

                {/* PRODUCTO */}

                <div className="p-3">

                  <div className="flex items-start justify-between gap-3">

                    <div className="min-w-0 flex-1">

                      <div className="flex items-center gap-2">

                        <p className="font-medium">
                          {item.productName}
                        </p>

                        {/* WARNING */}

                        {hasCases && (
                          <span
                            className="inline-flex shrink-0 items-center gap-1 rounded-full bg-yellow-500/15 px-2 py-0.5 text-[10px] font-medium text-yellow-500"
                            title={
                              productCases.length ===
                              1
                                ? "Este producto tiene 1 caso"
                                : `Este producto tiene ${productCases.length} casos`
                            }
                          >
                            <AlertTriangle
                              size={11}
                            />

                            {productCases.length ===
                            1
                              ? "1 caso"
                              : `${productCases.length} casos`}
                          </span>
                        )}

                      </div>

                      <p className="text-xs text-muted-foreground">
                        {item.sku}
                      </p>

                    </div>

                    {/* BOTÓN */}

                    <button
                      type="button"
                      onClick={() =>
                        toggleProduct(
                          item.id,
                        )
                      }
                      aria-expanded={
                        isExpanded
                      }
                      aria-label={
                        isExpanded
                          ? `Cerrar casos de ${item.productName}`
                          : `Abrir casos de ${item.productName}`
                      }
                      title={
                        isExpanded
                          ? "Cerrar información"
                          : hasCases
                            ? "Ver casos de este producto"
                            : "Hacé click para ver los casos"
                      }
                      className={`group flex h-7 w-7 shrink-0 items-center justify-center rounded-md border transition ${
                        hasCases
                          ? "border-yellow-500/40 text-yellow-500 hover:border-yellow-500 hover:bg-yellow-500/10"
                          : "border-transparent text-muted-foreground hover:border-border hover:bg-muted hover:text-foreground"
                      }`}
                    >
                      {isExpanded ? (
                        <ChevronDown
                          size={17}
                        />
                      ) : (
                        <Plus
                          size={17}
                        />
                      )}
                    </button>

                  </div>

                  <div className="mt-2 flex justify-between text-sm">

                    <span>
                      Cantidad:{" "}
                      {item.qty}
                    </span>

                    <span>
                      $
                      {item.price.toLocaleString(
                        "es-AR",
                      )}
                    </span>

                  </div>

                </div>

                {/* CASOS */}

                {isExpanded && (
                  <div className="border-t px-3 pb-3 pt-3">

                    <CasesSection
                      orderId={
                        item.orderId
                      }
                      orderItemId={
                        item.id
                      }
                    />

                  </div>
                )}

              </div>
            );
          })}

        </div>
      )}
    </div>
  );
}