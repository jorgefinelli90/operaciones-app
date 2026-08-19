"use client";

import {
  Search,
  ChevronDown,
  X,
} from "lucide-react";

interface OrdersFiltersProps {
  search: string;

  onSearchChange: (
    value: string,
  ) => void;

  onSearch?: () => void;

  onClearSearch?: () => void;

  pickupStores: string[];

  filters: {
    status: string;
    warehouse: string;
    pickupStore: string;
    documents: string;
  };

  onFiltersChange: (
    filters: {
      status: string;
      warehouse: string;
      pickupStore: string;
      documents: string;
    },
  ) => void;
}

export function OrdersFilters({
  search,
  onSearchChange,
  onSearch,
  onClearSearch,
  pickupStores,
  filters,
  onFiltersChange,
}: OrdersFiltersProps) {
  const handleKeyDown = (
    event: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (
      event.key === "Enter" &&
      onSearch
    ) {
      event.preventDefault();
      onSearch();
    }
  };

  const handleClear = () => {
    if (onClearSearch) {
      onClearSearch();
      return;
    }

    onSearchChange("");
  };

  return (
    <div className="mb-6 space-y-3">
      {/* BUSCADOR */}

      <div className="flex max-w-2xl gap-2">
        <div className="relative flex-1">
          <Search
            className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
          />

          <input
            type="text"
            value={search}
            onChange={(event) =>
              onSearchChange(
                event.target.value,
              )
            }
            onKeyDown={handleKeyDown}
            placeholder="Buscar por número de pedido..."
            className="w-full rounded-lg border border-border bg-input py-2.5 pl-10 pr-10 text-sm outline-none transition-colors focus:border-primary"
          />

          {search && (
            <button
              type="button"
              onClick={handleClear}
              title="Limpiar búsqueda"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {onSearch && (
          <button
            type="button"
            onClick={onSearch}
            className="rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Buscar
          </button>
        )}

        {onSearch &&
          onClearSearch &&
          search && (
            <button
              type="button"
              onClick={onClearSearch}
              className="rounded-lg border border-border px-4 py-2.5 text-sm font-medium transition-colors hover:bg-secondary"
            >
              Limpiar
            </button>
          )}
      </div>

      {/* FILTROS */}

      <div className="flex flex-wrap gap-3">
        {/* ESTADO */}

        <div className="relative">
          <select
            value={filters.status}
            onChange={(event) =>
              onFiltersChange({
                ...filters,
                status:
                  event.target.value,
              })
            }
            className="appearance-none rounded-lg border border-border bg-input px-4 py-2 pr-10 text-sm font-medium outline-none focus:border-primary"
          >
            <option value="all">
              Todos los estados
            </option>

            <option value="pendiente">
              Pendiente
            </option>

            <option value="picking">
              Picking
            </option>

            <option value="embalado">
              Embalado
            </option>

            <option value="facturado">
              Facturado
            </option>

            <option value="despachado">
              Despachado
            </option>

            <option value="en pickup">
              En PickUp
            </option>

            <option value="entregado">
              Entregado
            </option>
          </select>

          <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2" />
        </div>

        {/* TIPO DE ENVÍO */}

        <div className="relative">
          <select
            value={filters.warehouse}
            onChange={(event) =>
              onFiltersChange({
                ...filters,
                warehouse:
                  event.target.value,
                pickupStore:
                  "all",
              })
            }
            className="appearance-none rounded-lg border border-border bg-input px-4 py-2 pr-10 text-sm font-medium outline-none focus:border-primary"
          >
            <option value="all">
              Todos los envíos
            </option>

            <option value="pickup">
              Retiro PickUp
            </option>

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

          <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2" />
        </div>

        {/* PICKUP */}

        {filters.warehouse ===
          "pickup" && (
          <div className="relative">
            <select
              value={
                filters.pickupStore
              }
              onChange={(event) =>
                onFiltersChange({
                  ...filters,
                  pickupStore:
                    event.target.value,
                })
              }
              className="appearance-none rounded-lg border border-border bg-input px-4 py-2 pr-10 text-sm font-medium outline-none focus:border-primary"
            >
              <option value="all">
                Todas las sucursales
              </option>

              {pickupStores.map(
                (store) => (
                  <option
                    key={store}
                    value={store}
                  >
                    {store}
                  </option>
                ),
              )}
            </select>

            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2" />
          </div>
        )}

        {/* COMPROBANTES */}

        <div className="relative">
          <select
            value={
              filters.documents
            }
            onChange={(event) =>
              onFiltersChange({
                ...filters,
                documents:
                  event.target.value,
              })
            }
            className="appearance-none rounded-lg border border-border bg-input px-4 py-2 pr-10 text-sm font-medium outline-none focus:border-primary"
          >
            <option value="all">
              Todos los comprobantes
            </option>

            <option value="invoice">
              Con factura
            </option>

            <option value="credit_note">
              Con nota de crédito
            </option>

            <option value="both">
              Factura + nota de crédito
            </option>

            <option value="none">
              Sin comprobantes
            </option>
          </select>

          <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2" />
        </div>
      </div>
    </div>
  );
}