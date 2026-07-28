"use client";

import type { Order } from "@/types/orders";

import { Header } from "./Header";
import { ProductsSection } from "./ProductsSection";

interface Props {
  order: Order | null;
  open: boolean;
  onClose: () => void;
}

export function MissingProductsDrawer({
  order,
  open,
  onClose,
}: Props) {
  if (!open || !order) return null;

  return (
    <>
      <div
        className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      <aside className="fixed right-0 top-0 z-50 flex h-screen w-[760px] flex-col border-l border-border bg-background shadow-2xl">

        <Header
          order={order}
          productsCount={0}
        />

        <div className="flex-1 overflow-y-auto px-6 py-6">

          <ProductsSection
            orderId={order.id}
          />

        </div>

      </aside>
    </>
  );
}