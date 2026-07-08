'use client'

import { Sidebar } from '@/components/sidebar'
import { TopBar } from '@/components/topbar'
import { Filter, Truck } from 'lucide-react'

const exchanges = [
  {
    id: 1,
    order: 'ORD-2024-007',
    customer: 'Isabella García',
    original: 'Chaqueta Azul - Talla M',
    requested: 'Chaqueta Azul - Talla L',
    priceDiff: '+$0.00',
    returnStatus: 'pendiente',
    dispatchStatus: 'pendiente',
    tracking: 'TRK-001-EX',
  },
  {
    id: 2,
    order: 'ORD-2024-010',
    customer: 'Francisco Torres',
    original: 'Zapatillas Blancas - Talla 9',
    requested: 'Zapatillas Blancas - Talla 10',
    priceDiff: '+$0.00',
    returnStatus: 'en_transito',
    dispatchStatus: 'listo',
    tracking: 'TRK-002-EX',
  },
  {
    id: 3,
    order: 'ORD-2024-013',
    customer: 'Laura Sánchez',
    original: 'Vestido de Verano - Talla S',
    requested: 'Vestido de Verano - Talla M',
    priceDiff: '-$5.00',
    returnStatus: 'recibido',
    dispatchStatus: 'despachado',
    tracking: 'TRK-003-EX',
  },
]

const statusColors = {
  pendiente: 'bg-yellow-500/10 text-yellow-400',
  en_transito: 'bg-blue-500/10 text-blue-400',
  recibido: 'bg-green-500/10 text-green-400',
  listo: 'bg-cyan-500/10 text-cyan-400',
  despachado: 'bg-emerald-500/10 text-emerald-400',
}

export default function ExchangesPage() {
  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <TopBar />

      {/* Main Content */}
      <main className="ml-64 mt-16 p-6">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Cambios</h1>
            <p className="text-muted-foreground mt-1">Track product exchanges and replacements</p>
          </div>
          <button className="flex items-center gap-2 rounded-lg border border-border px-4 py-2 hover:bg-secondary transition-colors text-sm font-medium">
            <Filter className="h-4 w-4" />
            Filter
          </button>
        </div>

        {/* Exchanges Table */}
        <div className="rounded-lg border border-border bg-card overflow-hidden">
          {/* Header */}
          <div className="sticky top-0 bg-secondary/50 border-b border-border">
            <div className="grid grid-cols-11 gap-4 px-6 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              <div className="col-span-1">Pedido</div>
              <div className="col-span-2">Cliente</div>
              <div className="col-span-2">Producto Original</div>
              <div className="col-span-2">Producto Solicitado</div>
              <div className="col-span-1">Precio</div>
              <div className="col-span-2">Estado</div>
              <div className="col-span-1">Accion</div>
            </div>
          </div>

          {/* Rows */}
          <div className="divide-y divide-border">
            {exchanges.map((exchange) => (
              <div key={exchange.id} className="grid grid-cols-11 gap-4 px-6 py-4 hover:bg-secondary/30 transition-colors items-center">
                <div className="col-span-1">
                  <span className="text-sm font-semibold text-primary">{exchange.order}</span>
                </div>
                <div className="col-span-2">
                  <span className="text-sm text-foreground">{exchange.customer}</span>
                </div>
                <div className="col-span-2">
                  <span className="text-sm text-muted-foreground">{exchange.original}</span>
                </div>
                <div className="col-span-2">
                  <span className="text-sm text-foreground font-medium">{exchange.requested}</span>
                </div>
                <div className="col-span-1">
                  <span className="text-sm font-semibold text-foreground">{exchange.priceDiff}</span>
                </div>
                <div className="col-span-2 flex gap-2">
                  <span className={`inline-block px-2 py-1 rounded text-xs font-semibold ${statusColors[exchange.returnStatus as keyof typeof statusColors]}`}>
                    Retorno: {exchange.returnStatus}
                  </span>
                  <span className={`inline-block px-2 py-1 rounded text-xs font-semibold ${statusColors[exchange.dispatchStatus as keyof typeof statusColors]}`}>
                    Envio: {exchange.dispatchStatus}
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

        {/* Timeline Section */}
        <div className="mt-8">
          <h2 className="text-lg font-bold text-foreground mb-4">Historial del cambio:</h2>
          <div className="rounded-lg border border-border bg-card p-6">
            <div className="space-y-6">
              {[
                { stage: 'Devolución Iniciada', status: 'complete', description: 'Cliente solicitó cambio' },
                { stage: 'Artículo Original en Tránsito', status: 'complete', description: 'Etiqueta de devolución enviada al cliente' },
                { stage: 'Artículo Recibido', status: 'complete', description: 'Devolución recibida en almacén' },
                { stage: 'Reemplazo Preparado', status: 'in_progress', description: 'Nuevo artículo siendo preparado' },
                { stage: 'Despachado', status: 'pendiente', description: 'Reemplazo listo para ser enviado' },
              ].map((item, idx) => (
                <div key={idx} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className={`h-4 w-4 rounded-full ${
                      item.status === 'complete' ? 'bg-green-500' :
                      item.status === 'in_progress' ? 'bg-blue-500' :
                      'bg-muted'
                    }`}></div>
                    {idx < 4 && <div className="h-12 w-0.5 bg-border mt-2"></div>}
                  </div>
                  <div className="pb-4">
                    <p className="font-semibold text-foreground">{item.stage}</p>
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
