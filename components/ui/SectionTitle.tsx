interface SectionTitleProps {
  icon: string;
  title: string;
}

export function SectionTitle({
  icon,
  title,
}: SectionTitleProps) {
  return (
    <div className="mb-5 flex items-center gap-2">
      <span className="text-xl">
        {icon}
      </span>

      <h3 className="text-lg font-semibold">
        {title}
      </h3>
    </div>
  );
}