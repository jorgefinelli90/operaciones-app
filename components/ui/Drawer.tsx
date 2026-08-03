"use client";

import type { ReactNode } from "react";

interface DrawerProps {
  open: boolean;
  onClose: () => void;
  title: string;
  size?: "sm" | "md" | "lg" | "xl";
  children: ReactNode;
}

const sizeClasses = {
  sm: "w-[360px]",
  md: "w-[480px]",
  lg: "w-[640px]",
  xl: "w-[900px]",
} as const;

export function Drawer({
  open,
  onClose,
  title,
  size = "md",
  children,
}: DrawerProps) {
  return (
    <>
      {open && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/40"
        />
      )}

      <aside
        className={`fixed right-0 top-0 z-50 h-screen ${sizeClasses[size]} border-l border-border bg-background shadow-xl transition-transform duration-300 ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-border p-6">
          <h2 className="text-xl font-bold">{title}</h2>

          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar"
            className="rounded-md px-3 py-2 hover:bg-secondary"
          >
            ×
          </button>
        </div>

        <div className="h-[calc(100vh-81px)] overflow-y-auto">
          {children}
        </div>
      </aside>
    </>
  );
}
