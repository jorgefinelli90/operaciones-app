"use client";

import { useEffect, useState } from "react";

import { Sidebar } from "@/components/sidebar";
import { TopBar } from "@/components/topbar";

import { OrdersToolbar } from "@/components/orders/OrdersToolbar";
import { OrdersFilters } from "@/components/orders/OrdersFilters";

import { InvoiceATable } from "./InvoiceATable";
import { InvoiceDrawer } from "./InvoiceDrawer/InvoiceDrawer";

import {
  getInvoiceRequests,
  type InvoiceRequestRow,
} from "@/lib/invoices/getInvoiceRequests";

export function InvoicePage() {
  const [rows, setRows] = useState<InvoiceRequestRow[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedOrder, setSelectedOrder] = useState<string | null>(null);

  const [search, setSearch] = useState("");

  const [filters, setFilters] = useState({
    status: "all",
    warehouse: "all",
    pickupStore: "all",
    documents: "all",
  });

  useEffect(() => {
    async function load() {
      try {
        const data = await getInvoiceRequests();

        console.log(data[0]);
console.log(data[0].orders);  


        setRows(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  const filtered = rows.filter((r) => {
    const text = search.toLowerCase();

    return (
      r.order_id.toLowerCase().includes(text) ||
      (r.business_name ?? "").toLowerCase().includes(text) ||
      (r.cuit ?? "").includes(text)
    );
  });

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />

      <TopBar />

      <main className="ml-64 mt-16 p-6">
        <OrdersToolbar
          title="Factura A"
          subtitle="Gestión de solicitudes de Facturación A."
          showCSVUploader={false}
          onToggleCSVUploader={() => {}}
        />

        <OrdersFilters
          search={search}
          onSearchChange={setSearch}
          filters={filters}
          pickupStores={[]}
          onFiltersChange={setFilters}
        />

        <InvoiceATable
          rows={filtered}
          loading={loading}
          onOpen={setSelectedOrder}
        />

        <InvoiceDrawer
          open={selectedOrder !== null}
          orderId={selectedOrder}
          onClose={() => setSelectedOrder(null)}
        />
      </main>
    </div>
  );
}