'use client'

import { Search, Bell, User, ChevronDown, Command } from 'lucide-react'

export function TopBar() {
  return (
    <header className="fixed top-0 right-0 left-64 z-40 border-b border-border bg-card/50 backdrop-blur-sm">
      <div className="flex items-center justify-between px-6 py-3">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Buscar pedidos, clientes, rastreo..."
            className="w-full rounded bg-input px-3 py-2 pl-10 text-sm placeholder-muted-foreground border border-border focus:outline-none focus:ring-1 focus:ring-ring"
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
            <kbd className="rounded px-1.5 py-0.5 text-xs font-semibold text-muted-foreground bg-muted/30 border border-border">
              <Command className="h-3 w-3 inline" /> K
            </kbd>
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-4 ml-6">
          {/* Notifications */}
          <button className="relative p-2 hover:bg-secondary rounded-lg transition-colors">
            <Bell className="h-5 w-5 text-foreground" />
            <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
          </button>

          {/* User Menu */}
          <button className="flex items-center gap-2 rounded-lg border border-border px-3 py-2 hover:bg-secondary transition-colors">
            <div className="h-6 w-6 rounded-full bg-primary flex items-center justify-center text-xs font-semibold text-primary-foreground">
              JD
            </div>
            <span className="text-sm font-medium text-foreground">Jorge Finelli</span>
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          </button>
        </div>
      </div>
    </header>
  )
}
