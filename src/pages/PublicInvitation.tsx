import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { InvitationRenderer } from "@/components/invitation/InvitationRenderer";
import { ShareBar } from "@/components/invitation/ShareBar";
import { RsvpSection } from "@/components/rsvp/RsvpSection";
import { useInvitationFonts } from "@/hooks/useInvitationFonts";
import { usePublishedInvitation } from "@/hooks/usePublishedInvitation";
import { isHexColor } from "@/lib/color";
import type { PublicInvitation as PublicInvitationData } from "@/lib/invitationApi";

const SITE_TITLE = "Invitation Generator";

/** Keeps a published invitation out of search results and names the tab after it. */
function usePageMeta(title: string | undefined) {
  useEffect(() => {
    const previous = document.title;
    const robots = document.createElement("meta");
    robots.name = "robots";
    robots.content = "noindex, nofollow";
    document.head.appendChild(robots);
    if (title) document.title = title;
    return () => {
      document.title = previous;
      robots.remove();
    };
  }, [title]);
}

function Message({ title, body, children }: { title: string; body: string; children?: React.ReactNode }) {
  return (
    <main className="grid min-h-dvh place-items-center bg-background px-6 py-16 text-center">
      <div className="max-w-md">
        <h1 className="font-serif text-3xl font-medium tracking-tight">{title}</h1>
        <p className="mt-3 text-muted-foreground">{body}</p>
        <div className="mt-6 flex justify-center gap-2">{children}</div>
      </div>
    </main>
  );
}

function Loaded({ invitation }: { invitation: PublicInvitationData }) {
  const { content, design } = invitation;
  useInvitationFonts(design);
  const url = `${window.location.origin}/invitation/${invitation.slug}`;
  // A backdrop that echoes the invitation's own color, so the card feels placed on a surface of its kind.
  const backdrop = isHexColor(design.backgroundColor) ? `color-mix(in srgb, ${design.backgroundColor} 45%, #d9d3c7)` : undefined;

  return (
    <div className="min-h-dvh bg-muted px-4 py-8 sm:py-12" style={{ backgroundColor: backdrop }}>
      <main className="mx-auto flex w-full flex-col gap-6" style={{ maxWidth: "min(520px, max(300px, calc((100dvh - 9rem) * 0.8)))" }}>
        <h1 className="sr-only">{invitation.title || content.hostNames}</h1>
        {/* Plain markup, not role="img": guests using a screen reader need to read the date, time and place. */}
        <div className="shadow-soft" data-testid="public-invitation">
          <InvitationRenderer templateId={invitation.templateId} content={content} design={design} />
        </div>
        <ShareBar url={url} title={invitation.title || content.hostNames} />
        <RsvpSection invitationId={invitation.id} rsvp={invitation.rsvp} />
      </main>
      <footer className="mt-10 text-center text-xs text-muted-foreground">
        Made with <Link to="/templates" className="underline underline-offset-4 hover:text-foreground">{SITE_TITLE}</Link>
      </footer>
    </div>
  );
}

export default function PublicInvitation() {
  const { slug } = useParams();
  const { state, retry } = usePublishedInvitation(slug);
  usePageMeta(state.status === "ready" ? state.invitation.title || state.invitation.content.hostNames || SITE_TITLE : SITE_TITLE);

  if (state.status === "loading") {
    return (
      <div role="status" aria-live="polite" className="grid min-h-dvh place-items-center bg-background text-sm text-muted-foreground">
        Loading invitation…
      </div>
    );
  }
  if (state.status === "missing") {
    return (
      <Message title="This invitation isn't available" body="The link may be mistyped, or the host may have taken the invitation down.">
        <Button asChild variant="secondary">
          <Link to="/">Go to home</Link>
        </Button>
      </Message>
    );
  }
  if (state.status === "error") {
    return (
      <Message title="We couldn't load this invitation" body={state.message}>
        <Button onClick={retry}>Try again</Button>
      </Message>
    );
  }
  return <Loaded invitation={state.invitation} />;
}
