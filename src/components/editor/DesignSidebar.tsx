import { BackgroundPanel } from "./panels/BackgroundPanel";
import { ColorsPanel } from "./panels/ColorsPanel";
import { DecorationPanel } from "./panels/DecorationPanel";
import { TypographyPanel } from "./panels/TypographyPanel";

export function DesignPanels() {
  return (
    <>
      <TypographyPanel />
      <ColorsPanel />
      <BackgroundPanel />
      <DecorationPanel />
    </>
  );
}

export function DesignSidebar() {
  return (
    <aside aria-label="Design" className="overflow-y-auto border-l bg-surface">
      <DesignPanels />
    </aside>
  );
}
