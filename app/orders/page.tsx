"use client";

import { useEffect, useState } from "react";
import { Sidebar } from "@/components/sidebar";
import { TopBar } from "@/components/topbar";
import { CSVUploader } from "@/components/csv-uploader";
import { getOrders } from "@/lib/orders/getOrders";
import type { Order } from "@/types/order";
import { formatDate } from "@/lib/utils/date";
import { ChevronDown, Search, Filter, ChevronRight } from "lucide-react";

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

  useEffect(() => {
    async function load() {
      const data = await getOrders(50);
      setOrders(data);
      setLoading(false);
    }
    load();
  }, []);

  const filteredOrders = orders.filter((order) => {
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
        <div className="space-y-3 max-h-[calc(100vh-350px)] overflow-y-auto pr-2">
          {filteredOrders.length > 0 ? (
            filteredOrders.map((order) => (
              <div
                key={order.id}
                className="group relative bg-gradient-to-br from-card to-card/95 border border-border rounded-lg p-5 transition-all duration-200 hover:shadow-md hover:border-primary/50 hover:bg-gradient-to-br hover:from-card hover:to-card/85 cursor-pointer"
              >
                {/* Top Row - Order ID, Customer, and Amount */}
                <div className="flex items-start justify-between mb-4 gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10 text-primary font-bold text-sm">
                        {order.id.slice(-2)}
                      </span>
                      <p className="text-sm font-semibold text-muted-foreground">
                        {order.id}
                      </p>
                    </div>
                    <p className="text-base font-semibold text-foreground truncate">
                      {order.customer_name}
                    </p>
                    <p className="text-xs text-muted-foreground truncate mt-1">
                      {order.customer_email}
                    </p>
                  </div>

                  <div className="text-right flex-shrink-0">
                    <p className="text-2xl font-bold text-primary tabular-nums">
                      {new Intl.NumberFormat("es-AR", {
                        style: "currency",
                        currency: "ARS",
                      }).format(order.grand_total)}
                    </p>
                    <span
                      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold mt-2 ${
                        statusColors[
                          order.warehouse_status.toLowerCase() as keyof typeof statusColors
                        ]
                      }`}
                    >
                      {order.warehouse_status}
                    </span>
                  </div>
                </div>

                {/* Divider */}
                <div className="h-px bg-border/50 mb-4" />

                {/* Bottom Row - Details Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {/* Date */}
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                      Fecha
                    </p>
                    <p className="text-sm font-medium text-foreground">
                      {formatDate(order.purchase_date).split(" ")[0]}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatDate(order.purchase_date).split(" ")[1]}
                    </p>
                  </div>

                  {/* Shipping */}
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                      Envío
                    </p>
                    <p className="text-sm font-medium text-foreground">
                      {shortShipping(order.shipping_method).title}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      {shortShipping(order.shipping_method).subtitle}
                    </p>
                  </div>

                  {/* Address */}
                  <div className="min-w-0 col-span-2 md:col-span-1">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                      Dirección
                    </p>
                    <p className="text-sm font-medium text-foreground truncate">
                      {order.delivery_address}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      {order.delivery_city}, {order.delivery_province}
                    </p>
                  </div>

                  {/* Action Button */}
                  <div className="flex items-end justify-end col-span-2 md:col-span-1">
                    <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10 text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                      <ChevronRight className="h-5 w-5" />
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <p className="text-muted-foreground font-medium">
                No hay pedidos que coincidan con los filtros
              </p>
            </div>
          )}
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
