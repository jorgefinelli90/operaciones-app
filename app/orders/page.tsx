"use client";

import { useEffect, useState } from "react";
import { Sidebar } from "@/components/sidebar";
import { TopBar } from "@/components/topbar";
import { CSVUploader } from "@/components/csv/CSVUploader";
import { getOrders } from "@/lib/orders/getOrders";
import type { Order } from "@/types/orders";
import { formatDate } from "@/lib/utils/date";
import { OrdersFilters } from "@/app/orders/OrdersFilters";
import { OrdersToolbar } from "@/app/orders/OrdersToolbar";
import { OrderDrawer } from "@/app/orders/OrderDrawer";
import {
  ChevronDown,
  Search,
  Filter,
  ChevronRight,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
} from "lucide-react";
import { OrdersTable } from "@/app/orders/OrdersTable";
type SortKey =
  | "id"
  | "customer_firstname"
  | "purchase_date"
  | "grand_total"
  | "warehouse_status"
  | null;
type SortDirection = "asc" | "desc" | null;

const statusColors = {
  pendiente: "bg-yellow-500/10 text-yellow-400",
  despachado: "bg-blue-500/10 text-blue-400",
  enviado: "bg-green-500/10 text-green-400",
  producto_faltante: "bg-red-500/10 text-red-400",
  devuelto: "bg-orange-500/10 text-orange-400",
  cambio: "bg-purple-500/10 text-purple-400",
};


function shortShipping(shipping: string) {
  if (!shipping) {
    return {
      title: "-",
      subtitle: "",
    };
  }

  if (shipping.includes("Andreani")) {
    if (shipping.includes("Retiro en sucursal")) {
      return {
        title: "Andreani",
        subtitle: "Retiro sucursal",
      };
    }

    return {
      title: "Andreani",
      subtitle: "Domicilio",
    };
  }

  if (shipping.toLowerCase().includes("treggo")) {
    return {
      title: "Treggo",
      subtitle: "Same / Next Day",
    };
  }

  if (shipping.includes("Retiro en tienda")) {
    const local = shipping.split("-").pop()?.trim() ?? "";

    return {
      title: "Retiro tienda",
      subtitle: local,
    };
  }

  return {
    title: shipping,
    subtitle: "",
  };
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedOrder, setSelectedOrder] =
    useState<Order | null>(null);

  const [drawerOpen, setDrawerOpen] =
    useState(false);

  const [search, setSearch] = useState("");

  const [filters, setFilters] = useState({
    status: "all",
    warehouse: "all",
    pickupStore: "all",
  });
  const [showCSVUploader, setShowCSVUploader] = useState(false);
  const [sortKey, setSortKey] = useState<SortKey>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);

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

  async function loadOrders() {
    const data = await getOrders(50);
    setOrders(data);
    setLoading(false);
  }

  useEffect(() => {
    loadOrders();
  }, []);

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
      .filter((o) =>
        o.shippingDescription
          .toLowerCase()
          .startsWith("amt - retiro en tienda")
      )
      .map((o) => {
        const parts =
          o.shippingDescription.split(" - ");

        return parts.length >= 3
          ? parts[2].trim()
          : "";
      })
      .filter(Boolean)
  )
).sort();

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <TopBar />

      {/* Main Content */}
      <main className="ml-64 mt-16 p-6">
        <OrdersToolbar
          showCSVUploader={showCSVUploader}
          onToggleCSVUploader={() => setShowCSVUploader(!showCSVUploader)}
        />

        {/* CSV Uploader Section */}
        {showCSVUploader && (
          <CSVUploader
            onImportFinished={() => {
              loadOrders();
              setShowCSVUploader(false);
            }}
          />
        )}

        {/* Filters */}
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

<OrderDrawer
  order={selectedOrder}
  open={drawerOpen}
  onClose={() => {
    setDrawerOpen(false);
    setSelectedOrder(null);
  }}
/>

        {/* Pagination */}
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
