interface SectionCardProps {
  children: React.ReactNode;
}

export function SectionCard({
  children,
}: SectionCardProps) {
  return (
    <section className="rounded-xl border border-border bg-card p-5 shadow-sm">
      {children}
    </section>
  );
}