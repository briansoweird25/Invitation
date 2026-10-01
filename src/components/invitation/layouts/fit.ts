/** Smallest scale a fitted block may shrink to. Below this the text is too small to read, so the block is clipped instead. */
export const MIN_FIT_SCALE = 0.4;

/**
 * The scale that makes a block of `needed` height (and optionally `neededWidth`) fit in `available`.
 * Never above 1, never below `min`. Zero or invalid sizes (an element that is not laid out yet) give 1.
 */
export function fitScale(available: number, needed: number, options: { min?: number; availableWidth?: number; neededWidth?: number } = {}): number {
  const { min = MIN_FIT_SCALE, availableWidth, neededWidth } = options;
  const byHeight = available > 0 && needed > available ? available / needed : 1;
  const byWidth = availableWidth && neededWidth && availableWidth > 0 && neededWidth > availableWidth ? availableWidth / neededWidth : 1;
  return Math.min(1, Math.max(min, Math.min(byHeight, byWidth)));
}
