import { EventDetailsPanel } from "./panels/EventDetailsPanel";
import { MessagePanel } from "./panels/MessagePanel";
import { RSVPPanel } from "./panels/RSVPPanel";

export function ContentSidebar() {
  return (
    <aside aria-label="Invitation content" className="overflow-y-auto border-r bg-surface">
      <EventDetailsPanel />
      <MessagePanel />
      <RSVPPanel />
    </aside>
  );
}
