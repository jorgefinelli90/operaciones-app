interface FieldProps {
  label: string;
  value?: React.ReactNode;
}

export function Field({
  label,
  value,
}: FieldProps) {
  return (
    <div className="space-y-1">
      <p className="text-xs text-muted-foreground">
        {label}
      </p>

      <p className="font-medium break-words">
        {value || "-"}
      </p>
    </div>
  );
}