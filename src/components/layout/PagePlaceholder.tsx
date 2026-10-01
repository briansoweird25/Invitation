import { Container } from "./Container";

interface PagePlaceholderProps {
  title: string;
  description?: string;
}

/** Temporary page body until the owning phase builds the real screen. */
export function PagePlaceholder({ title, description }: PagePlaceholderProps) {
  return (
    <Container className="py-24">
      <h1 className="font-serif text-4xl font-medium tracking-tight">{title}</h1>
      {description && <p className="mt-3 max-w-prose text-muted-foreground">{description}</p>}
    </Container>
  );
}
