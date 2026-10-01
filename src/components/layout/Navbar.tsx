import { Menu, X } from "lucide-react";
import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { signOut } from "@/lib/auth";
import { useAuthStore } from "@/stores/authStore";
import { Container } from "./Container";

const links = [
  { to: "/templates", label: "Templates" },
  { to: "/pricing", label: "Pricing" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const status = useAuthStore((s) => s.status);
  const navigate = useNavigate();
  const signedIn = status === "authenticated";
  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `text-sm transition-colors hover:text-foreground ${isActive ? "text-foreground" : "text-muted-foreground"}`;

  async function logOut() {
    setOpen(false);
    await signOut();
    navigate("/");
  }

  // While the session is being restored, show neither "Log in" nor "Dashboard" to avoid a flash.
  const accountLinks = signedIn
    ? [
        { to: "/dashboard", label: "Dashboard" },
        { to: "/dashboard/settings", label: "Settings" },
      ]
    : status === "unauthenticated"
      ? [{ to: "/login", label: "Log in" }]
      : [];

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
          {accountLinks.map((l) => (
            <Button key={l.to} asChild variant="ghost" size="sm">
              <Link to={l.to}>{l.label}</Link>
            </Button>
          ))}
          {signedIn && (
            <Button variant="ghost" size="sm" onClick={logOut}>
              Log out
            </Button>
          )}
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
            {[...links, ...accountLinks].map((l) => (
              <NavLink key={l.to} to={l.to} className={linkClass} onClick={() => setOpen(false)}>
                <span className="block py-2">{l.label}</span>
              </NavLink>
            ))}
            {signedIn && (
              <button type="button" onClick={logOut} className="py-2 text-left text-sm text-muted-foreground hover:text-foreground">
                Log out
              </button>
            )}
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
