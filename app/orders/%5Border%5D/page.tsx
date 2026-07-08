'use client'

import { useState } from 'react'
import { Sidebar } from '@/components/sidebar'
import { TopBar } from '@/components/topbar'
import { ChevronLeft, Clock, MapPin, Package, Phone, Mail, MessageSquare, Download } from 'lucide-react'

const timeline = [
  {
    date: '2024-01-15',
    time: '14:32',
    user: 'Sistema',
    action: 'Pedido Creado',
    description: 'Pedido recibido de Magento',
  },
  {
    date: '2024-01-15',
    time: '14:35',
    user: 'Almacén',
    action: 'Almacén Iniciado',
    description: 'Pedido enviado a cola de preparación',
  },
  {
    date: '2024-01-15',
    time: '15:12',
    user: 'María',
    action: 'Producto Faltante Detectado',
    description: 'SKU-45892 no disponible en stock',
  },
  {
    date: '2024-01-15',
    time: '15:45',
    user: 'Soporte',
    action: 'Cliente Contactado',
    description: 'Email enviado solicitando preferencia',
  },
  {
    date: '2024-01-16',
    time: '09:20',
    user: 'Cliente',
    action: 'Reemplazo Aprobado',
    description: 'Cliente aceptó artículo de reemplazo',
  },
]

