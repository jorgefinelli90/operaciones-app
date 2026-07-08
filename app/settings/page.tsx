'use client'

import { Sidebar } from '@/components/sidebar'
import { TopBar } from '@/components/topbar'
import { Save, AlertCircle, CheckCircle2 } from 'lucide-react'

export default function SettingsPage() {
  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <TopBar />

      {/* Main Content */}
      <main className="ml-64 mt-16 p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Configuración</h1>
          <p className="text-muted-foreground mt-1">Configura la aplicación y la integración</p>
        </div>

        <div className="max-w-2xl">
          {/* Connection Status */}
          <div className="mb-8 rounded-lg border border-border bg-card p-6">
            <h2 className="text-lg font-semibold text-foreground mb-4">Estado de Integración</h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="h-5 w-5 text-green-400" />
                  <div>
                    <p className="font-medium text-foreground">Integración Magento</p>
                    <p className="text-xs text-muted-foreground">Conectado</p>
                  </div>
                </div>
                <button className="px-3 py-1 rounded text-xs font-semibold bg-secondary hover:bg-secondary/80 text-foreground transition-colors">
                  Configurar
                </button>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="h-5 w-5 text-green-400" />
                  <div>
                    <p className="font-medium text-foreground">Pagos Stripe</p>
                    <p className="text-xs text-muted-foreground">Conectado</p>
                  </div>
                </div>
                <button className="px-3 py-1 rounded text-xs font-semibold bg-secondary hover:bg-secondary/80 text-foreground transition-colors">
                  Configurar
                </button>
              </div>
            </div>
          </div>

          {/* General Settings */}
          <div className="mb-8 rounded-lg border border-border bg-card p-6">
            <h2 className="text-lg font-semibold text-foreground mb-4">Configuración General</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Nombre de Empresa</label>
                <input
                  type="text"
                  placeholder="BURGUES Operaciones"
                  className="w-full rounded-lg border border-border bg-input px-3 py-2 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Correo Electrónico</label>
                <input
                  type="email"
                  placeholder="operations@burgues.com"
                  className="w-full rounded-lg border border-border bg-input px-3 py-2 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Zona Horaria</label>
                <select className="w-full rounded-lg border border-border bg-input px-3 py-2 text-foreground focus:outline-none focus:ring-1 focus:ring-ring">
                  <option>Europe/Madrid (UTC+1)</option>
                  <option>Europe/Barcelona (UTC+1)</option>
                  <option>Europe/London (UTC+0)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Notification Settings */}
          <div className="mb-8 rounded-lg border border-border bg-card p-6">
            <h2 className="text-lg font-semibold text-foreground mb-4">Notifications</h2>
            <div className="space-y-3">
              {[
                { label: 'Missing Product Alerts', enabled: true },
                { label: 'Return Received Notifications', enabled: true },
                { label: 'Invoice Requests', enabled: true },
                { label: 'Chargeback Alerts', enabled: true },
                { label: 'Daily Summary Reports', enabled: false },
              ].map((notif, idx) => (
                <label key={idx} className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    defaultChecked={notif.enabled}
                    className="h-4 w-4 rounded border-border bg-input cursor-pointer"
                  />
                  <span className="text-sm text-foreground">{notif.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Warehouse Settings */}
          <div className="mb-8 rounded-lg border border-border bg-card p-6">
            <h2 className="text-lg font-semibold text-foreground mb-4">Warehouse Configuration</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Default Warehouse</label>
                <select className="w-full rounded-lg border border-border bg-input px-3 py-2 text-foreground focus:outline-none focus:ring-1 focus:ring-ring">
                  <option>Madrid</option>
                  <option>Barcelona</option>
                  <option>Valencia</option>
                  <option>Seville</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Auto-assignment Enabled</label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" defaultChecked className="h-4 w-4 rounded border-border bg-input cursor-pointer" />
                  <span className="text-sm text-muted-foreground">Automatically assign orders to available staff</span>
                </label>
              </div>
            </div>
          </div>

          {/* Security Settings */}
          <div className="mb-8 rounded-lg border border-border bg-card p-6">
            <h2 className="text-lg font-semibold text-foreground mb-4">Security</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Session Timeout (minutes)</label>
                <input
                  type="number"
                  defaultValue="30"
                  className="w-full rounded-lg border border-border bg-input px-3 py-2 text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                />
              </div>
              <div>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" defaultChecked className="h-4 w-4 rounded border-border bg-input cursor-pointer" />
                  <span className="text-sm text-foreground">Require Two-Factor Authentication</span>
                </label>
              </div>
              <div>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" defaultChecked className="h-4 w-4 rounded border-border bg-input cursor-pointer" />
                  <span className="text-sm text-foreground">Audit Log All Actions</span>
                </label>
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex gap-3">
            <button className="flex items-center gap-2 rounded-lg bg-primary px-6 py-2 text-primary-foreground hover:bg-primary/90 transition-colors font-medium">
              <Save className="h-4 w-4" />
              Save Settings
            </button>
            <button className="rounded-lg border border-border px-6 py-2 text-foreground hover:bg-secondary transition-colors font-medium">
              Cancel
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}
