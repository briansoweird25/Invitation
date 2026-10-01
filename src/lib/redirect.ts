/** Only same-site paths are allowed as post-login destinations, to avoid open redirects. */
export function safeRedirectPath(from: unknown, fallback = "/dashboard"): string {
  return typeof from === "string" && from.startsWith("/") && !from.startsWith("//") ? from : fallback;
}
