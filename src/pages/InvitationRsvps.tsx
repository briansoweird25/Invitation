import { ArrowLeft } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { InvitationsError, InvitationSkeletons } from "@/components/dashboard/InvitationGridStates";
import { Container } from "@/components/layout/Container";
import { RsvpGuestList } from "@/components/rsvp/RsvpGuestList";
import { RsvpStats } from "@/components/rsvp/RsvpStats";
import { Button } from "@/components/ui/button";
import { useRsvpReplies } from "@/hooks/useRsvpReplies";
import { rsvpStats } from "@/lib/rsvp";
import { useAuthStore } from "@/stores/authStore";

export default function InvitationRsvps() {
  const { invitationId } = useParams();
  const user = useAuthStore((s) => s.user);
  const { state, reload } = useRsvpReplies(invitationId, user?.id);

  return (
    <Container className="py-14 sm:py-20">
      <Link to="/dashboard" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="size-4" aria-hidden="true" /> Dashboard
      </Link>

      {state.status === "loading" && (
        <div className="mt-8" aria-busy="true">
          <p role="status" className="sr-only">
            Loading replies…
          </p>
          <InvitationSkeletons />
        </div>
      )}
      {state.status === "error" && (
        <div className="mt-8">
          <InvitationsError message={state.message} onRetry={() => void reload()} />
        </div>
      )}
      {state.status === "missing" && (
        <div className="mt-8 border-t py-20 text-center">
          <h1 className="font-serif text-3xl font-medium">Invitation not found</h1>
          <p className="mx-auto mt-3 max-w-sm text-muted-foreground">It may have been deleted, or it belongs to another account.</p>
          <Button asChild className="mt-8">
            <Link to="/dashboard">Back to dashboard</Link>
          </Button>
        </div>
      )}
      {state.status === "ready" && (
        <>
          <header className="mt-6">
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-accent">RSVPs</p>
            <h1 className="mt-3 font-serif text-4xl font-medium leading-[1.05] tracking-tight sm:text-5xl [overflow-wrap:anywhere]">{state.invitation.title}</h1>
            {!state.invitation.rsvp.enabled && (
              <p className="mt-3 text-sm text-muted-foreground">
                RSVPs are turned off for this invitation, so guests can't reply.{" "}
                <Link to={`/editor/${state.invitation.id}`} className="underline underline-offset-4">
                  Turn them on in the editor
                </Link>
                .
              </p>
            )}
            {state.invitation.rsvp.enabled && state.invitation.status !== "published" && (
              <p className="mt-3 text-sm text-muted-foreground">This invitation isn't published yet, so guests can't reply. Publish it from the dashboard.</p>
            )}
          </header>

          <div className="mt-10">
            <RsvpStats stats={rsvpStats(state.replies)} />
          </div>
          {state.replies.length === 0 ? (
            <div className="mt-12 border-t py-16 text-center">
              <h2 className="font-serif text-2xl font-medium">No replies yet</h2>
              <p className="mx-auto mt-3 max-w-sm text-muted-foreground">Replies appear here as guests answer. Share your invitation link to get started.</p>
            </div>
          ) : (
            <RsvpGuestList replies={state.replies} />
          )}
        </>
      )}
    </Container>
  );
}
