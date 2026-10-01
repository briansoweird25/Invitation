import { NavLink } from "react-router-dom";
import { categories, templates } from "@/data/templates";
import { cn } from "@/lib/utils";

const tabClass = ({ isActive }: { isActive: boolean }) =>
  cn(
    "-mb-px whitespace-nowrap border-b-2 py-3 text-sm transition-colors",
    isActive ? "border-foreground font-medium text-foreground" : "border-transparent text-muted-foreground hover:text-foreground",
  );

export function CategoryNav({ search }: { search: string }) {
  const items = [
    { to: "/templates", label: "All", count: templates.length },
    ...categories.map((c) => ({
      to: `/templates/${c.id}`,
      label: c.label,
      count: templates.filter((t) => t.category === c.id).length,
    })),
  ];

  return (
    <nav aria-label="Template categories" className="-mx-5 overflow-x-auto px-5 sm:mx-0 sm:px-0">
      <ul className="flex gap-8 border-b">
        {items.map((item) => (
          <li key={item.to}>
            <NavLink to={{ pathname: item.to, search }} end className={tabClass}>
              {item.label}
              <span className="ml-1.5 text-xs text-subtle-foreground">{item.count}</span>
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}
