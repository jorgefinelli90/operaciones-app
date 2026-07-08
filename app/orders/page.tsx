'use client'

import { useState } from 'react'
import { Sidebar } from '@/components/sidebar'
import { TopBar } from '@/components/topbar'
import { CSVUploader } from '@/components/csv-uploader'
import { ChevronDown, Search, Filter, ChevronRight } from 'lucide-react'

const orders = [
  {
    id: 'B-000049339',
    date: '2026-07-06 10:16:06',
    customer: 'Guido Orioli',
    email: 'guidoorioliab@gmail.com',
    phone: '',
    method: 'Tarjeta de crédito/débito',
    warehouse: '',
    shipping: 'Andreani - Envío a domicilio (48hs a 72hs)',
    tracking: '',
    assigned: '',
    updated: '',
    status: 'processing',
    amount: '$246.638',
    address: 'Ascasubi 472, Bell Ville, Córdoba 2550',
  },
  {
    id: 'B-000049338',
    date: '2026-07-06 02:35:34',
    customer: 'Pablo R Rivas',
    email: 'pablorivasok@gmail.com',
    phone: '',
    method: 'Tarjeta de crédito/débito',
    warehouse: '',
    shipping: 'Treggo - Same Day / Next Day',
    tracking: '',
    assigned: '',
    updated: '',
    status: 'complete',
    amount: '$188.595,20',
    address: 'Pantaleon Rivarola 2451 21, CABA 1417',
  },
  {
    id: 'B-000049337',
    date: '2026-07-06 00:34:03',
    customer: 'Juan Lupinucci',
    email: 'dia.lupinuccijuan2@gmail.com',
    phone: '',
    method: 'Transferencia bancaria - 15% descuento',
    warehouse: 'Alcorta Shopping',
    shipping: 'Retiro en tienda - Alcorta Shopping',
    tracking: '',
    assigned: '',
    updated: '',
    status: 'complete',
    amount: '$152.991',
    address: 'Paunero 2865 8 A, CABA 1425',
  },
  {
    id: 'B-000049336',
    date: '2026-07-06 00:07:00',
    customer: 'Juan Lupinucci',
    email: 'dia.lupinuccijuan2@gmail.com',
    phone: '',
    method: 'Transferencia bancaria - 15% descuento',
    warehouse: 'Alcorta Shopping',
    shipping: 'Retiro en tienda - Alcorta Shopping',
    tracking: '',
    assigned: '',
    updated: '',
    status: 'canceled',
    amount: '$152.991',
    address: 'Paunero 2865 8 A, CABA 1425',
  },
  {
    id: 'B-000049335',
    date: '2026-07-05 23:59:19',
    customer: 'Jorge Rocha',
    email: 'jorgerochapadilla@gmail.com',
    phone: '',
    method: 'Transferencia bancaria - 15% descuento',
    warehouse: 'Unicenter Shopping',
    shipping: 'Retiro en tienda - Unicenter Shopping',
    tracking: '',
    assigned: '',
    updated: '',
    status: 'canceled',
    amount: '$84.745',
    address: 'Ventura Bosch 7223, Liniers, Buenos Aires 1408',
  },
  {
    id: 'B-000049334',
    date: '2026-07-05 23:54:30',
    customer: 'Anabella Kleiman',
    email: 'kleimanabella@gmail.com',
    phone: '',
    method: 'Transferencia bancaria - 15% descuento',
    warehouse: '',
    shipping: 'Treggo - Envío a domicilio',
    tracking: '',
    assigned: '',
    updated: '',
    status: 'complete',
    amount: '$35.509',
    address: 'La Pampa 2975 10 01, CABA',
  },
];

const statusColors = {
  pendiente: 'bg-yellow-500/10 text-yellow-400',
  despachado: 'bg-blue-500/10 text-blue-400',
  enviado: 'bg-green-500/10 text-green-400',
  producto_faltante: 'bg-red-500/10 text-red-400',
  devuelto: 'bg-orange-500/10 text-orange-400',
  cambio: 'bg-purple-500/10 text-purple-400',
}

