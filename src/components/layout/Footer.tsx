import { Link } from "react-router-dom";
import { categoriesWithTemplates } from "@/components/invitation/templateCatalog";
import { getCategoryConfig } from "@/data/categories";
import { Container } from "./Container";

const columns = [
  {
    title: "Product",
    links: [
      { to: "/templates", label: "Templates" },
      { to: "/pricing", label: "Pricing" },
      { to: "/editor/new", label: "Create an invitation" },
    ],
  },
  {
    title: "Occasions",
    links: categoriesWithTemplates().map((id) => ({ to: `/templates/${id}`, label: getCategoryConfig(id).label })),
  },
];

export function Footer() {
  return (
    <footer className="border-t">
      <Container className="grid gap-10 py-14 sm:grid-cols-[1.5fr_1fr_1fr]">
        <div>
          <Link to="/" className="font-serif text-2xl font-semibold tracking-tight">
            Invitation
          </Link>
          <p className="mt-3 max-w-xs text-sm leading-relaxed text-muted-foreground">
            Beautiful digital invitations for life&apos;s special moments.
          </p>
        </div>
        {columns.map((col) => (
          <nav key={col.title} aria-label={col.title}>
            <h2 className="text-sm font-medium">{col.title}</h2>
            <ul className="mt-4 space-y-2.5 text-sm text-muted-foreground">
              {col.links.map((l) => (
                <li key={l.to}>
                  <Link to={l.to} className="hover:text-foreground">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </Container>
      <div className="border-t">
        <Container className="py-6 text-sm text-subtle-foreground">© {new Date().getFullYear()} Invitation</Container>
      </div>
    </footer>
  );
}
