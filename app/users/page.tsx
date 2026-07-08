'use client'

import { Sidebar } from '@/components/sidebar'
import { TopBar } from '@/components/topbar'
import { Plus, Edit2, Trash2, Filter } from 'lucide-react'

const users = [
  {
    id: 1,
    name: 'Bruno Menardo',
    email: 'bruno@elburgues.com',
    role: 'Manager',
    status: 'active',
    lastLogin: '2024-01-15 14:32',
  },
  {
    id: 2,
    name: 'Nestor Bazan',
    email: 'deposito@elburgues.com',
    role: 'deposito',
    status: 'active',
    lastLogin: '2024-01-15 13:45',
  },
  {
    id: 3,
    name: 'Yohanna Apodaca',
    email: 'yohanna@elburgues.com',
    role: 'Atencion al cliente',
    status: 'active',
    lastLogin: '2024-01-15 15:20',
  },
  {
    id: 4,
    name: 'Roberto Diaz',
    email: 'roberto@elburgues.com',
    role: 'deposito',
    status: 'active',
    lastLogin: '2024-01-14 09:15',
  },
  {
    id: 5,
    name: 'Soledad Rocha',
    email: 'soledad@elburgues.com',
    role: 'Administrador',
    status: 'active',
    lastLogin: '2024-01-15 10:00',
  },
  {
    id: 6,
    name: 'Jorge Finelli',
    email: 'jorge@elburgues.com',
    role: 'Administrator',
    status: 'active',
    lastLogin: '2024-01-15 08:30',
  },
]

const roleColors = {
  deposito: 'bg-blue-500/10 text-blue-400',
  'Atencion al cliente': 'bg-purple-500/10 text-purple-400',
  Manager: 'bg-orange-500/10 text-orange-400',
  Administrator: 'bg-red-500/10 text-red-400',
}

const permissions = {
  deposito: ['Ver Pedidos', 'Gestionar Almacén', 'Ver Reportes'],
  'Atencion al cliente': ['Ver Pedidos', 'Gestionar Tareas', 'Crear Notas de Crédito', 'Ver Reportes'],
  Manager: ['Acceso Completo', 'Gestionar Usuarios', 'Ver Reportes', 'Gestionar Configuración'],
  Administrator: ['Acceso Completo', 'Configuración del Sistema', 'Gestión de Usuarios'],
}

export default function UsersPage() {
  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <TopBar />

      {/* Main Content */}
      <main className="ml-64 mt-16 p-6">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Usuarios</h1>
            <p className="text-muted-foreground mt-1">Gestiona miembros del equipo y permisos</p>
          </div>
          <div className="flex gap-2">
            <button className="flex items-center gap-2 rounded-lg border border-border px-4 py-2 hover:bg-secondary transition-colors text-sm font-medium">
              <Filter className="h-4 w-4" />
              Filtro
            </button>
            <button className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-primary-foreground hover:bg-primary/90 transition-colors text-sm font-medium">
              <Plus className="h-4 w-4" />
              Agregar Usuario
            </button>
          </div>
        </div>

        {/* Users Table */}
        <div className="rounded-lg border border-border bg-card overflow-hidden">
          {/* Header */}
          <div className="sticky top-0 bg-secondary/50 border-b border-border">
            <div className="grid grid-cols-6 gap-4 px-6 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              <div className="col-span-2">Nombre</div>
              <div className="col-span-1">Rol</div>
              <div className="col-span-1">Estado</div>
              <div className="col-span-1">Último Acceso</div>
              <div className="col-span-1">Acciones</div>
            </div>
          </div>

          {/* Rows */}
          <div className="divide-y divide-border">
            {users.map((user) => (
              <div
                key={user.id}
                className="grid grid-cols-6 gap-4 px-6 py-4 hover:bg-secondary/30 transition-colors items-center"
              >
                <div className="col-span-2">
                  <div>
                    <p className="font-semibold text-foreground">{user.name}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{user.email}</p>
                  </div>
                </div>
                <div className="col-span-1">
                  <span className={`inline-block px-2 py-1 rounded text-xs font-semibold ${roleColors[user.role as keyof typeof roleColors]}`}>
                    {user.role}
                  </span>
                </div>
                <div className="col-span-1">
                  <span className="inline-block px-2 py-1 rounded text-xs font-semibold bg-green-500/10 text-green-400">
                    {user.status.toUpperCase()}
                  </span>
                </div>
                <div className="col-span-1">
                  <span className="text-sm text-muted-foreground">{user.lastLogin}</span>
                </div>
                <div className="col-span-1 flex gap-2">
                  <button className="p-2 hover:bg-primary/10 rounded transition-colors">
                    <Edit2 className="h-4 w-4 text-primary" />
                  </button>
                  <button className="p-2 hover:bg-red-500/10 rounded transition-colors">
                    <Trash2 className="h-4 w-4 text-red-400" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Roles & Permissions */}
        <div className="mt-8">
          <h2 className="text-lg font-bold text-foreground mb-4">Roles & Permissions</h2>
          <div className="grid grid-cols-2 gap-4">
            {Object.entries(permissions).map(([role, perms]) => (
              <div key={role} className="rounded-lg border border-border bg-card p-6">
                <h3 className={`text-sm font-semibold px-2 py-1 rounded w-fit mb-4 ${roleColors[role as keyof typeof roleColors]}`}>
                  {role}
                </h3>
                <ul className="space-y-2">
                  {perms.map((perm, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-sm text-foreground">
                      <span className="h-1.5 w-1.5 rounded-full bg-primary"></span>
                      {perm}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
