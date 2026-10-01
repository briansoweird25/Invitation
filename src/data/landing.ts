import { CalendarCheck, Eye, Link2, Smartphone, type LucideIcon } from "lucide-react";

export type SampleId = "elegant-wedding" | "floral-wedding" | "minimal-wedding" | "modern-birthday";

export interface ShowcaseTemplate {
  id: SampleId;
  name: string;
  category: "wedding" | "birthday";
  isPremium: boolean;
}

/** Landing-page showcase only. The real template registry arrives in Phase 4. */
export const showcaseTemplates: ShowcaseTemplate[] = [
  { id: "elegant-wedding", name: "Elegant Wedding", category: "wedding", isPremium: false },
  { id: "floral-wedding", name: "Floral Wedding", category: "wedding", isPremium: true },
  { id: "minimal-wedding", name: "Minimal Wedding", category: "wedding", isPremium: false },
  { id: "modern-birthday", name: "Modern Birthday", category: "birthday", isPremium: false },
];

export const steps = [
  { title: "Choose a template", body: "Start from a design made for weddings, birthdays and more." },
  { title: "Add your details", body: "Names, date, venue and a message in your own words." },
  { title: "Make it yours", body: "Adjust fonts, colors and background and watch it update live." },
  { title: "Publish and share", body: "Get a link of your own and collect RSVPs from your guests." },
];

export const features: { icon: LucideIcon; title: string; body: string }[] = [
  { icon: Eye, title: "Live preview", body: "Every change appears on the invitation instantly, with no save step in between." },
  { icon: Link2, title: "A link of your own", body: "Share a clean, readable address like /invitation/john-and-maria." },
  { icon: CalendarCheck, title: "RSVP built in", body: "Guests reply on the invitation and you see every response in one place." },
  { icon: Smartphone, title: "Made for every screen", body: "Invitations read beautifully on a phone, a tablet or a desktop." },
];
