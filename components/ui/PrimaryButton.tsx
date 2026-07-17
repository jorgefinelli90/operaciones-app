interface PrimaryButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

export function PrimaryButton({
  children,
  className = "",
  ...props
}: PrimaryButtonProps) {
  return (
    <button
      {...props}
      className={`w-full rounded-lg bg-black py-2 text-white transition hover:opacity-90 disabled:opacity-50 ${className}`}
    >
      {children}
    </button>
  );
}