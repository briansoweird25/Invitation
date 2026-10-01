import { useEffect, useRef, useState, type ReactNode } from "react";

interface LazyMountProps {
  children: ReactNode;
  /** Shown until the area is near the viewport. Give it the same size as the children to avoid layout shift. */
  placeholder: ReactNode;
  /** How far outside the viewport to start rendering. */
  rootMargin?: string;
}

/** Renders children only once they are near the viewport, then keeps them. Used for gallery previews. */
export function LazyMount({ children, placeholder, rootMargin = "400px" }: LazyMountProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(typeof IntersectionObserver === "undefined");

  useEffect(() => {
    const el = ref.current;
    if (visible || !el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [visible, rootMargin]);

  return <div ref={ref}>{visible ? children : placeholder}</div>;
}
