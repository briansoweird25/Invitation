export interface FontOption {
  name: string;
  stack: string;
}

/** Fonts available to invitations. `name` is what gets stored in `InvitationDesign`. */
export const fontOptions: FontOption[] = [
  { name: "Cormorant Garamond", stack: '"Cormorant Garamond", Georgia, serif' },
  { name: "Playfair Display", stack: '"Playfair Display Variable", Georgia, serif' },
  { name: "DM Serif Display", stack: '"DM Serif Display", Georgia, serif' },
  { name: "Lora", stack: '"Lora Variable", Georgia, serif' },
  { name: "Inter", stack: '"Inter Variable", Inter, ui-sans-serif, system-ui, sans-serif' },
  { name: "DM Sans", stack: '"DM Sans Variable", ui-sans-serif, system-ui, sans-serif' },
];

/** Turns a stored font name into a CSS font-family value. */
export function resolveFont(name: string): string {
  return fontOptions.find((f) => f.name === name)?.stack ?? `"${name}", ui-sans-serif, system-ui, sans-serif`;
}
