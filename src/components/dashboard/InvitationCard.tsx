import { Eye, EyeOff, MoreHorizontal, Pencil, Trash2, Users } from "lucide-react";
import { Link } from "react-router-dom";
import { InvitationRenderer } from "@/components/invitation/InvitationRenderer";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { dateParts, joinText } from "@/lib/invitationFormat";
import type { Invitation } from "@/types/invitation";
import { StatusBadge } from "./StatusBadge";

interface InvitationCardProps {
  invitation: Invitation;
  busy: boolean;
  onTogglePublish: (invitation: Invitation) => void;
  onDelete: (invitation: Invitation) => void;
}

const updatedFormat = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" });

export function InvitationCard({ invitation, busy, onTogglePublish, onDelete }: InvitationCardProps) {
  const { id, title, content, design, status, slug, templateId } = invitation;
  const date = dateParts(content.date);
  const eventLine = joinText([content.hostNames, date ? `${date.day} ${date.monthShort} ${date.year}` : "No date yet"]);
  const published = status === "published";

  return (
    <article className="group" aria-busy={busy}>
      <Link
        to={`/editor/${id}`}
        aria-label={`Edit ${title}`}
        className="block rounded-lg bg-muted p-5 transition-colors hover:bg-border/70 sm:p-6"
      >
        {/* The same renderer as the editor; hidden from assistive tech because the card text describes it. */}
        <div aria-hidden="true" className="pointer-events-none shadow-soft transition-transform duration-300 group-hover:-translate-y-1">
          <InvitationRenderer templateId={templateId} content={content} design={design} />
        </div>
      </Link>

      <div className="mt-4 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h2 className="truncate font-serif text-2xl font-medium leading-tight">{title}</h2>
          <p className="mt-1 truncate text-sm text-muted-foreground">{eventLine}</p>
        </div>
        <StatusBadge status={status} />
      </div>
      <p className="mt-1 text-xs text-subtle-foreground">
        Updated {updatedFormat.format(new Date(invitation.updatedAt))}
        {published && slug && <> · /invitation/{slug}</>}
      </p>

      <div className="mt-4 flex items-center gap-2">
        <Button asChild variant="secondary" size="sm">
          <Link to={`/editor/${id}`}>
            <Pencil /> Edit
          </Link>
        </Button>
        {invitation.rsvp.enabled && (
          <Button asChild variant="ghost" size="sm">
            <Link to={`/dashboard/invitations/${id}/rsvps`}>
              <Users /> RSVPs
            </Link>
          </Button>
        )}
        {published && slug && (
          <Button asChild variant="ghost" size="sm">
            <Link to={`/invitation/${slug}`}>View</Link>
          </Button>
        )}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="ml-auto size-8" disabled={busy} aria-label={`More actions for ${title}`}>
              <MoreHorizontal />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onSelect={() => onTogglePublish(invitation)}>
              {published ? <EyeOff /> : <Eye />}
              {published ? "Unpublish" : "Publish"}
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => onDelete(invitation)} className="text-destructive">
              <Trash2 />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </article>
  );
}
