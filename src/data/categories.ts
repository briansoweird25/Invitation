import {
  Baby,
  Briefcase,
  Cake,
  Church,
  Droplet,
  Gem,
  Gift,
  GraduationCap,
  Heart,
  HeartHandshake,
  PartyPopper,
  Sunset,
  Utensils,
  type LucideIcon,
} from "lucide-react";
import type { InvitationContent } from "@/types/invitation";
import { toInvitationCategory, type InvitationCategory, type TemplateStyle } from "./taxonomy";

interface FieldCopy {
  label: string;
  helper?: string;
}

export interface CategoryConfig {
  id: InvitationCategory;
  label: string;
  description: string;
  icon: LucideIcon;
  /** Labels for the shared content fields. The fields themselves are the same in every category. */
  fields: { hostNames: FieldCopy; eventTitle: FieldCopy };
  suggestedStyles: TemplateStyle[];
  rsvpDefault: boolean;
  /** Starter copy for the message. Also the seed for the future writing assistant. */
  messageSuggestions: string[];
  /** Fallback sample used for previews and as the starting content. Templates may override parts of it. */
  sampleContent: InvitationContent;
}

const sample = (content: Partial<InvitationContent> & Pick<InvitationContent, "eventTitle" | "hostNames">): InvitationContent => ({
  date: "2026-09-19",
  time: "17:00",
  venue: "The Garden Room",
  address: "24 Park Street",
  message: "",
  ...content,
});

