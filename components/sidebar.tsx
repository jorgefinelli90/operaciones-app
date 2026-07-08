'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  BarChart3,
  Inbox,
  Package,
  AlertCircle,
  RotateCw,
  ArrowRightLeft,
  FileText,
  Truck,
  CreditCard,
  TrendingUp,
  Users,
  Settings,
  ChevronDown,
} from 'lucide-react'

const navigation = [
  { name: 'Panel de Control', href: '/dashboard', icon: BarChart3 },
  { name: 'Bandeja de Entrada', href: '/inbox', icon: Inbox },
  { name: 'Pedidos', href: '/orders', icon: Package },
  { name: 'Productos Faltantes', href: '/missing-products', icon: AlertCircle },
  { name: 'Devoluciones', href: '/returns', icon: RotateCw },
  { name: 'Cambios', href: '/exchanges', icon: ArrowRightLeft },
  { name: 'Notas de Crédito y Cupones', href: '/credit-notes', icon: FileText },
  { name: 'Factura A', href: '/invoice-a', icon: FileText },
  { name: 'Solicitudes de Recogida', href: '/pickup-requests', icon: Truck },
  { name: 'Contracargos', href: '/chargebacks', icon: CreditCard },
  { name: 'Reportes', href: '/reports', icon: TrendingUp },
  { name: 'Usuarios', href: '/users', icon: Users },
  { name: 'Configuración', href: '/settings', icon: Settings },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 border-r border-border bg-sidebar flex flex-col">
      {/* Logo */}
      <div className="flex items-center gap-2 border-b border-sidebar-border px-6 py-4">
        <div className="h-8 w-8 rounded bg-primary flex items-center justify-center">
          <span className="text-sm font-bold text-primary-foreground">B</span>
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-semibold text-sidebar-foreground">BURGUES</span>
          <span className="text-xs text-sidebar-foreground/60">Operaciones</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        {navigation.map((item) => {
          const Icon = item.icon
          const isActive = pathname?.startsWith(item.href)
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded px-3 py-2 text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-sidebar-primary text-sidebar-primary-foreground'
                  : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
              }`}
            >
              <Icon className="h-4 w-4" />
              <span>{item.name}</span>
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="border-t border-sidebar-border p-3">
        <div className="rounded bg-sidebar-accent px-3 py-2 text-xs text-sidebar-accent-foreground">
          <p className="font-semibold">v0.1.0</p>
          <p className="text-sidebar-foreground/60">Portal de Operaciones</p>
        </div>
      </div>
    </aside>
  )
}
