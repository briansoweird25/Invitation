import { cn } from "@/lib/utils";

export type Access = "all" | "free" | "premium";

const options: { value: Access; label: string }[] = [
  { value: "all", label: "All" },
  { value: "free", label: "Free" },
  { value: "premium", label: "Premium" },
];

interface AccessFilterProps {
  value: Access;
  onChange: (value: Access) => void;
}

export function AccessFilter({ value, onChange }: AccessFilterProps) {
  return (
    <div role="group" aria-label="Filter by price" className="flex items-center gap-1 text-sm">
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          aria-pressed={value === o.value}
          onClick={() => onChange(o.value)}
          className={cn(
            "rounded-md px-3 py-1.5 transition-colors",
            value === o.value ? "bg-foreground text-background" : "text-muted-foreground hover:bg-muted hover:text-foreground",
          )}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}
