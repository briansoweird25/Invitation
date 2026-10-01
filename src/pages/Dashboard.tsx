import { PagePlaceholder } from "@/components/layout/PagePlaceholder";
import { displayName, useAuthStore } from "@/stores/authStore";

export default function Dashboard() {
  const user = useAuthStore((s) => s.user);
  return <PagePlaceholder title={`Welcome back, ${displayName(user)}`} description="Your invitations will appear here." />;
}
