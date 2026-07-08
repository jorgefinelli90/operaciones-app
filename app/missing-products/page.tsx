'use client'

import { Sidebar } from '@/components/sidebar'
import { TopBar } from '@/components/topbar'
import { ChevronDown, Filter } from 'lucide-react'

const missingProducts = [
  {
    id: 1,
    order: 'ORD-2024-001',
    product: 'Remera Canada',
    sku: 'T002121can10',
    price: '$345.99',
    status: 'looking',
    assigned: 'María García',
    updated: 'hace 2 horas',
  },
  {
    id: 2,
    order: 'ORD-2024-008',
    product: 'Sweater Giulio',
    sku: 'T002121can10',
    price: '$89.50',
    status: 'waiting',
    assigned: 'Carlos López',
    updated: 'hace 4 horas',
  },
  {
    id: 3,
    order: 'ORD-2024-012',
    product: 'Pantalon Merida',
    sku: 'SKU-67890',
    price: '$199.99',
    status: 'approved',
    assigned: 'Ana Martínez',
    updated: 'hace 1 día',
  },
  {
    id: 4,
    order: 'ORD-2024-015',
    product: 'Saco Jhon',
    sku: 'SKU-11111',
    price: '$129.99',
    status: 'coupon',
    assigned: 'Pedro Rodríguez',
    updated: 'hace 2 días',
  },
  {
    id: 5,
    order: 'ORD-2024-018',
    product: 'Remera Basic',
    sku: 'SKU-22222',
    price: '$79.99',
    status: 'refund',
    assigned: 'Luis Fernández',
    updated: 'hace 3 días',
  },
]

const statusOptions = {
  waiting: 'Esperando',
  looking: 'Buscando en Tiendas',
  approved: 'Reemplazo Aprobado',
  coupon: 'Cupón',
  refund: 'Reembolso',
  cancelled: 'Cancelado',
  resolved: 'Resuelto',
}

const statusColors = {
  waiting: 'bg-yellow-500/10 text-yellow-400',
  looking: 'bg-blue-500/10 text-blue-400',
  approved: 'bg-green-500/10 text-green-400',
  coupon: 'bg-purple-500/10 text-purple-400',
  refund: 'bg-orange-500/10 text-orange-400',
  cancelled: 'bg-red-500/10 text-red-400',
  resolved: 'bg-emerald-500/10 text-emerald-400',
}

export default function MissingProductsPage() {
  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <TopBar />

      {/* Main Content */}
      <main className="ml-64 mt-16 p-6">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Productos Faltantes</h1>
            <p className="text-muted-foreground mt-1">23 artículos faltantes de pedidos de clientes</p>
          </div>
          <button className="flex items-center gap-2 rounded-lg border border-border px-4 py-2 hover:bg-secondary transition-colors text-sm font-medium">
            <Filter className="h-4 w-4" />
            Filter
          </button>
        </div>

        {/* Table */}
        <div className="rounded-lg border border-border bg-card overflow-hidden">
          {/* Header */}
          <div className="sticky top-0 bg-secondary/50 border-b border-border">
            <div className="grid grid-cols-12 gap-4 px-6 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              <div className="col-span-2">Pedido</div>
              <div className="col-span-3">Producto</div>
              <div className="col-span-1">SKU</div>
              <div className="col-span-1">Precio</div>
              <div className="col-span-2">Estado</div>
              <div className="col-span-2">Asignado a</div>
              <div className="col-span-1">Acciones</div>
            </div>
          </div>

          {/* Rows */}
          <div className="divide-y divide-border">
            {missingProducts.map((item) => (
              <div
                key={item.id}
                className="grid grid-cols-12 gap-4 px-6 py-4 hover:bg-secondary/30 transition-colors cursor-pointer items-center"
              >
                <div className="col-span-2">
                  <span className="text-sm font-semibold text-primary">{item.order}</span>
                </div>
                <div className="col-span-3">
                  <p className="text-sm font-medium text-foreground">{item.product}</p>
                </div>
                <div className="col-span-1">
                  <span className="text-xs font-mono text-muted-foreground">{item.sku}</span>
                </div>
                <div className="col-span-1">
                  <span className="text-sm font-semibold text-foreground">{item.price}</span>
                </div>
                <div className="col-span-2">
                  <span className={`inline-block px-2 py-1 rounded text-xs font-semibold ${statusColors[item.status as keyof typeof statusColors]}`}>
                    {statusOptions[item.status as keyof typeof statusOptions]}
                  </span>
                </div>
                <div className="col-span-2">
                  <span className="text-sm text-foreground">{item.assigned}</span>
                </div>
                <div className="col-span-1">
                  <button className="px-3 py-1 rounded text-xs font-semibold bg-primary/10 text-primary hover:bg-primary/20 transition-colors">
                    Ver
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Summary Stats */}
        <div className="mt-6 grid grid-cols-4 gap-4">
          <div className="rounded-lg border border-border bg-card p-4">
            <p className="text-xs font-semibold text-muted-foreground uppercase">Total</p>
            <p className="text-2xl font-bold text-foreground mt-2">5</p>
          </div>
          <div className="rounded-lg border border-border bg-card p-4">
            <p className="text-xs font-semibold text-muted-foreground uppercase">Esperando Resolucion</p>
            <p className="text-2xl font-bold text-yellow-400 mt-2">2</p>
          </div>
          <div className="rounded-lg border border-border bg-card p-4">
            <p className="text-xs font-semibold text-muted-foreground uppercase">En Progreso</p>
            <p className="text-2xl font-bold text-blue-400 mt-2">2</p>
          </div>
          <div className="rounded-lg border border-border bg-card p-4">
            <p className="text-xs font-semibold text-muted-foreground uppercase">Resueltos</p>
            <p className="text-2xl font-bold text-green-400 mt-2">1</p>
          </div>
        </div>
      </main>
    </div>
  )
}
