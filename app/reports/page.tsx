'use client'

import { Sidebar } from '@/components/sidebar'
import { TopBar } from '@/components/topbar'
import { BarChart3, TrendingUp, Calendar, Download } from 'lucide-react'

export default function ReportsPage() {
  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <TopBar />

      {/* Main Content */}
      <main className="ml-64 mt-16 p-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-foreground">Reportes</h1>
          <p className="text-muted-foreground mt-1">Análisis operacional e insights de desempeño</p>
        </div>

        {/* Report Selector */}
        <div className="mb-6 flex gap-2">
          {['Diario', 'Semanal', 'Mensual'].map((period) => (
            <button
              key={period}
              className="px-4 py-2 rounded-lg border border-border bg-secondary text-foreground text-sm font-medium hover:bg-secondary/80 transition-colors"
            >
              {period}
            </button>
          ))}
        </div>

        {/* Report Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Orders Report */}
          <div className="rounded-lg border border-border bg-card p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-blue-500/10">
                  <BarChart3 className="h-5 w-5 text-blue-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Pedidos</h3>
                  <p className="text-xs text-muted-foreground">Esta semana</p>
                </div>
              </div>
              <button className="p-2 hover:bg-secondary rounded transition-colors">
                <Download className="h-4 w-4 text-foreground" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-end">
                <span className="text-sm text-muted-foreground">Total Pedidos</span>
                <span className="text-2xl font-bold text-foreground">1,247</span>
              </div>
              <div className="flex justify-between items-end">
                <span className="text-sm text-muted-foreground">Completado</span>
                <span className="text-xl font-bold text-green-400">89%</span>
              </div>
              <div className="flex justify-between items-end">
                <span className="text-sm text-muted-foreground">Pendiente</span>
                <span className="text-xl font-bold text-yellow-400">8%</span>
              </div>
              <div className="flex justify-between items-end">
                <span className="text-sm text-muted-foreground">Problemas</span>
                <span className="text-xl font-bold text-red-400">3%</span>
              </div>
            </div>
          </div>

          {/* Warehouse Report */}
          <div className="rounded-lg border border-border bg-card p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-emerald-500/10">
                  <TrendingUp className="h-5 w-5 text-emerald-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Almacén</h3>
                  <p className="text-xs text-muted-foreground">Métricas de desempeño</p>
                </div>
              </div>
              <button className="p-2 hover:bg-secondary rounded transition-colors">
                <Download className="h-4 w-4 text-foreground" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-muted-foreground">Eficiencia</span>
                  <span className="text-foreground font-medium">94%</span>
                </div>
                <div className="h-2 rounded-full bg-secondary overflow-hidden">
                  <div className="h-full w-[94%] bg-emerald-500"></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-muted-foreground">Precisión de Preparación</span>
                  <span className="text-foreground font-medium">99.2%</span>
                </div>
                <div className="h-2 rounded-full bg-secondary overflow-hidden">
                  <div className="h-full w-[99%] bg-emerald-500"></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-muted-foreground">Despacho a Tiempo</span>
                  <span className="text-foreground font-medium">96%</span>
                </div>
                <div className="h-2 rounded-full bg-secondary overflow-hidden">
                  <div className="h-full w-[96%] bg-emerald-500"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Customer Service Report */}
          <div className="rounded-lg border border-border bg-card p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-purple-500/10">
                  <BarChart3 className="h-5 w-5 text-purple-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Servicio al Cliente</h3>
                  <p className="text-xs text-muted-foreground">Esta semana</p>
                </div>
              </div>
              <button className="p-2 hover:bg-secondary rounded transition-colors">
                <Download className="h-4 w-4 text-foreground" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-end">
                <span className="text-sm text-muted-foreground">Tiempo Promedio de Respuesta</span>
                <span className="text-2xl font-bold text-foreground">2.5h</span>
              </div>
              <div className="flex justify-between items-end">
                <span className="text-sm text-muted-foreground">Satisfacción del Cliente</span>
                <span className="text-xl font-bold text-green-400">4.8/5</span>
              </div>
              <div className="flex justify-between items-end">
                <span className="text-sm text-muted-foreground">Problemas Resueltos</span>
                <span className="text-xl font-bold text-blue-400">342</span>
              </div>
            </div>
          </div>

          {/* Returns Report */}
          <div className="rounded-lg border border-border bg-card p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-orange-500/10">
                  <TrendingUp className="h-5 w-5 text-orange-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Devoluciones y Reembolsos</h3>
                  <p className="text-xs text-muted-foreground">Este mes</p>
                </div>
              </div>
              <button className="p-2 hover:bg-secondary rounded transition-colors">
                <Download className="h-4 w-4 text-foreground" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-end">
                <span className="text-sm text-muted-foreground">Total Devoluciones</span>
                <span className="text-2xl font-bold text-foreground">127</span>
              </div>
              <div className="flex justify-between items-end">
                <span className="text-sm text-muted-foreground">Tasa de Devolución</span>
                <span className="text-xl font-bold text-orange-400">3.2%</span>
              </div>
              <div className="flex justify-between items-end">
                <span className="text-sm text-muted-foreground">Tiempo Promedio de Procesamiento</span>
                <span className="text-xl font-bold text-foreground">5.3 días</span>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Tables */}
        <div className="mt-8 space-y-6">
          {/* Missing Products by Resolution */}
          <div className="rounded-lg border border-border bg-card p-6">
            <h3 className="font-semibold text-foreground mb-4">Productos Faltantes por Resolución</h3>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-2 font-semibold text-muted-foreground">Tipo de Resolución</th>
                  <th className="text-right py-2 font-semibold text-muted-foreground">Cantidad</th>
                  <th className="text-right py-2 font-semibold text-muted-foreground">% del Total</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-border">
                  <td className="py-3 text-foreground">Reemplazo Aprobado</td>
                  <td className="py-3 text-right text-foreground">18</td>
                  <td className="py-3 text-right text-emerald-400">52%</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="py-3 text-foreground">Cupón Emitido</td>
                  <td className="py-3 text-right text-foreground">8</td>
                  <td className="py-3 text-right text-blue-400">23%</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="py-3 text-foreground">Reembolso Procesado</td>
                  <td className="py-3 text-right text-foreground">6</td>
                  <td className="py-3 text-right text-purple-400">17%</td>
                </tr>
                <tr>
                  <td className="py-3 text-foreground">Cancelado</td>
                  <td className="py-3 text-right text-foreground">3</td>
                  <td className="py-3 text-right text-red-400">8%</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Average Resolution Time */}
          <div className="rounded-lg border border-border bg-card p-6">
            <h3 className="font-semibold text-foreground mb-4">Tiempo Promedio de Resolución por Tipo</h3>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-2 font-semibold text-muted-foreground">Tipo de Problema</th>
                  <th className="text-right py-2 font-semibold text-muted-foreground">Tiempo Promedio</th>
                  <th className="text-right py-2 font-semibold text-muted-foreground">Tendencia</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-border">
                  <td className="py-3 text-foreground">Productos Faltantes</td>
                  <td className="py-3 text-right text-foreground">2.3 días</td>
                  <td className="py-3 text-right text-green-400">↓ 15%</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="py-3 text-foreground">Procesamiento de Devoluciones</td>
                  <td className="py-3 text-right text-foreground">5.8 días</td>
                  <td className="py-3 text-right text-green-400">↓ 8%</td>
                </tr>
                <tr>
                  <td className="py-3 text-foreground">Contracargos</td>
                  <td className="py-3 text-right text-foreground">4.2 días</td>
                  <td className="py-3 text-right text-red-400">↑ 5%</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  )
}
