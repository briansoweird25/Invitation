const leaves: [number, number, number][] = [
  [26, 86, -20],
  [40, 68, -60],
  [52, 52, -20],
  [66, 38, -60],
  [80, 26, -20],
  [94, 16, -60],
];

/** Botanical sprig used by the floral template. Colored through `color`. */
export function Sprig({ color, className }: { color: string; className?: string }) {
  return (
    <svg viewBox="0 0 120 120" fill="none" aria-hidden="true" className={className}>
      <path d="M8 112C30 80 54 50 112 8" stroke={color} strokeWidth="1.2" strokeLinecap="round" />
      {leaves.map(([x, y, r]) => (
        <ellipse key={`${x}-${y}`} cx={x} cy={y} rx="11" ry="4.5" transform={`rotate(${r} ${x} ${y})`} fill={color} opacity="0.55" />
      ))}
      <circle cx="104" cy="14" r="4" fill={color} />
    </svg>
  );
}
