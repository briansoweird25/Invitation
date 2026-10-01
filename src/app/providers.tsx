import { useEffect, type ReactNode } from "react";
import { Toaster } from "@/components/ui/sonner";
import { initAuth } from "@/stores/authStore";

export function Providers({ children }: { children: ReactNode }) {
  useEffect(() => initAuth(), []);

  return (
    <>
      {children}
      <Toaster />
    </>
  );
}
