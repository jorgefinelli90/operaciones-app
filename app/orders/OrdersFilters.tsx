"use client";

import { Search, Filter, ChevronDown } from "lucide-react";

interface OrdersFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;

  filters: {
    status: string;
    warehouse: string;
  };

  onFiltersChange: (filters: {
    status: string;
    warehouse: string;
  }) => void;
}

export function OrdersFilters({
  search,
  onSearchChange,
  filters,
  onFiltersChange,
}: OrdersFiltersProps) {
  return (
    <>
      <div className="mb-4 relative max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

        <input
          type="text"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Buscar por pedido, cliente o mail..."
          className="w-full rounded-lg border border-border bg-input py-2 pl-10 pr-4 text-sm outline-none focus:border-primary"
        />
      </div>

      <div className="mb-6 flex gap-3">

        <div className="relative">
          <select
            value={filters.status}
            onChange={(e) =>
              onFiltersChange({
                ...filters,
                status: e.target.value,
              })
            }
            className="appearance-none rounded-lg border border-border bg-input px-4 py-2 pr-10 text-sm font-medium"
          >
            <option value="all">Todos los estados</option>
            <option value="pendiente">Pendiente</option>
            <option value="despachado">Despachado</option>
            <option value="enviado">Enviado</option>
            <option value="producto_faltante">
              Producto Faltante
            </option>
            <option value="devuelto">
              Devuelto a depósito
            </option>
            <option value="cambio">Cambio</option>
          </select>

          <ChevronDown className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 pointer-events-none" />
        </div>

        <div className="relative">
          <select
            value={filters.warehouse}
            onChange={(e) =>
              onFiltersChange({
                ...filters,
                warehouse: e.target.value,
              })
            }
            className="appearance-none rounded-lg border border-border bg-input px-4 py-2 pr-10 text-sm font-medium"
          >
            <option value="all">Pickups</option>
            <option value="Palermo">Palermo</option>
            <option value="Unicenter">Unicenter</option>
            <option value="Alcorta">Alcorta</option>
            <option value="Arcos">Arcos</option>
          </select>

          <ChevronDown className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 pointer-events-none" />
        </div>

        <button className="flex items-center gap-2 rounded-lg border border-border px-4 py-2 hover:bg-secondary transition-colors text-sm font-medium">
          <Filter className="h-4 w-4" />
          Más filtros
        </button>

      </div>
    </>
  );
}