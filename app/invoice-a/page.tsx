'use client'

import { Sidebar } from '@/components/sidebar'
import { TopBar } from '@/components/topbar'
import { Download, Filter } from 'lucide-react'

const invoices = [
  {
    id: 1,
    order: 'B-0000431256',
    customer: 'Juan García',
    company: 'García Consulting SL',
    cuit: '20-0489516-8',
    taxDiff: '-$5.000',
    paid: 'si',
    status: 'generada',
    amount: '$345.990',
  },
  {
    id: 2,
    order: 'B-0000431255',
    customer: 'Carlos Rodríguez',
    company: 'Rodríguez Tech LLC',
    cuit: '20-35895748-8',
    taxDiff: '+$12.500',
    paid: 'No',
    status: 'pendiente',
    amount: '$234.75',
  },
  {
    id: 3,
    order: 'B-0000431254',
    customer: 'Luis Fernández',
    company: 'Fernández pedro',
    cuit: '20-36985748-8',
    taxDiff: '+$0.00',
    paid: 'si',
    status: 'generada',
    amount: '$456.990',
  },
]

const statusColors = {
  pendiente: 'bg-yellow-500/10 text-yellow-400',
  generada: 'bg-green-500/10 text-green-400',
  sent: 'bg-blue-500/10 text-blue-400',
}

export default function InvoiceAPage() {
  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <TopBar />

      {/* Main Content */}
      <main className="ml-64 mt-16 p-6">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Factura A</h1>
            <p className="text-muted-foreground mt-1">Gestiona facturas B2B y documentación fiscal</p>
          </div>
          <button className="flex items-center gap-2 rounded-lg border border-border px-4 py-2 hover:bg-secondary transition-colors text-sm font-medium">
            <Filter className="h-4 w-4" />
            Filtro
          </button>
        </div>

        {/* Table */}
        <div className="rounded-lg border border-border bg-card overflow-hidden">
          {/* Header */}
          <div className="sticky top-0 z-10 bg-secondary/50 border-b border-border">
            <div className="grid grid-cols-11 gap-4 px-6 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              <div className="col-span-1">Pedido</div>
              <div className="col-span-2">Cliente</div>
              <div className="col-span-2">Razon Social</div>
              <div className="col-span-1">CUIT</div>
              <div className="col-span-1">Impuesto</div>
              <div className="col-span-1">Pago</div>
              <div className="col-span-1">Estado</div>
              <div className="col-span-1">Accion</div>
            </div>
          </div>

          {/* Rows */}
          <div className="divide-y divide-border max-h-96 overflow-y-auto">
            {invoices.map((invoice) => (
              <div
                key={invoice.id}
                className="grid grid-cols-11 gap-4 px-6 py-4 hover:bg-secondary/30 transition-colors items-center"
              >
                <div className="col-span-1">
                  <span className="text-sm font-semibold text-primary">{invoice.order}</span>
                </div>
                <div className="col-span-2">
                  <span className="text-sm text-foreground">{invoice.customer}</span>
                </div>
                <div className="col-span-2">
                  <span className="text-sm text-muted-foreground">{invoice.company}</span>
                </div>
                <div className="col-span-1">
                  <span className="text-xs font-mono text-muted-foreground">{invoice.cuit}</span>
                </div>
                <div className="col-span-1">
                  <span className={`text-sm font-semibold ${invoice.taxDiff.startsWith('-') ? 'text-green-400' : 'text-orange-400'}`}>
                    {invoice.taxDiff}
                  </span>
                </div>
                <div className="col-span-1">
                  <span className="text-sm text-foreground">{invoice.paid}</span>
                </div>
                <div className="col-span-1">
                  <span className={`inline-block px-2 py-1 rounded text-xs font-semibold ${statusColors[invoice.status as keyof typeof statusColors]}`}>
                    {invoice.status.toUpperCase()}
                  </span>
                </div>
                <div className="col-span-1 flex gap-2">
                  <button className="p-1 hover:bg-primary/10 rounded transition-colors">
                    <Download className="h-4 w-4 text-primary" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Summary */}
        <div className="mt-6 grid grid-cols-3 gap-4">
          <div className="rounded-lg border border-border bg-card p-4">
            <p className="text-xs font-semibold text-muted-foreground uppercase">Facturas Totales</p>
            <p className="text-2xl font-bold text-foreground mt-2">3</p>
          </div>
          <div className="rounded-lg border border-border bg-card p-4">
            <p className="text-xs font-semibold text-muted-foreground uppercase">Pendientes por generar</p>
            <p className="text-2xl font-bold text-yellow-400 mt-2">1</p>
          </div>
          <div className="rounded-lg border border-border bg-card p-4">
            <p className="text-xs font-semibold text-muted-foreground uppercase">Valor total</p>
            <p className="text-2xl font-bold text-foreground mt-2">$1,037.73</p>
          </div>
        </div>
      </main>
    </div>
  )
}
