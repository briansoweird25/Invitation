import { Link } from "react-router-dom";
import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <Container className="py-24">
      <h1 className="font-serif text-4xl font-medium tracking-tight">Page not found</h1>
      <p className="mt-3 text-muted-foreground">The page you're looking for doesn't exist.</p>
      <Button asChild className="mt-6">
        <Link to="/">Back to home</Link>
      </Button>
    </Container>
  );
}
