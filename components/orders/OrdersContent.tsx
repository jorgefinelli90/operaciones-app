"use client";

import {
  useCallback,
  useEffect,
  useState,
} from "react";

import { CSVUploader } from "@/components/csv/CSVUploader";
import { OrderDrawer } from "@/components/OrderDrawer/OrderDrawer";
import { Sidebar } from "@/components/sidebar";
import { TopBar } from "@/components/topbar";
import { OrdersFilters } from "@/components/orders/OrdersFilters";
import { OrdersTable } from "@/components/orders/OrdersTable";
import { OrdersToolbar } from "@/components/orders/OrdersToolbar";
import { MissingProductsDrawer } from "@/components/MissingProducts/MissingProductsDrawer/MissingProductsDrawer";

import type { Order } from "@/types/orders";

interface OrdersContentProps {
  loader: (
    limit?: number,
    search?: string,
    offset?: number,
  ) => Promise<Order[]>;

  title: string;
  subtitle: string;
}

type SortKey =
  | "id"
  | "customer_firstname"
  | "purchase_date"
  | "grand_total"
  | "warehouse_status"
  | null;

type SortDirection =
  | "asc"
  | "desc"
  | null;

const PAGE_SIZE = 50;

function normalizeStatus(
  value: string,
) {
  return value
    .normalize("NFD")
    .replace(
      /[\u0300-\u036f]/g,
      "",
    )
    .trim()
    .toLowerCase();
}

function getShippingType(
  shippingDescription: string,
) {
  const shipping =
    shippingDescription
      .normalize("NFD")
      .replace(
        /[\u0300-\u036f]/g,
        "",
      )
      .toLowerCase()
      .trim();

  if (
    shipping.startsWith(
      "amt - retiro en tienda",
    )
  ) {
    return "pickup";
  }

  if (
    shipping.startsWith(
      "andreani - envio a domicilio",
    )
  ) {
    return "andreani_domicilio";
  }

  if (
    shipping.startsWith(
      "andreani - retiro en sucursal",
    )
  ) {
    return "andreani_sucursal";
  }

  if (
    shipping.startsWith(
      "envio rapido por treggo",
    ) ||
    shipping.startsWith(
      "treggo",
    )
  ) {
    return "treggo";
  }

  return "";
}

function getPickupStore(
  shippingDescription: string,
) {
  const shipping =
    shippingDescription
      .normalize("NFD")
      .replace(
        /[\u0300-\u036f]/g,
        "",
      )
      .toLowerCase();

  if (
    !shipping.startsWith(
      "amt - retiro en tienda",
    )
  ) {
    return "";
  }

  const parts =
    shippingDescription.split(
      " - ",
    );

  return parts.length >= 3
    ? parts[2].trim()
    : "";
}

