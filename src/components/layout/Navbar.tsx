import { Menu, X } from "lucide-react";
import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Container } from "./Container";

const links = [
  { to: "/templates", label: "Templates" },
  { to: "/pricing", label: "Pricing" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `text-sm transition-colors hover:text-foreground ${isActive ? "text-foreground" : "text-muted-foreground"}`;

  return (
    <header className="border-b bg-background">
      <Container className="flex h-16 items-center justify-between">
        <Link to="/" className="font-serif text-2xl font-semibold tracking-tight">
          Invitation
        </Link>

        <nav aria-label="Main" className="hidden items-center gap-8 md:flex">
          {links.map((l) => (
            <NavLink key={l.to} to={l.to} className={linkClass}>
              {l.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          <Button asChild variant="ghost" size="sm">
            <Link to="/login">Log in</Link>
          </Button>
          <Button asChild size="sm">
            <Link to="/editor/new">Create Invitation</Link>
          </Button>
        </div>

        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          aria-controls="mobile-nav"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X /> : <Menu />}
        </Button>
      </Container>

      {open && (
        <nav id="mobile-nav" aria-label="Mobile" className="border-t md:hidden">
          <Container className="flex flex-col gap-1 py-4">
            {[...links, { to: "/login", label: "Log in" }].map((l) => (
              <NavLink key={l.to} to={l.to} className={linkClass} onClick={() => setOpen(false)}>
                <span className="block py-2">{l.label}</span>
              </NavLink>
            ))}
            <Button asChild className="mt-2">
              <Link to="/editor/new" onClick={() => setOpen(false)}>
                Create Invitation
              </Link>
            </Button>
          </Container>
        </nav>
      )}
    </header>
  );
}
