"use client";

import { useState, type ReactNode } from "react";
import { ChevronDown } from "lucide-react";

interface AccordionProps {
  title: string;
  defaultOpen?: boolean;
  children: ReactNode;
  right?: ReactNode;
}

export function Accordion({
  title,
  defaultOpen = false,
  children,
  right,
}: AccordionProps) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <section className="rounded-lg border border-border">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between px-4 py-3 text-left transition hover:bg-muted/40"
      >
        <div className="flex items-center gap-2">
          <ChevronDown
            size={18}
            className={`transition-transform ${
              open ? "rotate-180" : ""
            }`}
          />

          <span className="font-medium">
            {title}
          </span>
        </div>

        {right}
      </button>

      {open && (
        <div className="border-t border-border p-4">
          {children}
        </div>
      )}
    </section>
  );
}