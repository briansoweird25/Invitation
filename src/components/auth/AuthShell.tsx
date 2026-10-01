import type { ReactNode } from "react";
import { Container } from "@/components/layout/Container";
import { isSupabaseConfigured } from "@/lib/supabase";

interface AuthShellProps {
  title: string;
  description: string;
  children: ReactNode;
  footer: ReactNode;
}

export function AuthShell({ title, description, children, footer }: AuthShellProps) {
  return (
    <Container className="py-16 sm:py-24">
      <div className="mx-auto w-full max-w-sm">
        <h1 className="font-serif text-4xl font-medium leading-tight tracking-tight">{title}</h1>
        <p className="mt-3 text-muted-foreground">{description}</p>
        {!isSupabaseConfigured && import.meta.env.DEV && (
          <p role="status" className="mt-6 rounded-md border border-accent/40 p-3 text-sm text-muted-foreground">
            Supabase isn&apos;t configured. Copy <code>.env.example</code> to <code>.env</code> and add your project URL and anon key.
          </p>
        )}
        <div className="mt-8">{children}</div>
        <p className="mt-8 text-sm text-muted-foreground">{footer}</p>
      </div>
    </Container>
  );
}
