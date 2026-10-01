import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export function InvitationSkeletons() {
  return (
    <ul aria-hidden="true" className="grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
      {[0, 1, 2].map((i) => (
        <li key={i} className="animate-pulse">
          <div className="aspect-[4/5] rounded-lg bg-muted" />
          <div className="mt-4 h-6 w-2/3 rounded bg-muted" />
          <div className="mt-2 h-4 w-1/2 rounded bg-muted" />
        </li>
      ))}
    </ul>
  );
}

export function InvitationsEmpty() {
  return (
    <div className="border-t py-20 text-center">
      <h2 className="font-serif text-3xl font-medium">No invitations yet</h2>
      <p className="mx-auto mt-3 max-w-sm text-muted-foreground">
        Create your first invitation and start designing something beautiful.
      </p>
      <Button asChild size="lg" className="mt-8">
        <Link to="/templates">Create Invitation</Link>
      </Button>
    </div>
  );
}

export function InvitationsError({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div role="alert" className="border-t py-20 text-center">
      <h2 className="font-serif text-3xl font-medium">Something went wrong</h2>
      <p className="mx-auto mt-3 max-w-sm text-muted-foreground">{message}</p>
      <Button variant="secondary" className="mt-8" onClick={onRetry}>
        Try again
      </Button>
    </div>
  );
}
