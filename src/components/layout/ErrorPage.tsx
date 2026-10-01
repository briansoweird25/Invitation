import { Link, useRouteError } from "react-router-dom";
import { Button } from "@/components/ui/button";

export function ErrorPage() {
  const error = useRouteError();
  if (import.meta.env.DEV) console.error(error);

  return (
    <div className="grid min-h-screen place-items-center px-5 text-center">
      <div>
        <h1 className="font-serif text-4xl font-medium">Something went wrong</h1>
        <p className="mt-3 text-muted-foreground">Please try again.</p>
        <Button asChild className="mt-6">
          <Link to="/">Back to home</Link>
        </Button>
      </div>
    </div>
  );
}
