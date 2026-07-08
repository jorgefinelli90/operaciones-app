'use client'

import { Sidebar } from '@/components/sidebar'
import { TopBar } from '@/components/topbar'
import { Filter, Download } from 'lucide-react'

const creditNotes = [
  {
    id: 1,
    order: 'B-000045958',
    reason: 'Faltante',
    amount: '$345.990',
    code: 'COUPON-001-2024',
    type: 'Coupon',
    payment: 'Mercadopago',
    status: 'pendiente',
  },
  {
    id: 2,
    order: 'B-000045951',
    reason: 'Dañado en entrega',
    amount: '$567.250',
    code: 'CN-002-2024',
    type: 'Credit Note',
    payment: 'TALOPAY',
    status: 'aprobado',
  },
  {
    id: 3,
    order: 'B-000045955',
    reason: 'Devolucion Cliente',
    amount: '$234.500',
    code: 'COUPON-003-2024',
    type: 'Coupon',
    payment: 'Mercadopago',
    status: 'aplicado',
  },
  {
    id: 4,
    order: 'B-000045957',
    reason: 'Devolucion parcial',
    amount: '$89.990',
    code: 'CN-004-2024',
    type: 'devolucion',
    payment: 'Mercadopago',
    status: 'Procesado',
  },
]

const statusColors = {
  pendiente: 'bg-yellow-500/10 text-yellow-400',
  aprobado: 'bg-blue-500/10 text-blue-400',
  aplicado: 'bg-green-500/10 text-green-400',
  procesado: 'bg-emerald-500/10 text-emerald-400',
}

export default function CreditNotesPage() {
  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <TopBar />

      {/* Main Content */}
      <main className="ml-64 mt-16 p-6">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Notas de Crédito y Cupones</h1>
            <p className="text-muted-foreground mt-1">Gestiona reembolsos y créditos promocionales</p>
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
            <div className="grid grid-cols-8 gap-4 px-6 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              <div className="col-span-1">Pedido</div>
              <div className="col-span-2">Razon</div>
              <div className="col-span-1">Monto</div>
              <div className="col-span-1">Codigo</div>
              <div className="col-span-1">Tipo</div>
              <div className="col-span-1">Pago</div>
              <div className="col-span-1">Estado</div>
              <div className="col-span-1">Accion</div>
            </div>
          </div>

          {/* Rows */}
          <div className="divide-y divide-border max-h-96 overflow-y-auto">
            {creditNotes.map((note) => (
              <div
                key={note.id}
                className="grid grid-cols-8 gap-4 px-6 py-3 hover:bg-secondary/30 transition-colors items-center"
              >
                <div className="col-span-1">
                  <span className="text-sm font-semibold text-primary">{note.order}</span>
                </div>
                <div className="col-span-2">
                  <span className="text-sm text-foreground">{note.reason}</span>
                </div>
                <div className="col-span-1">
                  <span className="text-sm font-semibold text-foreground">{note.amount}</span>
                </div>
                <div className="col-span-1">
                  <span className="text-xs font-mono text-muted-foreground">{note.code}</span>
                </div>
                <div className="col-span-1">
                  <span className="text-sm text-foreground">{note.type}</span>
                </div>
                <div className="col-span-1">
                  <span className="text-sm text-muted-foreground">{note.payment}</span>
                </div>
                <div className="col-span-1">
                  <span className={`inline-block px-2 py-1 rounded text-xs font-semibold ${statusColors[note.status as keyof typeof statusColors]}`}>
                    {note.status.toUpperCase()}
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
        <div className="mt-6 grid grid-cols-4 gap-4">
          <div className="rounded-lg border border-border bg-card p-4">
            <p className="text-xs font-semibold text-muted-foreground uppercase">Valor Total</p>
            <p className="text-2xl font-bold text-foreground mt-2">$1,237.73</p>
          </div>
          <div className="rounded-lg border border-border bg-card p-4">
            <p className="text-xs font-semibold text-muted-foreground uppercase">Coupones</p>
            <p className="text-2xl font-bold text-purple-400 mt-2">2</p>
          </div>
          <div className="rounded-lg border border-border bg-card p-4">
            <p className="text-xs font-semibold text-muted-foreground uppercase">Notas de credito</p>
            <p className="text-2xl font-bold text-blue-400 mt-2">2</p>
          </div>
          <div className="rounded-lg border border-border bg-card p-4">
            <p className="text-xs font-semibold text-muted-foreground uppercase">Pendientes</p>
            <p className="text-2xl font-bold text-yellow-400 mt-2">1</p>
          </div>
        </div>
      </main>
    </div>
  )
}
