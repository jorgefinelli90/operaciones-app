'use client'

import { Sidebar } from '@/components/sidebar'
import { TopBar } from '@/components/topbar'
import { Filter, MessageSquare } from 'lucide-react'

const returns = [
  {
    id: 1,
    order: 'ORD-2024-002',
    customer: 'María López',
    product: 'Zapatos para Correr - Talla 8',
    condition: 'Sin usar, embalaje original',
    courier: 'Treggo',
    status: 'received',
    updated: 'hace 2 horas',
  },
  {
    id: 2,
    order: 'ORD-2024-005',
    customer: 'Pedro Sánchez',
    product: 'Chaqueta de Cuero',
    condition: 'Usado, daño leve',
    courier: 'Andreani',
    status: 'received',
    updated: 'hace 4 horas',
  },
  {
    id: 3,
    order: 'ORD-2024-011',
    customer: 'Isabel García',
    product: 'Reloj Inteligente - Azul',
    condition: 'Buen estado',
    courier: 'Pickup',
    status: 'in_transit',
    updated: 'hace 1 día',
  },
  {
    id: 4,
    order: 'ORD-2024-014',
    customer: 'Diego López',
    product: 'Abrigo de Invierno',
    condition: 'Mancha menor',
    courier: 'Andreani',
    status: 'warehouse_review',
    updated: 'hace 2 días',
  },
]

const statusColors = {
  received: 'bg-green-500/10 text-green-400',
  in_transit: 'bg-blue-500/10 text-blue-400',
  warehouse_review: 'bg-yellow-500/10 text-yellow-400',
  processed: 'bg-emerald-500/10 text-emerald-400',
}

const statusLabels = {
  received: 'Recibido',
  in_transit: 'En Tránsito',
  warehouse_review: 'Revisión en Deposito',
  processed: 'Procesado',
}

export default function ReturnsPage() {
  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <TopBar />

      {/* Main Content */}
      <main className="ml-64 mt-16 p-6">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Devoluciones</h1>
            <p className="text-muted-foreground mt-1">Gestiona artículos devueltos y logística inversa</p>
          </div>
          <button className="flex items-center gap-2 rounded-lg border border-border px-4 py-2 hover:bg-secondary transition-colors text-sm font-medium">
            <Filter className="h-4 w-4" />
            Filtro
          </button>
        </div>

        {/* Returns Grid */}
        <div className="space-y-4">
          {returns.map((ret) => (
            <div key={ret.id} className="rounded-lg border border-border bg-card p-6 hover:border-primary/30 transition-colors">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-sm font-semibold text-muted-foreground">Pedido & Cliente</p>
                  <p className="text-lg font-bold text-primary">{ret.order}</p>
                  <p className="text-sm text-foreground mt-1">{ret.customer}</p>
                </div>
                <span className={`inline-block px-3 py-1 rounded-lg text-sm font-semibold ${statusColors[ret.status as keyof typeof statusColors]}`}>
                  {statusLabels[ret.status as keyof typeof statusLabels]}
                </span>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase">Producto</p>
                  <p className="text-sm text-foreground mt-1">{ret.product}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase">Condicion</p>
                  <p className="text-sm text-foreground mt-1">{ret.condition}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase">Logistica</p>
                  <p className="text-sm text-foreground mt-1">{ret.courier}</p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-border">
                <p className="text-xs text-muted-foreground">Actualizado {ret.updated}</p>
                <div className="flex gap-2">
                  <button className="flex items-center gap-1 px-3 py-1 rounded text-xs font-semibold bg-primary/10 text-primary hover:bg-primary/20 transition-colors">
                    <MessageSquare className="h-3.5 w-3.5" />
                    Agregar Nota
                  </button>
                  <button className="px-3 py-1 rounded text-xs font-semibold bg-secondary hover:bg-secondary/80 text-foreground transition-colors">
                    Ver Detalles
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Stats */}
        <div className="mt-8 grid grid-cols-4 gap-4">
          <div className="rounded-lg border border-border bg-card p-4">
            <p className="text-xs font-semibold text-muted-foreground uppercase">Total Devoluciones</p>
            <p className="text-2xl font-bold text-foreground mt-2">4</p>
          </div>
          <div className="rounded-lg border border-border bg-card p-4">
            <p className="text-xs font-semibold text-muted-foreground uppercase">En Tránsito</p>
            <p className="text-2xl font-bold text-blue-400 mt-2">1</p>
          </div>
          <div className="rounded-lg border border-border bg-card p-4">
            <p className="text-xs font-semibold text-muted-foreground uppercase">Recibido</p>
            <p className="text-2xl font-bold text-green-400 mt-2">2</p>
          </div>
          <div className="rounded-lg border border-border bg-card p-4">
            <p className="text-xs font-semibold text-muted-foreground uppercase">Pending Review</p>
            <p className="text-2xl font-bold text-yellow-400 mt-2">1</p>
          </div>
        </div>
      </main>
    </div>
  )
}
