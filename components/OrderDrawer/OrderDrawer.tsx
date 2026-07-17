"use client";

import type { Order } from "@/types/orders";

import { CustomerSection } from "./CustomerSection";
import { ProductsSection } from "./ProductsSection";
import { ShippingSection } from "./ShippingSection";
import { PaymentSection } from "./PaymentSection";
interface OrderDrawerProps {
  order: Order | null;
  open: boolean;
  onClose: () => void;
  onWarehouseStatusUpdated: (
    orderId: string,
    newStatus: string,
  ) => void;
}
export function OrderDrawer({
  order,
  open,
  onClose,
  onWarehouseStatusUpdated,
}: OrderDrawerProps) {
  return (
    <>
      {open && (
        <div onClick={onClose} className="fixed inset-0 z-40 bg-black/40" />
      )}

      <aside
        className={`fixed right-0 top-0 z-50 h-screen w-[900px] border-l border-border bg-background shadow-xl transition-transform duration-300 ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-border p-6">
          <h2 className="text-xl font-bold">Pedido</h2>

          <button
            onClick={onClose}
            className="rounded-md px-3 py-2 hover:bg-secondary"
          >
            ✕
          </button>
        </div>

        <div className="h-[calc(100vh-81px)] overflow-y-auto">
          <div className="space-y-6 p-6">
            <CustomerSection order={order} />

<ShippingSection
  order={order}
  onWarehouseStatusUpdated={onWarehouseStatusUpdated}
/>

<ProductsSection order={order} />

<PaymentSection order={order} />
          </div>
        </div>
      </aside>
    </>
  );
}