export default function OrderDetailPage() {
  const [activeTab, setActiveTab] = useState('overview')

  const tabs = [
    { id: 'overview', label: 'Descripción General' },
    { id: 'timeline', label: 'Línea de Tiempo' },
    { id: 'products', label: 'Productos' },
    { id: 'missing', label: 'Productos Faltantes' },
    { id: 'invoices', label: 'Facturas' },
    { id: 'activity', label: 'Registro de Actividad' },
  ]

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <TopBar />

      {/* Main Content */}
      <main className="ml-64 mt-16 p-6">
        {/* Header */}
        <div className="mb-6 flex items-center gap-4">
          <button className="p-2 hover:bg-secondary rounded-lg transition-colors">
            <ChevronLeft className="h-5 w-5 text-foreground" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-foreground">ORD-2024-001</h1>
            <p className="text-muted-foreground mt-1">Pedido realizado el 15 de enero de 2024</p>
          </div>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="col-span-2">
            {/* Tabs */}
            <div className="mb-6 rounded-lg border border-border bg-card">
              <div className="flex border-b border-border">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                      activeTab === tab.id
                        ? 'border-b-primary text-primary'
                        : 'border-b-transparent text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Tab Content */}
              <div className="p-6">
                {activeTab === 'overview' && (
                  <div className="space-y-6">
                    {/* Order Status */}
                    <div>
                      <h3 className="text-sm font-semibold text-muted-foreground uppercase mb-3">Order Status</h3>
                      <div className="inline-block px-3 py-1 rounded-lg bg-red-500/10 text-red-400 text-sm font-semibold">
                        Missing Product
                      </div>
                    </div>

                    {/* Customer Info */}
                    <div>
                      <h3 className="text-sm font-semibold text-muted-foreground uppercase mb-3">Customer Information</h3>
                      <div className="space-y-2">
                        <p className="text-foreground font-medium">Juan García</p>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Mail className="h-4 w-4" />
                          juan@example.com
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Phone className="h-4 w-4" />
                          +34-91-234-5678
                        </div>
                      </div>
                    </div>

                    {/* Shipping Information */}
                    <div>
                      <h3 className="text-sm font-semibold text-muted-foreground uppercase mb-3">Información de Envío</h3>
                      <div className="space-y-2">
                        <div className="flex items-start gap-2">
                          <MapPin className="h-4 w-4 mt-0.5 text-muted-foreground flex-shrink-0" />
                          <div className="text-sm">
                            <p className="font-medium text-foreground">Dirección de Entrega</p>
                            <p className="text-muted-foreground">Calle Mayor 123, 28001 Madrid, España</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-2 mt-3">
                          <Package className="h-4 w-4 mt-0.5 text-muted-foreground flex-shrink-0" />
                          <div className="text-sm">
                            <p className="font-medium text-foreground">Número de Rastreo</p>
                            <p className="text-muted-foreground font-mono">TRK-001-2024</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Products */}
                    <div>
                      <h3 className="text-sm font-semibold text-muted-foreground uppercase mb-3">Productos</h3>
                      <div className="space-y-3 border border-border rounded-lg p-3">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium text-foreground">Luxury Pillow - White</p>
                            <p className="text-xs text-muted-foreground">SKU: SKU-45892</p>
                          </div>
                          <span className="text-sm font-semibold text-foreground">$345.99</span>
                        </div>
                        <div className="text-xs text-muted-foreground pt-2 border-t border-border">
                          <p>Cantidad: 1 | Estado: Faltante en almacén</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'timeline' && (
                  <div className="space-y-4">
                    {timeline.map((event, idx) => (
                      <div key={idx} className="flex gap-4">
                        <div className="flex flex-col items-center">
                          <div className="h-3 w-3 rounded-full bg-primary"></div>
                          {idx < timeline.length - 1 && <div className="h-12 w-0.5 bg-border mt-2"></div>}
                        </div>
                        <div className="pb-4 flex-1">
                          <div className="flex items-baseline gap-2">
                            <p className="font-semibold text-foreground">{event.action}</p>
                            <span className="text-xs text-muted-foreground">{event.date} at {event.time}</span>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">{event.description}</p>
                          <p className="text-xs text-muted-foreground mt-1">by {event.user}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {activeTab === 'products' && (
                  <div className="space-y-3">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-border">
                          <th className="text-left py-2 font-semibold text-muted-foreground">Product</th>
                          <th className="text-left py-2 font-semibold text-muted-foreground">SKU</th>
                          <th className="text-right py-2 font-semibold text-muted-foreground">Price</th>
                          <th className="text-right py-2 font-semibold text-muted-foreground">Qty</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b border-border">
                          <td className="py-3 text-foreground">Luxury Pillow - White</td>
                          <td className="py-3 text-muted-foreground font-mono">SKU-45892</td>
                          <td className="py-3 text-right text-foreground">$345.99</td>
                          <td className="py-3 text-right text-foreground">1</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                )}

                {activeTab === 'missing' && (
                  <div className="rounded-lg bg-red-500/10 border border-red-500/20 p-4">
                    <h4 className="font-semibold text-red-400 mb-2">Missing Product</h4>
                    <p className="text-sm text-red-400/80">SKU-45892 - Luxury Pillow - White</p>
                    <p className="text-xs text-red-400/60 mt-2">Status: Awaiting replacement approval</p>
                  </div>
                )}

                {activeTab === 'invoices' && (
                  <p className="text-muted-foreground text-sm">No invoices generated yet.</p>
                )}

                {activeTab === 'activity' && (
                  <p className="text-muted-foreground text-sm">Activity log will appear here.</p>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Summary Card */}
            <div className="rounded-lg border border-border bg-card p-6">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase mb-4">Order Summary</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Subtotal</span>
                  <span className="text-sm font-medium text-foreground">$345.99</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Shipping</span>
                  <span className="text-sm font-medium text-foreground">$0.00</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Tax</span>
                  <span className="text-sm font-medium text-foreground">$0.00</span>
                </div>
                <div className="border-t border-border pt-3 flex justify-between">
                  <span className="font-semibold text-foreground">Total</span>
                  <span className="font-semibold text-primary text-lg">$345.99</span>
                </div>
              </div>
            </div>

            {/* Actions Card */}
            <div className="rounded-lg border border-border bg-card p-6">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase mb-4">Acciones</h3>
              <div className="space-y-2">
                <button className="w-full px-4 py-2 rounded-lg bg-primary/10 text-primary text-sm font-semibold hover:bg-primary/20 transition-colors">
                  Editar Pedido
                </button>
                <button className="w-full px-4 py-2 rounded-lg bg-secondary hover:bg-secondary/80 text-foreground text-sm font-semibold transition-colors flex items-center justify-center gap-2">
                  <Download className="h-4 w-4" />
                  Descargar Factura
                </button>
                <button className="w-full px-4 py-2 rounded-lg bg-secondary hover:bg-secondary/80 text-foreground text-sm font-semibold transition-colors">
                  Imprimir Etiqueta
                </button>
              </div>
            </div>

            {/* Internal Notes */}
            <div className="rounded-lg border border-border bg-card p-6">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase mb-4">Notas Internas</h3>
              <textarea
                placeholder="Agregar notas sobre este pedido..."
                className="w-full h-24 rounded-lg bg-input border border-border px-3 py-2 text-sm text-foreground placeholder-muted-foreground resize-none focus:outline-none focus:ring-1 focus:ring-ring"
              />
              <button className="mt-2 w-full px-4 py-2 rounded-lg bg-primary/10 text-primary text-sm font-semibold hover:bg-primary/20 transition-colors">
                Guardar Nota
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
