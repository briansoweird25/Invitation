import { Navigate, Outlet, useLocation } from "react-router-dom";
import { safeRedirectPath } from "@/lib/redirect";
import { useAuthStore } from "@/stores/authStore";
import { RouteFallback } from "./RouteFallback";

/** Login and register are for signed-out visitors. Signed-in users are sent on. */
export function GuestRoute() {
  const status = useAuthStore((s) => s.status);
  const location = useLocation();

  if (status === "loading") return <RouteFallback />;
  if (status === "authenticated") {
    return <Navigate to={safeRedirectPath((location.state as { from?: unknown } | null)?.from)} replace />;
  }
  return <Outlet />;
}
