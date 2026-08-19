"use client";

import { useCallback, useEffect, useState } from "react";

import { CSVUploader } from "@/components/csv/CSVUploader";
import { OrderDrawer } from "@/components/OrderDrawer/OrderDrawer";
import { Sidebar } from "@/components/sidebar";
import { TopBar } from "@/components/topbar";
import { OrdersFilters } from "@/components/orders/OrdersFilters";
import { OrdersTable } from "@/components/orders/OrdersTable";
import { OrdersToolbar } from "@/components/orders/OrdersToolbar";
import type { Order } from "@/types/orders";
import { MissingProductsDrawer } from "@/components/MissingProducts/MissingProductsDrawer/MissingProductsDrawer";

interface OrdersContentProps {
  loader: () => Promise<Order[]>;
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
type SortDirection = "asc" | "desc" | null;

export function OrdersContent({
  loader,
  title,
  subtitle,
}: OrdersContentProps) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState({
    status: "all",
    warehouse: "all",
    pickupStore: "all",
  });
  const [showCSVUploader, setShowCSVUploader] = useState(false);
  const [sortKey, setSortKey] = useState<SortKey>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);

  const handleWarehouseStatusUpdated = (
    orderId: string,
    newStatus: string,
  ) => {
    setOrders((prev) =>
      prev.map((order) =>
        order.id === orderId
          ? {
              ...order,
              warehouse_status: newStatus,
            }
          : order,
      ),
    );

    setSelectedOrder((prev) =>
      prev && prev.id === orderId
        ? {
            ...prev,
            warehouse_status: newStatus,
          }
        : prev,
    );
  };

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      if (sortDirection === "asc") {
        setSortDirection("desc");
      } else if (sortDirection === "desc") {
        setSortKey(null);
        setSortDirection(null);
      }
    } else {
      setSortKey(key);
      setSortDirection("asc");
    }
  };

  const loadOrders = useCallback(async () => {
    const data = await loader();
    setOrders(data);
    setLoading(false);
  }, [loader]);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  let filteredOrders = orders.filter((order) => {
    const searchText = search.toLowerCase().trim();

    const fullName = `${order.customer_firstname} ${order.customer_lastname}`
      .toLowerCase()
      .trim();

    const matchesSearch =
      searchText === "" ||
      order.id.toLowerCase().includes(searchText) ||
      order.customer_firstname.toLowerCase().includes(searchText) ||
      order.customer_lastname.toLowerCase().includes(searchText) ||
      fullName.includes(searchText) ||
      order.customer_email.toLowerCase().includes(searchText);

    const matchesStatus =
      filters.status === "all" ||
      order.warehouse_status.toLowerCase() === filters.status;

    const shipping = order.shippingDescription.toLowerCase();

    let shippingType = "";

    if (shipping.startsWith("amt - retiro en tienda")) {
      shippingType = "pickup";
    } else if (shipping.startsWith("andreani - envio a domicilio")) {
      shippingType = "andreani_domicilio";
    } else if (shipping.startsWith("andreani - retiro en sucursal")) {
      shippingType = "andreani_sucursal";
    } else if (shipping.startsWith("envío rápido por treggo")) {
      shippingType = "treggo";
    }

    const matchesWarehouse =
      filters.warehouse === "all" || filters.warehouse === shippingType;

    let pickupStore = "";

    if (shipping.startsWith("amt - retiro en tienda")) {
      const parts = order.shippingDescription.split(" - ");

      pickupStore = parts.length >= 3 ? parts[2].trim() : "";
    }

    const matchesPickup =
      filters.pickupStore === "all" || pickupStore === filters.pickupStore;

    return matchesSearch && matchesStatus && matchesWarehouse && matchesPickup;
  });

  if (sortKey && sortDirection) {
    filteredOrders = [...filteredOrders].sort((a, b) => {
      let aValue: string | number = "";
      let bValue: string | number = "";

      switch (sortKey) {
        case "id":
          aValue = a.id;
          bValue = b.id;
          break;

        case "customer_firstname":
          aValue = `${a.customer_firstname} ${a.customer_lastname}`;
          bValue = `${b.customer_firstname} ${b.customer_lastname}`;
          break;

        case "purchase_date":
          aValue = new Date(a.purchase_date).getTime();
          bValue = new Date(b.purchase_date).getTime();
          break;

        case "grand_total":
          aValue = a.grand_total;
          bValue = b.grand_total;
          break;

        case "warehouse_status":
          aValue = a.warehouse_status;
          bValue = b.warehouse_status;
          break;

        default:
          return 0;
      }

      const isTextSort =
        sortKey === "id" ||
        sortKey === "customer_firstname" ||
        sortKey === "warehouse_status";

      if (isTextSort) {
        const normalizedA = String(aValue).toLowerCase();
        const normalizedB = String(bValue).toLowerCase();

        if (normalizedA < normalizedB) return sortDirection === "asc" ? -1 : 1;
        if (normalizedA > normalizedB) return sortDirection === "asc" ? 1 : -1;

        return 0;
      }

      const numericA = aValue as number;
      const numericB = bValue as number;

      if (numericA < numericB) return sortDirection === "asc" ? -1 : 1;
      if (numericA > numericB) return sortDirection === "asc" ? 1 : -1;

      return 0;
    });
  }

  const pickupStores = Array.from(
    new Set(
      orders
        .filter((order) =>
          order.shippingDescription
            .toLowerCase()
            .startsWith("amt - retiro en tienda"),
        )
        .map((order) => {
          const parts = order.shippingDescription.split(" - ");

          return parts.length >= 3 ? parts[2].trim() : "";
        })
        .filter(Boolean),
    ),
  ).sort();

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <TopBar />

      <main className="ml-64 mt-16 p-6">
        <OrdersToolbar
          title={title}
          subtitle={subtitle}
          showCSVUploader={showCSVUploader}
          onToggleCSVUploader={() => setShowCSVUploader(!showCSVUploader)}
        />

        {showCSVUploader && (
          <CSVUploader
            onImportFinished={() => {
              loadOrders();
              setShowCSVUploader(false);
            }}
          />
        )}

        <OrdersFilters
          search={search}
          onSearchChange={setSearch}
          filters={filters}
          pickupStores={pickupStores}
          onFiltersChange={setFilters}
        />

        <OrdersTable
          orders={filteredOrders}
          onOrderClick={(order) => {
            setSelectedOrder(order);
            setDrawerOpen(true);
          }}
        />

        {title === "Productos faltantes" ? (
  <MissingProductsDrawer
    order={selectedOrder}
    open={drawerOpen}
    onClose={() => {
      setDrawerOpen(false);
      setSelectedOrder(null);
    }}
  />
) : (
  <OrderDrawer
    order={selectedOrder}
    open={drawerOpen}
    onClose={() => {
      setDrawerOpen(false);
      setSelectedOrder(null);
    }}
    onWarehouseStatusUpdated={handleWarehouseStatusUpdated}
  />
)}

        <div className="mt-6 flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Viendo {filteredOrders.length} de {orders.length} pedidos.
          </p>
          <div className="flex gap-2">
            <button className="rounded-lg border border-border px-4 py-2 text-sm font-medium hover:bg-secondary transition-colors disabled:opacity-50">
              Atras
            </button>
            <button className="rounded-lg border border-border px-4 py-2 text-sm font-medium hover:bg-secondary transition-colors">
              Adelante
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
