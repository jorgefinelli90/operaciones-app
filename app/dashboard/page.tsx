'use client'

import { Sidebar } from '@/components/sidebar'
import { TopBar } from '@/components/topbar'
import { BarChart3, Package, Truck, AlertCircle, RotateCw, ArrowRightLeft, FileText, CreditCard, TrendingUp } from 'lucide-react'

const kpis = [
  { label: 'Pedidos Pendientes', value: '247', change: '+12', icon: Package, color: 'bg-blue-500/10 text-blue-400' },
  { label: 'Pedidos Despachados Hoy', value: '89', change: '+5', icon: Truck, color: 'bg-green-500/10 text-green-400' },
  { label: 'Pedidos Entregados', value: '1,234', change: '+34', icon: TrendingUp, color: 'bg-emerald-500/10 text-emerald-400' },
  { label: 'Productos Faltantes', value: '23', change: '-2', icon: AlertCircle, color: 'bg-red-500/10 text-red-400' },
  { label: 'Devoluciones Esperando', value: '15', change: '+3', icon: RotateCw, color: 'bg-orange-500/10 text-orange-400' },
  { label: 'Cambios Abiertos', value: '8', change: '0', icon: ArrowRightLeft, color: 'bg-purple-500/10 text-purple-400' },
  { label: 'Factura A Pendiente', value: '34', change: '+7', icon: FileText, color: 'bg-cyan-500/10 text-cyan-400' },
  { label: 'Contracargos', value: '3', change: '-1', icon: CreditCard, color: 'bg-red-500/10 text-red-400' },
]

const recentTasks = [
  { id: 1, title: 'Resolver Producto Faltante - ORD-2024-001', priority: 'high', status: 'pending', user: 'María' },
  { id: 2, title: 'Revisar Artículo Devuelto - ORD-2024-002', priority: 'high', status: 'pending', user: 'Carlos' },
  { id: 3, title: 'Generar Factura A - ORD-2024-003', priority: 'medium', status: 'pending', user: 'Ana' },
  { id: 4, title: 'Crear Nota de Crédito - ORD-2024-004', priority: 'medium', status: 'pending', user: 'Pedro' },
  { id: 5, title: 'Confirmar Recogida - ORD-2024-005', priority: 'low', status: 'pending', user: 'Luis' },
]

const recentOrders = [
  { id: 'ORD-2024-001', customer: 'Juan García', date: '2024-01-15', status: 'missing_product', amount: '$345.99' },
  { id: 'ORD-2024-002', customer: 'María López', date: '2024-01-15', status: 'dispatched', amount: '$129.50' },
  { id: 'ORD-2024-003', customer: 'Carlos Rodríguez', date: '2024-01-14', status: 'delivered', amount: '$234.75' },
  { id: 'ORD-2024-004', customer: 'Ana Martínez', date: '2024-01-14', status: 'pending', amount: '$567.25' },
  { id: 'ORD-2024-005', customer: 'Pedro Sánchez', date: '2024-01-14', status: 'returned', amount: '$89.99' },
]

const statusLabels = {
  pending: 'PENDIENTE',
  dispatched: 'DESPACHADO',
  delivered: 'ENTREGADO',
  missing_product: 'PRODUCTO FALTANTE',
  returned: 'DEVUELTO',
}

const statusColors = {
  pending: 'bg-yellow-500/10 text-yellow-400',
  dispatched: 'bg-blue-500/10 text-blue-400',
  delivered: 'bg-green-500/10 text-green-400',
  missing_product: 'bg-red-500/10 text-red-400',
  returned: 'bg-orange-500/10 text-orange-400',
}

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <TopBar />

      {/* Main Content */}
      <main className="ml-64 mt-16 p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Panel de Control</h1>
          <p className="text-muted-foreground mt-1">Bienvenido de vuelta, Juan. Aquí está tu descripción general operativa.</p>
        </div>

        {/* KPI Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {kpis.map((kpi, idx) => {
            const Icon = kpi.icon
            return (
              <div key={idx} className="rounded-lg border border-border bg-card p-4 hover:border-primary/30 transition-colors">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{kpi.label}</p>
                    <p className="text-2xl font-bold text-foreground mt-2">{kpi.value}</p>
                    <p className="text-xs text-green-400 mt-1">{kpi.change} hoy</p>
                  </div>
                  <div className={`p-2 rounded-lg ${kpi.color}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* My Tasks */}
          <div className="lg:col-span-2 rounded-lg border border-border bg-card overflow-hidden">
            <div className="border-b border-border px-6 py-4">
              <h2 className="text-lg font-semibold text-foreground">Mis Tareas</h2>
            </div>
            <div className="divide-y divide-border">
              {recentTasks.map((task) => (
                <div key={task.id} className="flex items-center gap-4 px-6 py-3 hover:bg-secondary/50 transition-colors cursor-pointer">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">{task.title}</p>
                    <p className="text-xs text-muted-foreground mt-1">Asignado a {task.user}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${
                      task.priority === 'high' ? 'bg-red-500/10 text-red-400' :
                      task.priority === 'medium' ? 'bg-yellow-500/10 text-yellow-400' :
                      'bg-blue-500/10 text-blue-400'
                    }`}>
                      {task.priority.toUpperCase()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Warehouse Performance */}
          <div className="rounded-lg border border-border bg-card p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Estado del Almacén</h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-foreground font-medium">Eficiencia</span>
                  <span className="text-muted-foreground">94%</span>
                </div>
                <div className="h-2 rounded-full bg-secondary overflow-hidden">
                  <div className="h-full w-[94%] bg-green-500"></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-foreground font-medium">Utilización</span>
                  <span className="text-muted-foreground">78%</span>
                </div>
                <div className="h-2 rounded-full bg-secondary overflow-hidden">
                  <div className="h-full w-[78%] bg-blue-500"></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-foreground font-medium">Despacho a Tiempo</span>
                  <span className="text-muted-foreground">96%</span>
                </div>
                <div className="h-2 rounded-full bg-secondary overflow-hidden">
                  <div className="h-full w-[96%] bg-emerald-500"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Orders */}
        <div className="mt-6 rounded-lg border border-border bg-card overflow-hidden">
          <div className="border-b border-border px-6 py-4">
            <h2 className="text-lg font-semibold text-foreground">Pedidos Recientes</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-secondary/30">
                  <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground">Pedido</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground">Cliente</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground">Fecha</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground">Estado</th>
                  <th className="px-6 py-3 text-right text-xs font-semibold text-muted-foreground">Monto</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr key={order.id} className="border-b border-border hover:bg-secondary/30 transition-colors cursor-pointer">
                    <td className="px-6 py-3 text-sm font-semibold text-primary">{order.id}</td>
                    <td className="px-6 py-3 text-sm text-foreground">{order.customer}</td>
                    <td className="px-6 py-3 text-sm text-muted-foreground">{order.date}</td>
                    <td className="px-6 py-3 text-sm">
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${statusColors[order.status as keyof typeof statusColors]}`}>
                        {statusLabels[order.status as keyof typeof statusLabels]}
                      </span>
                    </td>
                    <td className="px-6 py-3 text-sm text-foreground text-right font-semibold">{order.amount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  )
}
