import { Outlet } from "react-router-dom";

/** Pass-through until Supabase Auth lands in Phase 6. */
export function ProtectedRoute() {
  return <Outlet />;
}
