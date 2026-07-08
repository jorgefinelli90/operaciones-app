"use client";

import { useEffect, useState } from "react";
import { Sidebar } from "@/components/sidebar";
import { TopBar } from "@/components/topbar";
import { CSVUploader } from "@/components/csv-uploader";
import { getOrders } from "@/lib/orders/getOrders";
import type { Order } from "@/types/order";
import { formatDate } from "@/lib/utils/date";
import { ChevronDown, Search, Filter, ChevronRight, ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";

type SortKey = "id" | "customer_name" | "purchase_date" | "grand_total" | "warehouse_status" | null;
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
  const [filters, setFilters] = useState({
    status: "all",
    warehouse: "all",
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

  useEffect(() => {
    async function load() {
      const data = await getOrders(50);
      setOrders(data);
      setLoading(false);
    }
    load();
  }, []);

  let filteredOrders = orders.filter((order) => {
    if (
      filters.status !== "all" &&
      order.warehouse_status.toLowerCase() !== filters.status
    )
      return false;
    if (
      filters.warehouse !== "all" &&
      (order as Order & { warehouse?: string }).warehouse !== filters.warehouse
    )
      return false;
    return true;
  });

  // Apply sorting
  if (sortKey && sortDirection) {
    filteredOrders = [...filteredOrders].sort((a, b) => {
      let aValue: any = a[sortKey];
      let bValue: any = b[sortKey];

      // Handle different data types
      if (sortKey === "grand_total") {
        aValue = parseFloat(aValue) || 0;
        bValue = parseFloat(bValue) || 0;
      } else if (sortKey === "purchase_date") {
        aValue = new Date(aValue).getTime();
        bValue = new Date(bValue).getTime();
      } else if (typeof aValue === "string") {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }

      if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
      if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });
  }

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <TopBar />

      {/* Main Content */}
      <main className="ml-64 mt-16 p-6">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Pedidos</h1>
            <p className="text-muted-foreground mt-1">
              Gestiona y realiza el seguimiento de todos los pedidos
            </p>
          </div>
          <button
            onClick={() => setShowCSVUploader(!showCSVUploader)}
            className="px-4 py-2 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors text-sm"
          >
            {showCSVUploader ? "Cancelar" : "Cargar CSV"}
          </button>
        </div>

        {/* CSV Uploader Section */}
        {showCSVUploader && (
          <CSVUploader
            onDataLoaded={(orders) => {
              console.log("CSV cargado:", orders);
            }}
          />
        )}

        {/* Filters */}
        <div className="mb-6 flex gap-3">
          <div className="relative">
            <select
              value={filters.status}
              onChange={(e) =>
                setFilters({ ...filters, status: e.target.value })
              }
              className="appearance-none rounded-lg border border-border bg-input px-4 py-2 pr-10 text-sm font-medium text-foreground cursor-pointer hover:border-primary/30 transition-colors"
            >
              <option value="all">Todos los estados</option>
              <option value="pendiente">Pendiente</option>
              <option value="despachado">Despachado</option>
              <option value="enviado">Enviado</option>
              <option value="producto_faltante">Producto Faltante</option>
              <option value="devuelto">Devuelto a deposito</option>
              <option value="cambio">Cambio</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 pointer-events-none text-muted-foreground" />
          </div>

          <div className="relative">
            <select
              value={filters.warehouse}
              onChange={(e) =>
                setFilters({ ...filters, warehouse: e.target.value })
              }
              className="appearance-none rounded-lg border border-border bg-input px-4 py-2 pr-10 text-sm font-medium text-foreground cursor-pointer hover:border-primary/30 transition-colors"
            >
              <option value="all">Pickups</option>
              <option value="Madrid">Palermo</option>
              <option value="Barcelona">Unicenter</option>
              <option value="Valencia">Alcorta</option>
              <option value="Seville">Arcos</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 pointer-events-none text-muted-foreground" />
          </div>

          <button className="flex items-center gap-2 rounded-lg border border-border px-4 py-2 hover:bg-secondary transition-colors text-sm font-medium">
            <Filter className="h-4 w-4" />
            Mas filtros
          </button>
        </div>

        {/* Orders Table */}
        <div className="rounded-lg border border-border overflow-hidden bg-card/50 backdrop-blur">
          {/* Table Header */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-secondary/30 hover:bg-secondary/40 transition-colors">
                  <th className="px-6 py-4 text-left">
                    <button
                      onClick={() => handleSort("id")}
                      className="flex items-center gap-2 font-semibold text-sm text-muted-foreground hover:text-foreground transition-colors group"
                    >
                      Pedido
                      <span className="opacity-0 group-hover:opacity-100 transition-opacity">
                        {sortKey === "id" ? (
                          sortDirection === "asc" ? (
                            <ArrowUp className="h-4 w-4 text-primary" />
                          ) : (
                            <ArrowDown className="h-4 w-4 text-primary" />
                          )
                        ) : (
                          <ArrowUpDown className="h-4 w-4" />
                        )}
                      </span>
                    </button>
                  </th>
                  <th className="px-6 py-4 text-left">
                    <button
                      onClick={() => handleSort("customer_name")}
                      className="flex items-center gap-2 font-semibold text-sm text-muted-foreground hover:text-foreground transition-colors group"
                    >
                      Cliente
                      <span className="opacity-0 group-hover:opacity-100 transition-opacity">
                        {sortKey === "customer_name" ? (
                          sortDirection === "asc" ? (
                            <ArrowUp className="h-4 w-4 text-primary" />
                          ) : (
                            <ArrowDown className="h-4 w-4 text-primary" />
                          )
                        ) : (
                          <ArrowUpDown className="h-4 w-4" />
                        )}
                      </span>
                    </button>
                  </th>
                  <th className="px-6 py-4 text-left">
                    <button
                      onClick={() => handleSort("purchase_date")}
                      className="flex items-center gap-2 font-semibold text-sm text-muted-foreground hover:text-foreground transition-colors group"
                    >
                      Fecha
                      <span className="opacity-0 group-hover:opacity-100 transition-opacity">
                        {sortKey === "purchase_date" ? (
                          sortDirection === "asc" ? (
                            <ArrowUp className="h-4 w-4 text-primary" />
                          ) : (
                            <ArrowDown className="h-4 w-4 text-primary" />
                          )
                        ) : (
                          <ArrowUpDown className="h-4 w-4" />
                        )}
                      </span>
                    </button>
                  </th>
                  <th className="px-6 py-4 text-left">
                    <span className="font-semibold text-sm text-muted-foreground">Envío</span>
                  </th>
                  <th className="px-6 py-4 text-left">
                    <span className="font-semibold text-sm text-muted-foreground">Dirección</span>
                  </th>
                  <th className="px-6 py-4 text-left">
                    <button
                      onClick={() => handleSort("warehouse_status")}
                      className="flex items-center gap-2 font-semibold text-sm text-muted-foreground hover:text-foreground transition-colors group"
                    >
                      Estado
                      <span className="opacity-0 group-hover:opacity-100 transition-opacity">
                        {sortKey === "warehouse_status" ? (
                          sortDirection === "asc" ? (
                            <ArrowUp className="h-4 w-4 text-primary" />
                          ) : (
                            <ArrowDown className="h-4 w-4 text-primary" />
                          )
                        ) : (
                          <ArrowUpDown className="h-4 w-4" />
                        )}
                      </span>
                    </button>
                  </th>
                  <th className="px-6 py-4 text-right">
                    <button
                      onClick={() => handleSort("grand_total")}
                      className="flex items-center justify-end gap-2 font-semibold text-sm text-muted-foreground hover:text-foreground transition-colors group ml-auto"
                    >
                      Importe
                      <span className="opacity-0 group-hover:opacity-100 transition-opacity">
                        {sortKey === "grand_total" ? (
                          sortDirection === "asc" ? (
                            <ArrowUp className="h-4 w-4 text-primary" />
                          ) : (
                            <ArrowDown className="h-4 w-4 text-primary" />
                          )
                        ) : (
                          <ArrowUpDown className="h-4 w-4" />
                        )}
                      </span>
                    </button>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredOrders.length > 0 ? (
                  filteredOrders.map((order) => (
                    <tr
                      key={order.id}
                      className="hover:bg-secondary/20 transition-colors cursor-pointer group"
                    >
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10 text-primary font-bold text-xs font-mono">
                          {order.id.slice(-2)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="min-w-0">
                          <p className="font-semibold text-sm text-foreground truncate">
                            {order.customer_name}
                          </p>
                          <p className="text-xs text-muted-foreground truncate">
                            {order.customer_email}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-foreground">
                          {formatDate(order.purchase_date).split(" ")[0]}
                          <br />
                          <span className="text-xs text-muted-foreground">
                            {formatDate(order.purchase_date).split(" ")[1]}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-foreground">
                          {shortShipping(order.shipping_method).title}
                          <br />
                          <span className="text-xs text-muted-foreground">
                            {shortShipping(order.shipping_method).subtitle}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-foreground min-w-0">
                          <p className="truncate">{order.delivery_address}</p>
                          <p className="text-xs text-muted-foreground truncate">
                            {order.delivery_city}, {order.delivery_province}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                            statusColors[
                              order.warehouse_status.toLowerCase() as keyof typeof statusColors
                            ]
                          }`}
                        >
                          {order.warehouse_status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-between gap-3">
                          <p className="font-semibold text-sm text-foreground tabular-nums">
                            {new Intl.NumberFormat("es-AR", {
                              style: "currency",
                              currency: "ARS",
                            }).format(order.grand_total)}
                          </p>
                          <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors opacity-0 group-hover:opacity-100" />
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="px-6 py-16 text-center">
                      <p className="text-muted-foreground font-medium">
                        No hay pedidos que coincidan con los filtros
                      </p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

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
