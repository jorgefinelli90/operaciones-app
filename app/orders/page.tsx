'use client'

import { useEffect, useState } from 'react'
import { Sidebar } from '@/components/sidebar'
import { TopBar } from '@/components/topbar'
import { CSVUploader } from '@/components/csv-uploader'
import { getOrders } from '@/lib/orders/getOrders'
import type { Order } from '@/types/order'
import { formatDate } from '@/lib/utils/date'
import { ChevronDown, Search, Filter, ChevronRight } from 'lucide-react'

const statusColors = {
  pendiente: 'bg-yellow-500/10 text-yellow-400',
  despachado: 'bg-blue-500/10 text-blue-400',
  enviado: 'bg-green-500/10 text-green-400',
  producto_faltante: 'bg-red-500/10 text-red-400',
  devuelto: 'bg-orange-500/10 text-orange-400',
  cambio: 'bg-purple-500/10 text-purple-400',
}

function shortShipping(shipping: string) {
  if (!shipping) {
    return {
      title: "-",
      subtitle: "",
    }
  }

  if (shipping.includes("Andreani")) {
    if (shipping.includes("Retiro en sucursal")) {
      return {
        title: "Andreani",
        subtitle: "Retiro sucursal",
      }
    }

    return {
      title: "Andreani",
      subtitle: "Domicilio",
    }
  }

  if (shipping.toLowerCase().includes("treggo")) {
    return {
      title: "Treggo",
      subtitle: "Same / Next Day",
    }
  }

  if (shipping.includes("Retiro en tienda")) {
    const local = shipping.split("-").pop()?.trim() ?? ""

    return {
      title: "Retiro tienda",
      subtitle: local,
    }
  }

  return {
    title: shipping,
    subtitle: "",
  }
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    status: 'all',
    warehouse: 'all',
  })
  const [showCSVUploader, setShowCSVUploader] = useState(false)

  useEffect(() => {
    async function load() {
      const data = await getOrders(50)
      setOrders(data)
      setLoading(false)
    }
    load()
  }, [])

  const filteredOrders = orders.filter((order) => {
    if (filters.status !== 'all' && order.warehouse_status.toLowerCase() !== filters.status) return false
    if (filters.warehouse !== 'all' && (order as Order & { warehouse?: string }).warehouse !== filters.warehouse) return false
    return true
  })

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
            <p className="text-muted-foreground mt-1">Gestiona y realiza el seguimiento de todos los pedidos</p>
          </div>
          <button
            onClick={() => setShowCSVUploader(!showCSVUploader)}
            className="px-4 py-2 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors text-sm"
          >
            {showCSVUploader ? 'Cancelar' : 'Cargar CSV'}
          </button>
        </div>

        {/* CSV Uploader Section */}
        {showCSVUploader && (
          <CSVUploader
            onDataLoaded={(orders) => {
              console.log('CSV cargado:', orders)
            }}
          />
        )}

        {/* Filters */}
        <div className="mb-6 flex gap-3">
          <div className="relative">
            <select
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
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
              onChange={(e) => setFilters({ ...filters, warehouse: e.target.value })}
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
        <div className="rounded-lg border border-border bg-card overflow-hidden">
          {/* Sticky Header */}
          <div className="sticky top-0 z-10 border-b border-border bg-secondary/60 backdrop-blur">
  <div className="grid grid-cols-[170px_2fr_110px_2fr_130px_140px_40px] gap-4 px-6 py-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
    <div>Pedido</div>
    <div>Cliente</div>
    <div>Fecha</div>
    <div>Envío</div>
    <div>Estado</div>
    <div className="text-right">Importe</div>
    <div />
  </div>
</div>

          {/* Order Rows */}
          <div className="divide-y divide-border max-h-96 overflow-y-auto">
            {filteredOrders.map((order) => (
              <div
              key={order.id}
              className="grid grid-cols-[170px_2fr_110px_2fr_130px_140px_40px] gap-4 items-center border-l-4 border-l-transparent px-6 py-5 transition-all hover:border-l-primary hover:bg-secondary/40"
            >
              <div>
                <p className="font-semibold text-primary">
                  {order.id}
                </p>
              </div>
            
              <div className="min-w-0">
                <p className="truncate font-semibold">
                  {order.customer_name}
                </p>
            
                <p className="truncate text-xs text-muted-foreground">
                  {order.customer_email}
                </p>
              </div>
            
              <div>
                <p className="font-medium">
                  {formatDate(order.purchase_date).split(" ")[0]}
                </p>
            
                <p className="text-xs text-muted-foreground">
                  {formatDate(order.purchase_date).split(" ")[1]}
                </p>
              </div>
            
              <div>
                <p className="font-medium">
                  {shortShipping(order.shipping_method).title}
                </p>
            
                <p className="truncate text-xs text-muted-foreground">
                  {shortShipping(order.shipping_method).subtitle}
                </p>
              </div>
            
              <div>
                <span
                  className={`inline-flex rounded-md px-3 py-1 text-xs font-semibold ${
                    statusColors[
                      order.warehouse_status.toLowerCase() as keyof typeof statusColors
                    ]
                  }`}
                >
                  {order.warehouse_status}
                </span>
              </div>
            
              <div className="text-right font-semibold tabular-nums">
                {new Intl.NumberFormat("es-AR", {
                  style: "currency",
                  currency: "ARS",
                }).format(order.grand_total)}
              </div>
            
              <div className="flex justify-center">
                <ChevronRight className="h-5 w-5 text-primary" />
              </div>
            </div>
            ))}
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
  )
}
