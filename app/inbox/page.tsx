'use client'

import { Sidebar } from '@/components/sidebar'
import { TopBar } from '@/components/topbar'
import { Clock, AlertCircle, CheckCircle2, Filter, Download } from 'lucide-react'

const tasks = [
  {
    id: 1,
    title: 'Resolver Producto Faltante',
    order: 'ORD-2024-001',
    priority: 'alta',
    dueDate: '2024-01-16',
    status: 'pendiente',
    assignedTo: 'María García',
    description: 'SKU-45892: Remera no encontrada',
  },
  {
    id: 2,
    title: 'Revisar Artículo Devuelto',
    order: 'ORD-2024-002',
    priority: 'alta',
    dueDate: '2024-01-16',
    status: 'pendiente',
    assignedTo: 'Carlos López',
    description: 'Cliente devolvio zapatos',
  },
  {
    id: 3,
    title: 'Generar Factura A',
    order: 'ORD-2024-003',
    priority: 'media',
    dueDate: '2024-01-17',
    status: 'pendiente',
    assignedTo: 'Ana Martínez',
    description: 'Factura A de cliente necesaria',
  },
  {
    id: 4,
    title: 'Crear Nota de Crédito',
    order: 'ORD-2024-004',
    priority: 'media',
    dueDate: '2024-01-17',
    status: 'pendiente',
    assignedTo: 'Pedro Rodríguez',
    description: 'Procesamiento de reembolso por artículo defectuoso',
  },
  {
    id: 5,
    title: 'Enviar Cambio',
    order: 'ORD-2024-005',
    priority: 'media',
    dueDate: '2024-01-15',
    status: 'pendiente',
    assignedTo: 'Luis Fernández',
    description: 'Enviar producto de reemplazo al cliente',
  },
  {
    id: 6,
    title: 'Confirmar Recogida',
    order: 'ORD-2024-006',
    priority: 'baja',
    dueDate: '2024-01-18',
    status: 'pendiente',
    assignedTo: 'María García',
    description: 'Confirmar recogida de devolución con transportista',
  },
  {
    id: 7,
    title: 'Completar Documentación de Contracargo',
    order: 'ORD-2024-007',
    priority: 'alta',
    dueDate: '2024-01-15',
    status: 'pendiente',
    assignedTo: 'Carlos López',
    description: 'Enviar evidencia para resolución de disputa',
  },
]

const priorityColor = {
  alta: 'bg-red-500/10 text-red-400 border-red-500/20',
  media: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
  low: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
}

export default function InboxPage() {
  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <TopBar />

      {/* Main Content */}
      <main className="ml-64 mt-16 p-6">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Bandeja de Entrada</h1>
            <p className="text-muted-foreground mt-1">7 tareas pendientes asignadas a ti</p>
          </div>
          <div className="flex gap-2">
            <button className="flex items-center gap-2 rounded-lg border border-border px-4 py-2 hover:bg-secondary transition-colors text-sm font-media">
              <Filter className="h-4 w-4" />
              Filtro
            </button>
            <button className="flex items-center gap-2 rounded-lg border border-border px-4 py-2 hover:bg-secondary transition-colors text-sm font-media">
              <Download className="h-4 w-4" />
              Exportar
            </button>
          </div>
        </div>

        {/* Tasks List */}
        <div className="rounded-lg border border-border bg-card overflow-hidden">
          {/* Sticky Table Header */}
          <div className="sticky top-0 bg-secondary/50 border-b border-border">
            <div className="grid grid-cols-12 gap-4 px-6 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              <div className="col-span-1">Prioridad</div>
              <div className="col-span-3">Tarea</div>
              <div className="col-span-2">Pedido</div>
              <div className="col-span-2">Asignado a</div>
              <div className="col-span-2">Vencimiento</div>
              <div className="col-span-2">Accion</div>
            </div>
          </div>

          {/* Task Rows */}
          <div className="divide-y divide-border">
            {tasks.map((task) => (
              <div
                key={task.id}
                className="grid grid-cols-12 gap-4 px-6 py-4 hover:bg-secondary/30 transition-colors cursor-pointer items-center border-l-4 border-l-transparent hover:border-l-primary"
              >
                {/* Priority Badge */}
                <div className="col-span-1">
                  <span className={`inline-block px-2 py-1 rounded text-xs font-semibold border ${priorityColor[task.priority as keyof typeof priorityColor]}`}>
                    {task.priority.toUpperCase()}
                  </span>
                </div>

                {/* Task Info */}
                <div className="col-span-3">
                  <p className="font-semibold text-foreground text-sm">{task.title}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{task.description}</p>
                </div>

                {/* Order */}
                <div className="col-span-2">
                  <span className="text-sm font-semibold text-primary">{task.order}</span>
                </div>

                {/* Assigned To */}
                <div className="col-span-2">
                  <span className="text-sm text-foreground">{task.assignedTo}</span>
                </div>

                {/* Due Date */}
                <div className="col-span-2">
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Clock className="h-3.5 w-3.5" />
                    {task.dueDate}
                  </div>
                </div>

                {/* Actions */}
                <div className="col-span-2 flex gap-2">
                  <button className="px-3 py-1 rounded text-xs font-semibold bg-primary/10 text-primary hover:bg-primary/20 transition-colors">
                    Ver
                  </button>
                  <button className="px-3 py-1 rounded text-xs font-semibold bg-green-500/10 text-green-400 hover:bg-green-500/20 transition-colors">
                    Completo
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Summary */}
        <div className="mt-6 grid grid-cols-3 gap-4">
          <div className="rounded-lg border border-border bg-card p-4">
            <div className="flex items-center gap-3">
              <AlertCircle className="h-5 w-5 text-red-400" />
              <div>
                <p className="text-xs font-semibold text-muted-foreground">Alta prioridad</p>
                <p className="text-2xl font-bold text-foreground">3</p>
              </div>
            </div>
          </div>
          <div className="rounded-lg border border-border bg-card p-4">
            <div className="flex items-center gap-3">
              <Clock className="h-5 w-5 text-yellow-400" />
              <div>
                <p className="text-xs font-semibold text-muted-foreground">Demora</p>
                <p className="text-2xl font-bold text-foreground">1</p>
              </div>
            </div>
          </div>
          <div className="rounded-lg border border-border bg-card p-4">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="h-5 w-5 text-green-400" />
              <div>
                <p className="text-xs font-semibold text-muted-foreground">Finalizados Hoy</p>
                <p className="text-2xl font-bold text-foreground">12</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
