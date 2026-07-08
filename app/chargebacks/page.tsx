'use client'

import { Sidebar } from '@/components/sidebar'
import { TopBar } from '@/components/topbar'
import { Filter, AlertTriangle } from 'lucide-react'

const chargebacks = [
  {
    id: 1,
    order: 'ORD-2024-020',
    customer: 'Juan Perez',
    payment: 'MercadoPago',
    clearsale: 'Under Review',
    amount: '$456.780',
    date: '2024-01-10',
    status: 'pendiente',
  },
  {
    id: 2,
    order: 'ORD-2024-019',
    customer: 'Jennifer Davis',
    payment: 'Decidir',
    clearsale: 'Approved',
    amount: '$123.450',
    date: '2024-01-08',
    status: 'documentation',
  },
  {
    id: 3,
    order: 'ORD-2024-017',
    customer: 'Michael Brown',
    payment: 'Payway',
    clearsale: 'Approved',
    amount: '$234.560',
    date: '2024-01-05',
    status: 'resolved',
  },
]

const statusColors = {
  pendiente: 'bg-red-500/10 text-red-400',
  documentation: 'bg-yellow-500/10 text-yellow-400',
  resolved: 'bg-green-500/10 text-green-400',
}

const statusLabels = {
  pendiente: 'PENDIENTE',
  documentation: 'DOCUMENTACIÓN',
  resolved: 'RESUELTO',
}

export default function ChargebacksPage() {
  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <TopBar />

      {/* Main Content */}
      <main className="ml-64 mt-16 p-6">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <AlertTriangle className="h-6 w-6 text-red-500" />
            <div>
              <h1 className="text-3xl font-bold text-foreground">Contracargos</h1>
              <p className="text-muted-foreground mt-1">Gestiona disputas de pago y contracargos</p>
            </div>
          </div>
          <button className="flex items-center gap-2 rounded-lg border border-border px-4 py-2 hover:bg-secondary transition-colors text-sm font-medium">
            <Filter className="h-4 w-4" />
            Filtro
          </button>
        </div>

        {/* Alert */}
        <div className="mb-6 rounded-lg border border-red-500/20 bg-red-500/5 p-4">
          <p className="text-sm text-red-400">
            <strong>⚠️ Acción Requerida:</strong> 1 contracargo requiere presentación de documentación dentro de 7 días.
          </p>
        </div>

        {/* Table */}
        <div className="rounded-lg border border-border bg-card overflow-hidden">
          {/* Header */}
          <div className="sticky top-0 bg-secondary/50 border-b border-border">
            <div className="grid grid-cols-10 gap-4 px-6 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              <div className="col-span-1">Pedido</div>
              <div className="col-span-2">Cliente</div>
              <div className="col-span-1">Metodo Pago</div>
              <div className="col-span-1">ClearSale</div>
              <div className="col-span-1">Monto</div>
              <div className="col-span-1">Fecha</div>
              <div className="col-span-1">Estado</div>
              <div className="col-span-1">Acciones</div>
            </div>
          </div>

          {/* Rows */}
          <div className="divide-y divide-border">
            {chargebacks.map((chargeback) => (
              <div
                key={chargeback.id}
                className="grid grid-cols-10 gap-4 px-6 py-4 hover:bg-secondary/30 transition-colors items-center"
              >
                <div className="col-span-1">
                  <span className="text-sm font-semibold text-primary">{chargeback.order}</span>
                </div>
                <div className="col-span-2">
                  <span className="text-sm text-foreground">{chargeback.customer}</span>
                </div>
                <div className="col-span-1">
                  <span className="text-sm text-muted-foreground">{chargeback.payment}</span>
                </div>
                <div className="col-span-1">
                  <span className={`inline-block px-2 py-1 rounded text-xs font-semibold ${
                    chargeback.clearsale === 'Approved' ? 'bg-green-500/10 text-green-400' :
                    chargeback.clearsale === 'Under Review' ? 'bg-yellow-500/10 text-yellow-400' :
                    'bg-blue-500/10 text-blue-400'
                  }`}>
                    {chargeback.clearsale}
                  </span>
                </div>
                <div className="col-span-1">
                  <span className="text-sm font-semibold text-foreground">{chargeback.amount}</span>
                </div>
                <div className="col-span-1">
                  <span className="text-sm text-muted-foreground">{chargeback.date}</span>
                </div>
                <div className="col-span-1">
                  <span className={`inline-block px-2 py-1 rounded text-xs font-semibold ${statusColors[chargeback.status as keyof typeof statusColors]}`}>
                    {statusLabels[chargeback.status as keyof typeof statusLabels]}
                  </span>
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

        {/* Documentation Checklist */}
        <div className="mt-8 rounded-lg border border-border bg-card p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Lista de Verificación de Documentación</h3>
          <div className="space-y-3">
            {[
              { item: 'Confirmación de pedido', complete: true },
              { item: 'Prueba de seguimiento de envío', complete: true },
              { item: 'Confirmación de entrega', complete: false },
              { item: 'Comunicación con el cliente', complete: false },
            ].map((doc, idx) => (
              <label key={idx} className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={doc.complete}
                  readOnly
                  className="h-4 w-4 rounded border-border bg-input cursor-pointer"
                />
                <span className={doc.complete ? 'text-muted-foreground line-through' : 'text-foreground'}>
                  {doc.item}
                </span>
              </label>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