export function OrdersContent({
  loader,
  title,
  subtitle,
}: OrdersContentProps) {
  const [orders, setOrders] =
    useState<Order[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [
    selectedOrder,
    setSelectedOrder,
  ] =
    useState<Order | null>(null);

  const [
    drawerOpen,
    setDrawerOpen,
  ] =
    useState(false);

  const [
    searchInput,
    setSearchInput,
  ] =
    useState("");

  const [search, setSearch] =
    useState("");

  /*
   * Página actual.
   *
   * 0 = pedidos 1-50
   * 1 = pedidos 51-100
   * 2 = pedidos 101-150
   */
  const [page, setPage] =
    useState(0);

  /*
   * Si recibimos exactamente 50,
   * suponemos que puede existir
   * una página siguiente.
   */
  const [
    hasNextPage,
    setHasNextPage,
  ] =
    useState(false);

  const [filters, setFilters] =
    useState({
      status: "all",
      warehouse: "all",
      pickupStore: "all",
      documents: "all",
    });

  const [
    showCSVUploader,
    setShowCSVUploader,
  ] =
    useState(false);

  const [sortKey, setSortKey] =
    useState<SortKey>(null);

  const [
    sortDirection,
    setSortDirection,
  ] =
    useState<SortDirection>(null);

  /*
   * ============================================================
   * CARGAR PEDIDOS
   * ============================================================
   */

  const loadOrders =
    useCallback(async () => {
      try {
        setLoading(true);

        const offset =
          page * PAGE_SIZE;

        const data =
          await loader(
            PAGE_SIZE,
            search,
            offset,
          );

        setOrders(data);

        /*
         * Si llegaron 50,
         * puede haber otra página.
         */
        setHasNextPage(
          data.length ===
            PAGE_SIZE,
        );
      } catch (error) {
        console.error(
          "Error cargando pedidos:",
          error,
        );

        setOrders([]);
        setHasNextPage(false);
      } finally {
        setLoading(false);
      }
    }, [
      loader,
      search,
      page,
    ]);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  /*
   * ============================================================
   * BUSCAR
   * ============================================================
   */

  const handleSearch = () => {
    const cleanSearch =
      searchInput.trim();

    /*
     * Una nueva búsqueda
     * siempre empieza en página 1.
     */
    setPage(0);

    if (
      cleanSearch === search
    ) {
      return;
    }

    setSearch(
      cleanSearch,
    );
  };

  /*
   * ============================================================
   * LIMPIAR BÚSQUEDA
   * ============================================================
   */

  const handleClearSearch =
    () => {
      setSearchInput("");
      setSearch("");
      setPage(0);
    };

  /*
   * ============================================================
   * PAGINACIÓN
   * ============================================================
   */

  const handlePreviousPage =
    () => {
      if (page === 0) {
        return;
      }

      setPage(
        (current) =>
          current - 1,
      );
    };

  const handleNextPage =
    () => {
      if (!hasNextPage) {
        return;
      }

      setPage(
        (current) =>
          current + 1,
      );
    };

  /*
   * ============================================================
   * ACTUALIZAR ESTADO
   * ============================================================
   */

  const handleWarehouseStatusUpdated =
    (
      orderId: string,
      newStatus: string,
    ) => {
      setOrders((prev) =>
        prev.map((order) =>
          order.id === orderId
            ? {
                ...order,
                warehouse_status:
                  newStatus,
              }
            : order,
        ),
      );

      setSelectedOrder(
        (prev) =>
          prev &&
          prev.id === orderId
            ? {
                ...prev,
                warehouse_status:
                  newStatus,
              }
            : prev,
      );
    };

  /*
   * ============================================================
   * ORDENAMIENTO
   * ============================================================
   */

  const handleSort = (
    key: SortKey,
  ) => {
    if (sortKey === key) {
      if (
        sortDirection ===
        "asc"
      ) {
        setSortDirection(
          "desc",
        );
      } else if (
        sortDirection ===
        "desc"
      ) {
        setSortKey(null);
        setSortDirection(
          null,
        );
      }
    } else {
      setSortKey(key);
      setSortDirection(
        "asc",
      );
    }
  };

  /*
   * ============================================================
   * FILTROS
   * ============================================================
   */

  let filteredOrders =
    orders.filter((order) => {
      const matchesStatus =
        filters.status ===
          "all" ||
        normalizeStatus(
          order.warehouse_status,
        ) ===
          normalizeStatus(
            filters.status,
          );

      const shippingType =
        getShippingType(
          order.shippingDescription,
        );

      const matchesWarehouse =
        filters.warehouse ===
          "all" ||
        shippingType ===
          filters.warehouse;

      const pickupStore =
        getPickupStore(
          order.shippingDescription,
        );

      const matchesPickup =
        filters.pickupStore ===
          "all" ||
        pickupStore ===
          filters.pickupStore;

      const hasInvoice =
        order.hasInvoice;

      const hasCreditNote =
        order.hasCreditNote;

      let matchesDocuments =
        true;

      switch (
        filters.documents
      ) {
        case "invoice":
          matchesDocuments =
            hasInvoice;
          break;

        case "credit_note":
          matchesDocuments =
            hasCreditNote;
          break;

        case "both":
          matchesDocuments =
            hasInvoice &&
            hasCreditNote;
          break;

        case "none":
          matchesDocuments =
            !hasInvoice &&
            !hasCreditNote;
          break;

        default:
          matchesDocuments =
            true;
      }

      return (
        matchesStatus &&
        matchesWarehouse &&
        matchesPickup &&
        matchesDocuments
      );
    });

  /*
   * ============================================================
   * ORDENAMIENTO LOCAL
   * ============================================================
   */

  if (
    sortKey &&
    sortDirection
  ) {
    filteredOrders =
      [...filteredOrders].sort(
        (a, b) => {
          let aValue:
            | string
            | number = "";

          let bValue:
            | string
            | number = "";

          switch (sortKey) {
            case "id":
              aValue = a.id;
              bValue = b.id;
              break;

            case "customer_firstname":
              aValue =
                `${a.customer_firstname} ${a.customer_lastname}`;

              bValue =
                `${b.customer_firstname} ${b.customer_lastname}`;
              break;

            case "purchase_date":
              aValue =
                new Date(
                  a.purchase_date,
                ).getTime();

              bValue =
                new Date(
                  b.purchase_date,
                ).getTime();
              break;

            case "grand_total":
              aValue =
                a.grand_total;

              bValue =
                b.grand_total;
              break;

            case "warehouse_status":
              aValue =
                a.warehouse_status;

              bValue =
                b.warehouse_status;
              break;

            default:
              return 0;
          }

          if (
            typeof aValue ===
              "string" ||
            typeof bValue ===
              "string"
          ) {
            const normalizedA =
              String(
                aValue,
              ).toLowerCase();

            const normalizedB =
              String(
                bValue,
              ).toLowerCase();

            if (
              normalizedA <
              normalizedB
            ) {
              return sortDirection ===
                "asc"
                ? -1
                : 1;
            }

            if (
              normalizedA >
              normalizedB
            ) {
              return sortDirection ===
                "asc"
                ? 1
                : -1;
            }

            return 0;
          }

          const numericA =
            Number(aValue);

          const numericB =
            Number(bValue);

          if (
            numericA <
            numericB
          ) {
            return sortDirection ===
              "asc"
              ? -1
              : 1;
          }

          if (
            numericA >
            numericB
          ) {
            return sortDirection ===
              "asc"
              ? 1
              : -1;
          }

          return 0;
        },
      );
  }

  /*
   * ============================================================
   * SUCURSA PICKUP
   * ============================================================
   */

  const pickupStores =
    Array.from(
      new Set(
        orders
          .map((order) =>
            getPickupStore(
              order.shippingDescription,
            ),
          )
          .filter(Boolean),
      ),
    ).sort();

  /*
   * ============================================================
   * RENDER
   * ============================================================
   */

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />

      <TopBar />

      <main className="ml-64 mt-16 p-6">
        <OrdersToolbar
          title={title}
          subtitle={subtitle}
          showCSVUploader={
            showCSVUploader
          }
          onToggleCSVUploader={() =>
            setShowCSVUploader(
              (value) =>
                !value,
            )
          }
        />

        {showCSVUploader && (
          <CSVUploader
            onImportFinished={() => {
              loadOrders();

              setShowCSVUploader(
                false,
              );
            }}
          />
        )}

        <OrdersFilters
          search={searchInput}
          onSearchChange={
            setSearchInput
          }
          onSearch={
            handleSearch
          }
          onClearSearch={
            handleClearSearch
          }
          pickupStores={
            pickupStores
          }
          filters={filters}
          onFiltersChange={
            setFilters
          }
        />

        {loading ? (
          <div className="rounded-lg border border-border bg-card p-10 text-center text-sm text-muted-foreground">
            Cargando pedidos...
          </div>
        ) : (
          <OrdersTable
            orders={
              filteredOrders
            }
            onOrderClick={(
              order,
            ) => {
              setSelectedOrder(
                order,
              );

              setDrawerOpen(
                true,
              );
            }}
          />
        )}

        {title ===
        "Productos faltantes" ? (
          <MissingProductsDrawer
            order={
              selectedOrder
            }
            open={
              drawerOpen
            }
            onClose={() => {
              setDrawerOpen(
                false,
              );

              setSelectedOrder(
                null,
              );
            }}
          />
        ) : (
          <OrderDrawer
            order={
              selectedOrder
            }
            open={
              drawerOpen
            }
            onClose={() => {
              setDrawerOpen(
                false,
              );

              setSelectedOrder(
                null,
              );
            }}
            onWarehouseStatusUpdated={
              handleWarehouseStatusUpdated
            }
          />
        )}

        <div className="mt-6 flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            {search ? (
              <>
                Mostrando{" "}
                {
                  filteredOrders.length
                }{" "}
                coincidencias para{" "}
                <span className="font-semibold text-foreground">
                  "{search}"
                </span>
              </>
            ) : (
              <>
                Página{" "}
                {page + 1}{" "}
                · Mostrando{" "}
                {
                  filteredOrders.length
                }{" "}
                pedidos
              </>
            )}
          </p>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={
                handlePreviousPage
              }
              disabled={
                page === 0 ||
                loading
              }
              className="rounded-lg border border-border px-4 py-2 text-sm font-medium transition-colors hover:bg-secondary disabled:cursor-not-allowed disabled:opacity-40"
            >
              Atrás
            </button>

            <button
              type="button"
              onClick={
                handleNextPage
              }
              disabled={
                !hasNextPage ||
                loading
              }
              className="rounded-lg border border-border px-4 py-2 text-sm font-medium transition-colors hover:bg-secondary disabled:cursor-not-allowed disabled:opacity-40"
            >
              Adelante
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}