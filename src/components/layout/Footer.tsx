import { Link } from "react-router-dom";
import { Container } from "./Container";

export function Footer() {
  return (
    <footer className="border-t">
      <Container className="flex flex-col gap-4 py-10 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
        <p>© {new Date().getFullYear()} Invitation</p>
        <nav aria-label="Footer" className="flex gap-6">
          <Link to="/templates" className="hover:text-foreground">
            Templates
          </Link>
          <Link to="/pricing" className="hover:text-foreground">
            Pricing
          </Link>
        </nav>
      </Container>
    </footer>
  );
}