const CSV_REQUIRED_HEADERS = [
  'ID',
  'Purchase Date',
  'Bill-to Name',
  'Grand Total (Base)',
  'Status',
  'Billing Address',
  'Shipping Information',
  'Customer Email',
  'Payment Method',
  'Pickup Store Name',
]

export default function OrdersPage() {
  const [filters, setFilters] = useState({
    status: 'all',
    warehouse: 'all',
  })
  const [showCSVUploader, setShowCSVUploader] = useState(false)

  const filteredOrders = orders.filter((order) => {
    if (filters.status !== 'all' && order.status !== filters.status) return false
    if (filters.warehouse !== 'all' && order.warehouse !== filters.warehouse) return false
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
            requiredHeaders={CSV_REQUIRED_HEADERS}
            onDataLoaded={(data) => {
              console.log('CSV cargado:', data)
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
          <div className="sticky top-0 z-10 bg-secondary/50 border-b border-border">
            <div className="grid gap-4 px-6 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              <div style={{ gridColumn: '1 / span 1' }}>Pedido</div>
              <div style={{ gridColumn: '2 / span 2' }}>Cliente</div>
              <div style={{ gridColumn: '4 / span 1' }}>Fecha</div>
              <div style={{ gridColumn: '5 / span 1' }}>Deposito</div>
              <div style={{ gridColumn: '6 / span 1' }}>Envio</div>
              <div style={{ gridColumn: '7 / span 1' }}>Guia</div>
              <div style={{ gridColumn: '8 / span 1' }}>Usuario</div>
              <div style={{ gridColumn: '9 / span 1' }}>Estado</div>
              <div style={{ gridColumn: '10 / span 1' }}>Importe</div>
              <div style={{ gridColumn: '11 / span 1' }}></div>
            </div>
          </div>

          {/* Order Rows */}
          <div className="divide-y divide-border max-h-96 overflow-y-auto">
            {filteredOrders.map((order) => (
              <div
                key={order.id}
                className="grid gap-4 px-6 py-3 hover:bg-secondary/30 transition-colors cursor-pointer items-center border-l-4 border-l-transparent hover:border-l-primary text-sm"
              >
                <div style={{ gridColumn: '1 / span 1' }}>
                  <span className="font-semibold text-primary">{order.id}</span>
                </div>
                <div style={{ gridColumn: '2 / span 2' }}>
                  <p className="font-medium text-foreground">{order.customer}</p>
                  <p className="text-xs text-muted-foreground">{order.email}</p>
                </div>
                <div style={{ gridColumn: '4 / span 1' }} className="text-muted-foreground">
                  {order.date}
                </div>
                <div style={{ gridColumn: '5 / span 1' }} className="text-foreground">
                  {order.warehouse}
                </div>
                <div style={{ gridColumn: '6 / span 1' }} className="text-foreground">
                  {order.shipping}
                </div>
                <div style={{ gridColumn: '7 / span 1' }} className="text-muted-foreground text-xs font-mono">
                  {order.tracking}
                </div>
                <div style={{ gridColumn: '8 / span 1' }} className="text-foreground">
                  {order.assigned}
                </div>
                <div style={{ gridColumn: '9 / span 1' }}>
                  <span className={`inline-block px-2 py-1 rounded text-xs font-semibold ${statusColors[order.status as keyof typeof statusColors]}`}>
                    {order.status.replace('_', ' ').toUpperCase()}
                  </span>
                </div>
                <div style={{ gridColumn: '10 / span 1' }} className="font-semibold text-foreground">
                  {order.amount}
                </div>
                <div style={{ gridColumn: '11 / span 1' }}>
                  <button className="p-2 hover:bg-primary/10 rounded transition-colors">
                    <ChevronRight className="h-4 w-4 text-primary" />
                  </button>
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
