interface InfoRowProps {
  label: string;
  value?: React.ReactNode;
}

export function InfoRow({
  label,
  value,
}: InfoRowProps) {
  return (
    <div className="flex items-center justify-between border-b border-border py-2 last:border-none">
      <span className="text-sm text-muted-foreground">
        {label}
      </span>

      <span className="font-medium">
        {value || "-"}
      </span>
    </div>
  );
}