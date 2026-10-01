const fontStacks: Record<string, string> = {
  "Cormorant Garamond": '"Cormorant Garamond", Georgia, serif',
  Inter: '"Inter Variable", Inter, ui-sans-serif, system-ui, sans-serif',
};

/** Turns a stored font name into a CSS font-family value. */
export function resolveFont(name: string): string {
  return fontStacks[name] ?? `"${name}", ui-sans-serif, system-ui, sans-serif`;
}
