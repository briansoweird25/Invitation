import type { Page } from "@playwright/test";

export interface TextOverflow {
  text: string;
  side: string;
}

export interface PreviewReport {
  /** Text lines that reach into the frame margin or outside the card. */
  overflowing: TextOverflow[];
  /** Smallest scale any fitted block had to shrink to (1 = nothing shrunk). */
  smallestScale: number;
  /** Number of text fragments measured, to make sure the check looked at something. */
  measured: number;
  cardWidth: number;
  horizontalPageOverflow: boolean;
}

/**
 * Measures the invitation drawn in the editor preview. Every rendered line of text must stay inside the card
 * with a margin of 7.5% of its width, which is clear of every frame the kit draws (frames sit 4% to 7.5% in).
 */
export async function measurePreview(page: Page): Promise<PreviewReport> {
  return page.evaluate(() => {
    const card = document.querySelector<HTMLElement>("[role=img] > div > div");
    if (!card) throw new Error("preview card not found");
    const box = card.getBoundingClientRect();
    const margin = box.width * 0.075;
    const overflowing: { text: string; side: string }[] = [];
    let measured = 0;
    const walker = document.createTreeWalker(card, NodeFilter.SHOW_TEXT);
    for (let node = walker.nextNode(); node; node = walker.nextNode()) {
      const text = node.textContent?.trim();
      if (!text) continue;
      const range = document.createRange();
      range.selectNodeContents(node);
      for (const r of Array.from(range.getClientRects())) {
        if (r.width < 0.5 || r.height < 0.5) continue;
        measured++;
        const tolerance = 1;
        const side =
          r.left < box.left + margin - tolerance ? "left" : r.right > box.right - margin + tolerance ? "right" : r.top < box.top + margin - tolerance ? "top" : r.bottom > box.bottom - margin + tolerance ? "bottom" : "";
        if (side) overflowing.push({ text: text.slice(0, 40), side });
      }
    }
    const scales = Array.from(card.querySelectorAll<HTMLElement>("[data-fitbox]")).map((el) => Number(el.dataset.fitScale));
    return {
      overflowing,
      smallestScale: scales.length ? Math.min(...scales) : 1,
      measured,
      cardWidth: Math.round(box.width),
      horizontalPageOverflow: document.documentElement.scrollWidth > window.innerWidth,
    };
  });
}