export const categoryConfigs: Record<InvitationCategory, CategoryConfig> = {
  wedding: {
    id: "wedding",
    label: "Wedding",
    description: "Ceremonies and receptions, from classic to contemporary.",
    icon: Heart,
    fields: {
      hostNames: { label: "Names", helper: 'For example "Eleanor & James".' },
      eventTitle: { label: "Opening line", helper: 'For example "Together with their families".' },
    },
    suggestedStyles: ["elegant", "romantic", "floral", "luxury", "minimal", "botanical", "traditional"],
    rsvpDefault: true,
    messageSuggestions: [
      "Join us for an evening of love, laughter and celebration.",
      "We would be honored to have you with us as we say I do.",
    ],
    sampleContent: sample({
      eventTitle: "Together with their families",
      hostNames: "Eleanor & James",
      venue: "The Garden Pavilion",
      address: "12 Orchard Lane, Napa Valley",
      message: "Join us for an evening of love, laughter and celebration.",
    }),
  },
  birthday: {
    id: "birthday",
    label: "Birthday",
    description: "Parties for every age, from first birthdays to milestones.",
    icon: Cake,
    fields: {
      hostNames: { label: "Name", helper: "Who is celebrating?" },
      eventTitle: { label: "Headline", helper: 'For example "turns 30".' },
    },
    suggestedStyles: ["playful", "colorful", "modern", "editorial", "luxury"],
    rsvpDefault: true,
    messageSuggestions: ["Come celebrate with us. There will be cake.", "Good food, great people, and a night to remember."],
    sampleContent: sample({ eventTitle: "turns 30", hostNames: "Maya", venue: "The Rooftop", address: "88 Skyline Avenue" }),
  },
  "baby-shower": {
    id: "baby-shower",
    label: "Baby Shower",
    description: "Soft, joyful invitations for welcoming a new arrival.",
    icon: Baby,
    fields: {
      hostNames: { label: "Parents-to-be", helper: 'For example "Nina & Sam".' },
      eventTitle: { label: "Headline", helper: 'For example "A baby shower for".' },
    },
    suggestedStyles: ["playful", "botanical", "romantic", "minimal"],
    rsvpDefault: true,
    messageSuggestions: ["Please join us as we shower the parents-to-be with love.", "A little one is on the way. Come celebrate with us."],
    sampleContent: sample({ eventTitle: "A baby shower for", hostNames: "Nina & Sam", venue: "The Sunroom", date: "2026-05-16", time: "14:00" }),
  },
  "bridal-shower": {
    id: "bridal-shower",
    label: "Bridal Shower",
    description: "Feminine, celebratory invitations for the bride-to-be.",
    icon: Gift,
    fields: {
      hostNames: { label: "Bride", helper: "Who is the shower for?" },
      eventTitle: { label: "Headline", helper: 'For example "A bridal shower for".' },
    },
    suggestedStyles: ["floral", "romantic", "elegant", "colorful"],
    rsvpDefault: true,
    messageSuggestions: ["Join us for brunch, bubbles and a celebration of the bride-to-be."],
    sampleContent: sample({ eventTitle: "A bridal shower for", hostNames: "Claire", venue: "The Tea House", date: "2026-04-25", time: "11:00" }),
  },
  engagement: {
    id: "engagement",
    label: "Engagement",
    description: "Celebrate the news with the people who matter most.",
    icon: Gem,
    fields: {
      hostNames: { label: "Names", helper: 'For example "Ana & Luis".' },
      eventTitle: { label: "Headline", helper: 'For example "They said yes".' },
    },
    suggestedStyles: ["romantic", "elegant", "modern", "floral"],
    rsvpDefault: true,
    messageSuggestions: ["We're engaged! Join us for drinks and a toast."],
    sampleContent: sample({ eventTitle: "They said yes", hostNames: "Ana & Luis", venue: "Casa Verde", date: "2026-03-07", time: "18:30" }),
  },
  anniversary: {
    id: "anniversary",
    label: "Anniversary",
    description: "Warm, nostalgic invitations for years worth celebrating.",
    icon: HeartHandshake,
    fields: {
      hostNames: { label: "Names", helper: 'For example "Margaret & Robert".' },
      eventTitle: { label: "Headline", helper: 'For example "Celebrating 25 years".' },
    },
    suggestedStyles: ["elegant", "luxury", "vintage", "romantic"],
    rsvpDefault: true,
    messageSuggestions: ["Celebrate a lifetime of love with us."],
    sampleContent: sample({ eventTitle: "Celebrating 25 years", hostNames: "Margaret & Robert", venue: "The Heritage Club", date: "2026-11-14" }),
  },
  graduation: {
    id: "graduation",
    label: "Graduation",
    description: "Proud, energetic invitations for the class of the year.",
    icon: GraduationCap,
    fields: {
      hostNames: { label: "Graduate", helper: "Who is graduating?" },
      eventTitle: { label: "Headline", helper: 'For example "Class of 2026".' },
    },
    suggestedStyles: ["modern", "editorial", "colorful", "traditional"],
    rsvpDefault: true,
    messageSuggestions: ["Join us as we celebrate this milestone and everything that comes next."],
    sampleContent: sample({ eventTitle: "Class of 2026", hostNames: "Jordan Lee", venue: "The Lee Family Home", date: "2026-06-06", time: "15:00" }),
  },
  baptism: {
    id: "baptism",
    label: "Baptism",
    description: "Gentle, reverent invitations for a christening day.",
    icon: Droplet,
    fields: {
      hostNames: { label: "Child's name", helper: "Who is being baptized?" },
      eventTitle: { label: "Headline", helper: 'For example "The baptism of".' },
    },
    suggestedStyles: ["traditional", "elegant", "minimal", "botanical"],
    rsvpDefault: true,
    messageSuggestions: ["Please join us as we welcome our child into the faith."],
    sampleContent: sample({ eventTitle: "The baptism of", hostNames: "Lucas Michael", venue: "St. Mary's Church", date: "2026-05-02", time: "11:00" }),
  },
  communion: {
    id: "communion",
    label: "Communion",
    description: "Gentle, reverent invitations for a first communion.",
    icon: Church,
    fields: {
      hostNames: { label: "Child's name", helper: "Who is receiving communion?" },
      eventTitle: { label: "Headline", helper: 'For example "First Holy Communion".' },
    },
    suggestedStyles: ["traditional", "elegant", "floral"],
    rsvpDefault: true,
    messageSuggestions: ["Celebrate this special day with us."],
    sampleContent: sample({ eventTitle: "First Holy Communion", hostNames: "Sofia Grace", venue: "Our Lady of Peace", date: "2026-05-23", time: "10:30" }),
  },
  retirement: {
    id: "retirement",
    label: "Retirement",
    description: "Warm, appreciative invitations for a well-earned next chapter.",
    icon: Sunset,
    fields: {
      hostNames: { label: "Honoree", helper: "Who is retiring?" },
      eventTitle: { label: "Headline", helper: 'For example "is retiring".' },
    },
    suggestedStyles: ["editorial", "vintage", "elegant", "modern"],
    rsvpDefault: true,
    messageSuggestions: ["After 30 years, it's time to celebrate. Join us for a toast."],
    sampleContent: sample({ eventTitle: "is retiring", hostNames: "Dr. Alan Brooks", venue: "The Oak Room", date: "2026-12-04", time: "18:00" }),
  },
  "dinner-party": {
    id: "dinner-party",
    label: "Dinner Party",
    description: "Refined, intimate invitations for an evening at the table.",
    icon: Utensils,
    fields: {
      hostNames: { label: "Host", helper: "Who is hosting?" },
      eventTitle: { label: "Headline", helper: 'For example "An evening of food and friends".' },
    },
    suggestedStyles: ["luxury", "editorial", "rustic", "vintage"],
    rsvpDefault: true,
    messageSuggestions: ["Dinner is at eight. Dress warmly and come hungry."],
    sampleContent: sample({ eventTitle: "An evening of food and friends", hostNames: "Hosted by Elena", venue: "Elena's Table", date: "2026-10-24", time: "20:00" }),
  },
  "corporate-event": {
    id: "corporate-event",
    label: "Corporate Event",
    description: "Professional invitations for launches, galas and team events.",
    icon: Briefcase,
    fields: {
      hostNames: { label: "Company or host", helper: "Who is hosting the event?" },
      eventTitle: { label: "Event name", helper: 'For example "Annual Summit 2026".' },
    },
    suggestedStyles: ["modern", "minimal", "editorial"],
    rsvpDefault: true,
    messageSuggestions: ["Please join us for an evening of conversation and connection."],
    sampleContent: sample({ eventTitle: "Annual Summit 2026", hostNames: "Northwind Co.", venue: "The Grand Hall", date: "2026-09-10", time: "18:00" }),
  },
  "general-party": {
    id: "general-party",
    label: "General Party",
    description: "A flexible starting point for any celebration.",
    icon: PartyPopper,
    fields: {
      hostNames: { label: "Host", helper: "Who is hosting?" },
      eventTitle: { label: "Headline", helper: 'For example "You are invited".' },
    },
    suggestedStyles: ["playful", "colorful", "modern", "vintage"],
    rsvpDefault: true,
    messageSuggestions: ["Come celebrate with us."],
    sampleContent: sample({ eventTitle: "You are invited", hostNames: "Alex & Friends", venue: "The Studio", date: "2026-08-15", time: "19:00" }),
  },
};

export function getCategoryConfig(category: string): CategoryConfig {
  return categoryConfigs[toInvitationCategory(category)];
}
