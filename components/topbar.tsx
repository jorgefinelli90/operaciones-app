'use client'

import { Search, Bell, User, ChevronDown, Command } from 'lucide-react'

export function TopBar() {
  return (
    <header className="fixed top-0 right-0 left-64 z-40 border-b border-border bg-card/50 backdrop-blur-sm">
  <div className="flex w-full items-center justify-end px-6 py-3">
    
    {/* Right Section */}
    <div className="flex items-center gap-4">
      
      {/* Notifications */}
      <button className="relative rounded-lg p-2 transition-colors hover:bg-secondary">
        <Bell className="h-5 w-5 text-foreground" />
        <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-red-500" />
      </button>

      {/* User Menu */}
      <button className="flex items-center gap-2 rounded-lg border border-border px-3 py-2 transition-colors hover:bg-secondary">
        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
          JD
        </div>

        <span className="text-sm font-medium text-foreground">
          Jorge Finelli
        </span>

        <ChevronDown className="h-4 w-4 text-muted-foreground" />
      </button>

    </div>
  </div>
</header>
  )
}
