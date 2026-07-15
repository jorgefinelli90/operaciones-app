"use client";

import { Search, Filter, ChevronDown } from "lucide-react";

interface OrdersFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;

  pickupStores: string[];

  filters: {
    status: string;
    warehouse: string;
    pickupStore: string;
  };

  onFiltersChange: (filters: {
    status: string;
    warehouse: string;
    pickupStore: string;
  }) => void;
}

export function OrdersFilters({
  search,
  onSearchChange,
  pickupStores,
  filters,
  onFiltersChange,
}: OrdersFiltersProps) {
  return (
    <>
      {/* Buscador */}
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

      <div className="mb-6 flex flex-wrap gap-3">

        {/* Estado */}
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
              Producto faltante
            </option>
            <option value="devuelto">
              Devuelto a depósito
            </option>
            <option value="cambio">
              Cambio
            </option>
          </select>

          <ChevronDown className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 pointer-events-none" />
        </div>

        {/* Tipo de envío */}
        <div className="relative">
          <select
            value={filters.warehouse}
            onChange={(e) =>
              onFiltersChange({
                ...filters,
                warehouse: e.target.value,
                pickupStore: "all",
              })
            }
            className="appearance-none rounded-lg border border-border bg-input px-4 py-2 pr-10 text-sm font-medium"
          >
            <option value="all">Todos los envíos</option>
            <option value="pickup">Retiro PickUp</option>
            <option value="andreani_domicilio">
              Andreani Domicilio
            </option>
            <option value="andreani_sucursal">
              Andreani Sucursal
            </option>
            <option value="treggo">
              Treggo
            </option>
          </select>

          <ChevronDown className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 pointer-events-none" />
        </div>

        {/* Sucursal Pickup */}
        {filters.warehouse === "pickup" && (
          <div className="relative">
            <select
              value={filters.pickupStore}
              onChange={(e) =>
                onFiltersChange({
                  ...filters,
                  pickupStore: e.target.value,
                })
              }
              className="appearance-none rounded-lg border border-border bg-input px-4 py-2 pr-10 text-sm font-medium"
            >
              <option value="all">
                Todas las sucursales
              </option>

              {pickupStores.map((store) => (
                <option
                  key={store}
                  value={store}
                >
                  {store}
                </option>
              ))}
            </select>

            <ChevronDown className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 pointer-events-none" />
          </div>
        )}

        {/* Botón reservado para futuros filtros */}
        <button
          type="button"
          className="flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-medium transition-colors hover:bg-secondary"
        >
          <Filter className="h-4 w-4" />
          Más filtros
        </button>

      </div>
    </>
  );
}