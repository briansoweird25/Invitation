import { useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { fitScale, MIN_FIT_SCALE } from "./fit";

interface FitBoxProps {
  /** Positions the safe region of the card, for example `absolute inset-x-0 inset-y-[11cqw]`. */
  className?: string;
  /** Lays out the content inside the region. It is at least as tall as the region. */
  innerClassName?: string;
  /** Which point the content shrinks toward. Centered content shrinks toward its center, top-aligned content toward its top. */
  origin?: "center" | "top" | "top left";
  minScale?: number;
  children: ReactNode;
}

/**
 * A safe region that keeps long content inside it. Content wraps at the region's width as usual. If it is
 * still taller than the region, the whole block shrinks uniformly (names, details and message together)
 * instead of being cut off or running over the frame. Layout is measured, so it adapts to any card size,
 * font and content length.
 *
 * `data-fit-scale` and `data-fit-state` ("natural", "scaled" or "min") expose the result for tests.
 */
export function FitBox({ className, innerClassName, origin = "center", minScale = MIN_FIT_SCALE, children }: FitBoxProps) {
  const outer = useRef<HTMLDivElement>(null);
  const inner = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useLayoutEffect(() => {
    const outerEl = outer.current;
    const innerEl = inner.current;
    if (!outerEl || !innerEl) return;

    const measure = () => {
      // offsetHeight and clientWidth ignore transforms, so these are the unscaled layout sizes.
      const next = fitScale(outerEl.clientHeight, innerEl.offsetHeight, {
        min: minScale,
        availableWidth: innerEl.clientWidth,
        neededWidth: innerEl.scrollWidth,
      });
      setScale((current) => (Math.abs(current - next) < 0.002 ? current : next));
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(outerEl);
    observer.observe(innerEl);
    return () => observer.disconnect();
  }, [minScale]);

  return (
    <div ref={outer} className={cn("flex flex-col overflow-hidden", origin === "center" ? "justify-center" : "justify-start", className)} data-fitbox="" data-fit-scale={scale.toFixed(3)} data-fit-state={scale >= 1 ? "natural" : scale <= minScale ? "min" : "scaled"}>
      <div
        ref={inner}
        className={cn("w-full shrink-0 [overflow-wrap:anywhere]", innerClassName)}
        style={{ minHeight: "100%", transform: scale < 1 ? `scale(${scale})` : undefined, transformOrigin: origin === "center" ? "50% 50%" : origin === "top" ? "50% 0%" : "0% 0%" }}
      >
        {children}
      </div>
    </div>
  );
}
