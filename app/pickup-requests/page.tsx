'use client'

import { Sidebar } from '@/components/sidebar'
import { TopBar } from '@/components/topbar'
import { Truck, CheckCircle2, Clock, Filter } from 'lucide-react'

const pickups = [
  {
    id: 1,
    order: 'B-000049338',
    pickupNum: 'PU-001-2024',
    carrier: 'Treggo',
    status: 'programado',
    tracking: '45157781121',
    date: '2024-01-16 10:00',
  },
  {
    id: 2,
    order: 'B-000049335',
    pickupNum: 'PU-002-2024',
    carrier: 'Treggo',
    status: 'en_progreso',
    tracking: '4541515545',
    date: '2024-01-16 14:30',
  },
  {
    id: 3,
    order: 'B-000049336',
    pickupNum: 'PU-003-2024',
    carrier: 'Andreani',
    status: 'completo',
    tracking: '45445151511',
    date: '2024-01-15 16:45',
  },
  {
    id: 4,
    order: 'B-000049337',
    pickupNum: 'PU-004-2024',
    carrier: 'Andreani',
    status: 'pendiente',
    tracking: '454451551887',
    date: '2024-01-17 09:00',
  },
]

const statusColors = {
  pendiente: 'bg-yellow-500/10 text-yellow-400',
  programado: 'bg-blue-500/10 text-blue-400',
  en_progreso: 'bg-purple-500/10 text-purple-400',
  completo: 'bg-green-500/10 text-green-400',
}

const statusIcons = {
  pendiente: Clock,
  programado: Truck,
  en_progreso: Truck,
  completo: CheckCircle2,
}

export default function PickupRequestsPage() {
  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <TopBar />

      {/* Main Content */}
      <main className="ml-64 mt-16 p-6">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Solicitudes de Recogida</h1>
            <p className="text-muted-foreground mt-1">Gestiona recogidas de devolución y logística inversa</p>
          </div>
          <button className="flex items-center gap-2 rounded-lg border border-border px-4 py-2 hover:bg-secondary transition-colors text-sm font-medium">
            <Filter className="h-4 w-4" />
            Filtro
          </button>
        </div>

        {/* Table */}
        <div className="rounded-lg border border-border bg-card overflow-hidden">
          {/* Header */}
          <div className="sticky top-0 bg-secondary/50 border-b border-border">
            <div className="grid grid-cols-8 gap-4 px-6 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              <div className="col-span-1">Pedido</div>
              <div className="col-span-1">Pickup #</div>
              <div className="col-span-1">Envio</div>
              <div className="col-span-1">Tracking</div>
              <div className="col-span-1">Estado</div>
              <div className="col-span-1">Fecha</div>
              <div className="col-span-1">Accion</div>
            </div>
          </div>

          {/* Rows */}
          <div className="divide-y divide-border">
            {pickups.map((pickup) => {
              const StatusIcon = statusIcons[pickup.status as keyof typeof statusIcons]
              return (
                <div
                  key={pickup.id}
                  className="grid grid-cols-8 gap-4 px-6 py-4 hover:bg-secondary/30 transition-colors items-center"
                >
                  <div className="col-span-1">
                    <span className="text-sm font-semibold text-primary">{pickup.order}</span>
                  </div>
                  <div className="col-span-1">
                    <span className="text-sm text-foreground">{pickup.pickupNum}</span>
                  </div>
                  <div className="col-span-1">
                    <span className="text-sm text-muted-foreground">{pickup.carrier}</span>
                  </div>
                  <div className="col-span-1">
                    <span className="text-xs font-mono text-muted-foreground">{pickup.tracking}</span>
                  </div>
                  <div className="col-span-1">
                    <div className="flex items-center gap-2">
                      <StatusIcon className="h-4 w-4" />
                      <span className={`inline-block px-2 py-1 rounded text-xs font-semibold ${statusColors[pickup.status as keyof typeof statusColors]}`}>
                        {pickup.status.replace('_', ' ').toUpperCase()}
                      </span>
                    </div>
                  </div>
                  <div className="col-span-1">
                    <span className="text-sm text-foreground">{pickup.date}</span>
                  </div>
                  <div className="col-span-1">
                    <button className="px-3 py-1 rounded text-xs font-semibold bg-primary/10 text-primary hover:bg-primary/20 transition-colors">
                      Ver
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Summary Stats */}
        <div className="mt-6 grid grid-cols-4 gap-4">
          <div className="rounded-lg border border-border bg-card p-4">
            <p className="text-xs font-semibold text-muted-foreground uppercase">Total</p>
            <p className="text-2xl font-bold text-foreground mt-2">4</p>
          </div>
          <div className="rounded-lg border border-border bg-card p-4">
            <p className="text-xs font-semibold text-muted-foreground uppercase">Pendiente</p>
            <p className="text-2xl font-bold text-yellow-400 mt-2">1</p>
          </div>
          <div className="rounded-lg border border-border bg-card p-4">
            <p className="text-xs font-semibold text-muted-foreground uppercase">En Progreso</p>
            <p className="text-2xl font-bold text-purple-400 mt-2">1</p>
          </div>
          <div className="rounded-lg border border-border bg-card p-4">
            <p className="text-xs font-semibold text-muted-foreground uppercase">Completo</p>
            <p className="text-2xl font-bold text-green-400 mt-2">2</p>
          </div>
        </div>
      </main>
    </div>
  )
}
