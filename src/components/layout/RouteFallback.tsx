export function RouteFallback({ label = "Loading…" }: { label?: string }) {
  return (
    <div role="status" aria-live="polite" className="grid min-h-[40vh] place-items-center text-sm text-muted-foreground">
      {label}
    </div>
  );
}
